/*
  Warnings:

  - Added the required column `genderCategory` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GenderCategory" AS ENUM ('MEN', 'WOMEN', 'BOYS');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "genderCategory" "GenderCategory" NOT NULL;
