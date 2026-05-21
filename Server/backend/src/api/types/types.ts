export type BaseJwtPayload = {
    sub: string;
    iat: number;
    exp: number;
};

export type AccessTokenPayload = BaseJwtPayload & {
    type: "access";
    tenant_id: string;
    role?: "admin" | "user";
};

export type RefreshTokenPayload = BaseJwtPayload & {
    type: "refresh";
    jti: string;
};