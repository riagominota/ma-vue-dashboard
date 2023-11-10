/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */
package com.ioconstructs.vui;

import java.util.HashMap;
import java.util.Map;

import com.serotonin.m2m2.i18n.ProcessResult;
import com.serotonin.m2m2.module.SystemSettingsDefinition;

/**
 * @author Jared Wiltshire
 */
public class VUISystemSettingsDefinition extends SystemSettingsDefinition {

    @Override
    public String getDescriptionKey() {
        return "vui.settings";
    }

    @Override
    public Map<String, Object> getDefaultValues() {
        Map<String, Object> defaults = new HashMap<String, Object>();
        defaults.put(VUICommon.VUI_FIRST_USER_LOGIN_PAGE, VUICommon.DEFAULT_VUI_FIRST_USER_LOGIN_PAGE);
        defaults.put(VUICommon.VUI_PASSWORD_RESET_PAGE, VUICommon.DEFAULT_VUI_PASSWORD_RESET_PAGE);
        defaults.put(VUICommon.VUI_LOGGED_IN_PAGE, VUICommon.DEFAULT_VUI_LOGGED_IN_PAGE);
        defaults.put(VUICommon.VUI_LOGGED_IN_PAGE_PRE_HOME, VUICommon.DEFAULT_VUI_LOGGED_IN_PAGE_PRE_HOME);
        defaults.put(VUICommon.VUI_LOGIN_PAGE, VUICommon.DEFAULT_VUI_LOGIN_PAGE);
        defaults.put(VUICommon.VUI_LOGIN_ERROR_PAGE, VUICommon.DEFAULT_VUI_LOGIN_ERROR_PAGE);
        defaults.put(VUICommon.VUI_LOGOUT_SUCCESS_PAGE, VUICommon.DEFAULT_VUI_LOGOUT_SUCCESS_PAGE);
        defaults.put(VUICommon.VUI_UNAUTHORIZED_PAGE, VUICommon.DEFAULT_VUI_UNAUTHORIZED_PAGE);
        defaults.put(VUICommon.VUI_NOT_FOUND_PAGE, VUICommon.DEFAULT_VUI_NOT_FOUND_PAGE);
        defaults.put(VUICommon.VUI_ERROR_PAGE, VUICommon.DEFAULT_VUI_ERROR_PAGE);
        defaults.put(VUICommon.VUI_EMAIL_VERIFICATION_PAGE, VUICommon.DEFAULT_VUI_EMAIL_VERIFICATION_PAGE);
        return defaults;
    }

    @Override
    public Integer convertToValueFromCode(String key, String code) {
        return null;
    }

    @Override
    public String convertToCodeFromValue(String key, Integer value) {
        return null;
    }

    @Override
    public void validateSettings(Map<String, Object> settings, ProcessResult response) {
    }

}
