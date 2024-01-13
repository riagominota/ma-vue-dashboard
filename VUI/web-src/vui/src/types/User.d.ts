import { boolean } from 'mathjs';

declare module 'User' {
    export type UserReceiveAlarmEmail = 'IGNORE' | 'DO_NOT_LOG' | 'LIFE_SAFETY' | 'CRITICAL' | 'URGENT' | 'WARNING' | 'IMPORTANT' | 'INFORMATION' | 'NONE';
    export interface UserProperties {
        username: string;
        name: string;
        email: string;
        phone: number;
        homeUrl: string;
        locale: string | null;
        timezone: string | null;
        roles: string[];
        muted: boolean;
        receiveOwnAuditEvents: boolean;
        disabled: boolean;
        receiveAlarmEmails: UserReceiveAlarmEmail;
    }
}
