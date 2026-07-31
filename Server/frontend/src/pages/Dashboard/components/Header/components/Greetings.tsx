import { useAuthStore } from "@/stores/auth.store";

export function Greetings() {
    const user = useAuthStore((state) => state.user);

    return (
        <h2 className="text-text font-secondary text-lg hidden sm:inline mr-2 relative after:absolute after:-top-1 after:-bottom-1 after:w-0.5 after:ml-2 after:bg-border after:rounded-full">👋 Olá, {user.name}!</h2>
    );
};