/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */

import constants from '@/boot/constants';
import { useEventBusStore } from '@/stores/EventBusStore';
import { useWatchdogStore } from '@/stores/watchdogStore';
import { resolve } from 'path';
import { WebSocketConnectionPayload } from 'vite/types/customEvent';

// NotificationManagerFactory.$inject = ['MA_BASE_URL', '$rootScope', 'MA_TIMEOUTS', 'Promise', '$timeout', 'maEventBus', 'maWatchdog'];
// function NotificationManagerFactory(maEventBus, maWatchdog) {
function NotificationManagerFactory() {
    const EventBus = useEventBusStore();
    const Watchdog = useWatchdogStore();
    const MA_BASE_URL = constants.MA_BASE_URL;
    const MA_TIMEOUTS = constants.MA_TIMEOUTS;

    //const READY_STATE_CONNECTING = 0;
    const READY_STATE_OPEN = 1;
    //const READY_STATE_CLOSING = 2;
    //const READY_STATE_CLOSED = 3;

    const mapEventType = {
        add: 'create'
    };

    class CrudOperationAttributes {
        item: any;
        originalXid: string | undefined;
        itemId: number | undefined;
        eventType: any;
        constructor(options) {
            Object.assign(this, options);
        }

        updateArray(array: any[], filterFn: Function) {
            if (!Array.isArray(array)) return;

            const item = this.item;
            const originalXid = this.originalXid;
            const itemId = this.itemId || (item && item.id);
            const eventType = this.eventType;

            const filterMatches = typeof filterFn === 'function' ? filterFn(item) : true;
            if (filterMatches && Number.isFinite(array.length)) {
                if (eventType === 'create') {
                    //  array.$total += 1;
                } else if (eventType === 'delete') {
                    //  array.$total -= 1;
                }
            }

            const index = array.findIndex((o) => {
                return (itemId && o.id === itemId) || (originalXid && o.xid === originalXid);
            });
            if (index >= 0) {
                if (!filterMatches || eventType === 'delete') {
                    array.splice(index, 1);
                    return true;
                } else if (eventType === 'update' || eventType === 'create' || eventType === 'stateChange') {
                    Object.assign(array[index], item);
                    return true;
                }
            } else if (filterMatches && (eventType === 'update' || eventType === 'create' || eventType === 'stateChange')) {
                array.push(item);
                return true;
            }
        }
    }
    type DeferredSocket = { resolve: any; reject: any };
    type XidPayload = { action: string; object: Record<string, any>; xid: string; originalXid: string; id: number };
    type NotificationMessage = { messageType: string; notificationType: string; sequenceNumber: number; payload: any; attributes: any };
    interface WebSocketRequest {
        sequenceNumber?: number;
        messageType?: string;
        requestType: string;
        notificationTypes: string[];
        xids: string[] | null;
    }

    class NotificationManager {
        listeners: number;
        subscribedXids: Record<string, any> = {};
        subscribedToAllXidsCount: number;
        eventScope: { notificationManager: NotificationManager };
        pendingRequests: Record<string, any>;
        sequenceNumber: number;
        loggedIn: boolean;
        socketDeferred: DeferredSocket;
        webSocketUrl: any;
        socket?: WebSocket;
        connectTimer?: NodeJS.Timeout;
        supportsSubscribe: any;
        constructor(options: any) {
            Object.assign(this, options);
            this.socketDeferred = undefined as unknown as DeferredSocket;
            this.listeners = 0;
            this.subscribedXids = {};
            this.subscribedToAllXidsCount = 0;
            // this.eventScope = $rootScope.$new(true);
            this.eventScope = { notificationManager: {} as NotificationManager };
            Object.assign(this.eventScope.notificationManager, this); //one circular, coming right up
            this.pendingRequests = {};
            this.sequenceNumber = 0;

            this.loggedIn = Watchdog.status === 'LOGGED_IN';

            EventBus.subscribe('maWatchdog/#', (event, watchdog) => {
                this.loggedIn = watchdog.status === 'LOGGED_IN';

                if (watchdog.status === 'LOGGED_IN' && this.listeners > 0) {
                    // API is up and we are logged in
                    this.openSocket();
                } else if (watchdog.status === 'API_UP') {
                    // API is up but we aren't logged in
                    this.closeSocket();
                }
                // all other states we dont do anything
            });
        }

        openSocket() {
            // socket already open
            if (this.socketDeferred) {
                return this.socketDeferred;
            }
            if (!('WebSocket' in window)) {
                return Promise.reject('WebSocket not supported in this browser');
            }
            if (!this.webSocketUrl) {
                return Promise.reject('No websocket URL');
            }
            let p = new Promise((resolve, reject) => {
                this.socketDeferred = { resolve, reject } as DeferredSocket;
            });
            const socketDeferred = this.socketDeferred as DeferredSocket;

            let host = document.location.host;
            let protocol = document.location.protocol;

            if (MA_BASE_URL) {
                const i = MA_BASE_URL.indexOf('//');
                if (i >= 0) {
                    protocol = MA_BASE_URL.substring(0, i);
                    host = MA_BASE_URL.substring(i + 2);
                } else {
                    host = MA_BASE_URL;
                }
            }

            protocol = protocol === 'https:' ? 'wss:' : 'ws:';

            const socket = (this.socket = new WebSocket(protocol + '//' + host + this.webSocketUrl));

            this.connectTimer = setTimeout(() => {
                socketDeferred.reject('Timeout opening socket');
                this.closeSocket();
            }, MA_TIMEOUTS.websocket);

            socket.onclose = (event: CloseEvent) => {
                console.warn('WebSocket closed', (event as { target: { url: string }; reason: string } & CloseEvent).target.url, 'reason:', event.reason);
                socketDeferred.reject('Socket closed');
                this.closeSocket(event);
            };

            socket.onerror = (event) => {
                socketDeferred.reject('Socket error');
                this.closeSocket(event);
            };

            socket.onopen = (event) => {
                // setTimeout.cancel();
                clearTimeout(this.connectTimer);
                delete this.connectTimer;

                this.pendingRequests = {};
                this.sequenceNumber = 0;

                Promise.resolve(this.onOpen())
                    .then(() => {
                        this.notify('webSocketOpen');
                        this.sendSubscription();
                        socketDeferred.resolve(this.socket);
                    })
                    .then(null, (error) => {
                        this.closeSocket(error);
                    });
            };

            socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);

                    if (message.status === 'ERROR') {
                        const error = new Error('Web socket status ERROR');
                        error.message = message;
                        throw error;
                    } else if (message.status === 'OK') {
                        const payload = message.payload;
                        this.notify('webSocketMessage', payload);
                        this.notifyFromPayload(payload);
                    } else if (typeof message.messageType === 'string') {
                        this.messageReceived(message);
                    }
                } catch (e) {
                    this.notify('webSocketError', e);
                }
            };

            return socketDeferred;
        }

        onOpen() {
            // do nothing
        }

        /**
         * Processes the websocket payload and calls notify() with the appropriate event type.
         * Default notifier for CRUD type websocket payloads, they have a action and object property.
         */

        notifyFromPayload(payload: XidPayload) {
            if (typeof payload.action === 'string') {
                const eventType = mapEventType[payload.action as 'add'] || payload.action;
                if (eventType) {
                    const item = payload.object != null ? this.transformObject(payload.object) : null;
                    const attributes = new CrudOperationAttributes({
                        eventType,
                        item,
                        originalXid: payload.originalXid || payload.xid,
                        itemXid: payload.xid,
                        itemId: payload.id
                    });
                    this.notify(eventType, item, attributes);
                }
            }
        }

        createCrudOperationAttributes(options: any) {
            return new CrudOperationAttributes(options);
        }

        /**
         * Processes a V2 websocket message and calls notify()
         */
        messageReceived(message: NotificationMessage) {
            if (message.messageType === 'RESPONSE') {
                if (isFinite(message.sequenceNumber)) {
                    const request = this.pendingRequests[message.sequenceNumber];
                    if (request != null) {
                        Promise.resolve(message.payload);
                        //  $timeout.cancel(request.timeoutPromise);
                    }
                    delete this.pendingRequests[message.sequenceNumber];
                }
            } else if (message.messageType === 'NOTIFICATION') {
                const item = this.transformObject(message.payload);
                const notificationType = mapEventType[message.notificationType as 'add'] || message.notificationType;
                this.notify(notificationType, item, message.attributes);
            }
        }

        closeSocket(event?: Event) {
            if (this.socketDeferred) {
                this.socketDeferred.reject('Socket closed');
            }
            if (this.connectTimer) {
                clearTimeout(this.connectTimer);
                delete this.connectTimer;
            }
            if (this.socket) {
                this.socket.onclose = () => {};
                this.socket.onerror = () => {};
                this.socket.onopen = () => {};
                this.socket.onmessage = () => {};
                this.socket.close();
                delete this.socket;
            }

            Object.keys(this.pendingRequests).forEach((sequenceNumber) => {
                const request = this.pendingRequests[sequenceNumber];
                Promise.reject('Socket closed');
                // request.deferred.reject('Socket closed');
                // $timeout.cancel(request.timeoutPromise);
            });
            this.pendingRequests = {};
            this.sequenceNumber = 0;

            if (event) {
                // websocket closed by server, check if Mango is still up
                Watchdog.checkStatus();
            }
        }

        socketConnected() {
            return this.socket && this.socket.readyState === READY_STATE_OPEN;
        }

        sendSubscription(eventTypes = ['create', 'update', 'delete', 'stateChange']) {
            if (!this.supportsSubscribe) return;

            const xids = this.subscribedToAllXidsCount > 0 ? null : Object.keys(this.subscribedXids);

            return this.sendRequest({
                requestType: 'SUBSCRIPTION',
                notificationTypes: eventTypes,
                xids
            });
        }

        sendMessage(message: string) {
            if (this.socketConnected()) {
                (this.socket as WebSocket).send(JSON.parse(message));
            }
        }

        sendRequest(message: WebSocketRequest, timeout = MA_TIMEOUTS.websocketRequest) {
            if (this.socketConnected()) {
                const deferred = { resolve: Promise.resolve, reject: Promise.reject };
                const timeoutPromise = setTimeout(() => {
                    deferred.reject('Timeout');
                }, timeout);
                const sequenceNumber = this.sequenceNumber++;

                message.messageType = 'REQUEST';
                message.sequenceNumber = sequenceNumber;
                this.pendingRequests[sequenceNumber] = {
                    deferred,
                    timeoutPromise
                };

                (this.socket as WebSocket).send(JSON.stringify(message));
                return deferred;
            } else {
                return Promise.reject('Socket is not open');
            }
        }

        subscribe(handler: Record<string, any> | Function, eventTypes = ['create', 'update', 'delete', 'stateChange'], xids: string[] | null = null, localOnly: boolean = false) {
            if (typeof handler === 'object') {
                const options = handler;
                handler = options.handler;
                eventTypes = options.eventTypes || ['create', 'update', 'delete', 'stateChange'];
                xids = options.xids || null;
                localOnly = options.localOnly || false;
            }

            if (!localOnly) {
                this.listeners++;

                let subscriptionChanged = false;
                if (Array.isArray(xids)) {
                    xids.forEach((xid) => {
                        if (!this.subscribedXids.hasOwnProperty(xid)) {
                            this.subscribedXids[xid] = 1;
                            subscriptionChanged = true;
                        } else {
                            // someone else is already subscribed to this xid, don't need to send anything
                            // just increment the count
                            this.subscribedXids[xid]++;
                        }
                    });
                } else {
                    subscriptionChanged = this.subscribedToAllXidsCount++ === 0;
                }

                if (this.socketConnected()) {
                    if (subscriptionChanged) {
                        this.sendSubscription();
                    }
                } else if (this.loggedIn) {
                    this.openSocket().catch(() => {});
                }
            }

            const applyThenHandle = (...args: Record<string, any>[]) => {
                // dont call handler if user supplied xids and this item doesnt match
                const item = args[1];
                if (Array.isArray(xids) && !xids.includes(item.xid)) {
                    return;
                }

                (handler as Function)(...args);
            };

            const eventDeregisters = [];
            eventTypes.forEach((eventType) => {
                // const eventDeregister = this.eventScope.$on(eventType, applyThenHandle);
                applyThenHandle(eventType);
                eventDeregisters.push(eventDeregister);
            });

            let deregistered = false;
            const deregisterEvents = () => {
                if (!deregistered) {
                    eventDeregisters.forEach((eventDeregister) => eventDeregister());
                    deregistered = true;

                    if (!localOnly) {
                        const lastListener = --this.listeners === 0;

                        let subscriptionChanged = false;
                        // decrement the count for xid subscriptions
                        if (Array.isArray(xids)) {
                            xids.forEach((xid) => {
                                this.subscribedXids[xid]--;

                                // unsubscribe any xids with no more listeners
                                if (this.subscribedXids[xid] === 0) {
                                    delete this.subscribedXids[xid];
                                    subscriptionChanged = true;
                                }
                            });
                        } else {
                            subscriptionChanged = --this.subscribedToAllXidsCount === 0;
                        }

                        if (lastListener) {
                            this.closeSocket();
                        } else if (subscriptionChanged) {
                            this.sendSubscription();
                        }
                    }
                }
            };

            const deregisterDestroy = $scope && $scope.$on('$destroy', deregisterEvents);

            const manualDeregister = () => {
                if (deregisterDestroy) {
                    deregisterDestroy();
                }
                deregisterEvents();
            };

            return manualDeregister;
        }

        // TODO remove
        subscribeToXids(xids: string, handler: Record<string, any> | Function, eventTypes = ['create', 'update', 'delete', 'stateChange']) {
            return this.subscribe(
                (...args) => {
                    const item = args[1];
                    if (xids.includes(item.xid)) {
                        handler(...args);
                    }
                },
                eventTypes,
                xids
            );
        }

        /**
         * Notifies the event listeners of an event
         */
        notify(type, ...args) {
            this.eventScope.$broadcast(type, ...args);
        }

        /**
         * Notifies the event listeners only if the websocket is not connected. This is so the listener is not notified twice of the same change.
         */
        notifyIfNotConnected(type, ...args) {
            if (['create', 'update', 'delete'].indexOf(type) < 0 || !this.socket || this.socket.readyState !== READY_STATE_OPEN) {
                this.notify(type, ...args);
            }
        }

        transformObject(obj) {
            return obj;
        }
    }

    return NotificationManager;
}

export default NotificationManagerFactory;


