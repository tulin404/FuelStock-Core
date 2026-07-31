import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { AuthService } from "@/services/auth.service";

export function useAuthInit() {
    const setAuth = useAuthStore((state) => state.setAuth);
    const setLoading = useAuthStore((state) => state.setLoading);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        async function init() {
            try {
                setLoading(true);

                const data = await AuthService.refresh();

                setAuth(data.user, data.accessToken);
            } catch {
                logout();
            } finally {
                setLoading(false);
            };
        };

        init();
    }, [setAuth, setLoading,logout]);
};