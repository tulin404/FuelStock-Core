import { useAuthStore } from "@/stores/auth.store";

// GLOBAL VARIABLE FOR RACE CONDITIONS
let refreshPromise: Promise<string> | null = null;

export async function jwtFetch(url: string, options: RequestInit = {}) {
    const accessToken = useAuthStore.getState().accessToken;

    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers ?? {}),
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (response.status !== 401) return response;

    if (!refreshPromise) {
        async function refreshFunction() {
                const raw = await fetch("api/auth/refresh", { method: "POST", credentials: "include" });
                const identity = await raw.json();
    
                useAuthStore.getState().setAuth(identity.user, identity.accessToken);
                return identity.accessToken;
        };

        // FINALLY IS THE CLEANUP FOR UNLOCK
        refreshPromise = refreshFunction().finally(() => refreshPromise = null);
    };

    const newToken = await refreshPromise;

    const newResponse = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers ?? {}),
            Authorization: `Bearer ${newToken}`
        }
    });


    return newResponse;
};