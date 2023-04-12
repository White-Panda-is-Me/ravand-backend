/*
  Warnings:

  - Added the required column `date` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Task" (
    "taskid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imp" INTEGER NOT NULL,
    "min" INTEGER NOT NULL,
    "planUUID" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_taskid_key" ON "Task"("taskid");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_planUUID_fkey" FOREIGN KEY ("planUUID") REFERENCES "Plan"("planid") ON DELETE RESTRICT ON UPDATE CASCADE;
