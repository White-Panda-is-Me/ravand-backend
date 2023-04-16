/*
  Warnings:

  - The `blocked1` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `blocked2` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "starts" SET DATA TYPE TEXT,
ALTER COLUMN "ends" SET DATA TYPE TEXT,
DROP COLUMN "blocked1",
ADD COLUMN     "blocked1" TEXT[],
DROP COLUMN "blocked2",
ADD COLUMN     "blocked2" TEXT[];
