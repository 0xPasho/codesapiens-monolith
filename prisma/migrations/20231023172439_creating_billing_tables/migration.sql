/*
  Warnings:

  - You are about to drop the column `tokens_used` on the `BillingQuestions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BillingFile" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "metadata" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BillingQuestions" DROP COLUMN "tokens_used",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "BillingFile" ADD CONSTRAINT "BillingFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingQuestions" ADD CONSTRAINT "BillingQuestions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
