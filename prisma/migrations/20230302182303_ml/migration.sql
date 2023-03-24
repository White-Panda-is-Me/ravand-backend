-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" TEXT NOT NULL,
    "fName" TEXT NOT NULL,
    "lName" TEXT NOT NULL,
    "task" SERIAL,
    "taskAlias" TEXT,
    "taskDes" TEXT,
    "taskImp" INTEGER,
    "role" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
