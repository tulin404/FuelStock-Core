/*
  Warnings:

  - You are about to alter the column `in` on the `stock_analytics` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `out` on the `stock_analytics` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.

*/
-- AlterTable
ALTER TABLE "stock_analytics" ALTER COLUMN "in" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "out" SET DATA TYPE DECIMAL(10,3);
