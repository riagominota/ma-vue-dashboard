/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */
import {UserProperties} from '../types/user'
import {DateTime} from 'luxon';
import Cldr from 'cldr';


// preload popular locales
/* import 'angular-i18n/angular-locale_en';
import 'angular-i18n/angular-locale_en-001';
import 'angular-i18n/angular-locale_en-150';
import 'angular-i18n/angular-locale_en-us';
import 'angular-i18n/angular-locale_en-gb';
import 'angular-i18n/angular-locale_en-ca';
import 'angular-i18n/angular-locale_en-au';
import 'angular-i18n/angular-locale_en-za';
import 'angular-i18n/angular-locale_en-nz';
import 'angular-i18n/angular-locale_en-ie';
import 'angular-i18n/angular-locale_zh-cn';
import 'angular-i18n/angular-locale_ru-ru';
import 'angular-i18n/angular-locale_fr-fr';
import 'angular-i18n/angular-locale_es-es';
import 'angular-i18n/angular-locale_es-mx';
import 'angular-i18n/angular-locale_de-de';
import 'angular-i18n/angular-locale_pt-br';
import 'angular-i18n/angular-locale_it-it';
import 'angular-i18n/angular-locale_ja-jp'; */

import { api } from '@/boot/axios';
/**
* @ngdoc service
* @name ngMangoServices.maUser
*
* @description
* Provides a service for getting list of users from the Mango system, as well as logging users in and out.
* - All methods return <a href="https://docs.angularjs.org/api/ngResource/service/$resource" target="_blank">$resource</a>
*   objects that can call the following methods available to those objects:
*   - `$save`
*   - `$remove`
*   - `$delete`
*   - `$get`
*
* # Usage
*
* <pre prettyprint-mode="javascript">
*  const user = User.login({
    username: $scope.username,
    password: $scope.password
});

User.logout();
* </pre>
*
*/


/**
* @ngdoc method
* @methodOf ngMangoServices.maUser
* @name User#get
*
* @description
* A default action provided by $resource. Makes a http GET call to the rest endpoint `/rest/latest/users/:username`
* @param {object} query Object containing a `xid` property which will be used in the query.
* @returns {object} Returns a user object. Objects will be of the resource class and have resource actions available to them.
*
*/

/**
* @ngdoc method
* @methodOf ngMangoServices.maUser
* @name User#save
*
* @description
* A default action provided by $resource. Makes a http POST call to the rest endpoint `/rest/latest/users/:username`
* @param {object} query Object containing a `username` property which will be used in the query.
* @returns {object} Returns a user object. Objects will be of the resource class and have resource actions available to them.
*
*/

/**
* @ngdoc method
* @methodOf ngMangoServices.maUser
* @name User#remove
*
* @description
* A default action provided by $resource. Makes a http DELETE call to the rest endpoint `/rest/latest/users/:username`
* @param {object} query Object containing a `xid` property which will be used in the query.
* @returns {object} Returns a user object. Objects will be of the resource class and have resource actions available to them.
*
*/

/**
* @ngdoc method
* @methodOf ngMangoServices.maUser
* @name User#delete
*
* @description
* A default action provided by $resource. Makes a http DELETE call to the rest endpoint `/rest/latest/users/:username`
* @param {object} query Object containing a `xid` property which will be used in the query.
* @returns {object} Returns a user object. Objects will be of the resource class and have resource actions available to them.
*
*/


/**
* @ngdoc method
* @methodOf ngMangoServices.maUser
* @name User#rql
*
* @description
* Passed a string containing RQL for the query and returns an array of user objects.
* @param {string} RQL RQL string for the query
* @returns {array} An array of user objects. Objects will be of the resource class and have resource actions available to them.
*
*/


/**
* @ngdoc method
* @methodOf ngMangoServices.maUser
* @name User#getById
*
* @description
* Query the REST endpoint `/rest/latest/users/by-id/:id` with the `GET` method.
* @param {object} query Object containing a `id` property which will be used in the query.
* @returns {object} Returns a user object. Objects will be of the resource class and have resource actions available to them.
*
*/

/**
* @ngdoc method
* @methodOf ngMangoServices.maUser
* @name User#getCurrent
*
* @description
* Query the REST endpoint `/rest/latest/users/current` with the `GET` method to return the currently logged in user.
* @returns {object} Returns a user object. Objects will be of the resource class and have resource actions available to them.
*
*/

/**
* @ngdoc method
* @methodOf ngMangoServices.maUser
* @name User#login
*
* @description
* Attempts to login in the user by using `GET` method at `/rest/latest/login/:username`
* @returns {object} Returns a user object. Objects will be of the resource class and have resource actions available to them.
*
*/

