import "dotenv/config"
import { client } from "./db/prisma.js";
import fs from "fs";
import { parseDailyXls } from "./utils/xls.parser.js";

export default async function populateProducts() {
    const bf = fs.readFileSync("/home/tulin/Work/FuelStock/Client/RelatorioTemp/LucratividadeSintetico.xls");
    
    const tenant_id = "910af53f-3827-42a4-b549-4393762dcf0e";
    const parsed = parseDailyXls(bf);

    const products = parsed.data.productData.map(product => {
        return {
            name: product.productName,
            tenant_id
        };
    });

    try {
        await client.products.createMany({
            data: products,
            skipDuplicates: true,
        });
    } catch (error) {
        console.error(error);
    };
};

// const testTenant = await client.tenants.create({
//     data: {
//         id: "910af53f-3827-42a4-b549-4393762dcf0e",
//         name: "POSTO TESTE",
//         active: true
//     }
// });
// 
// console.log(testTenant);

console.log(process.env.DATABASE_URL);

export async function populateStocks() {
    const tenant_id: string = process.env.TEST_TENANT_ID ?? "";

    const productIds = await client.products.findMany({
        where: { tenant_id },
        select: { id: true }
    });

    const fakeData = productIds.map(product => ({
        product_id: product.id,
        tenant_id,
        current_stock: 1000
    }));

    await client.stocks.createMany({
        data: fakeData
    });
};

await populateStocks();