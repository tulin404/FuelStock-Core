import { type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthInit } from "@/hooks/useAuthInit";
import { Spinner } from "./Spinner";

export function AuthGate({ children }: { children: ReactNode }) {
    useAuthInit();

    const isLoading = useAuthStore((state) => state.isLoading);

    // MORE READABLE THAN THE TERNARY
    if (isLoading) {
        return (
            <>
                {children}
                {<Spinner />}
            </>
        );
    };

    return children;
};