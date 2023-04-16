/*
  Warnings:

  - You are about to drop the column `userUUID` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `signin_password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `users` table. All the data in the column will be lost.
  - Added the required column `UserId` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_userUUID_fkey";

-- DropIndex
DROP INDEX "users_token_key";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "userUUID",
ADD COLUMN     "UserId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "signin_password",
DROP COLUMN "time",
DROP COLUMN "token",
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
