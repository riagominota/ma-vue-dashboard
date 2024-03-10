import AbstractResourceApi, { Interceptors } from '@/composables/useAbstractResourceApi';
import { Action, ReceiveAlarmEmails } from './ModelActions.d.ts';
import { MangoPermission, Role } from './Permissions';
import { DateTime, Zone } from 'luxon';

export interface User {
    name: string;
    xid: string;
    username: string;
}

export enum PeriodType {
    'MILLISECONDS',
    'SECONDS',
    'MINUTES',
    'HOURS',
    'DAYS',
    'WEEKS',
    'MONTHS',
    'YEARS'
}
export type SessionTimePeriod = { periods: number; type: PeriodType };

export interface UserAction extends UserModel {
    action: Action;
}

export interface UserModel extends User {
    username:string;
    created: string;
    data: Record<string, any>;
    disabled: boolean;
    editPermission: MangoPermission;
    email: string;
    emailVerified: string;
    hashAlgorithm: string;
    homeUrl: string;
    id: number;
    inheritedRoles: Role[];
    lastLogin: string;
    lastUpgradeTime?: DateTime;
    lastPasswordChange: string;
    linkedAccounts: number[];
    locale: string;
    loginRedirectUrl?: string;
    loginRedirectUrlRequired?: string;
    muted: boolean;
    oldHashAlgorithm: boolean;
    organization: string;
    organizationalRole: string;
    password?: string;
    passwordLocked: boolean;
    phone: string;
    readPermission: MangoPermission;
    receiveAlarmEmails: ReceiveAlarmEmails;
    receiveOwnAuditEvents: boolean;
    roles: Role[];
    sessionExpirationOverride: boolean;
    sessionExpirationPeriod: SessionTimePeriod;
    systemPermissions: MangoPermission[];
    timezone: string|Zone;
}

export class UserResource extends AbstractResourceApi<UserModel> implements UserModel {
    name = '';
    username = '';
    xid = '';
    created = '';
    data = {};
    disabled = false;
    editPermission = { id: 0, roles: [] };
    email = '';
    emailVerified = '';
    hashAlgorithm = '';
    homeUrl = '';
    id = 0;
    inheritedRoles = [];
    lastLogin = '';
    lastPasswordChange = '';
    linkedAccounts = [];
    locale = '';
    muted = false;
    oldHashAlgorithm = false;
    organization = '';
    organizationalRole = '';
    password? = '';
    passwordLocked = false;
    phone = '';
    readPermission = { id: 0, roles: [] };
    receiveAlarmEmails = ReceiveAlarmEmails.NONE;
    receiveOwnAuditEvents = false;
    roles = [];
    sessionExpirationOverride = false;
    sessionExpirationPeriod = { periods: 0, type: PeriodType.HOURS };
    systemPermissions = [];
    timezone = '';

    constructor(basePath: string, options: Interceptors<UserModel>, username = '') {
        super();
    }

    $save = this.save;
    $delete = this.delete;
    $update = this.update;
    $get = this.get;
}
