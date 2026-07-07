/*
  Warnings:

  - The values [writer] on the enum `UserKind` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserKind_new" AS ENUM ('reader', 'admin');
ALTER TABLE "User" ALTER COLUMN "kind" TYPE "UserKind_new" USING ("kind"::text::"UserKind_new");
ALTER TYPE "UserKind" RENAME TO "UserKind_old";
ALTER TYPE "UserKind_new" RENAME TO "UserKind";
DROP TYPE "public"."UserKind_old";
COMMIT;
