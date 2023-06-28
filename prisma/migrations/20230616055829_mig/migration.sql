-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Parent', 'Child');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Child';
