/*
  Warnings:

  - You are about to drop the column `last_synced_commit` on the `Repository` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProjectVisibility" AS ENUM ('public', 'private');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "currentProcessedFiles" INTEGER DEFAULT 0,
ADD COLUMN     "currentQuestions" INTEGER DEFAULT 0,
ADD COLUMN     "currentSeats" INTEGER DEFAULT 1;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "visibility" "ProjectVisibility" NOT NULL DEFAULT 'private';

-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "last_synced_commit",
ADD COLUMN     "repoDescription" TEXT,
ADD COLUMN     "repoGithubIsPublic" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "RepositorySync" ADD COLUMN     "synced_commit" TEXT;
