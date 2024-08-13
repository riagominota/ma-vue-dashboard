/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */


import defaultUiSettings from '../assets/json/vuiSettings.json';
// import util from './bootstrapUtil.js';
import { useSessionStore } from '@/stores/sessionStore';
import {axios} from './axios.js'
import { AxiosResponse } from 'axios';
import {apply} from 'ts-merge-patch'
import { PreLoginData } from '@/types/PreLoginData.js';
import { useUserStore } from '@/stores/UserStore.js';
import { VUISettings } from '@/types/VUISettings.js';
import { User, UserModel } from '@/types/User';
import useTranslationStore from '@/stores/TranslationStore';
//needs to be in web directory for REST controller to read
//import './vuiSettings.json?fileLoader';

interface BootstrapInit
{
    vuiSettings:VUISettings, user:User|null, preLoginData:PreLoginData, postLoginData:PostLoginData|null    
}

export const boostrapPreLogin =  () => {
    const SessionStore = useSessionStore();
    let beforeinstallpromptEvent: Event;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        beforeinstallpromptEvent = e;
    });

    (Promise.resolve() )
        .then(async():Promise<BootstrapInit> => {
            // clear the autologin credentials if the url parameter is set
            SessionStore.checkClearAutoLogin();
        const TRANSLATION_STORE = useTranslationStore()
        const preLoginDataPromise: AxiosResponse<any,PreLoginData> = await axios({
            method: 'GET',
            url: '/rest/latest/vui-bootstrap/pre-login'})
            // }).then((response: AxiosResponse) => {
                // if (response.status !== 200) {
                    // throw new Error('Failed to fetch pre-login bootstrap data');
                    // }
                    // return response.data;
                    // });
                    
        if(preLoginDataPromise.status!==200)
            throw new Error('Failed to fetch pre-login bootstrap data');

        /* const vuiSettingsPromise: Promise<VUISettings> = preLoginDataPromise.then((preLoginData: PreLoginData) => {
            const vuiSettings: VUISettings = Object.assign({}, defaultUiSettings);
            const customSettings = preLoginData.vuiSettings && preLoginData.vuiSettings.jsonData;
            return apply(vuiSettings, customSettings);
        }) as Promise<VUISettings>; */

        const preLoginData:PreLoginData = preLoginDataPromise.data;

        TRANSLATION_STORE.loadTranslations(preLoginData.translations)

        const vuiSettings: VUISettings = Object.assign({}, defaultUiSettings);
        const customSettings = preLoginData.vuiSettings && preLoginData.vuiSettings.jsonData;
        apply(vuiSettings, customSettings) 
            

            /* const modulesPromise = Promise.all([preLoginDataPromise, uiSettingsPromise]).then(([preLoginData, uiSettings]:PreLoginData,UISettings) => {
        // const modules = preLoginData.angularJsModules.modules;
        const amdModuleNames = /* modules.map(m => {
            amdConfiguration.moduleVersions[m.name] = m.version;
            return m.url.replace(/\.js$/, '');
        }); */

            /*   if ((uiSettings as VuiSettings).userModule) {
            let url = uiSettings.userModule;
            // load user module from the /file-stores URL outside of REST so it is not rate limited
            url = url.replace(/^\/rest\/(?:v\d+|latest)\/file-stores\//, '/file-stores/');
            amdModuleNames.push(url);
        } */

            /* const modulePromises = amdModuleNames.map(moduleName => {
            return new Promise((resolve, reject) => {
                requirejs([moduleName], module => {
                    resolve(module);
                }, e => {
                    reject(e);
                });
            }).catch(e => {
                console.error(`Failed to load AMD module ${moduleName}`, e);
            });
        });

        return Promise.all(modulePromises);
    }); */

            // const userPromise = preLoginDataPromise.then((preLoginData: PreLoginData) => {
        if (preLoginData.user) {
            preLoginData.user.originalId = preLoginData.user.username;
            // return preLoginData.user;
        }

        // return vuiSettingsPromise.then((vuiSettings) => {
        // return SessionStore.autoLogin(vuiSettings);
        SessionStore.autoLogin(vuiSettings);
        // });
            // });

        // const postLoginDataPromise = userPromise.then((user) => {
            if (!preLoginData.user) return {vuiSettings, user:null, preLoginData, postLoginData:null};
            const user = preLoginData.user
            const postLoginDataPromise:AxiosResponse<any,PostLoginData> = await axios({
                method: 'get',
                url: '/rest/latest/vui-bootstrap/post-login'
            });
            const postLoginData:PostLoginData = postLoginDataPromise.data
            if (postLoginDataPromise.status !== 200) {
                throw new Error('Failed to fetch post-login bootstrap data');
            }
            

            /* .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Failed to fetch post-login bootstrap data');
                }
                return response.data;
            }); */
        // });

            // return Promise.all([vuiSettingsPromise, /* modulesPromise, */ userPromise, preLoginDataPromise, postLoginDataPromise]);
            return {vuiSettings, /* modulesPromise, */ user , preLoginData, postLoginData} as BootstrapInit;
        })
        // .then(([vuiSettings, /* angularModules,  */ user, preLoginData, postLoginData]:[VUISettings,User,PreLoginData,PostLoginData]) => {
        .then(
            (  resp : BootstrapInit) => {
              const  {vuiSettings, user, preLoginData, postLoginData} = resp;
            /*  amdConfiguration.defaultVersion = preLoginData.lastUpgradeTime; */

            // vuiSettings.mangoModuleNames = [];
            /* const angularJsModuleNames = ['maUiApp']; */
            /*
    angularModules.forEach((angularModule, index, array) => {
        if (angularModule && angularModule.name) {
            if (Array.isArray(angularModule.optionalRequires)) {
                angularModule.optionalRequires.forEach(require => {
                    try {
                        angular.module(require);
                        angularModule.requires.push(require);
                    } catch (e) {
                        // module not loaded, don't add to requires
                    }
                });
            }

            angularJsModuleNames.push(angularModule.name);

            if (uiSettings.userModule && index === (array.length - 1)) {
                uiSettings.userModuleName = angularModule.name;
            } else {
                uiSettings.mangoModuleNames.push(angularModule.name);
            }
        }
    }); */

            // create a new AngularJS module which depends on the ui module and all the modules' AngularJS modules
            /* const maUiBootstrap = angular.module('maUiBootstrap', angularJsModuleNames); */

            // configure the the providers using data retrieved before bootstrap
            /*   maUiBootstrap.config(['maUserProvider', 'maUiSettingsProvider', 'maUiServerInfoProvider', 'MA_UI_INSTALL_PROMPT', 'MA_DEVELOPMENT_CONFIG',
            (UserProvider, maUiSettingsProvider, maUiServerInfoProvider, installPrompt, developmentConfig) => { */

            // store pre-bootstrap user into the User service
            // UserProvider.setCurrentUser(user);
            const UserStore = useUserStore();
            UserStore.setCurrentUser(user as UserModel);
            UserStore.setOAuth2Clients(preLoginData.oauth2Clients);
            // NOTE: REVISIT BELOW LATER
            /*       maUiSettingsProvider.setUiSettings(uiSettings);

        maUiServerInfoProvider.setPreLoginData(preLoginData);
        if (postLoginData) {
            maUiServerInfoProvider.setPostLoginData(postLoginData);
        }

        Object.defineProperty(installPrompt, 'event', {
            configurable: true,
            get() {
                return beforeinstallpromptEvent;
            }
        });

        developmentConfig.enabled = !!preLoginData.developmentMode;
    }]);
*/
            // promise resolves when DOM loaded
            /*   return new Promise(resolve => angular.element(resolve));
}).then(() => {
    angular.bootstrap(document.documentElement, ['maUiBootstrap'], {strictDi: true});
}).then(null, error => { */
            const errorDiv: HTMLElement | null = document.querySelector('.pre-bootstrap-error');
            if (errorDiv) {
                const msgDiv = errorDiv.querySelector('div');
                const pre = errorDiv.querySelector('pre');
                const code = errorDiv.querySelector('code');
                const link = errorDiv.querySelector('a');

                msgDiv!.textContent = 'Error bootstrapping Mango VUI app: '; //+ error.message;
                // code!.textContent = error!.stack;
                errorDiv.style!.display = 'block';

                link!.onclick = () => {
                    pre!.style.display = pre!.style.display === 'none' ? 'block' : 'none';
                };
            }
            // console.error(error);
        });
};