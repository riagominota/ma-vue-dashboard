// rql library doesn't encode null correctly (it encodes as string:null)
const oldEncodeValue = rqlQuery.encodeValue;
rqlQuery.encodeValue = function (val) {
    if (val === null) return 'null';
    return oldEncodeValue.apply(this, arguments);
};
ngMangoServices.config([
    'localStorageServiceProvider',
    '$httpProvider',
    '$provide',
    function (localStorageServiceProvider, $httpProvider, $provide) {
        localStorageServiceProvider
            .setPrefix('ngMangoServices')
            .setStorageCookieDomain(window.location.hostname === 'localhost' ? '' : window.location.host)
            .setNotify(false, false);

        $httpProvider.defaults.paramSerializer = 'maRqlParamSerializer';
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.interceptors.push('maHttpInterceptor');

        $provide.decorator('$q', qDecorator);
        $provide.decorator('$resource', resourceDecorator);
        $provide.decorator('$rootScope', scopeDecorator);
    }
]);

function setCurrentUserInterceptor(data) {
    // set some properties on the user from headers that will only be available when logging in
    const loginRedirectUrl = data.headers('X-Mango-Default-URI');
    const lastUpgrade = data.headers('X-Mango-Last-Upgrade');

    if (loginRedirectUrl) {
        data.resource.loginRedirectUrl = loginRedirectUrl;
        const required = data.headers('X-Mango-Default-URI-Required');
        data.resource.loginRedirectUrlRequired = !!(required && required.toLowerCase() !== 'false');
    }

    if (lastUpgrade) {
        data.resource.lastUpgradeTime = parseInt(lastUpgrade, 10);
    }

    // the resource decorator interceptor also does this but we need to do it before the User.setCurrentUser() call below
    if (data.resource.username) {
        data.resource.originalId = data.resource.username;
    }

    User.setCurrentUser(data.resource.copy());
    $injector.get('maWatchdog').setStatus('LOGGED_IN');

    return data.resource;
}

function logoutInterceptor(data) {
    User.setCurrentUser(null);
    $injector.get('maWatchdog').setStatus('API_UP');

    if (data.resource.username) {
        data.resource.originalId = data.resource.username;
    }

    return data.resource;
}
