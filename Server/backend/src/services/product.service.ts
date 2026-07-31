import type { PrismaClient } from "../generated/prisma/client.js";
import type { MappedDailyProduct } from "../types/types.js";

export class ProductService {
    readonly #prisma: PrismaClient;
    
    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    };

    async upsertProducts(tenant_id: string, productData: MappedDailyProduct[]) {

        const uniqueNames = new Set<string>();

        for (const row of productData) {
            uniqueNames.add(row.productName.trim());
        };

        if (uniqueNames.size === 0) return;

        // BATCH INSERT
        const products = Array.from(uniqueNames).map(name => ({
            id: crypto.randomUUID(),
            tenant_id,
            name: name.trim()
        }));

        await this.#prisma.products.createMany({
            data: products,
            skipDuplicates: true
        });
    };
};