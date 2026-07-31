import type { Roles } from "../../generated/prisma/enums.js";

export type BaseJwtPayload = {
    sub: string;
    sid: string;
};

export type AccessTokenPayload = BaseJwtPayload & {
    type: "access";
    tenant_id: string;
    role: Roles;
};

export type RefreshTokenPayload = BaseJwtPayload & {
    type: "refresh";
};

export type RefreshTokenDTO = {
    user_id: string,
    sid: string
};

export type AccessTokenDTO = RefreshTokenDTO & {
    tenant_id: string,
    role: Roles;
};

export type RedisSession = {
    user_id: string,
    refresh_hash: string,
    created_at: number
};

export type UserDTO = {
    tenant_id: string,
    email: string,
    name: string,
    password: string,
    role: Roles
};

export type User = {
    id: string,
    tenant_id: string,
    name: string,
    email: string,
    pwd_hash: string,
    role: Roles
};