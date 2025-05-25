/*
  Warnings:

  - Made the column `scrollDepthPercentage` on table `Session` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "scrollDepthPercentage" SET NOT NULL,
ALTER COLUMN "scrollDepthPercentage" SET DEFAULT 0;
