-- DropForeignKey
ALTER TABLE "Bot" DROP CONSTRAINT "Bot_creatorId_fkey";

-- AlterTable
ALTER TABLE "Bot" ALTER COLUMN "creatorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
