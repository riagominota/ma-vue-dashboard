/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */

import constants from "@/boot/constants";
import { useUserStore } from "@/stores/UserStore";
import Server from "@/services/server";

function loginRedirector( maUiMenu) 
{

    let lastUpgradeTime:string|null = null;

    const setLastUpgradeTime = function(_lastUpgradeTime:string) {
        lastUpgradeTime = _lastUpgradeTime;
    };
    

    
        const UserStore = useUserStore()
        const basePath = constants.MA_BASE_URL;
        const dontSaveStates = new Set(['vui.error', 'vui.serverError']);

        class LoginRedirector {
            redirect(user = UserStore.current) {
                let reload = false;
                let redirectUrl:string|null = null;
                let redirectUrlRequired = false;

                return Promise.resolve().then(() => {
                    if (user) {
                        if (user.lastUpgradeTime != null && user.lastUpgradeTime.current !== lastUpgradeTime) {
                            lastUpgradeTime = user.lastUpgradeTime;
                            reload = true;
                        }

                        // loginRedirectUrl will contain the homeUrl if set, or the UI module configured start page if not
                        redirectUrl = user.loginRedirectUrl || user.homeUrl;
                        redirectUrlRequired = !!user.loginRedirectUrlRequired;

                        // remove tmp properties
                        delete user.loginRedirectUrl;
                        delete user.loginRedirectUrlRequired;
                        delete user.lastUpgradeTime;
                    }

                    if (!reload) {
                        // load the user menu after logging in and register the UI router states
                        return maUiMenu.getMenu().catch(error => null);
                    }
                }).then(() => {
                    if (redirectUrl && redirectUrlRequired) {
                        this.goToUrl(redirectUrl, reload);
                    } else if (this.savedState) {
                        this.goToSavedState(reload);
                    } else if (!user) {
                        this.goToState('login', {}, reload);
                    } else {
                        if (redirectUrl) {
                            this.goToUrl(redirectUrl, reload);
                        } else if (user.hasRole('superadmin')) {
                            this.goToState('ui.settings.home', {}, reload);
                        } else {
                            this.goToState('ui.dataPointDetails', {}, reload);
                        }
                    }

                    return user;
                });
            }

            handleUnknownPath(path) {
                const user = UserStore.current;

                // prepend with basePath (stripping the leading /)
                path = path ? basePath + path.substr(1) : basePath;

                // often the path is unknown because the user is not logged in
                if (!user) {
                    this.saveUrl(path);
                    const loginUrl = this.getLoginUrl();
                    return this.stripBasePath(loginUrl);
                }

                if (path === basePath) {
                    // tried to navigate to /ui/

                    // can't use loginRedirectUrl, only available at login
                    const redirectUrl = user.homeUrl;
                    if (redirectUrl && redirectUrl.startsWith(basePath)) {
                        return redirectUrl.substr(basePath.length - 1); // strip basePath from start of URL
                    }
                    return user.hasRole('superadmin') ? '/administration/home' : '/data-point-details/';
                }

                let notFoundUrl = this.getNotFoundUrl();

                // our not found URL was not found, use a known built in URL
                if (path === notFoundUrl) {
                    notFoundUrl = '/ui/not-found';
                }

                notFoundUrl += `?path=${encodeURIComponent(path)}`;
                return this.stripBasePath(notFoundUrl);
            }

            stripBasePath(url) {
                if (url.startsWith(basePath)) {
                    // strip the /ui
                    return url.substr(basePath.length - 1);
                } else {
                    this.goToUrl(url);
                    return '';
                }
            }

            goToSavedState(reload = false) {
                const savedState = this.savedState;
                delete this.savedState;

                if (savedState.state) {
                    this.goToState(savedState.state, savedState.params, reload);
                } else if (savedState.url) {
                    this.goToUrl(savedState.url, reload);
                }
            }

            goToState(state, parameters = {}, reload = false) {
                if (reload) {
                    const href = $state.href(state, parameters);
                    $window.location = href;
                } else {
                    $state.go(state, parameters);
                }
            }

            goToUrl(url, reload = false) {
                if (!reload && url.startsWith(basePath)) {
                    $location.replace().url(url.substr(basePath.length - 1));
                } else if (url) {
                    $window.location = url;
                }
            }

            saveCurrentState() {
                this.saveState($state.current.name, $state.params);
            }

            saveState(state, params) {
                // dont want to save these states
                if (dontSaveStates.has(state)) {
                    return;
                }

                this.savedState = {
                    state,
                    params: Object.assign({}, params)
                };
            }

            saveUrl(url) {
                this.savedState = {
                    url
                };
            }

            getLoginUrl() {
                return Server.preLoginData.loginUri || '/ui/login';
            }

            getNotFoundUrl() {
                return Server.preLoginData.notFoundUri || '/ui/not-found';
            }

            getLogoutSuccessUrl() {
                return Server.preLoginData.logoutSuccessUri || '/ui/login';
            }

            goToLogin(reload = false) {
                const url = this.getLoginUrl();
                this.goToUrl(url, reload);
            }

            goToLogoutSuccess(reload = false) {
                const url = this.getLogoutSuccessUrl();
                this.goToUrl(url, reload);
            }
        }

        return new LoginRedirector();
    }
}

export default loginRedirectorProvider;
