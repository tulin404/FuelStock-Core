import type { ReactNode } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { Navigate } from "react-router";

export function PublicRoute({ children }: { children: ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    };

    return children;
};