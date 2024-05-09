/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */

import { DateTime } from 'luxon';
import constants from '@/boot/constants';
import rqlBuilderFactory, { RqlBuilderInstance } from '@/services/RqlBuilder';
import { v4 as uuid4 } from 'uuid';
import { RouteParams } from 'vue-router';
import { number } from 'mathjs';
import { AxiosError, AxiosResponse } from 'axios';
import { apply } from 'ts-merge-patch';
import restResourceFactory from '@/services/RestResource';
import { RqlVisitorInstance } from '@/services/RqlVisitor';
/**
* @ngdoc service
* @name ngMangoServices.maUtil
*
* @description
* Provides  various utility functions that can be used in other directives and services.
*
* # Usage
*
* <pre prettyprint-mode="javascript">
    const changedXids = Util.arrayDiff(newValue.xids, oldValue.xids);
* </pre>
*/

// CONVERT TO A PINIA STORE
// /**
//  * @ngdoc method
//  * @methodOf ngMangoServices.maUtil
//  * @name encodeStateParams
//  *
//  * @description Encodes watch list parameters into a format that will work with $state.go().
//  * Encodes null into 'null', and empty array into undefined, unwraps single element arrays e.g. [a] => a
//  * Parameter names which are not found in $stateParams will be excluded from the output.
//  *
//  * @param {object} inputParameters Watch list parameters to encode
//  * @returns {object} Encoded parameters to pass to $state.go()
//  */
// encodeStateParams(inputParameters:Record<string,any>) {
//     const params = {};

//     Object.keys(inputParameters).forEach((key) => {
//         const paramValue = inputParameters[key];

//         if (!$stateParams.hasOwnProperty(key)) {
//             return;
//         }

//         if (Array.isArray(paramValue)) {
//             if (!paramValue.length) {
//                 params[key] = undefined;
//             } else if (paramValue.length === 1) {
//                 params[key] = paramValue[0] === null ? ENCODED_STATE_PARAM_NULL : paramValue[0];
//             } else {
//                 params[key] = paramValue.map((value) => {
//                     return value === null ? ENCODED_STATE_PARAM_NULL : value;
//                 });
//             }
//         } else if (paramValue === null) {
//             params[key] = ENCODED_STATE_PARAM_NULL;
//         } else {
//             params[key] = paramValue;
//         }
//     });

//     return params;
// },

// /**
//  * @ngdoc method
//  * @methodOf ngMangoServices.maUtil
//  * @name decodedStateParams
//  *
//  * @description Returns $stateParams decoded into a format that can be used in watch list parameters.
//  * Decodes 'null' into null.
//  *
//  * @returns {object} Decoded parameters for watch list
//  */
// decodedStateParams() {
//     const params = Object.assign({}, $stateParams);

//     Object.keys(params).forEach((key) => {
//         const paramValue = params[key];
//         if (Array.isArray(paramValue)) {
//             params[key] = paramValue.map((value) => {
//                 return value === ENCODED_STATE_PARAM_NULL ? null : value;
//             });
//         } else if (paramValue === ENCODED_STATE_PARAM_NULL) {
//             params[key] = null;
//         }
//     });

//     return params;
// },

// /**
//  * @ngdoc method
//  * @methodOf ngMangoServices.maUtil
//  * @name createArrayParams
//  *
//  * @description Creates a parameters object where each value is always an array. Useful for setting
//  *     multi-select watch list parameters from state parameters.
//  *
//  * @param {object} parameters $stateParams like object
//  * @returns {object} new parameters object where values are always arrays
//  */
// createArrayParams(parameters) {
//     const arrayParams = {};
//     Object.keys(parameters).forEach((key) => {
//         const paramValue = parameters[key];
//         if (paramValue === undefined) {
//             arrayParams[key] = [];
//         } else if (!Array.isArray(paramValue)) {
//             arrayParams[key] = [paramValue];
//         } else {
//             arrayParams[key] = paramValue;
//         }
//     });
//     return arrayParams;
// },

// /**
//  * @ngdoc method
//  * @methodOf ngMangoServices.maUtil
//  * @name differentToStateParams
//  *
//  * @description Compares new state params to the current $stateParams
//  *
//  * @param {object} updateParams New state params
//  * @returns {boolean} true if updateParams are the different to the current $stateParams
//  *
//  */
// differentToStateParams(updateParams) {
//     return Object.keys(updateParams).some((key) => {
//         const paramValue = updateParams[key];
//         return $stateParams.hasOwnProperty(key) && !angular.equals(paramValue, $stateParams[key]);
//     });
// },

