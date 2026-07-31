import "dotenv/config"
import { client } from "./db/prisma.js";
import fs from "fs";
import { parseDailyXls } from "./utils/xls.parser.js";
import argon2 from "argon2";
import type { Roles } from "./generated/prisma/enums.js";
import { lte } from "zod";
import { getTodayInSP } from "./utils/getTodayInSP.js";
import { Prisma } from "./generated/prisma/client.js";

// async function populateProducts() {
//     const bf = fs.readFileSync("/home/tulin/Work/FuelStock/Client/RelatorioTemp/LucratividadeSintetico.xls");
    
//     const tenant_id = process.env.TEST_TENANT_ID!;
//     const parsed = parseDailyXls(bf);

//     const products = parsed.data.productData.map(product => {
//         return {
//             name: product.productName,
//             tenant_id
//         };
//     });

//     try {
//         await client.products.createMany({
//             data: products,
//             skipDuplicates: true,
//         });
//     } catch (error) {
//         console.error(error);
//     };
// };

// const testTenant = await client.tenants.create({
//     data: {
//         id: "910af53f-3827-42a4-b549-4393762dcf0e",
//         name: "POSTO TESTE",
//         active: true
//     }
// });

// console.log(testTenant);

// console.log(process.env.DATABASE_URL);

// async function populateStocks() {
//     const tenant_id = process.env.TEST_TENANT_ID ?? "";

//     const productIds = await client.products.findMany({
//         where: { tenant_id },
//         select: { id: true }
//     });

//     const fakeData = productIds.map(product => ({
//         product_id: product.id,
//         tenant_id,
//         current_stock: 1000
//     }));

//     await client.stocks.createMany({
//         data: fakeData
//     });
// };

// await populateStocks();

// async function populateMonthly() {
//     const tenant_id = process.env.TEST_TENANT_ID!;
// 
//     const rawData = await client.product_daily_sales.findMany({
//         where: {
//             date: '2026-07-02'
//         }
//     });
// 
//     const fakeData = rawData.map(product => ({
//         id: crypto.randomUUID(),
//         tenant_id,
//         product_id: product.product_id,
//         year: 2026,
//         month: 5,
//         unit_cost: product.unit_cost,
//         unit_profit_margin: product.unit_profit_margin,
//         total_sold_qty: product.cumulative_qty,
//         total_revenue: product.cumulative_revenue,
//         total_cost: product.cumulative_cost,
//         total_profit: product.cumulative_profit
//     }));
// 
//     try {
//         await client.product_monthly_sales.createMany({
//             data: fakeData
//         });
//     } catch(error) {
//         console.log(error);
//     };
// };
// 
// await populateMonthly();


// MONTHLY TWEAKED FOR TESTING
// async function generateMonthlySales() {
//     const tenants = await client.tenants.findMany();
//     let result = [];
//     for (const tenant of tenants) {
//         await client.$transaction(async(tx) => {

//             const data = await tx.product_daily_sales.findMany({
//                 where: { date: '2026-05-26', tenant_id: tenant.id }
//             });

//             const t1 = await tx.product_monthly_sales.createMany({
//                 data: data.map(item => ({
//                     id: crypto.randomUUID(),
//                     tenant_id: tenant.id,
//                     product_id: item.product_id,
//                     year: 2026,
//                     month: 6,
//                     unit_cost: item.unit_cost,
//                     unit_profit_margin: item.unit_profit_margin,
//                     total_sold_qty: item.cumulative_qty,
//                     total_revenue: item.cumulative_revenue,
//                     total_cost: item.cumulative_cost,
//                     total_profit: item.cumulative_profit
//                 })),
//                 skipDuplicates: true // JUST FOR SAFETY
//             });

//             result.push(t1);

//             const t2 = await tx.product_daily_sales.deleteMany({
//                 where: {
//                     tenant_id: tenant.id,
//                     date: {
//                         lte: '2026-05-26'
//                     }
//                 }
//             });

//             result.push(t2);
            
//         });
//     };
//     return result;
// };

// async function test() {

//     try {
//         return await generateMonthlySales();
//     } catch(error) {
//         console.error(error);
//         throw error;
//     }
// }

// const result = await test();
// console.log(result)

// REGISTER SIM
// async function createUser() {
//     const data = {
//         id: crypto.randomUUID(),
//         tenant_id: process.env.TEST_TENANT_ID!,
//         name: "User Teste da Silva",
//         email: "testando@teste.com",
//         pwd_hash: await argon2.hash("SenhaTeste"),
//         role: "admin" as Roles
//     };

//     return client.users.create({ data });
// };

// const user = await createUser();
// console.log(user);

// client.stocks.updateMany({
//     where: { current_stock: { lt: 0 } },
//     data: { current_stock: 0 }
// })
// 
// await client.stock_movements.deleteMany({ where: { quantity: 0} });
// await client.products.deleteMany();
// 
// function randomDecimal(min: number, max: number, decimals = 3) {
//     return Number(
//         (Math.random() * (max - min) + min).toFixed(decimals)
//     );
// }

// function populateStockAnalytics() {
//     const tenant_id = process.env.TEST_TENANT_ID!;

//     const today = getTodayInSP();
    
//     const fakeArray = Array.from({ length: 365 }, (_, index) => {
//         const date = new Date(today);
//         date.setDate(today.getDate() - (364 - index));
//         return {
//             tenant_id,
//             date,
//             stock_in: new Prisma.Decimal(
//                 randomDecimal(1000, 5000)
//             ),
//             stock_out: new Prisma.Decimal(
//                 randomDecimal(800, 4500)
//             )
//         };
//     });

//     return client.stock_analytics.createMany({
//         data: fakeArray
//     });
// };

// await populateStockAnalytics();