-- CreateEnum
CREATE TYPE "public"."Modality" AS ENUM ('WEIGHT_TRAINING', 'CROSSFIT', 'FUNCTIONAL', 'YOGA', 'PILATES', 'SWIMMING', 'MARTIAL_ARTS', 'DANCE');

-- AlterTable
ALTER TABLE "public"."gyms" ADD COLUMN     "address" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modalities" "public"."Modality"[] DEFAULT ARRAY[]::"public"."Modality"[];
