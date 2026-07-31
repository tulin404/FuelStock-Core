/*
  Warnings:

  - You are about to drop the `ai_monthly_analysis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ai_monthly_analysis" DROP CONSTRAINT "ai_monthly_analysis_tenant_id_fkey";

-- DropTable
DROP TABLE "ai_monthly_analysis";

-- CreateTable
CREATE TABLE "ai_monthly_analyses" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "analysis_text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_monthly_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_monthly_analyses_tenant_id_year_month_key" ON "ai_monthly_analyses"("tenant_id", "year", "month");

-- AddForeignKey
ALTER TABLE "ai_monthly_analyses" ADD CONSTRAINT "ai_monthly_analyses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
