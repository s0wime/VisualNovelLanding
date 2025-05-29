/*
  Warnings:

  - The values [CLICK_HERO_CTA,CLICK_POST_QUIZ_CTA,CLICK_WILLING_TO_PAY_BUTTON,EMAIL_FORM_SUBMITTED,CLICK_FAQ_ITEM] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `scrollDepthPercentage` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Visitor` table. All the data in the column will be lost.
  - Added the required column `option` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GenreType" AS ENUM ('ROMANCE', 'SCI_FI', 'HORROR');

-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('CLICK_TRY_FREE', 'CLICK_TRY_PAID', 'QUIZ_STARTED', 'QUIZ_ENDED');
ALTER TABLE "Event" ALTER COLUMN "eventType" TYPE "EventType_new" USING ("eventType"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;

-- DropIndex
DROP INDEX "Question_order_key";

-- DropIndex
DROP INDEX "Visitor_email_key";

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "option" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "quizId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "QuizAttempt" ADD COLUMN     "quizType" "GenreType";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "scrollDepthPercentage",
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "gender" TEXT;

-- AlterTable
ALTER TABLE "Visitor" DROP COLUMN "email";

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "genre" "GenreType" NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "option" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "genre" "GenreType" NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
