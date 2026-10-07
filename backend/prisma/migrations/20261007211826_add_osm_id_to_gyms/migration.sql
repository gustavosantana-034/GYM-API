-- AlterTable
ALTER TABLE "public"."gyms" ADD COLUMN     "osm_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "gyms_osm_id_key" ON "public"."gyms"("osm_id");

