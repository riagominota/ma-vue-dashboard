/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 * Amended by Matt Fox for Vue based UI
 */
package com.ioconstructs.vui;

/**
 * @author originally Jared Wiltshire
 */
public class VUICommon {
    private VUICommon() {}

    public static final String VUI_LOGIN_PAGE = "vui.login.page";
    public static final String VUI_LOGIN_ERROR_PAGE = "vui.loginError.page";
    public static final String VUI_LOGOUT_SUCCESS_PAGE = "vui.logoutSuccess.page";
    public static final String VUI_PASSWORD_RESET_PAGE = "vui.login.passwordReset";
    public static final String VUI_FIRST_USER_LOGIN_PAGE = "vui.login.userFirstLogin.page";
    public static final String VUI_LOGGED_IN_PAGE = "vui.login.loggedIn.page";
    public static final String VUI_LOGGED_IN_PAGE_PRE_HOME = "vui.login.loggedInPreHome.page";
    public static final String VUI_UNAUTHORIZED_PAGE = "vui.unauthorized.page";
    public static final String VUI_NOT_FOUND_PAGE = "vui.notFound.page";
    public static final String VUI_ERROR_PAGE = "vui.error.page";
    public static final String VUI_EMAIL_VERIFICATION_PAGE = "vui.emailVerification.page";

    public static final String DEFAULT_VUI_LOGIN_PAGE = "/vui/login";
    public static final String DEFAULT_VUI_LOGIN_ERROR_PAGE = "/vui/login";
    public static final String DEFAULT_VUI_LOGOUT_SUCCESS_PAGE = "/vui/login";
    public static final String DEFAULT_VUI_PASSWORD_RESET_PAGE = "/vui/change-password";
    public static final String DEFAULT_VUI_FIRST_USER_LOGIN_PAGE = "/vui/help/getting-started";
    public static final String DEFAULT_VUI_LOGGED_IN_PAGE = "/vui/data-point-details/";
    public static final String DEFAULT_VUI_LOGGED_IN_PAGE_PRE_HOME = "";
    public static final String DEFAULT_VUI_UNAUTHORIZED_PAGE = "/vui/unauthorized";
    public static final String DEFAULT_VUI_NOT_FOUND_PAGE = "/vui/not-found";
    public static final String DEFAULT_VUI_ERROR_PAGE = "/vui/server-error";
    public static final String DEFAULT_VUI_EMAIL_VERIFICATION_PAGE = "/vui/verify-email-token";


    // must match variables defined in web/vui/app.js
    public static final String MA_VUI_PAGES_XID = "mangoVUI-pages";
    public static final String MA_VUI_MENU_XID = "mangoVUI-menu";
    public static final String MA_VUI_SETTINGS_XID = "mangoVUI-settings";
}
