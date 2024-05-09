import { VUISettings } from "@/types/VUISettings";
import { defineStore } from "pinia";
import { computed } from "vue";


const useSessionStore = defineStore('sessionStore',()=>
{
    const autoLoginKey = 'MangoVuiServices.storedCredentials'
    const getCookie = (name: string) =>
    {
        const cookies = document.cookie.split(/\s*;\s*/);
        for (let i = 0; i < cookies.length; i++) {
            const splitCookie = cookies[i].split('=');
            if (splitCookie[0] === name) {
                return splitCookie[1];
            }
        }
    }
    
    const xhrRequest = (options: { method: any; url: any; data?: any; }) =>
    {
        const xhr = new XMLHttpRequest();
        
        return new Promise(resolve => {
            xhr.addEventListener('load', resolve);
            xhr.addEventListener('error', resolve);
            xhr.addEventListener('abort', resolve);
            xhr.open(options.method, options.url);
            xhr.timeout = 30000;
            xhr.setRequestHeader('accept', 'application/json;charset=utf-8');
            
            if (options.method !== 'GET') {
                const xsrfToken = getCookie('XSRF-TOKEN');
                if (xsrfToken) {
                    xhr.setRequestHeader('X-XSRF-TOKEN', xsrfToken);
                }
            }
            
            if (options.data) {
                xhr.setRequestHeader('content-type', 'application/json;charset=utf-8');
                xhr.send(JSON.stringify(options.data));
            } else {
                xhr.send();
            }
        }).then((event:any) => {
            const data = xhr.responseText && JSON.parse(event?.target.responseText as string);
            return {
                status: xhr.status,
                statusText: xhr.statusText,
                getHeader: xhr.getResponseHeader.bind(xhr),
                data,
                xhr
            };
        });
    }
    
    const getLocalStorage=(name:string) =>{
        if (!window.localStorage) return;
        const value = window.localStorage.getItem(name);
        return value && JSON.parse(value);
    }
    
    const setLocalStorage=(name:string, value:string|number|boolean|Record<string,string|number|boolean>) =>{
        if (!window.localStorage) return;
        window.localStorage.setItem(name, JSON.stringify(value));
    }
    
    const removeLocalStorage = (name:string) =>{
        if (!window.localStorage) return;
        window.localStorage.removeItem(name);
    }
    
    const login = (credentials:{username:string,password:string}) => {
        return xhrRequest({
            method: 'POST',
            url: '/rest/latest/login',
            data: credentials,
        }).then(response => {
            if (response.status === 200) {
                return response.data;
            }
            console.warn('Failed to login, credentials: ', credentials);
        });
    }
    
    

    const checkClearAutoLogin = ()=> {
        const searchParams = new URL(window.location.href).searchParams;
        if (searchParams) {
            if (searchParams.get('autoLoginDeleteCredentials') != null) {
                removeLocalStorage(autoLoginKey);
            }
        }
    }
    
    const autoLogin = (vuiSettings:VUISettings) =>
    {
        const credentials = {
            username: vuiSettings.autoLoginUsername,
            password: vuiSettings.autoLoginPassword || ''
        };
        
        const localStorageCredentials = getLocalStorage(autoLoginKey);
        if (localStorageCredentials && localStorageCredentials.username) {
            credentials.username = localStorageCredentials.username;
            credentials.password = localStorageCredentials.password || '';
        }
        
        const searchParams = new URL(window.location.href).searchParams;
        if (searchParams) {
            const username = searchParams.get('autoLoginUsername');
            const password = searchParams.get('autoLoginPassword');
            
            if (username) {
                credentials.username = username;
                credentials.password = password || '';
                
                if (searchParams.get('autoLoginStoreCredentials') != null) {
                    setLocalStorage(autoLoginKey, credentials);
                }
            }
        }
        
        if (credentials && credentials.username) {
            return login(credentials);
        }
    }

    return {
        checkClearAutoLogin,
        autoLogin,
        login,
        getLocalStorage,
        setLocalStorage,
        getCookie,
        removeLocalStorage
    }

    });

    export {useSessionStore}