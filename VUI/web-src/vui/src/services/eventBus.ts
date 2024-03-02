/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */

import { umask } from "node:process";



    const SINGLE_LEVEL_WILDCARD = '+';
    const MULTI_LEVEL_WILDCARD = '#';
    const PATH_SEPARATOR = '/';

    class EventBusEvent extends CustomEvent {
        constructor(topic:string) {
            super(topic);
        }
    }

    export type SubtopicMap<T,P=undefined> = Map<string,Topic<T,P>>
    export type SubscribeCallback = (event:any,current:any)=>void
    export type TopicConstructor = <T,P=undefined>(parent?:Topic<T,P>)=>Topic<T,P>
    export type Listener = {call:(handle:string|undefined,event:Event,...args: any[])=>any,[k:string]:any}

    export interface Topic<T,P=undefined>
    {
    publishToSubscribers: (event: any, args: any) => void;
    publish: (path: any, event: any, args: any, i: number) => void;
    isEmpty: () => boolean;
    unsubscribe: (path: string[], listener: Listener, index: number) => any;
    parent:Topic<P> | undefined
    subscribers:Set<Listener>
    subtopics:SubtopicMap<T,P>
    createSubtopic: <S,T extends P>(name:string)=>Topic<S,T>
    subscribe (path:string[], listener:Listener , index:number ):void
}

export const Topic:TopicConstructor = <T,P=undefined>(parent?:Topic<P,Listener>) => 
    {     
        const that:Topic<T,P> = this as unknown as Topic<T,P>;
        that.parent=parent;
        that.subscribers = new Set<Listener>(),
        that.subtopics = new Map() as SubtopicMap<T,P>,
        

        that.createSubtopic = <S=any,P=T>(name: string):Topic<S,  T>=> {
            let subtopic = that.subtopics.get(name);
            if (!subtopic) {
                subtopic = Topic(that);
                that.subtopics.set(name, subtopic);
            }
            return subtopic;
        },

        that.subscribe = (path: string[], listener:Listener, i = 0 ) => {
            const segment = path[i];
            if (segment == null) {
                (that.subscribers).add(listener);
            } else {
                const subtopic = that.createSubtopic(segment);
                subtopic.subscribe(path as string[], listener, i + 1);
            }
        },

        that.unsubscribe=(path:string[], listener:Listener, i = 0) => {
            const segment = path[i];
            if (segment == null) {
                return that.subscribers.delete(listener);
            } else {
                const subtopic = that.subtopics.get(segment);
                if (subtopic) {
                    const deleted = subtopic.unsubscribe(path, listener, i + 1);
                    if (deleted && subtopic.isEmpty()) {
                        that.subtopics.delete(segment);
                    }
                    return deleted;
                }
            }
            return false;
        },

        that.isEmpty=() => {
            return !that.subscribers.size && !that.subtopics.size;
        },

        that.publish=(path, event, args, i = 0) => {
            const segment = path[i];
            if (segment == null) {
                that.publishToSubscribers(event, args);
            } else {
                const subtopic = that.subtopics.get(segment);
                if (subtopic) {
                    subtopic.publish(path, event, args, i + 1);
                }
                const singleLevelWildcardTopic = that.subtopics.get(SINGLE_LEVEL_WILDCARD);
                if (singleLevelWildcardTopic) {
                    singleLevelWildcardTopic.publish(path, event, args, i + 1);
                }
                const multiLevelWildcardTopic = that.subtopics.get(MULTI_LEVEL_WILDCARD);
                if (multiLevelWildcardTopic) {
                    multiLevelWildcardTopic.publishToSubscribers(event, args);
                }
            }
        },

        that.publishToSubscribers=(event, args) =>{
            for (const subscriber of that.subscribers) {
                try {
                    subscriber.call(undefined, event, ...args);
                } catch (e) {
                    console.error(e);
                }
            }
        };

        return that;
        
    }

    /**
     * @ngdoc service
     * @name ngMangoServices.maEventBus
     * @description
     * Provides a generic event bus instance which can be shared and used amongst services and components
     */
 

