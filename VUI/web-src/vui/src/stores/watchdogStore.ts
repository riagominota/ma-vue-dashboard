/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */

import constants from "@/boot/constants";
import {axios} from '@/boot/axios';
import { useEventBusStore } from "./EventBusStore";
import { useUserStore } from "./UserStore";
import timeout, { TimeoutPromise } from "@/composables/timeout";
import { defineStore } from "pinia";
import { computed } from "vue";


export const useWatchdogStore = defineStore('watchdog',()=>{
const MA_TIMEOUTS = constants.MA_TIMEOUTS;
const EventBus = useEventBusStore();
const User = useUserStore()

    const OFFLINE = 'OFFLINE';
    const API_DOWN = 'API_DOWN';
    const STARTING_UP = 'STARTING_UP';
    const API_UP = 'API_UP';
    const API_ERROR = 'API_ERROR';
    const LOGGED_IN = 'LOGGED_IN';

    class WatchdogEvent extends CustomEvent<any> {
        constructor(type:string, options=undefined) {
            super(type);
            Object.assign(this, options??{});
        }
    }

    /**
     * @ngdoc service
     * @name ngMangoServices.maWatchdog
     *
     * @description
     * The mangoWatchdog service checks for connectivity to the Mango API and checks if a user is logged in. It does this via
     * a HTTP interceptor and periodically checking the /status endpoint.
     *
     * The watchdog service publishes events on the maEventBus under the 'maWatchdog' name space.
     *
     * - <a ui-sref="ui.examples.utilities.watchdog">View Demo</a>
     */
    class MangoWatchdog {
        status!:string;
        timeout:number;
        reconnectDelay:number;
        statusData!: Record<string, any> | null;
        timeoutPromise: TimeoutPromise<unknown> | undefined;
        statusPromise: any;


        constructor() {
            this.timeout = MA_TIMEOUTS.xhr;
            this.reconnectDelay = MA_TIMEOUTS.watchdogStatusDelay;

            // wait until all services are initialized before publishing any events to the bus
            // so that all services which subscribe get the maWatchdog event (e.g. NotificationManager)
            this.init();
        }

        init() {
            if (this.isOffline()) {
                this.setStatus(OFFLINE);
            } else if (User.current) {
                this.setStatus(LOGGED_IN);
            } else {
                this.setStatus(API_UP);
            }

            window.addEventListener('online', event => {
                this.checkStatus();
                
            });
            window.addEventListener('offline', event => {
                    this.setStatus(OFFLINE);
            });
        }

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maWatchdog
         * @name setStatus
         *
         * @description
         * Sets the status of the watchdog and publishes the event to the bus
         *
         * @param {string} status Status string
         * @param {object=} statusData additional status data
         */
        setStatus(status:string, statusData:Record<string,any>|null = null) {
            const prevStatus = this.status;
            const prevStatusData = this.statusData;
            this.status = status;
            this.statusData = statusData;

            if ([API_DOWN, STARTING_UP, API_ERROR].includes(status)) {
                if (this.reconnectDelay > 0) {
                    // poll faster during startup as we want to provide a bit more feedback
                    const delay = status === STARTING_UP ? this.reconnectDelay / 3 : this.reconnectDelay;
                    this.timeoutPromise = timeout(() => this.checkStatus(), delay);
                }
            } else {
                this?.timeoutPromise?.cancel();
            }

            const dispatchEvent = status !== prevStatus || status === 'STARTING_UP' && (JSON.stringify(statusData)!==JSON.stringify(prevStatusData));
            if (dispatchEvent) {
                EventBus.publish(new WatchdogEvent(`maWatchdog/${status}` )as CustomEvent, this, prevStatus);
            }
        }

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maWatchdog
         * @name cancelTimeout
         *
         * @description
         * Cancels any scheduled status checks
         */
        cancelTimeout() {
            if (this.timeoutPromise) {
                this.timeoutPromise.cancel();
                delete this.timeoutPromise;
            }
        }

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maWatchdog
         * @name isOffline
         *
         * @returns {boolean} true if the browser thinks it has no internet connectivity
         */
        isOffline() {
            return 'onLine' in window.navigator && !window.navigator.onLine;
        }

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maWatchdog
         * @name checkStatus
         *
         * @description
         * Informs the watchdog service that it should check the status
         */
        checkStatus()
        {
        return computed(()=>{
            if (this.statusPromise) {
                return;
            }

            this.cancelTimeout();

            if (this.isOffline()) {
                this.setStatus(OFFLINE);
                return;
            }

            this.statusPromise = axios({
                method: 'GET',
                url: '/status',
                timeout: this.timeout,
            }).then(response => {
                const status = response.data;
                if (status.stateName === 'RUNNING') {
                    // dont use User.getCurrent() here as we set ignoreError so the $httpInterceptor does not call
                    // checkStatus() again
                    return axios({
                        method: 'GET',
                        url: '/rest/latest/users/current',
                        timeout: this.timeout,
                    }).then(response => {
                        User.setCurrentUser(response.data);
                        this.setStatus(LOGGED_IN, status);
                    }, error => {
                        if (error.status === 401) {
                            // API explicitly told us that there is no user logged in
                            User.setCurrentUser(null);
                            this.setStatus(API_UP, status);
                        } else {
                            // defer to catch block below
                            return Promise.reject(error);
                        }
                    });
                } else {
                    this.setStatus(STARTING_UP, status);
                }
            }).catch(error => {
                if (error.status < 0) {
                    this.setStatus(API_DOWN);
                } else {
                    // status endpoint should not return HTTP error responses
                    this.setStatus(API_ERROR);
                }
            }).finally(() => {
                delete this.statusPromise;
            });
        })
    }

        /**
         * @ngdoc property
         * @propertyOf ngMangoServices.maWatchdog
         * @name apiUp
         *
         * @returns {boolean} true if the API is up
         */
        get apiUp() {
            return this.status === API_UP || this.status === LOGGED_IN;
        }

        /**
         * @ngdoc property
         * @propertyOf ngMangoServices.maWatchdog
         * @name loggedIn
         *
         * @returns {boolean} true if the API is up and a user is logged in
         */
        get loggedIn() {
            return this.status === LOGGED_IN;
        }

        /**
         * @ngdoc property
         * @propertyOf ngMangoServices.maWatchdog
         * @name status
         *
         * @returns {string} the current status, one of OFFLINE, API_DOWN, STARTING_UP, API_UP, API_ERROR, LOGGED_IN
         */
    }
    const MangoWatchdogInstance = new MangoWatchdog();
    return MangoWatchdogInstance;
});

