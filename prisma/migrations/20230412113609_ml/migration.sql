/*
  Warnings:

  - You are about to drop the column `uuid` on the `vers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `vers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `vers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "vers_uuid_key";

-- AlterTable
ALTER TABLE "vers" DROP COLUMN "uuid",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL,
ADD CONSTRAINT "vers_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "vers_token_key" ON "vers"("token");
