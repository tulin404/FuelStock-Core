import argon2 from "argon2";
import type { PrismaClient } from "../../generated/prisma/client.js";
import type { User, UserDTO } from "../types/types.js";

export class AuthService {
    readonly #prisma;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    };

    async verifyUser(email: string, password: string): Promise<User> {
        const user = await this.#prisma.users.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error("Credenciais inválidas.");
        };

        const matches = await argon2.verify(user.pwd_hash, password);

        if (!matches) {
            throw new Error("Credenciais inválidas.");
        };

        return user;
    };

    async createUser({ email, password, name, tenant_id, role }: UserDTO) {
        return this.#prisma.users.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id,
                name,
                email,
                pwd_hash: await argon2.hash(password),
                role
            }
        });
    };

    getUser(id: string) {
        return this.#prisma.users.findUnique({ where: { id } });
    };
};