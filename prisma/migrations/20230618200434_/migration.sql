/*
  Warnings:

  - You are about to drop the column `ends` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `starts` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "ends",
DROP COLUMN "starts";
