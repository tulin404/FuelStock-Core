/*
  Warnings:

  - You are about to alter the column `unit_cost` on the `product_daily_sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `unit_profit_margin` on the `product_daily_sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `unit_cost` on the `product_monthly_sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `unit_profit_margin` on the `product_monthly_sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "product_daily_sales" ALTER COLUMN "unit_cost" SET DEFAULT 0,
ALTER COLUMN "unit_cost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "unit_profit_margin" SET DEFAULT 0,
ALTER COLUMN "unit_profit_margin" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "product_monthly_sales" ALTER COLUMN "unit_cost" SET DEFAULT 0,
ALTER COLUMN "unit_cost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "unit_profit_margin" SET DEFAULT 0,
ALTER COLUMN "unit_profit_margin" SET DATA TYPE DECIMAL(10,2);
