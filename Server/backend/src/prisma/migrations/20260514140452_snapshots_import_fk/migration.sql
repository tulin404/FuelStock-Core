/*
  Warnings:

  - Added the required column `import_id` to the `processed_snapshots` table without a default value. This is not possible if the table is not empty.
  - Made the column `import_id` on table `product_daily_sales` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "product_daily_sales" DROP CONSTRAINT "product_daily_sales_import_id_fkey";

-- AlterTable
ALTER TABLE "processed_snapshots" ADD COLUMN     "import_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "product_daily_sales" ALTER COLUMN "import_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "processed_snapshots" ADD CONSTRAINT "processed_snapshots_import_id_fkey" FOREIGN KEY ("import_id") REFERENCES "imports"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_daily_sales" ADD CONSTRAINT "product_daily_sales_import_id_fkey" FOREIGN KEY ("import_id") REFERENCES "imports"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
