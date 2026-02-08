-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WebhookEvent" ADD COLUMN     "processedAt" TIMESTAMP(3);
