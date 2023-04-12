/*
  Warnings:

  - You are about to drop the column `token` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_token_fkey";

-- DropIndex
DROP INDEX "Task_token_key";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "token";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
