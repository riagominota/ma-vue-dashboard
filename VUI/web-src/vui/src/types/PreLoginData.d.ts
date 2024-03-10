
import { VuiSettings } from "./VUISettings";

export interface PreLoginData {
    angularJsModules:          AngularJSModules;
    uiSettings:                VUISettings;
    serverTimezone:            string;
    serverLocale:              string;
    translations:              Translations;
    lastUpgradeTime:           number;
    user:                      User;
    publicRegistrationEnabled: boolean;
    developmentMode:           boolean;
    loginUri:                  string;
    notFoundUri:               string;
    logoutSuccessUri:          string;
    oauth2Clients:             any[];
}

export interface AngularJSModules {
    urls:    string[];
    modules: Module[];
}

export interface Module {
    url:          string;
    name:         string;
    version:      Version;
    upgradedDate: string;
}

export enum Version {
    The450 = "4.5.0",
    The451 = "4.5.1",
}

export interface  Locale_Translations {
    locale:       string;
    translations: Translations;
    namespaces:   string[];
}

export interface Translations {
    root: { [key: string]: string };
    en:   JSONData;
}

export interface JSONData {
}

export interface User {
    username:                  string;
    password:                  string;
    email:                     string;
    phone:                     string;
    disabled:                  boolean;
    homeUrl:                   string;
    lastLogin:                 string;
    lastPasswordChange:        string;
    receiveAlarmEmails:        string;
    receiveOwnAuditEvents:     boolean;
    timezone:                  null;
    muted:                     boolean;
    roles:                     string[];
    inheritedRoles:            string[];
    locale:                    null;
    passwordLocked:            boolean;
    sessionExpirationOverride: boolean;
    sessionExpirationPeriod:   null;
    organization:              null;
    organizationalRole:        null;
    originalId?:               string;
    created:                   string;
    emailVerified:             null;
    data:                      null;
    linkedAccounts:            null;
    editPermission:            any[];
    readPermission:            any[];
    systemPermissions:         string[];
    oldHashAlgorithm:          boolean;
    id:                        number;
    xid:                       string;
    name:                      string;
}
