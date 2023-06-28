/*
  Warnings:

  - You are about to drop the `SortedTasks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `SortedTasks` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SortedTasks" DROP CONSTRAINT "SortedTasks_PlanID_fkey";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "SortedTasks" JSONB NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ChildEmail" TEXT,
ALTER COLUMN "role" DROP DEFAULT;

-- DropTable
DROP TABLE "SortedTasks";

-- CreateTable
CREATE TABLE "Childreq" (
    "id" SERIAL NOT NULL,
    "ChildEmail" TEXT NOT NULL,
    "ParentId" INTEGER NOT NULL,
    "Accepted" BOOLEAN NOT NULL DEFAULT false,
    "Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Childreq_pkey" PRIMARY KEY ("id")
);
