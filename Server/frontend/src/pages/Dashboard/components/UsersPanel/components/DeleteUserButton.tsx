import type { Dispatch, SetStateAction } from "react";
import type { User } from "@/types/types";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ErrorToast } from "@/components/ErrorToast";
import { DashboardSpinner } from "../../DashboardSpinner";
import { UserService } from "@/services/user.service";

export function DeleteUserButton({ user, setUsers, setSuccess }: { user: User, setUsers: Dispatch<SetStateAction<User[] | null>>, setSuccess: Dispatch<SetStateAction<string>> }) {
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete() {
        try {
            setIsLoading(true);
            const message = await UserService.deleteUser(user.id);
            setSuccess(message);
            setUsers(prev => prev.filter(prevUser => prevUser.id !== user.id));
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        };
    };

    return (
        <>
            <button onClick={handleDelete} type="button" aria-label="Deletar usuário"><Trash2 size={22} className="text-danger" /></button>
            {isLoading && <DashboardSpinner />}
            {error && <ErrorToast error={error} onClose={setError} />}
        </>
    );
};