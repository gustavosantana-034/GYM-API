/*
  Warnings:

  - You are about to drop the column `descrption` on the `gyms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."gyms" DROP COLUMN "descrption",
ADD COLUMN     "description" TEXT;
