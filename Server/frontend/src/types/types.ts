// GENERAL PURPOSE TYPES

export type AuthStore = {
    user: User | null,
    accessToken: string | null,
    isAuthenticated: boolean,
    isLoading: boolean,

    setAuth: (user: User, token: string) => void,
    logout: () => void,
    setLoading: (value: boolean) => void
};

export type User = {
    id: string,
    tenant_id: string,
    name: string,
    email: string,
    role: "admin" | "user"
};

export type UserDTO = {
    name: string,
    email: string,
    password: string,
    role: "admin" | "user"
};