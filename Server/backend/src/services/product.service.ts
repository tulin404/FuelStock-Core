import type { PrismaClient, Prisma } from "../generated/prisma/client.js";
import type { MappedDailyProduct } from "../types/types.js";

export default class ProductService {
    readonly #prisma: PrismaClient;
    readonly #prismaStatic: typeof Prisma;
    
    constructor(prisma: PrismaClient, prismaStatic: typeof Prisma) {
        this.#prisma = prisma;
        this.#prismaStatic = prismaStatic;
    };

    async upsertProducts(tenant_id: string, productData: MappedDailyProduct[]) {

        const uniqueNames = new Set<string>();

        for (const row of productData) {
            uniqueNames.add(row.productName.trim());
        };

        if (uniqueNames.size === 0) return;

        // BATCH INSERT
        const values = Array.from(uniqueNames).map(name =>
            this.#prismaStatic.sql`(
                ${crypto.randomUUID()}::uuid,
                ${tenant_id}::uuid,
                ${name.trim()}
            )`
        );

        await this.#prisma.$executeRaw`
            INSERT INTO products (
                id,
                tenant_id,
                name
            )
            VALUES ${this.#prismaStatic.join(values)}
            ON CONFLICT (tenant_id, name)
            DO NOTHING
        `;
    };
};