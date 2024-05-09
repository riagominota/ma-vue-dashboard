/**
* @name TranslationStore
*
* @description
* `Translate` service provides internationalization support.
*
* # Usage
*
* <pre prettyprint-mode="javascript">
    text = useTranslateStore.trSync(key, args);
* </pre>
*/ 
import { apply } from "ts-merge-patch";
import Globalize from 'globalize';
import likelySubtags from 'cldr-data/supplemental/likelySubtags.json';
import plurals from 'cldr-data/supplemental/plurals.json';
import {axios} from '@/boot/axios'
import { useEventBusStore } from "./EventBusStore";
import { Store, defineStore } from "pinia";
import { computed, inject, reactive } from "vue";
import {useUserStore} from "./UserStore";
import constants from "@/boot/constants";

const useTranslationStore = defineStore('translationStore',()=>{
    
        const EventBusStore = useEventBusStore()
        Globalize.load(likelySubtags);
        Globalize.load(plurals);
        
        const loadedNamespaces = reactive<Record<string,Record<string,Record<string,string>>>>({});
        const pendingRequests:Record<string,Record<string,Record<string,string>>> = {};
            
        const setLocale = (locale:string) => {
            let globalizeLocale = Globalize.locale();
            if (!globalizeLocale || globalizeLocale.locale !== locale) {
                globalizeLocale = Globalize.locale(locale);
                
                // remove all currently loaded namespaces
                clearLoadedNamespaces();
            }
            return globalizeLocale;
        }
        
        const clearLoadedNamespaces = () => {
            Object.keys(loadedNamespaces).forEach(key => delete loadedNamespaces[key]);
        }
        
        const loadTranslations = (data:{namespaces:string[],translations:Record<string,Record<string,string>>,locale:string}) => {
            const namespaces = data.namespaces;
            const translations = data.translations;
            const locale = data.locale;
            
            // translations will never contain the an entry for language tags with a script
            // eg zn-Hans-HK or pt-Latn-BR
            if (!translations[locale]) {
                translations[locale] = {};
            }
    
            Globalize.loadMessages(translations);
            
            // locale must be set after messages are loaded
            setLocale(locale);
            
            namespaces.forEach((namespace:string) => loadedNamespaces[namespace] = translations);
        }
    
       const translationsUrl = '/rest/latest/translations';
            
         
       const tr=(key:string|string[], args:string|string[]|undefined)=> {
                    if (Array.isArray(key)) {
                        args = key.slice(1);
                        key = key[0];
                    } else if (args != null && !Array.isArray(args)) {
                        console.warn('Deprecated use of Translation.tr()');
                        args = Array.prototype.slice.call(args , 1);
                    }
    
                    const namespaces = findNamespaces(key, args as string[]);
                    
                    return loadNamespaces(namespaces).then(() => {
                        return trSync(key, args as string[]);
                    });
                }
                
               const  findNamespaces=(key:string, args:string[]|string[][], namespaces:string[] = []) => {
                    const namespace = key.split('.')[0];
                    namespaces.push(namespace);
                    
                    if (Array.isArray(args)) {
                        for (let i = 0; i < args.length; i++) {
                            const arg = args[i];
                            if (Array.isArray(arg)) {
                                findNamespaces(arg[0], arg.slice(1), namespaces);
                            }
                        }
                    }
                    
                    return namespaces;
                }
                
                const trAll= (keys:string|string[]) =>{
                    if (Array.isArray(keys)) {
                        return Promise.all(keys.map((key:string) => tr(key,undefined)));
                    }
                    
                    const promises = Object.values(keys).map(translationKey => {
                        return translationKey ? tr(translationKey,undefined) : undefined;
                    });
                    
                    return Promise.all(promises).then(translated => {
                        return Object.keys(keys).reduce((obj:Record<string,any>, k:string, i) => {
                            obj[k] = translated[i];
                            return obj;
                        }, {});
                    });
                }
    
                function trSync(key:string|string[], args?:string[]|undefined){
                    if (Array.isArray(key)) {
                        args = key.slice(1);
                        key = key[0];
                    } else if (args != null && !Array.isArray(args)) {
                        console.warn('Deprecated use of maTranslate.trSync()');
                        args = Array.prototype.slice.call(arguments, 1);
                    }
                    
                    if (Array.isArray(args)) {
                        for (let i = 0; i < args.length; i++) {
                            const arg = args[i];
                            if (Array.isArray(arg)) {
                                args[i] = trSync(arg,undefined);
                            }
                        }
                    }
                    
                    return Globalize.messageFormatter(key).apply(Globalize, args as any);
                }
    
                function loadNamespaces(namespaces:string[]){
                    if (!Array.isArray(namespaces)) {
                        namespaces = Array.prototype.slice.call(arguments);
                    }
    
                    return Promise.resolve().then( async () => {
                        let namespacePromises = namespaces.map(async namespace => {
                            let loadedNamespace = loadedNamespaces[namespace];
                            if ( Object.prototype.hasOwnProperty.call(loadedNamespace,'then') ) {
                                return loadedNamespace;
                            }
                           
                            
                            let request = pendingRequests[namespace];
                            if (!request) {
                                let url = translationsUrl;
                                if (namespace === 'public' || namespace === 'login' || namespace === 'header') {
                                    url += '/public';
                                }
                                try
                                {
                                const response = await axios.get(`${url}/${encodeURIComponent(namespace)}`);
                                    // params: {
                                    //     //language: 'en-US',
                                    //     //server: true,
                                    //     //browser: true
                                    // }
                                
                                    loadTranslations(response.data);
                                    return response.data;
                                }
                                catch(e)
                                {
                                    console.warn(e)
                                }
                                finally
                                {
                                    delete pendingRequests[namespace];
                                }
    
                                pendingRequests[namespace] = request;
                            }
                            return request;
                        });
                        return Promise.all(namespacePromises);
                    }).then(result => {
                        const allData = {};
                        
                        result.forEach(data => {
                            apply(allData, data);
                        });
    
                        return allData;
                    });
                }
                
               const clearCache = () =>{
                    return axios({
                        method: 'POST',
                        url: `${translationsUrl}/clear-cache`
                    }).then(() => {
                        clearLoadedNamespaces();
                    });
                }
            
    

    
            EventBusStore.addNewTopic('maUser/localeChanged');
            EventBusStore.subscribe('maUser/localeChanged', (event, locale) => {
                const globalizeLocale = Globalize.locale();
                if (!globalizeLocale || globalizeLocale.locale !== locale) {
                    // clear the translation namespace cache if the user's locale changes
                    clearLoadedNamespaces();
                }
            });   
            return {
                tr,
                trSync
            }
});

export default useTranslationStore;