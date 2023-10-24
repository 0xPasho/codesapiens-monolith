/*
  Warnings:

  - You are about to drop the column `embedding` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "embedding";

-- CreateTable
CREATE TABLE "DocumentEmbeedingChunk" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT,
    "metadata" JSONB NOT NULL,
    "embedding" vector,

    CONSTRAINT "DocumentEmbeedingChunk_pkey" PRIMARY KEY ("id")
);
