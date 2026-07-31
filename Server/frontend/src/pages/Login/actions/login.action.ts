import { AuthService } from "@/services/auth.service";
import { ApiError } from "@/utils/ApiError";

export async function login(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
        throw new ApiError("Insira todas as informações solicitadas.", "Credenciais insuficientes");
    };

    if (typeof email !== "string" || typeof password !== "string") {
        throw new ApiError("Insira credenciais válidas", "Formato inválido");
    };

    const data = await AuthService.login(email, password);
    
    return data;
};