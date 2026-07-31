import { useAuthStore } from "@/stores/auth.store";
import type { User, UserDTO } from "@/types/types";
import { ApiError } from "@/utils/ApiError";
import { jwtFetch } from "@/utils/jwtFetch";

export class UserService {
    static async getUsers() {
        const raw = await jwtFetch("api/users", {
            credentials: "include"
        });

        const parsed = await raw.json();

        return parsed.data;
    };

    static async createUser({ name, email, password, role }: UserDTO) {
        const raw = await jwtFetch("api/auth/register", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                name,
                email,
                password,
                role
            })
        });

        const response = await raw.json();

        if (!raw.ok) {
            throw new ApiError(response.message, response.name);
        };

        const newUser: User = response.newUser;
        
        return {
            message: response.message,
            newUser
        };
    };

    static async deleteUser(userId: string) {
        const requesterId = useAuthStore.getState().user.id;

        if (requesterId === userId) {
            throw new ApiError("Não é possível deletar o Não é possível deletar seu próprio usuário.", "Operação inválida");
        };
        
        const raw = await jwtFetch(`api/users/delete/${userId}`, {
            method: "DELETE",
            credentials: "include"
        });

        const response = await raw.json();
        
        if (!raw.ok) {
            throw new ApiError(response.message, response.name);
        }

        return response.message;
    };
};