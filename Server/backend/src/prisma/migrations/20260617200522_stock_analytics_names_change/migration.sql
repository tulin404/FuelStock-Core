/*
  Warnings:

  - You are about to drop the column `in` on the `stock_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `out` on the `stock_analytics` table. All the data in the column will be lost.
  - Added the required column `stock_in` to the `stock_analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_out` to the `stock_analytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stock_analytics" DROP COLUMN "in",
DROP COLUMN "out",
ADD COLUMN     "stock_in" DECIMAL(10,3) NOT NULL,
ADD COLUMN     "stock_out" DECIMAL(10,3) NOT NULL;
