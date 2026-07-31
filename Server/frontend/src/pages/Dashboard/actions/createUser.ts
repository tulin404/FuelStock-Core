import { UserService } from "@/services/user.service";
import type { UserDTO } from "@/types/types";

export function createUser(formData: FormData) {
    const newUserDTO: UserDTO = {
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        role: String(formData.get("role")) as "admin" | "user"
    };

    return UserService.createUser(newUserDTO);
};