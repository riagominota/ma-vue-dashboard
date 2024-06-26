import { defineStore } from 'pinia';
import AbstractResourceApi from '@/composables/useAbstractResourceApi';
import { User, UserModel, UserResource } from '@/types/User';
import { Util } from '@/composables/Util';
import { axios } from '@/boot/axios';
import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { Ref, computed, ref } from 'vue';
import { VUISettings } from '@/types/VUISettings';
import { DateTime, Zone } from 'luxon';
import constants from '@/boot/constants';
import { useEventBusStore } from './EventBusStore';
import Cldr from 'cldrjs';

interface Credentials {
    username: string;
    password: string;
}

const useUserStore = defineStore('userStore', () => {
    const USER_API_PATH = 'rest/latest/users';
    const authTokenBaseUrl = '/rest/latest/auth-tokens';
    const passwordResetUrl = '/rest/latest/password-reset';
    const emailVerificationUrl = '/rest/latest/email-verification';

    const EventBus = useEventBusStore();

    const userResource = new UserResource(USER_API_PATH, {});
    const { $get, $save, $update, $delete } = userResource;
    const lastUpgradeTime = ref<DateTime>();
    const current = ref<UserModel>();
    const ensureXsrfToken = async (req: AxiosRequestConfig) => {
        // ensures there is a CSRF protection cookie set before logging in
        const xsrfCookie = (req.headers as AxiosHeaders)['X-CSRF-TOKEN']; // $cookies.get($http.defaults.xsrfCookieName);
        if (!xsrfCookie) {
            (req.headers as AxiosHeaders)['X-CSRF-TOKEN'] = Util.uuid();
        }
    };
    const systemLocale = ref<string>();
    const systemTimezone = ref<string|Zone>();
    const oauth2Clients = ref<string[]>();
    const setCurrentUser = function(user:UserModel|null) {
        if(user)
            current.value = user;
        else
            current.value = undefined
    };
    const setSystemLocale = function(locale:string) {
        systemLocale.value = locale;
    };
    const setSystemTimezone = function(timezone:string) {
        systemTimezone.value = timezone;
    };
    const setOAuth2Clients = function(clients:string[]) {
        oauth2Clients.value = clients;
    }

    const switchCurrentUser = (user:UserModel)=>
    {
        if (user != null ) {
            user = Object.assign(Object.create(UserResource.prototype), user);
         }
         if (user !== current.value) {
            const previousUser = current.value;
            current.value = user || null;
         
            configureLocale();
            configureTimezone();
         
            EventBus.publish('maUser/currentUserChanged', current.value, previousUser);
         }
        current.value = user;
    }

    const configureLocale = (locale = getLocale()) => {
        if (locale !== (current as Ref<UserModel>).value.locale) {
            const prevLocale = locale;
            (current as Ref<UserModel>).value.locale = locale;

            // moment doesn't support locales with a script, just supply it with language and region
            const cldrAttributes = new Cldr(locale).attributes;
            DateTime.now().setLocale(cldrAttributes.minLanguageId);

            /* const localeId = locale.toLowerCase();
            const $locale = $injector.get('$locale');
            if (localeId !== $locale.id) {
                // localeCache.getLocale() returns ES6 promise, convert to AngularJS $q promise
                const promise = this.replaceLocalePromise = $q.when(angularLocaleCache.getLocale(localeId))
                    .catch(error => angularLocaleCache.getLocale(cldrAttributes.language))
                    .then(newLocaleData => {
                        if (promise === this.replaceLocalePromise) {
                            delete this.replaceLocalePromise;

                            // deep replace all properties of existing locale with the keys from the new locale
                            // this is necessary as the filters cache $locale.NUMBER_FORMATS for example
                            Util.deepReplace($locale, newLocaleData);
                        }
                    });
            } */

            EventBus.publish('maUser/localeChanged', locale, prevLocale);
        }
    }

   const configureTimezone = (timezone = getTimezone()) =>{
        if (timezone !== current.value?.timezone) {
            const prevTimezone = current.value?.timezone;
            (current as Ref<UserModel>).value.timezone = timezone;

            DateTime.local().setZone(timezone)
            // moment.tz.setDefault(timezone);

            EventBus.publish('maUser/timezoneChanged', timezone, prevTimezone);
        }
    }
    const getLocale = ():string => 
    {
        if (current.value) {
            return current.value.locale;
        }
        return getSystemLocale();
    }

    const getSystemLocale = ():string => 
    {
        return systemLocale.value || constants.MA_DEFAULT_LOCALE || (window.navigator.languages && window.navigator.languages[0]) || window.navigator.language;
    }

    const getTimezone = () => {
        if (current.value) {
            return current.value.timezone;
        }
        return getSystemTimezone();
    }

    const getSystemTimezone = ():string|Zone => {
        return systemTimezone.value || constants.MA_DEFAULT_TIMEZONE || DateTime.local().zone;
    }
    /* Send to store end */
    const publicVerifyEmail = async (email: string) => {
        return await axios.post(`${emailVerificationUrl}/public/send-email`, {
            emailAddress: email
        });
    };

    const publicUpdateEmail = async (token: string) => {
        return await axios.post(`${emailVerificationUrl}/public/update-email`, {
            token
        });
    };

    const sendEmailVerification = async (data: UserResource) => {
        return await axios.post(`${emailVerificationUrl}/send-email`, data);
    };

    const createEmailVerificationToken = async (data: UserResource) => {
        return await axios.post(`${emailVerificationUrl}/create-token`, data);
    };

    /* Send to store */
    const createAuthToken = async (expiry: DateTime, username: string) => {
        return await axios.post(`${authTokenBaseUrl}/create`, {
            username,
            expiry
        });
    };

    const revokeAuthTokens = async (username: string) => {
        let url = `${authTokenBaseUrl}/revoke`;
        if (username != null && username !== (current.value && current.value.username)) {
            url += `/${encodeURIComponent(username)}`;
        }

        return await axios.post(url);
    };

    //Use in User Store
    const storeCredentials = (username: string, password: string) => {
        localStorage.set('storedCredentials', {
            username: username,
            password: password
        });
    };

    const storedUsername = computed<Credentials>(() => {
        const credentials = localStorage.get('storedCredentials');
        return credentials ? credentials.username : null;
    });

    const getCredentialsFromUrl = () => {
        const params = new URL(window.location.href).searchParams;
        if (!params) return;

        const credentials = {
            username: params.get('autoLoginUsername'),
            password: params.get('autoLoginPassword') || ''
        };

        if (params.get('autoLoginDeleteCredentials') != null) {
            clearStoredCredentials();
        } else if (params.get('autoLoginStoreCredentials') != null && credentials.username) {
            storeCredentials(credentials.username, credentials.password);
        }

        return credentials.username && credentials;
    };

    const autoLogin = (maVuiSettings: VuiSettings) => {
        let credentials = getCredentialsFromUrl() || localStorage.get('storedCredentials');
        if (!credentials && maVuiSettings) {
            if (maVuiSettings.autoLoginUsername) {
                credentials = {
                    username: maVuiSettings.autoLoginUsername,
                    password: maVuiSettings.autoLoginPassword || ''
                };
            }
        }
        if (!credentials) {
            return Promise.reject('No stored credentials');
        }
        return login.call(this, credentials);
    };

    const clearStoredCredentials = () => {
        localStorage.remove('storedCredentials');
    };

    /* MOVE TO STORE */
    /* Object.assign(User.notificationManager, {
webSocketUrl: '/rest/latest/websocket/users'
});

Object.assign(User, {
setCurrentUser(user) {
if (user != null && !(user instanceof User)) {
   user = Object.assign(Object.create(User.prototype), user);
}
if (!angular.equals(user, currentUser)) {
   const previousUser = currentUser;
   currentUser = user || null;

   this.configureLocale();
   this.configureTimezone();

   maEventBus.publish('maUser/currentUserChanged', currentUser, previousUser);
}
}, */
    /* MOVE TO STORE END */
    const login = async (data: { username: string; password: string }) => {
        const resp = await axios.post<UserModel>('/rest/latest/login', data);
        if (resp.data) {
            current.value = resp.data;
        }
        return resp;
        /* method: 'POST',
    isArray: false,
    interceptor: {
       request: function(config) {
           delete config.params.username;
           User.ensureXsrfToken();
           return config;
       },
       response: setCurrentUserInterceptor
    } */
    };

    const logout = async (username: { username: string }) => {
        return await axios.post('/rest/latest/logout', username);
        /* method: 'POST',
        isArray: false,
        interceptor: {
           response: logoutInterceptor
        },
        hasBody: false */
    };

    const getCurrent = async () => {
        const resp = await axios.get<UserModel>(`${USER_API_PATH}current`);
        return resp.data;
        /* method: 'GET',
    isArray: false,
    interceptor: {
       response: setCurrentUserInterceptor
    } */
    };

    return {
        $get,
        $save,
        $update,
        $delete,
        publicUpdateEmail,
        publicVerifyEmail,
        login,
        logout,
        autoLogin,
        createAuthToken,
        createEmailVerificationToken,
        sendEmailVerification,
        storeCredentials,
        revokeAuthTokens,
        getCredentialsFromUrl,
        getCurrent,
        ensureXsrfToken,
        current,
        setCurrentUser,
        setSystemLocale,
        setSystemTimezone,
        switchCurrentUser,
        setOAuth2Clients,
        storedUsername,
       lastUpgradeTime
    };
});

export { useUserStore };
