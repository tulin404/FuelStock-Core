import { useAuthStore } from "@/stores/auth.store";
import { Navigate } from "react-router";

export function HomeRedirect() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    };

    return <Navigate to="/login" replace />;
};