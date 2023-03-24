/*
  Warnings:

  - Added the required column `signin_password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "signin_password" TEXT NOT NULL;
