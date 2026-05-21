/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id,name]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Made the column `active` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unit_cost` on table `stock_movements` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "fk_stocks_product";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "fk_stocks_tenant";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "active" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "stock_movements" ALTER COLUMN "unit_cost" SET NOT NULL;

-- CreateIndex
CREATE INDEX "product_daily_sales_tenant_id_product_id_date_idx" ON "product_daily_sales"("tenant_id", "product_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "products_tenant_id_name_key" ON "products"("tenant_id", "name");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "fk_stocks_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "fk_stocks_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
