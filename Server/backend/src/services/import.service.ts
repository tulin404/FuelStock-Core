import type { PrismaClient } from "../generated/prisma/client.js";

export default class ImportService {
    readonly #prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    };

    #postImport(import_id: string, tenant_id: string) {
        // EN-CA format for DB
        const todayBR = new Intl.DateTimeFormat("en-CA", {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date());

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
            console.log(error);
            throw error;
        };
    };

    handleImport(import_id: string, tenant_id: string) {
        return this.#postImport(import_id, tenant_id);
    };
};