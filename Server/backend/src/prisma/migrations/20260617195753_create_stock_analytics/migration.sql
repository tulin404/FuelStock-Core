-- CreateTable
CREATE TABLE "stock_analytics" (
    "tenant_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "in" INTEGER NOT NULL,
    "out" INTEGER NOT NULL,

    CONSTRAINT "stock_analytics_pkey" PRIMARY KEY ("tenant_id","date")
);
