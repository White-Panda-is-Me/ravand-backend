/*
  Warnings:

  - You are about to drop the `Tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blocks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_PlanID_fkey";

-- DropForeignKey
ALTER TABLE "blocks" DROP CONSTRAINT "blocks_planId_fkey";

-- DropTable
DROP TABLE "Tasks";

-- DropTable
DROP TABLE "blocks";

-- CreateTable
CREATE TABLE "SortedTasks" (
    "id" TEXT NOT NULL,
    "PlanID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "min" INTEGER NOT NULL,
    "Imp" INTEGER NOT NULL,

    CONSTRAINT "SortedTasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SortedTasks" ADD CONSTRAINT "SortedTasks_PlanID_fkey" FOREIGN KEY ("PlanID") REFERENCES "Plan"("planid") ON DELETE RESTRICT ON UPDATE CASCADE;