// /**
//  * @ngdoc method
//  * @methodOf ngMangoServices.maUtil
//  * @name updateStateParams
//  *
//  * @description Updates $stateParams using $state.go() if updateParams are different to the current $stateParams
//  *
//  * @param {object} updateParams New state params
//  * @returns {boolean} true if updateParams were different and $state.go() was called
//  */
// updateStateParams(updateParams) {
//     if (this.differentToStateParams(updateParams)) {
//         $state.go('.', updateParams, { location: 'replace', notify: false });
//         return true;
//     }
//     return false;
// },

interface ObjectResource extends Array<any> {
    $start: number;
    $limit: number;
    $total: number;
    $pages: number;
    $page: number;
    length: number;
}

interface UtilFactory {
    maMatch(args: any): any;
    maMatches(selector: any): boolean;
    query(queryObject: any, opts?: {}): any;
    maFind(selector: any): Element[];
    maHasFocus(): boolean;
    maClick(): boolean | UtilFactory;
    maFocus(options: { selectText?: string; sort?: string; scrollIntoView?: boolean }): UtilFactory;
    firstMatch: (accessor: string) => (selector: string) => Element[];
    maParent: (selector: string) => Element[];
    maNext: (selector: string) => Element[];
    maPrev: (selector: string) => Element[];
    maForEach(...args: any[]): UtilFactory;
    maPush(...args: any[]): UtilFactory;
    maFilter(...args: any[]): any[];
    maMap(...args: any[]): any[];
    maAdd(...args: any[]): any[];
    maIncludes($other: string): boolean;
    maNot($other: string): any[];
    arrayDiff(
        newArray: any[],
        oldArray: any[]
    ): {
        added: any[];
        removed: any[];
        changed: boolean;
    };
    toLuxonDT: (input: undefined | string | number, now: number, format: string) => DateTime;
    isEmpty(str: string): boolean;
    numKeys(obj: Record<string, number | string | boolean>, start: string): number;
    openSocket(path: string): WebSocket;
    transformArrayResponse(data: string, headers: string, code: number): any;
    arrayResponseInterceptor(data: { data: ObjectResource; resource: ObjectResource; config: { url: string } }): ObjectResource | Promise<never>;
    memoize(fn: Function, cacheSize: number): any;
    rollupIntervalCalculator(from: string, to: string, rollupType: string, asObject: boolean): string | { intervals: number; units: string };
    blobToText(blob: Blob): Promise<never>;
}

