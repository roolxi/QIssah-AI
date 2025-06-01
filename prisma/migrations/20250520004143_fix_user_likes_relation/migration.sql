-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "BotLike" (
    "userId" UUID NOT NULL,
    "botId" UUID NOT NULL,

    CONSTRAINT "BotLike_pkey" PRIMARY KEY ("userId","botId")
);

-- AddForeignKey
ALTER TABLE "BotLike" ADD CONSTRAINT "BotLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotLike" ADD CONSTRAINT "BotLike_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
