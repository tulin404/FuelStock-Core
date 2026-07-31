/*
  Warnings:

  - Added the required column `unit_cost` to the `product_monthly_sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_profit_margin` to the `product_monthly_sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_monthly_sales" ADD COLUMN     "unit_cost" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "unit_profit_margin" DECIMAL(65,30) NOT NULL;
