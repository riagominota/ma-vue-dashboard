export type Action = 'GET' | 'CREATE' | 'UPDATE' | 'DELETE';
export enum ReceiveAlarmEmails {
    'NONE',
    'INFORMATION',
    'IMPORTANT',
    'WARNING',
    'URGENT',
    'CRITICAL',
    'LIFE_SAFETY',
    'DO_NOT_LOG',
    'IGNORE'
}
