-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'DONOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ScholarshipStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "DocumentKind" AS ENUM ('PDF', 'IMAGE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amountGmd" INTEGER NOT NULL,
    "degree" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" TIMESTAMP(3),
    "status" "ScholarshipStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipEligibility" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ScholarshipEligibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipSave" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScholarshipSave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "stepData" JSONB NOT NULL DEFAULT '{}',
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationDocument" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "kind" "DocumentKind" NOT NULL DEFAULT 'OTHER',
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "base64" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "Scholarship_status_idx" ON "Scholarship"("status");

-- CreateIndex
CREATE INDEX "Scholarship_featured_idx" ON "Scholarship"("featured");

-- CreateIndex
CREATE INDEX "Scholarship_donorId_idx" ON "Scholarship"("donorId");

-- CreateIndex
CREATE UNIQUE INDEX "ScholarshipEligibility_scholarshipId_order_key" ON "ScholarshipEligibility"("scholarshipId", "order");

-- CreateIndex
CREATE INDEX "ScholarshipSave_scholarshipId_idx" ON "ScholarshipSave"("scholarshipId");

-- CreateIndex
CREATE UNIQUE INDEX "ScholarshipSave_studentId_scholarshipId_key" ON "ScholarshipSave"("studentId", "scholarshipId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Application_scholarshipId_idx" ON "Application"("scholarshipId");

-- CreateIndex
CREATE INDEX "Application_studentId_idx" ON "Application"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_studentId_scholarshipId_key" ON "Application"("studentId", "scholarshipId");

-- CreateIndex
CREATE INDEX "ApplicationDocument_applicationId_idx" ON "ApplicationDocument"("applicationId");

-- AddForeignKey
ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipEligibility" ADD CONSTRAINT "ScholarshipEligibility_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipSave" ADD CONSTRAINT "ScholarshipSave_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipSave" ADD CONSTRAINT "ScholarshipSave_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
