import type { ReactNode } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    };

    return children;
};