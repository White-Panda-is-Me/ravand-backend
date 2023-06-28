/*
  Warnings:

  - You are about to drop the column `ChildEmail` on the `Childreq` table. All the data in the column will be lost.
  - The `planid` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `ChildEmail` on the `users` table. All the data in the column will be lost.
  - Added the required column `ChildId` to the `Childreq` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Plan_planid_key";

-- AlterTable
ALTER TABLE "Childreq" DROP COLUMN "ChildEmail",
ADD COLUMN     "ChildId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "planid",
ADD COLUMN     "planid" SERIAL NOT NULL,
ADD CONSTRAINT "Plan_pkey" PRIMARY KEY ("planid");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "ChildEmail",
ADD COLUMN     "ChildId" INTEGER;
