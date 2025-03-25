-- CreateTable
CREATE TABLE "Complaint" (
    "id" SERIAL NOT NULL,
    "complaint" TEXT NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalHistory" (
    "id" SERIAL NOT NULL,
    "personalHistory" TEXT NOT NULL,

    CONSTRAINT "PersonalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyHistory" (
    "id" SERIAL NOT NULL,
    "familyHistory" TEXT NOT NULL,

    CONSTRAINT "FamilyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrugHistory" (
    "id" SERIAL NOT NULL,
    "drugHistory" TEXT NOT NULL,

    CONSTRAINT "DrugHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamFinding" (
    "id" SERIAL NOT NULL,
    "examFinding" TEXT NOT NULL,

    CONSTRAINT "ExamFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "id" SERIAL NOT NULL,
    "diagnosis" TEXT NOT NULL,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalHistory" (
    "id" SERIAL NOT NULL,
    "medicalHistory" TEXT NOT NULL,

    CONSTRAINT "MedicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurgicalHistory" (
    "id" SERIAL NOT NULL,
    "surgicalHistory" TEXT NOT NULL,

    CONSTRAINT "SurgicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treatment" (
    "id" SERIAL NOT NULL,
    "treatment" TEXT NOT NULL,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagementPlan" (
    "id" SERIAL NOT NULL,
    "managementPlan" TEXT NOT NULL,

    CONSTRAINT "ManagementPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investigation" (
    "id" SERIAL NOT NULL,
    "investigation" TEXT NOT NULL,

    CONSTRAINT "Investigation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advice" (
    "id" SERIAL NOT NULL,
    "advice" TEXT NOT NULL,

    CONSTRAINT "Advice_pkey" PRIMARY KEY ("id")
);
