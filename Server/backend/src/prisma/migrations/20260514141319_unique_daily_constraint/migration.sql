/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id,product_id,date]` on the table `product_daily_sales` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cumulative_revenue` on table `product_daily_sales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cumulative_cost` on table `product_daily_sales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cumulative_profit` on table `product_daily_sales` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product_daily_sales" ALTER COLUMN "cumulative_revenue" SET NOT NULL,
ALTER COLUMN "cumulative_cost" SET NOT NULL,
ALTER COLUMN "cumulative_profit" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_daily_sales_tenant_id_product_id_date_key" ON "product_daily_sales"("tenant_id", "product_id", "date");
