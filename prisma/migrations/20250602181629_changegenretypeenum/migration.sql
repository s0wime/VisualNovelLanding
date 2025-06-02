/*
  Warnings:

  - The values [ROMANCE,SCI_FI,HORROR] on the enum `GenreType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GenreType_new" AS ENUM ('FUTURISTIC', 'FANTASY', 'MODERN');
ALTER TABLE "Question" ALTER COLUMN "genre" TYPE "GenreType_new" USING ("genre"::text::"GenreType_new");
ALTER TABLE "QuizAttempt" ALTER COLUMN "quizType" TYPE "GenreType_new" USING ("quizType"::text::"GenreType_new");
ALTER TABLE "Story" ALTER COLUMN "genre" TYPE "GenreType_new" USING ("genre"::text::"GenreType_new");
ALTER TYPE "GenreType" RENAME TO "GenreType_old";
ALTER TYPE "GenreType_new" RENAME TO "GenreType";
DROP TYPE "GenreType_old";
COMMIT;
