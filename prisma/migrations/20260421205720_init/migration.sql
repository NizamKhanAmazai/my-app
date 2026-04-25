/*
  Warnings:

  - The values [MEN,WOMEN,BOYS] on the enum `GenderCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GenderCategory_new" AS ENUM ('ALL', 'MALE', 'FEMALE', 'CHILDREN');
ALTER TABLE "Product" ALTER COLUMN "genderCategory" TYPE "GenderCategory_new" USING ("genderCategory"::text::"GenderCategory_new");
ALTER TYPE "GenderCategory" RENAME TO "GenderCategory_old";
ALTER TYPE "GenderCategory_new" RENAME TO "GenderCategory";
DROP TYPE "public"."GenderCategory_old";
COMMIT;
