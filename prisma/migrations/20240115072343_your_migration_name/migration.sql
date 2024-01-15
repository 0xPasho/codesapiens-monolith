/*
  Warnings:

  - You are about to drop the column `projectId` on the `Repository` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_projectId_fkey";

-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "projectId";

-- CreateTable
CREATE TABLE "ProjectRepository" (
    "projectId" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,

    CONSTRAINT "ProjectRepository_pkey" PRIMARY KEY ("projectId","repositoryId")
);

-- AddForeignKey
ALTER TABLE "ProjectRepository" ADD CONSTRAINT "ProjectRepository_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRepository" ADD CONSTRAINT "ProjectRepository_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
