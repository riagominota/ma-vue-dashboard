/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */


    const SINGLE_LEVEL_WILDCARD = '+';
    const MULTI_LEVEL_WILDCARD = '#';

   export class EventBusEvent extends CustomEvent<Event> {
        constructor(topic:string) {
            super(topic );
        }
    }

    export type SubtopicMap<T,P=undefined> = Map<string,Topic<T,P>>
    export type SubscribeCallback = (event:any,current:any)=>void
    export type TopicConstructor = <T,P=undefined>(parent?:Topic<T,P>)=>Topic<T,P>
    export type Listener = {call:(handle:string|undefined,event:Event,...args: any[])=>any,[k:string]:any}

    export interface Topic<T,P=undefined>
    {
    publishToSubscribers: (event: any, args: any) => void;
    publish: (path: any, event: any, args: any, index?: number) => void;
    isEmpty: () => boolean;
    unsubscribe: (path: string[], listener: Listener, index?: number) => any;
    parent:Topic<P> | undefined
    subscribers:Set<Listener>
    subtopics:SubtopicMap<T,P>
    createSubtopic: <S,T extends P>(name:string)=>Topic<S,T>
    subscribe (path:string[], listener:Listener , index?:number ):void
}

export const Topic:TopicConstructor = <T,P=undefined>(parent?:Topic<P,Listener>) => 
    {     
        
        //const TopicInstance:Topic<T,P> = TopicInstance as unknown as Topic<T,P>;
        const TopicInstance:Topic<T,P> = 
        {
        parent:parent,
        subscribers : new Set<Listener>(),
        subtopics : new Map() as SubtopicMap<T,P>,
        

        createSubtopic : <S=any,P=T>(name: string):Topic<S,  T>=> {
            let subtopic = TopicInstance.subtopics.get(name);
            if (!subtopic) {
                subtopic = Topic(TopicInstance);
                TopicInstance.subtopics.set(name, subtopic);
            }
            return subtopic;
        },

        subscribe : (path: string[], listener:Listener, i = 0 ) => {
            const segment = path[i];
            if (segment == null) {
                (TopicInstance.subscribers).add(listener);
            } else {
                const subtopic = TopicInstance.createSubtopic(segment);
                subtopic.subscribe(path as string[], listener, i + 1);
            }
        },

        unsubscribe:(path:string[], listener:Listener, i = 0) => {
            const segment = path[i];
            if (segment == null) {
                return TopicInstance.subscribers.delete(listener);
            } else {
                const subtopic = TopicInstance.subtopics.get(segment);
                if (subtopic) {
                    const deleted = subtopic.unsubscribe(path, listener, i + 1);
                    if (deleted && subtopic.isEmpty()) {
                        TopicInstance.subtopics.delete(segment);
                    }
                    return deleted;
                }
            }
            return false;
        },

        isEmpty:() => {
            return !TopicInstance.subscribers.size && !TopicInstance.subtopics.size;
        },

        publish:(path, event, args, i = 0) => {
            const segment = path[i];
            if (segment == null) {
                TopicInstance.publishToSubscribers(event, args);
            } else {
                const subtopic = TopicInstance.subtopics.get(segment);
                if (subtopic) {
                    subtopic.publish(path, event, args, i + 1);
                }
                const singleLevelWildcardTopic = TopicInstance.subtopics.get(SINGLE_LEVEL_WILDCARD);
                if (singleLevelWildcardTopic) {
                    singleLevelWildcardTopic.publish(path, event, args, i + 1);
                }
                const multiLevelWildcardTopic = TopicInstance.subtopics.get(MULTI_LEVEL_WILDCARD);
                if (multiLevelWildcardTopic) {
                    multiLevelWildcardTopic.publishToSubscribers(event, args);
                }
            }
        },

       publishToSubscribers:(event, args) =>{
            for (const subscriber of TopicInstance.subscribers) {
                try {
                    subscriber.call(undefined, event, ...args);
                } catch (e) {
                    console.error(e);
                }
            }
        }
        };

        return TopicInstance;
        
    }


 

