/*
  Warnings:

  - You are about to drop the column `blocked1` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `blocked2` on the `Plan` table. All the data in the column will be lost.
  - Changed the type of `starts` on the `Plan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ends` on the `Plan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "blocked1",
DROP COLUMN "blocked2",
DROP COLUMN "starts",
ADD COLUMN     "starts" TIMESTAMP(3) NOT NULL,
DROP COLUMN "ends",
ADD COLUMN     "ends" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "blocks" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "starts" TIMESTAMP(3) NOT NULL,
    "ends" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tasks" (
    "id" TEXT NOT NULL,
    "PlanID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "min" INTEGER NOT NULL,
    "Imp" INTEGER NOT NULL,

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_PlanID_fkey" FOREIGN KEY ("PlanID") REFERENCES "Plan"("planid") ON DELETE RESTRICT ON UPDATE CASCADE;
