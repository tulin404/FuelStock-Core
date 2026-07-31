import z from "zod";
import { Roles } from "../../generated/prisma/enums.js";

export const registerSchema = z.object({
    tenant_id: z.uuid(),
    email: z.email("Email inválido.").max(40, "Emails devem ter entre 15 e 40 caracteres"),
    name: z.string().max(20, "Nomes devem conter 20 caracteres ou menos."),
    password: z.string().min(8, "Senhas devem ter entre 8 e 15 caracteres.").max(15, "Senhas devem ter entre 8 e 15 caracteres."),
    role: z.enum(Roles, "Cargo inválido.")
});