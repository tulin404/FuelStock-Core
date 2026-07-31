import { PrismaClient } from "../../generated/prisma/client.js";

export class UsersService {
    readonly #prisma;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    };

    getUsers(tenant_id: string) {
        return this.#prisma.users.findMany({
            where: { tenant_id },
            select: { id: true, name: true, email: true, role: true }
        });
    };

    delete(user_id: string) {
        return this.#prisma.users.delete({
            where: { id: user_id }
        });
    };
};