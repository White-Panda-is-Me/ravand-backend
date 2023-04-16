/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `blocked1` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blocked2` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_planUUID_fkey";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "blocked1" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "blocked2" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Task";
