/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "Plan" (
    "planid" TEXT NOT NULL,
    "userUUID" INTEGER NOT NULL,
    "starts" TIMESTAMP(3) NOT NULL,
    "ends" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_planid_key" ON "Plan"("planid");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_userUUID_fkey" FOREIGN KEY ("userUUID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
