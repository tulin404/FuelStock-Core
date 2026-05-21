import type { JwtPayload } from "jsonwebtoken";
import type { AccessTokenPayload } from "../types/types.js";

export function isAccessTokenPayload(payload: string | JwtPayload): payload is AccessTokenPayload {
    return (
        typeof payload === "object" &&
        payload !== null &&
        "sub" in payload &&
        "tenant_id" in payload
    );
};