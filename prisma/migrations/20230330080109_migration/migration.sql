/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_token_key" ON "Task"("token");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_token_fkey" FOREIGN KEY ("token") REFERENCES "users"("token") ON DELETE RESTRICT ON UPDATE CASCADE;