/**
* @ngdoc method
* @methodOf ngMangoServices.maUser
* @name User#logout
*
* @description
* Logout the current user by using `GET` method at `/rest/latest/login/:username`
* @returns {object} Returns a user object. Objects will be of the resource class and have resource actions available to them.
*
*/

    let oauth2Clients = null;
    let bootstrapUser = null;
    let systemLocale;
    let systemTimezone;
/*
    this.setCurrentUser = function(user) {
        bootstrapUser = user;
    };
    this.setSystemLocale = function(locale) {
        systemLocale = locale;
    };
    this.setSystemTimezone = function(timezone) {
        systemTimezone = timezone;
    };
    this.setOAuth2Clients = function(clients) {
        oauth2Clients = clients;
    }; */


    /*
     * Provides service for getting list of users and create, update, delete
     */


/*     function UserFactory($resource, $cacheFactory, localStorageService, $q, Util, $http, maServer,
        $injector, $cookies, TemporaryRestResource, maEventBus, maRole) {
 */
class BulkUserTemporaryResource extends TemporaryRestResource {
static get baseUrl() {
return '/rest/latest/users/bulk';
}
static get resourceType() {
return 'BULK_USER';
}
}

let currentUser;
const authTokenBaseUrl = '/rest/latest/auth-tokens';
const passwordResetUrl = '/rest/latest/password-reset';
const emailVerificationUrl = '/rest/latest/email-verification';
const defaultProperties = {
username: '',
name: '',
email: '',
phone: '',
homeUrl: '',
locale: null,
timezone: null,
roles: ['user'],
muted: true,
receiveOwnAuditEvents: false,
disabled: false,
receiveAlarmEmails: 'IGNORE'
};

const UserPath = '/rest/latest/users/',


// username: data => data && (data.originalId || data.username)

const query = async (username:string) => {

return await api.get(`${UserPath}${username}`);
/* isArray: true,
transformResponse: Util.transformArrayResponse,
interceptor: {
   response: Util.arrayResponseInterceptor
} */
},
const getById = async (id:number)=>{
   return await api.get(`${UserPath}by-id/${id}`);
/* method: 'GET',
isArray: false
 */
},


const switchUser = async (username:string) => {
 return await api.post('/rest/latest/login/su');
/* method: 'POST',
isArray: false,
interceptor: {
   response: setCurrentUserInterceptor
},
hasBody: false */
},
const exitSwitchUser = async () => {
return await api.post( '/rest/latest/login/exit-su')
/* method: 'POST',
isArray: false,
interceptor: {
   response: setCurrentUserInterceptor
},
hasBody: false */
},

const systemSetup = async () => {
  return await api.post( `${passwordResetUrl}/system-setup`);
/*
method: 'POST',
url:
interceptor: {
   response: function(data) {
       const updatedUser = data.resource;
       User.setCurrentUser(updatedUser.copy());
       return updatedUser;
   }
} */
},
/* }, {
idProperty: 'username',
defaultProperties,
autoXid: false
});
 */



/* const currentLocale = getLocale(),
const configureLocale = (locale:string) => {
if (locale !== currentLocale) {
   const prevLocale = currentLocale;
   this.locale = locale;

   // moment doesn't support locales with a script, just supply it with language and region
   const cldrAttributes = new Cldr(locale).attributes;
   DateTime.now().setLocale(cldrAttributes.minLanguageId);

   const localeId = locale.toLowerCase();
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
   }

   maEventBus.publish('maUser/localeChanged', locale, prevLocale);
}
}, */


/*
getLocale() {
if (currentUser) {
   return currentUser.getLocale();
}
return this.getSystemLocale();
},

/*
*/

const sendPasswordResetEmail = async (username:string, email:string) => {
   return api.post(
       `${passwordResetUrl}/send-email`,{
         username,
         email
     }
      // method: 'POST',
      /* data: {
          username,
          email
      }
   } */);
   },
const createPasswordResetLink = async (username:string, lockPassword:boolean, sendEmail:boolean, expiry:DateTime) => {
return await api.post(`${passwordResetUrl}/create`,{
       username,
       lockPassword,
       sendEmail,
       expiry
});
},

const passwordReset = (token, newPassword) => {
return $http({
   url: `${passwordResetUrl}/reset`,
   method: 'POST',
   data: {
       token,
       newPassword
   }
});
},



const revokeAllAuthTokens = async () => {
let url = `${authTokenBaseUrl}/reset-keys`;
return await api.post(url);
},


