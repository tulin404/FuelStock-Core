/*
  Warnings:

  - Added the required column `last_unit_cost` to the `processed_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_unit_profit_margin` to the `processed_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_cost` to the `product_daily_sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_profit_margin` to the `product_daily_sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "processed_snapshots" ADD COLUMN     "last_unit_cost" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "last_unit_profit_margin" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "product_daily_sales" ADD COLUMN     "unit_cost" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "unit_profit_margin" DECIMAL(65,30) NOT NULL;
