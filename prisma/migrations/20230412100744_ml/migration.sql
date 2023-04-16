-- CreateTable
CREATE TABLE "vers" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "signed" BOOLEAN NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "vers_uuid_key" ON "vers"("uuid");
