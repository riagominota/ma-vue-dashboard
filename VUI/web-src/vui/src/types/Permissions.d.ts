export type Role = { id: number; xid: string };

export type MangoPermission = { id: number; roles: Role[] };
