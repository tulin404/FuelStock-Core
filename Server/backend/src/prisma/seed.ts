import { client } from "../db/prisma.js";
import { Roles } from "../generated/prisma/enums.js";
import argon2 from "argon2";

async function main() {
    const testTenant = await client.tenants.create({
        data: {
            id: "910af53f-3827-42a4-b549-4393762dcf0e",
            name: "POSTO TESTE",
            active: true
        }
    });

    const testUser = await client.users.create({
        data: {
            id: crypto.randomUUID(),
            tenant_id: process.env.TEST_TENANT_ID!,
            name: "User Teste da Silva",
            email: "testando@teste.com",
            pwd_hash: await argon2.hash("SenhaTeste"),
            role: "admin" as Roles
        }
    });

    return [testTenant, testUser];
};

console.log(await main());