function UtilFactory(this: any) {
    const mangoBaseUrl = constants.MA_BASE_URL;

    // const $stateParams = $injector.has('$stateParams') ? $injector.get('$stateParams') : null;
    // const $state = $injector.has('$state') ? $injector.get('$state') : null;

    const SNAKE_CASE_REGEXP = /[A-Z]/g;
    const PREFIX_REGEXP = /^((?:x|data)[:\-_])/i;
    const SPECIAL_CHARS_REGEXP = /[:\-_]+(.)/g;

    const ENCODED_STATE_PARAM_NULL = 'null';

    const RestResource = restResourceFactory();

    const util: UtilFactory = {
        query: RestResource.query,
        firstMatch(accessor: string): (selector: string) => Element[] {
            return (selector: string) => {
                const selection: Element[] = [];
                Array.prototype.forEach.call(this, (e: any) => {
                    while ((e = e[accessor]) != null) {
                        if (e instanceof Element && e.matches(selector)) {
                            selection.push(e);
                            break;
                        }
                    }
                });
                return selection;
            };
        },
        maMatch(selector: any) {
            const elements = Array.prototype.filter.call(this, (e) => {
                return e instanceof Element && e.matches(selector);
            });
            return elements;
        },

        maMatches(selector: any) {
            return Array.prototype.some.call(this, (e) => {
                return e instanceof Element && e.matches(selector);
            });
        },

        maFind(selector: any): Element[] {
            const elements = Array.from(this.maMatch(selector)) as Element[];
            Array.prototype.forEach.call(this, (e) => {
                if (e instanceof Element || e instanceof Document) {
                    const matches = e.querySelectorAll(selector);
                    elements.push(...matches);
                }
            });
            return elements;
        },

        maHasFocus() {
            const activeElement = document.activeElement;
            if (!activeElement) return false;

            return Array.prototype.some.call(this, (e) => {
                return e.contains(activeElement);
            });
        },

        maClick() {
            Array.prototype.some.call(this, (e) => {
                if (e instanceof HTMLElement) {
                    e.click();
                    return true;
                }
            });
            return this;
        },

        maFocus(options: { selectText?: string; sort?: string; scrollIntoView?: boolean } = {}) {
            const selectText = !!options.selectText;
            const sort = !!options.sort;
            const scrollIntoView = !!options.scrollIntoView;

            const focusable = Array.prototype.filter.call(this, (e: HTMLFormElement) => {
                // offsetParent is null if element is not visible
                return e instanceof Element && e.offsetParent != null && !e.disabled;
            });

            if (sort) {
                focusable.sort((e1, e2) => {
                    // prioritize element with autofocus attribute
                    if (e1.autofocus && !e2.autofocus) return -1;
                    if (!e1.autofocus && e2.autofocus) return 1;
                    return e1.tabIndex - e2.tabIndex;
                });
            }

            focusable.find((first) => {
                first.focus();
                if (scrollIntoView) {
                    first.scrollIntoView();
                }
                if (selectText && typeof first.setSelectionRange === 'function') {
                    first.setSelectionRange(0, first.value.length);
                }
                return true;
            });
            return this;
        },

        maParent: this.firstMatch('parentNode'),
        maNext: this.firstMatch('nextSibling'),
        maPrev: this.firstMatch('previousSibling'),

        maForEach(...args: any[]) {
            const fn = args[0];
            Array.prototype.forEach.apply(this, args as [callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any]);
            return this;
        },

        maPush(...args: any[]) {
            Array.prototype.push.apply(this, args);
            return this;
        },

        maFilter<S>(...args: any[]) {
            return Array.prototype.filter.apply(this, args as [predicate: (value: any, index: number, array: any[]) => value is S, thisArg?: any]);
        },

        maMap<U>(...args: any[]): any[] {
            return Array.prototype.map.apply(this, args as [callbackfn: (value: any, index: number, array: any[]) => U, thisArg?: any]);
        },

        maAdd(...add: any[]) {
            const args = Array.from(add).map((arg) => (arg.prototype.constructor.name === 'Object' ? Array.from(arg) : arg));
            return Array.prototype.concat.apply(Array.from(this as any), args);
        },

        maIncludes($other: string) {
            return Array.prototype.some.call(this, (e) => {
                return Array.prototype.includes.call($other, e);
            });
        },

        maNot($other: string) {
            return Array.prototype.filter.call(this, (e) => {
                return !Array.prototype.includes.call($other, e);
            });
        },

        // maFirst() {
        //     return this.length ? JQLite(this[0]) : JQLite();
        // },
        /**
        * @ngdoc method
        * @methodOf ngMangoServices.maUtil
        * @name arrayDiff
        *
        * @description
        * Utility for providing information about the difference between two arrays
        * @param {*[]} newArray New array to compare against old array.
        * @param {*[]} oldArray Old array that new array will compare against.
        * @returns {object}  Returns an object with the following properties:

        <ul><li>`added` - ARRAY of items that were added in newArray that were not in oldArray.</li>
        <li>`removed` - ARRAY of items that were in oldArray that were not in newArray.</li>
        <li>`changed` - BOOLEAN true/false depending on if there is a diff between the arrays.
        */
        arrayDiff(newArray: any[], oldArray: any[]) {
            if (newArray === undefined) newArray = [];
            if (oldArray === undefined) oldArray = [];

            const newSet = new Set(newArray);
            const oldSet = new Set(oldArray);

            const added = Array.from(newSet).filter((x) => !oldSet.has(x));
            const removed = Array.from(oldSet).filter((x) => !newSet.has(x));

            return {
                added: added,
                removed: removed,
                changed: !!(added.length || removed.length)
            };
        },

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maUtil
         * @name toMoment
         *
         * @description
         * Converts an input to a momentjs object
         * @param {string} input If input = 'now', moment(now) will be returned
         * @param {string} now standard date timestamp for converting to moment
         * @param {string} format If input equals a formatted date/time string, specify what format it is in to return
         *     moment(input, format || mangoDateFormats.dateTimeSeconds);
         * @returns {object}  Returns a moment js object.
         *
         */
        toLuxonDT(input: string | number | undefined, now: number, format: string): DateTime {
            if (!input || input === 'now') return DateTime.now();
            if (typeof input === 'string') {
                return DateTime.fromFormat(input, format || constants.MA_DATE_FORMATS.dateTimeSeconds);
            }
            return DateTime.fromMillis(now);
        },

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maUtil
         * @name isEmpty
         *
         * @description
         * Test a string for null, undefined or whitespace
         * @param {string} str String to be tested for emptiness
         * @returns {boolean}  Returns true if `str` is null, undefined, or whitespace
         *
         */
        isEmpty(str: string) {
            return !str || /^\s*$/.test(str);
        },

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maUtil
         * @name numKeys
         *
         * @description
         * Number of keys in object starting with specified string
         * @param {object} obj Object containing a certain number of items.
         * @param {string} start String used for testing keys
         * @returns {number}  Returns the number of keys in `obj` starting with the text given by `start` string
         *
         */
        numKeys(obj: Record<string, number | string | boolean>, start: string): number {
            let count = 0;
            for (const key in obj) {
                if (key.indexOf(start) === 0) count++;
            }
            return count;
        },

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maUtil
         * @name openSocket
         *
         * @description
         * If websocket is supported by the browser this utility will open a new websocket at the specified path.
         * @param {string} path Path of the API endpoint to open a websocket connection with
         * @returns {object}  Returns a WebSocket object at the specifed path
         *
         */
        openSocket(path: string) {
            if (!('WebSocket' in window)) {
                throw new Error('WebSocket not supported');
            }

            let host = document.location.host;
            let protocol = document.location.protocol;

            if (mangoBaseUrl) {
                const i = mangoBaseUrl.indexOf('//');
                if (i >= 0) {
                    protocol = mangoBaseUrl.substring(0, i);
                    host = mangoBaseUrl.substring(i + 2);
                } else {
                    host = mangoBaseUrl;
                }
            }

            protocol = protocol === 'https:' ? 'wss:' : 'ws:';

            return new WebSocket(protocol + '//' + host + path);
        },

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maUtil
         * @name transformArrayResponse
         *
         * @description
         * Parses an array response from a Mango endpoint which contains a total
         * and assigns it as the property $total on the array
         * @param {string} data JSON response from Mango endpoint
         * @param {string} fn REPLACE
         * @param {number} code String used for testing keys
         * @returns {object[]}  Array with $total property
         *
         */
        transformArrayResponse(data: string, headers: string, code: number) {
            try {
                if (!data) return data;
                const parsed = JSON.parse(data);
                if (code < 300) {
                    parsed.items.$total = parsed.total || parsed.items.length;
                    return parsed.items;
                }
                return parsed;
            } catch (error) {
                console.log(error);
            }
        },

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maUtil
         * @name arrayResponseInterceptor
         *
         * @description
         * Copies the total from the transformed array onto the actual destination
         * array and computes page number
         *
         */

        arrayResponseInterceptor<T>(data: { data: ObjectResource; resource: ObjectResource; config: { url: string } }) {
            if (data.data === undefined) return Promise.reject(data);

            try {
                let start = 0;
                let limit = data.resource.length;
                const total = data.data.$total;

                const matches = /(?:&|\?)limit\((\d+)(?:,(\d+))?\)/i.exec(data.config.url);
                if (matches) {
                    limit = parseInt(matches[1], 10);
                    if (matches[2]) {
                        start = parseInt(matches[2], 10);
                    }
                }

                // copy the xid to the originalId property
                data.resource.forEach((r) => {
                    const idProperty = r.constructor.idProperty;
                    const originalId = idProperty && r[idProperty];
                    if (originalId) {
                        r.originalId = originalId;
                    }
                });

                data.resource.$start = start;
                data.resource.$limit = limit;
                data.resource.$total = total;
                data.resource.$pages = Math.ceil(total / limit);
                data.resource.$page = Math.floor(start / limit) + 1;
            } catch (error) {
                console.log(error);
                return Promise.reject(data);
            }
            return data.resource;
        },

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maUtil
         * @name memoize
         *
         * @description
         * Extremely simple memoize function that works on === equality.
         * Used to prevent infinite digest loops in filters etc.
         *
         */
        memoize(fn: Function, cacheSize: number) {
            const cache: any[] = [];
            if (!Number.isFinite(cacheSize) || cacheSize <= 0) {
                cacheSize = 10;
            }
            do {
                cache.push(undefined);
            } while (--cacheSize > 0);

            return () => {
                const args = Array.prototype.slice.call(arguments, 0);

                searchCache: for (let i = 0; i < cache.length; i++) {
                    const cacheItem = cache[i];
                    if (!cacheItem) break;

                    const cachedArgs = cacheItem.input;
                    if (cachedArgs.length !== args.length) continue;

                    for (let j = 0; j < cachedArgs.length; j++) {
                        if (cachedArgs[j] !== args[j]) continue searchCache;
                    }

                    return cacheItem.output;
                }

                const result = fn.apply(this, args);

                cache.unshift({ input: args, output: result });
                cache.pop();

                return result;
            };
        },

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maUtil
         * @name rollupIntervalCalculator
         *
         * @description
         * Calculates rollup intervals based on time duration and rollup type
         * @param {string} from From Time
         * @param {string} to To Time
         * @param {string} rollupType Rollup Type (DELTA, AVERAGE etc.)
         * @returns {string} Returns a string holding the Rollup Interval (eg. `1 MINUTES`)
         *
         */
        rollupIntervalCalculator(from: string, to: string, rollupType: string, asObject: boolean) {
            const duration = DateTime.fromFormat(to, constants.MA_DATE_TIME_FORMATS[0].format).diff(DateTime.fromFormat(from, constants.MA_DATE_TIME_FORMATS[0].format)).as('seconds');
            let result = { intervals: 1, units: 'SECONDS' };

            // console.log(duration,moment.duration(duration).humanize(),rollupType);

            if (duration > 60001 && duration <= 300001) {
                // 1 min - 5 mins
                result = { intervals: 5, units: 'SECONDS' };
            } else if (duration > 300001 && duration <= 900001) {
                // 5 min - 15 mins
                result = { intervals: 10, units: 'SECONDS' };
            } else if (duration > 900001 && duration <= 1800001) {
                // 15 min - 30 mins
                result = { intervals: 30, units: 'SECONDS' };
            } else if (duration > 1800001 && duration <= 10800001) {
                // 30 mins - 3 hours
                if (rollupType === 'DELTA') {
                    result = { intervals: 5, units: 'MINUTES' };
                } else {
                    result = { intervals: 1, units: 'MINUTES' };
                }
            } else if (duration > 10800001 && duration <= 21600001) {
                // 3 hours - 6 hours
                if (rollupType === 'DELTA') {
                    result = { intervals: 30, units: 'MINUTES' };
                } else {
                    result = { intervals: 2, units: 'MINUTES' };
                }
            } else if (duration > 21600001 && duration <= 86400001) {
                // 6 hours - 24 hours
                if (rollupType === 'DELTA') {
                    result = { intervals: 1, units: 'HOURS' };
                } else {
                    result = { intervals: 10, units: 'MINUTES' };
                }
            } else if (duration > 86400001 && duration <= 259200001) {
                // 1 day - 3 days
                if (rollupType === 'DELTA') {
                    result = { intervals: 6, units: 'HOURS' };
                } else {
                    result = { intervals: 30, units: 'MINUTES' };
                }
            } else if (duration > 259200001 && duration <= 604800001) {
                // 3 days - 1 week
                if (rollupType === 'DELTA') {
                    result = { intervals: 12, units: 'HOURS' };
                } else {
                    result = { intervals: 2, units: 'HOURS' };
                }
            } else if (duration > 604800001 && duration <= 1209600001) {
                // 1 week - 2 weeks
                if (rollupType === 'DELTA') {
                    result = { intervals: 1, units: 'DAYS' };
                } else {
                    result = { intervals: 3, units: 'HOURS' };
                }
            } else if (duration > 1209600001 && duration <= 2678400001) {
                // 2 weeks - 1 month
                if (rollupType === 'DELTA') {
                    result = { intervals: 1, units: 'DAYS' };
                } else {
                    result = { intervals: 4, units: 'HOURS' };
                }
            } else if (duration > 2678400001 && duration <= 15721200001) {
                // 1 month - 6 months
                if (rollupType === 'DELTA') {
                    result = { intervals: 1, units: 'WEEKS' };
                } else {
                    result = { intervals: 1, units: 'DAYS' };
                }
            } else if (duration > 15721200001 && duration <= 31622400001) {
                // 6 months - 1 YR
                if (rollupType === 'DELTA') {
                    result = { intervals: 2, units: 'WEEKS' };
                } else {
                    result = { intervals: 1, units: 'DAYS' };
                }
            } else if (duration > 31622400001) {
                // > 1 YR
                if (rollupType === 'DELTA') {
                    result = { intervals: 1, units: 'MONTHS' };
                } else {
                    result = { intervals: 1, units: 'DAYS' };
                }
            }
            // console.log(result);

            if (asObject) {
                return result;
            } else {
                return result.intervals + ' ' + result.units;
            }
        },

        objQuery(options: any) {
            const factory = rqlBuilderFactory();
            const rqlBuilder = new factory();
            if (!options) return rqlBuilder.query();
            const params = [];

            if (typeof options.query === 'string' && options.query) {
                params.push(options.query);
            } else if (options.query && typeof options.query.walk === 'function') {
                // RQL query object
                params.push(options.query.toString());
            } else if (options.query) {
                const or = !options.query.$and;
                const exact = !!options.query.$exact;

                if (or) {
                    rqlBuilder.or();
                }

                Object.keys(options.query)
                    .filter((k) => k.indexOf('$') !== 0)
                    .map((k) => ({ key: k, value: options.query[k] }))
                    .filter((entry) => entry.value !== undefined)
                    .forEach(({ key, value }) => {
                        if (Array.isArray(value)) {
                            if (value.length) {
                                rqlBuilder.in(key, ...value);
                            }
                        } else if (typeof value === 'string' && value.indexOf('=') < 0 && !exact) {
                            rqlBuilder.match(key, '*' + value + '*');
                        } else {
                            rqlBuilder.eq(key, value);
                        }
                    });

                if (or) {
                    rqlBuilder.up();
                }
            }

            if (options.sort) {
                if (Array.isArray(options.sort)) {
                    rqlBuilder.sort(...options.sort);
                } else {
                    rqlBuilder.sort(options.sort);
                }
            }

            if (options.limit != null) {
                rqlBuilder.limit(options.limit, options.start || 0);
            }

            const rqlBuilderString = rqlBuilder.toString();
            if (rqlBuilderString) {
                params.push(rqlBuilderString);
            }

            return params.length ? this.query({ rqlQuery: params.join('&') }) : this.query();
        },

        parseInternationalFloat(strValue: string) {
            strValue = standardizeFloat(strValue);
            return parseFloat(strValue);

            function standardizeFloat(strValue: string) {
                let matches;

                // has obvious space or full stop thousands separator and a comma as radix point
                // i.e. converts 1 234 567,89 to 1234567.89
                if ((matches = /\b(\d{1,3}(?:[\. ]\d{3})+),(\d+)/.exec(strValue))) {
                    return matches[1].replace(/[\. ]/g, '') + '.' + matches[2];
                }

                // convert groups of digits with 2 or more full stop thousands separators
                // i.e. converts 1.234.567 to 1234567
                if ((matches = /\b\d{1,3}(?:\.\d{3}){2,}(?!\d)/.exec(strValue))) {
                    return matches[0].replace(/\./g, '');
                }

                // remove any other commas, spaces and single quotes (can be thousands separators)
                strValue = strValue.replace(/[, ']/g, '');

                if ((matches = /[-+\.\d]+/.exec(strValue))) {
                    return matches[0];
                }

                return strValue;
            }
        },

        pointValueToString(pointValue: number | boolean, point: DataPoint) {
            if (point && typeof point.getTextRenderer === 'function') {
                const rendered = point.getTextRenderer().render(pointValue);
                if (rendered && rendered.text && typeof rendered.text === 'string') {
                    return rendered.text;
                }
            }

            if (typeof pointValue === 'number') {
                // convert to 3 fixed decimal places
                const numberString = pointValue.toFixed(3);

                // dont display trailing zeros
                if (numberString.substring(-4) === '.000') {
                    return numberString.slice(0, -4);
                } else if (numberString.substring(-2) === '00') {
                    return numberString.slice(0, -2);
                } else if (numberString.substring(-1) === '0') {
                    return numberString.slice(0, -1);
                } else {
                    return numberString;
                }
            }

            if (typeof pointValue === 'boolean') {
                return pointValue ? '1' : '0';
            }

            return '' + pointValue;
        },

        throwHttpError(error: AxiosResponse) {
            if (error instanceof Error) return Promise.reject(error);
            if (error.status < 0) throw new Error('$http request timeout or cancelled');
            throw new Error(error.status + ' - ' + error.statusText);
        },

        cancelOrTimeout<T>(cancelPromise: Promise<T>, timeout: number) {
            timeout = Number.isFinite(timeout) && timeout >= 0 ? timeout : constants.MA_TIMEOUTS.xhr;
            if (timeout > 0) {
                const timeoutPromise = new Promise(function (resolve) {
                    setTimeout(resolve, timeout, false);
                });
                return Promise.race([cancelPromise, timeoutPromise]);
            }
            return cancelPromise;
        },

        snakeCase(name: string, separator: string) {
            separator = separator || '-';
            return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
                return (pos ? separator : '') + letter.toLowerCase();
            });
        },

        camelCase(name: string) {
            return name.replace(PREFIX_REGEXP, '').replace(SPECIAL_CHARS_REGEXP, fnCamelCaseReplace);

            function fnCamelCaseReplace(all: string, letter: string) {
                return letter.toUpperCase();
            }
        },

        titleCase(input: string) {
            return input.replace(/\w\S*/g, function (txt: string) {
                return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
            });
        },

        downloadBlob(blob: Blob, filename: string) {
            /*    if (typeof window.navigator.msSaveBlob === 'function') {
                window.navigator. (blob, filename);
            } else { */
            const url = URL.createObjectURL(blob);
            try {
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } finally {
                URL.revokeObjectURL(url);
            }
            /*  } */
        },

        escapeRegExp(str: string) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        },

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maUtil
         * @name deepReplace
         *
         * @description does a deep replace of object values, i.e. keeps the same array/object but replaces all of its keys
         */
        deepReplace(oldObject: Record<string, any>, newObject: Record<string, any>) {
            // remove keys from oldObject which don't exist in newObject
            if (Array.isArray(newObject) && Array.isArray(oldObject)) {
                oldObject.length = newObject.length;
            } else {
                Object.keys(oldObject).forEach((oldKey) => {
                    if (!newObject.hasOwnProperty(oldKey)) {
                        delete oldObject[oldKey as keyof Object];
                    }
                });
            }

            Object.keys(newObject).forEach((key) => {
                const newValue = newObject[key as keyof Object];
                const oldValue = oldObject[key as keyof Object];

                if (newValue != null && oldValue != null && typeof newValue === 'object' && typeof oldValue === 'object') {
                    this.deepReplace(oldValue, newValue);
                } else {
                    oldObject[key] = newValue;
                }
            });
        },

        /**
         * Escapes all RegExp special characters
         * @param {string} s
         * @returns {*}
         */
        regExpEscape(s) {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        },

        setsEqual(a, b) {
            return a.size === b.size && Array.from(a).every((x) => b.has(x));
        },

        equalByFn(mapFn: (value: any, index?: number, array?: any[]) => any, a: any[], b: any[]) {
            if (a === b) return true;

            const aIsArray = Array.isArray(a);
            const bIsArray = Array.isArray(b);

            if (aIsArray || bIsArray) {
                const aKeys = new Set((aIsArray ? a : [a]).map(mapFn));
                const bKeys = new Set((bIsArray ? b : [b]).map(mapFn));

                return this.setsEqual(aKeys, bKeys);
            }

            return mapFn(a) === mapFn(b);
        },

        equalByKey(key: string, a: string, b: string) {
            return this.equalByFn((x) => (x == null || typeof x !== 'object' ? x : x[key]), a, b);
        },

        splitPropertyName(name: string, isControlName = false) {
            if (!name) {
                return [];
            }

            const propArray = name.split('.');

            if (isControlName) {
                // forms are often named "$ctrl.name", remove the prefix
                if (propArray.length && propArray[0] === '$ctrl') {
                    propArray.shift();
                }
            }

            for (let i = 0; i < propArray.length; i++) {
                const j = i;
                let prop = propArray[j];

                const arrayIndexMatch = /^(.+)\[(\d+)\]$/.exec(prop);
                if (arrayIndexMatch) {
                    prop = propArray[j] = arrayIndexMatch[1];
                    propArray.splice(j + 1, 0, arrayIndexMatch[2]);
                    i++; // skip in entry we just spliced in
                }

                if (isControlName) {
                    const matchesInternal = /^(.+)_internal$/.exec(prop);
                    if (matchesInternal) {
                        prop = propArray[j] = matchesInternal[1];
                    }
                }
            }

            return propArray.filter((p) => !!p);
        },

        splitControlName(control: string) {
            return this.splitPropertyName(controlName(control), true);
        },

        propertyNameToSelector(name: string) {
            return this.splitPropertyName(name)
                .map((n) => {
                    return `[name='${n}']`;
                })
                .join(' ');
        },

        /*  controlName(control:string) {
            return control.hasOwnProperty('$maName') ? control.$maName : control.$name;
        },

        findInputElement(name:string, control:string, parentPath = null as null|string) {
            const isRootControl = !parentPath;
            let path;

            if (isRootControl) {
                // convert xyz[0] to xyz.0
                name = this.splitPropertyName(name).join('.');
                path = [];
            } else {
                path = parentPath.concat(this.splitControlName(control));
            }

            let fullControlName;
            if (path.length) {
                fullControlName = path.join('.');
            } else if (isRootControl) {
                fullControlName = '';
            }

            if (name === fullControlName) {
                return control.$$element[0];
            }

            const isForm = typeof control.$getControls === 'function';
            if (isForm) {
                const children = control.$getControls();
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    const elem = this.findInputElement(name, child, path);
                    if (elem) {
                        return elem;
                    }
                }
            }
        }, */

        deepMerge: function deepMerge(dst: Record<string, any> | {}, ...srcArray: Record<string, any>[]) {
            if (dst === null || typeof dst !== 'object') {
                dst = {};
            }

            for (let i = 0; i < srcArray.length; i++) {
                const src = srcArray[i];
                if (src == null) continue;

                for (let k of Object.keys(src)) {
                    const srcVal = src[k];
                    let dstVal = (dst as Record<string, any>)[k];

                    if (srcVal !== null && typeof srcVal === 'object') {
                        const srcIsArray = Array.isArray(srcVal);
                        const dstIsArray = Array.isArray(dstVal);

                        if (srcIsArray && !dstIsArray) {
                            dstVal = [];
                        } else if (!srcIsArray && dstIsArray) {
                            dstVal = {};
                        }

                        (dst as Record<string, any>)[k] = deepMerge(dstVal, srcVal);
                    } else if (srcVal !== undefined) {
                        (dst as Record<string, any>)[k] = srcVal;
                    }
                }
            }

            return dst;
        },

        deepDiff: function deepDiff(data: Record<string, any>, defaults) {
            const differences = {};
            for (const key in data) {
                const fieldValue = data[key];
                const defaultValue = defaults && defaults[key];
                if (typeof fieldValue !== 'function' && Object.equals(fieldValue, defaultValue)) {
                    if (fieldValue && typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
                        const diff = deepDiff(fieldValue, defaultValue);
                        if (Object.keys(diff).length) {
                            (differences as Record<string, any>)[key] = diff;
                        }
                    } else {
                        (differences as Record<string, any>)[key] = fieldValue;
                    }
                }
            }
            return differences;
        },

        /**
         * @ngdoc method
         * @methodOf ngMangoServices.maUtil
         * @name uuid
         *
         * @description
         * Generates a v4 (random) UUID
         */
        uuid() {
            return (1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => {
                return (c ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
            });
        },

        generateKey(keySizeBits = 256) {
            const bytes = $window.crypto.getRandomValues(new Uint8Array(keySizeBits / 8));
            return bytes.reduce((key, byte) => key + ('0' + byte.toString(16)).slice(-2), '');
        },

        createMapObject(array, keyProperty, map = Object.create(null)) {
            // clear the map object in case user passed it in
            Object.keys(map).forEach((k) => delete map[k]);
            for (const item of array) {
                map[item[keyProperty]] = item;
            }
            return map;
        },

        createMap(array, keyProperty, map = new Map()) {
            // clear the map object in case user passed it in
            map.clear();
            for (const item of array) {
                map.set(item[keyProperty], item);
            }
            return map;
        },

        freezeAll(array) {
            array.forEach((a) => Object.freeze(a));
            return Object.freeze(array);
        },

        /**
         * Creates a boolean model for adding/removing an item from a collection (Supports Arrays, Maps, and Sets).
         */
        createBooleanModel(collection: any[] | SetConstructor | MapConstructor, item: Record<string, string>, getId: string | null | Function) {
            if (typeof getId === 'string') {
                const propertyName = getId;
                getId = (a: Record<string, any>) => a[propertyName];
            } else if (getId == null) {
                // identity function
                getId = (a: string) => a;
            }

            const id = getId(item);

            if (Array.isArray(collection)) {
                return Object.defineProperty({}, 'value', {
                    get: () => !!collection.find((a) => (getId as Function)(a) === id),
                    set: (value) => {
                        const index = collection.findIndex((a) => (getId as Function)(a) === id);
                        if (value) {
                            if (index < 0) {
                                collection.push(item);
                            }
                        } else {
                            if (index >= 0) {
                                collection.splice(index, 1);
                            }
                        }
                    }
                });
            } else if (collection instanceof Set) {
                return Object.defineProperty({}, 'value', {
                    get: () => collection.has(id),
                    set: (value) => {
                        if (value) {
                            collection.add(id);
                        } else {
                            collection.delete(id);
                        }
                    }
                });
            } else if (collection instanceof Map) {
                return Object.defineProperty({}, 'value', {
                    get: () => collection.has(id),
                    set: (value) => {
                        if (value) {
                            collection.set(id, item);
                        } else {
                            collection.delete(id);
                        }
                    }
                });
            }
        },

        /**
         * Warning: Only parses the token, does not verify the signature
         */
        parseJwt(token: string) {
            const parts = token.split('.');
            const claims = parts[1];
            const jsonStr = atob(claims);
            return JSON.parse(jsonStr);
        },

        setDifference(a: any[], b: any[]) {
            const diff = new Set(a);
            for (let o of b) {
                diff.delete(o);
            }
            return diff;
        },

        formatBytes(bytes: number | string, precision = 1) {
            if (bytes === 0) return '0 B';
            if (isNaN(parseFloat(bytes as string)) || !isFinite(bytes as number)) return '-';
            const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes as number) / Math.log(1024));
            if (number === 0) precision = 0;
            return ((bytes as number) / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        },

        blobToText(blob: Blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.addEventListener('load', (e) => resolve(reader.result));
                reader.addEventListener('error', (e) => resolve(reader.error));
                reader.readAsText(blob);
            });
        },

        async blobToJson(blob: Blob): Promise<string> {
            return JSON.stringify(await this.blobToText(blob));
        },

        /**
         * Use /file-stores URL outside of REST so it is not rate limited, and is accessible anonymously (if public)
         * @param url
         */
        fileStoreUrl(url: string) {
            return url.replace(/^\/rest\/(?:v\d+|latest)\/file-stores\//, '/file-stores/');
        },
        /**
         * Use get nth argument supplied as an ...args parameter
         * @param index: number
         * @param args: any[] - pass arguments into here
         */
        sliceArgs(index: number, ...args: any[]): any {
            let i = 0;
            for (let arg in args) {
                if (i === index) {
                    return arg;
                }
                i++;
            }
            return null;
        }
    };

    return Object.freeze(util);
}

export const Util = UtilFactory();


