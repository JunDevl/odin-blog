/*
  Warnings:

  - The values [reader] on the enum `UserKind` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostVisibility" AS ENUM ('public', 'private');

-- AlterEnum
BEGIN;
CREATE TYPE "UserKind_new" AS ENUM ('admin', 'writer');
ALTER TABLE "User" ALTER COLUMN "kind" TYPE "UserKind_new" USING ("kind"::text::"UserKind_new");
ALTER TYPE "UserKind" RENAME TO "UserKind_old";
ALTER TYPE "UserKind_new" RENAME TO "UserKind";
DROP TYPE "public"."UserKind_old";
COMMIT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "visibility" "PostVisibility" NOT NULL;
