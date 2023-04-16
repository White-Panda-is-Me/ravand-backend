/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `vers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vers_email_key" ON "vers"("email");
