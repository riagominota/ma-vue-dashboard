import { defineStore } from "pinia";
import {EventBusEvent, Topic} from '@/services/eventTopic' 
 const MULTI_LEVEL_WILDCARD = '#';
const PATH_SEPARATOR = '/';
    /**
     * @ngdoc service
     * @name EventBusStore
     * @description
     * Provides a generic event bus instance which can be shared and used amongst services and components
     */
export const useEventBusStore = defineStore('eventBus', ()=> {

    const EventBusCollection:Record<string,Topic<any,any>> = {};

    const addNewTopic = (topic:string,parentTopic?:Topic<any>) =>
    {
        if(!Object.prototype.hasOwnProperty.call(EventBusCollection,topic) )
        {
            EventBusCollection[topic] = Topic<any>()
        }
    }


      /**
     * @ngdoc method
     * @name subscribe
     * Provides a generic event bus instance which can be shared and used amongst services and components
     * @description
     * Subscribes a listener callback to a topic. Topic levels are separated by a / character
     * and may contain a single-level wildcard (+) or a multi-level wildcard (#, at the end only).
     *
     * @param {string} topic Topic name
     * @param {function} listener Listener callback, invoked when a matching event is published. The first argument
     * is always an Event followed by the arguments passed to the publish method
     * @returns {function} Unsubscribe function, calling this function will unsubscribe the listener
     */
    const subscribe = (topicName:string, listener:(event:Event,...args:any[])=>void):()=>any => {
        const path = topicName.split(PATH_SEPARATOR);
        const i = path.indexOf(MULTI_LEVEL_WILDCARD);
        if (i >= 0 && i < path.length - 1) {
            throw new Error('Multi-level wildcard can only be at end of topic');
        }

        EventBusCollection[topicName].subscribe(path, listener);
        return () => {
            EventBusCollection[topicName].unsubscribe(path, listener);
        };
    }

    /**
     * @ngdoc method
     * @name unsubscribe
     *
     * @description
     * Unsubscribes a listener callback for a topic.
     *
     * @param {string} topic Topic name, must be exactly the same as the topic that was supplied when listener was
     * subscribed
     * @param {function} listener Listener callback
     * @returns {boolean} true if the listener was successfully removed
     */
    const unsubscribe = (topicName:string, listener:(event:Event,...args:any[])=>void) =>{
        const path = topicName.split(PATH_SEPARATOR);
        return EventBusCollection[topicName].unsubscribe(path, listener);
    }

    /**
     * @ngdoc method
    * @name publish
     *
     * @description
     * Unsubscribes a listener callback for a topic.
     *
     * @param {string} topic Topic name, cannot contain wildcards
     * @param {*} args arbitrary number of arguments which will be passed to the listeners (after the event argument)
     */
    const publish = (topic:EventBusEvent|string|CustomEvent, ...args:any[]) => {
        let event;
        if (topic instanceof Event) {
            event = topic;
            topic = event.type;
        } else {
            event = new EventBusEvent(topic);
        }

        const path = topic.split(PATH_SEPARATOR);
        EventBusCollection[topic].publish(path, event, args);
    }


return {
    addNewTopic,
    subscribe,
    unsubscribe,
    publish
}
})