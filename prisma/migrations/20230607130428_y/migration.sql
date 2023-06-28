/*
  Warnings:

  - You are about to drop the column `Imp` on the `SortedTasks` table. All the data in the column will be lost.
  - You are about to drop the column `min` on the `SortedTasks` table. All the data in the column will be lost.
  - Added the required column `from` to the `SortedTasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `SortedTasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SortedTasks" DROP COLUMN "Imp",
DROP COLUMN "min",
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "to" TEXT NOT NULL;
