import type { PrismaClient } from "../generated/prisma/client.js";
import { formatter } from "../utils/date.formatter.js";

export class ImportService {
    readonly #prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    };

    #postImport(import_id: string, tenant_id: string) {
        // EN-CA format for DB
        const todayBR = formatter.format(new Date());

        return this.#prisma.imports.create({
            data: {
                id: import_id,
                tenant_id,
                date: todayBR
            }
        });
    };

    findImportByDate(tenant_id: string, date: string) {
        return this.#prisma.imports.findFirst({
            where: { tenant_id, date }
        });
    };

    updateImportStatus(import_id: string, status: "CANCELED" | "PROCESSED") {
        try {
            return this.#prisma.imports.update({
                where: { id: import_id },
                data: { status }
            });
        } catch (error) {
            console.error(error);
            throw error;
        };
    };

    handleImport(import_id: string, tenant_id: string) {
        return this.#postImport(import_id, tenant_id);
    };
};