-- AlterTable
ALTER TABLE "Scholarship" ADD COLUMN     "externalApplicationUrl" TEXT,
ADD COLUMN     "isExternal" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Scholarship_isExternal_idx" ON "Scholarship"("isExternal");
