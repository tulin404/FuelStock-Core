/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id,date]` on the table `imports` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "imports_tenant_id_date_key" ON "imports"("tenant_id", "date");
