/*
  Warnings:

  - The `latest_sync_date` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `repositoryId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "content_obj" JSONB,
ADD COLUMN     "isFolder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pathName" TEXT,
ADD COLUMN     "repositoryId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "sync_fail_reason" DROP NOT NULL,
DROP COLUMN "latest_sync_date",
ADD COLUMN     "latest_sync_date" TIMESTAMP(3),
ALTER COLUMN "path" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_synced_commit" TIMESTAMP(3),
ADD COLUMN     "title" TEXT,
ALTER COLUMN "repoOrganizationName" DROP NOT NULL,
ALTER COLUMN "repoUrl" DROP NOT NULL,
ALTER COLUMN "repoProjectName" DROP NOT NULL,
ALTER COLUMN "repoBranchName" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
