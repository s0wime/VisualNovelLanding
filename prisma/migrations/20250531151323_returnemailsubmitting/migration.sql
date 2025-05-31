-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'EMAIL_SUBMITTED';

-- AlterTable
ALTER TABLE "Visitor" ADD COLUMN     "email" TEXT;
