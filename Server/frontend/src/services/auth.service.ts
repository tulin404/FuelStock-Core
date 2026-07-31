import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/utils/ApiError";

export class AuthService {
    static async login(email: string, password: string) {
        const raw = await fetch("api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
            // DO NOT REMOVE
            credentials: "include"
        });

        const response = await raw.json();

        if (!raw.ok) {
            throw new ApiError(response.message, response.name);
        };

        return {
            user: response.user,
            token: response.accessToken
        };
    };

    static async refresh() {
        const raw = await fetch("api/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const response = await raw.json();
        
        if (!raw.ok) {
            throw new ApiError(response.message, response.name);
        };

        if (!response.user || !response.accessToken) {
            throw new ApiError(response.message, response.name);
        };

        return response;
    };

    static async logout() {
        const response = await fetch("api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
    
        if (!response.ok) {
            throw new ApiError("Não foi possível encerrar sua sessão. Por favor, tente novamente.", "Erro ao sair");
        };
    
        const logoutState = useAuthStore.getState().logout;
        logoutState();
    };
};