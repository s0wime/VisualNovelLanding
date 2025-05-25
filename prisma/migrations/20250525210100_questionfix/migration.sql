/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Question_order_key" ON "Question"("order");
