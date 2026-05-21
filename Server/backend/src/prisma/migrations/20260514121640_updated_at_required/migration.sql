/*
  Warnings:

  - Made the column `updated_at` on table `processed_snapshots` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "processed_snapshots" ALTER COLUMN "updated_at" SET NOT NULL;
