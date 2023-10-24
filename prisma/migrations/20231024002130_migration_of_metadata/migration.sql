/*
  Warnings:

  - The primary key for the `DocumentEmbeedingChunk` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "DocumentEmbeedingChunk" DROP CONSTRAINT "DocumentEmbeedingChunk_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DocumentEmbeedingChunk_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DocumentEmbeedingChunk_id_seq";