const publicRegisterUser = async (token, user) => {
return $http({
   url: `${emailVerificationUrl}/public/register`,
   method: 'POST',
   data: {
       token, user
   }
}).then(response => {
   return Object.assign(Object.create(this.prototype), response.data);
});
},



const getOAuth2Clients  = async (fromCache = true)=> {
if (fromCache && oauth2Clients != null) {
   return $q.resolve(oauth2Clients);
}

return $http({
   url: `/rest/latest/login/oauth2-clients`,
   method: 'GET'
}).then(response => {
   return (oauth2Clients = response.data);
});
},

bulk: BulkUserTemporaryResource
});

Object.defineProperty(User, 'current', {
get: function() {
// TODO return anonymous user, need to update everywhere that we check maUser.current
return currentUser;
}
});

Object.assign(User.prototype, {
/**
* @param permission
* @returns {boolean} true if user has permission (i.e. they hold the required roles)
*/
const hasPermission = async(permission)=> {
// should return true even for empty array if we are superadmin
if (this.inheritedRoles.some(r => r === 'superadmin')) {
   return true;
}

// use isArray() to deal with unresolved expressions used in templates
return Array.isArray(permission) && permission.some(t => {
   if (typeof t === 'string') {
       return this.hasRole(t);
   } else {
       return t.every(r => this.hasRole(r));
   }
});
},

/**
* @param {string} role
* @returns {boolean} true if the user holds the specified role
*/
const hasRole =(role) =>{
return this.inheritedRoles.some(r => r === 'superadmin' || r === role);
},

/**
* @param {...string} permissionName name of the system permission
* @returns {boolean} true if the user has any of the system permissions
*/
const hasSystemPermission = async(permissionName) =>{
return Array.prototype.some.call(arguments, p => this.systemPermissions.includes(p));
},

const getTimezone = async() =>{
return this.timezone || this.constructor.getSystemTimezone();
},

const sendTestEmail = async(toEmail, usernameInEmail)=> {
return maServer.sendTestEmail(toEmail || this.email, usernameInEmail || this.username);
},

const getLocale = async() =>{
return this.locale || this.constructor.getSystemLocale();
},

/* const createAuthToken(expiry) =>{
return this.constructor.createAuthToken(expiry);
},
 */
/* const revokeAuthTokens() {
return this.constructor.revokeAuthTokens();
}, */

const createdDuration=(now = new Date())=> {
const nowM = moment(now);
const created = moment(this.created);
return moment.duration(created.diff(nowM));
},

const emailVerifiedDuration=(now = new Date())=> {
const nowM = moment(now);
const emailVerified = moment(this.emailVerified);
return moment.duration(emailVerified.diff(nowM));
},

const lastLoginDuration=(now = new Date()) =>{
const nowM = moment(now);
const lastLogin = moment(this.lastLogin);
return moment.duration(lastLogin.diff(nowM));
},

const lastPasswordChangeDuration=(now = new Date()) =>{
const nowM = moment(now);
const lastPasswordChange = moment(this.lastPasswordChange);
return moment.duration(lastPasswordChange.diff(nowM));
},

const sendEmailVerification=(emailAddress = this.email)=> {
return this.constructor.sendEmailVerification({
   username: this.username,
   emailAddress
});
},

const createEmailVerificationToken = (emailAddress = this.email) => {
return this.constructor.createEmailVerificationToken({
   username: this.username,
   emailAddress
});
},

const formatRoles=() =>{
return maRole.formatRoles(this.roles);
}
});



/**
* Unauthenticated or anonymous user tried to access resource (HTTP 401)
* @type {NoUserError}
*/
class NoUserError extends Error {};
User.NoUserError = NoUserError;

/**
* Unauthorized access to resource, user is logged in but doesnt have access (HTTP 403)
* @type {UnauthorizedError}
*/
/* class UnauthorizedError extends Error {}
User.UnauthorizedError = UnauthorizedError;

class AnonymousUser extends User {
constructor() {
super();
this.name = 'Anonymous';
this.roles = ['anonymous'];
this.inheritedRoles = ['anonymous'];
// TODO currently no way to obtain granted permissions for anonymous user
this.systemPermissions = [];
Object.freeze(this);
}
}
User.AnonymousUser = AnonymousUser;
User.anonymous = new AnonymousUser();

// set the initial user and configure initial locale and timezone
User.setCurrentUser(bootstrapUser);
bootstrapUser = undefined;

return User;
} */

export
{
   getOAuth2Clients,
   publicRegisterUser,
   revokeAllAuthTokens,
   passwordReset,
   createPasswordResetLink,
   sendPasswordResetEmail,
   exitSwitchUser,
   systemSetup,
   query,
   getById,
   switchUser
};
