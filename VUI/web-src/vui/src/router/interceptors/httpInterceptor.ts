/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */
import constants from "@/boot/constants";
import { useWatchdogStore } from "@/stores/watchdogStore";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import useTranslationStore from "@/stores/TranslationStore";
import { Util } from "@/composables/Util";

    const MA_BASE_URL = constants.MA_BASE_URL;    
    const Watchdog = useWatchdogStore()
    const mangoBaseUrl = constants.MA_BASE_URL;
    const MA_TIMEOUTS = constants.MA_TIMEOUTS;
    const TranslationStore = useTranslationStore();
    /**
     * @ngdoc service
     * @name ngMangoServices.maHttpInterceptor
     *
     * @description Automatically prepends the base url onto the HTTP request's url, also augments HTTP error
     * responses with a human readable error message extracted from the response body, headers or generic status.
     */
    class MangoHttpInterceptor {
        request(config:AxiosRequestConfig) {
            if (this.isApiCall(config)) {
                config.url = mangoBaseUrl + config.url;
            }
            if (config.timeout == null) {
                config.timeout = MA_TIMEOUTS.xhr;
            }
            return config;
        }

        responseError(error: AxiosResponse) {
            // TODO error.xhrStatus abort might be a cancel, but could also be a timeout
            if (error.config && this.isApiCall(error.config) &&
                // !error.config.ignoreError && // ignoreError is set true by maWatchdog service
                (error.status < 0 && ['timeout', 'error'].includes(error.statusText) || error.status === 401)) {
                    
                Watchdog.checkStatus();
            }

            if (error.data instanceof Blob && error.data.type === 'application/json') {
                return Util.blobToJson(error.data).then(parsedData => {
                    error.data = parsedData;
                    return this.augmentError(error);
                }).catch(e => {
                    return this.augmentError(error);
                });
            }

            return this.augmentError(error);
        }

        augmentError(error: AxiosResponse) {
            let message = error.data && typeof error.data === 'object' && (error.data.message || error.data.localizedMessage);
            // TODO error.data.cause is now the only place containing the exception message, display this if it is available

            // try the 'errors' header
            // if (!message) {
            //     message = error.headers('errors'); // must be some angular bs
            // }

            // try the status text
            if (!message) {
                message = error.statusText;
            }

            // error.statusText is empty if its an XHR error
            if (!message && error.statusText !== 'complete') {
                message = error.statusText === 'abort' && this.safeTranslate('ui.app.xhrAborted', 'Request aborted') ||
                    error.statusText === 'timeout' && this.safeTranslate('ui.app.xhrTimeout', 'Request timed out') ||
                    error.statusText === 'error' && this.safeTranslate('ui.app.xhrError', 'Connection error');
            }

            // fallback to generic description of HTTP error code
            if (!message) {
                message = this.safeTranslate(`rest.httpStatus.${error.status}`, `HTTP error ${error.status}`);
            }
            console.error(error)
            // see if the below are used...
            // error.mangoStatusText = message;
            // error.mangoStatusTextShort = message;

            if (error.status === 422) {
                console.error(error)
                let messages = [];
                if (error.data.result && Array.isArray(error.data.result.messages)) {
                    messages = error.data.result.messages;
                } else if (Array.isArray(error.data.validationMessages)) {
                    messages = error.data.validationMessages;
                }

                if (messages.length) {
                    const firstMsg = messages[0];
                    let trKeyArgs;
                    if (firstMsg.property) {
                        trKeyArgs = ['vui.app.errorFirstValidationMsgWithProp', message, firstMsg.property, firstMsg.message];
                    } else {
                        trKeyArgs = ['vui.app.errorFirstValidationMsg', message, firstMsg.message];
                    }
                    // find out values here too
                    // error.mangoStatusTextFirstValidationMsg = firstMsg.message;
                    // error.mangoStatusText = this.safeTranslate(trKeyArgs, message);
                }
            }

            return Promise.reject(error);
        }

        safeTranslate(key:string, fallback:string) {
            try {
                return TranslationStore.trSync(key);
            } catch (e) {
                return fallback;
            }
        }

        isApiCall(config:AxiosRequestConfig) {
            return String(config.url).startsWith('/');
        }
    }

    // const interceptor = new MangoHttpInterceptor(); // use in axios interceptor instead
    
    
    


export default MangoHttpInterceptor;
