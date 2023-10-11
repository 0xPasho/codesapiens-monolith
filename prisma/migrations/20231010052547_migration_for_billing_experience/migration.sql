/*
  Warnings:

  - You are about to drop the `Billing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Source` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RepositoryType" AS ENUM ('manual', 'github');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('deleted', 'active');

-- DropForeignKey
ALTER TABLE "Billing" DROP CONSTRAINT "Billing_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_projectId_fkey";

-- DropTable
DROP TABLE "Billing";

-- DropTable
DROP TABLE "Source";

-- DropEnum
DROP TYPE "BillingType";

-- DropEnum
DROP TYPE "SourceType";

-- CreateTable
CREATE TABLE "BillingFile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillingFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL,
    "sync_fail_reason" TEXT NOT NULL,
    "synced" BOOLEAN NOT NULL,
    "latest_sync_date" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "repoOrganizationName" TEXT NOT NULL,
    "repositoryType" "RepositoryType" NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "repoProjectName" TEXT NOT NULL,
    "repoBranchName" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingQuestions" (
    "id" TEXT NOT NULL,
    "tokens_used" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "BillingQuestions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BillingFile" ADD CONSTRAINT "BillingFile_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingFile" ADD CONSTRAINT "BillingFile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingQuestions" ADD CONSTRAINT "BillingQuestions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingQuestions" ADD CONSTRAINT "BillingQuestions_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
