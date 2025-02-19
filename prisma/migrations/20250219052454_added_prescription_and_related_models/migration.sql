-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextVisit" TIMESTAMP(3),

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionComplaint" (
    "id" SERIAL NOT NULL,
    "prescriptionId" INTEGER NOT NULL,
    "complaint" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "PrescriptionComplaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionTreatment" (
    "id" SERIAL NOT NULL,
    "prescriptionId" INTEGER NOT NULL,
    "drug" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "rule" TEXT NOT NULL,
    "duration" TEXT NOT NULL,

    CONSTRAINT "PrescriptionTreatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionAdvice" (
    "id" SERIAL NOT NULL,
    "prescriptionId" INTEGER NOT NULL,
    "advice" TEXT NOT NULL,

    CONSTRAINT "PrescriptionAdvice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionAttachment" (
    "id" SERIAL NOT NULL,
    "prescriptionId" INTEGER NOT NULL,
    "file" TEXT NOT NULL,

    CONSTRAINT "PrescriptionAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientPersonalHistory" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "attribute" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "PatientPersonalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientFamilyHistory" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "attribute" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "PatientFamilyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientMedicalHistory" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "attribute" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "PatientMedicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientSurgicalHistory" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "attribute" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "PatientSurgicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientDrugHistory" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "attribute" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "PatientDrugHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientExamFinding" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "attribute" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "PatientExamFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientDiagnosis" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "attribute" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "PatientDiagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientManagementPlan" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "attribute" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "PatientManagementPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientInvestigation" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "attribute" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "PatientInvestigation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionComplaint" ADD CONSTRAINT "PrescriptionComplaint_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionTreatment" ADD CONSTRAINT "PrescriptionTreatment_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionAdvice" ADD CONSTRAINT "PrescriptionAdvice_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionAttachment" ADD CONSTRAINT "PrescriptionAttachment_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientPersonalHistory" ADD CONSTRAINT "PatientPersonalHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientFamilyHistory" ADD CONSTRAINT "PatientFamilyHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientMedicalHistory" ADD CONSTRAINT "PatientMedicalHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientSurgicalHistory" ADD CONSTRAINT "PatientSurgicalHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientDrugHistory" ADD CONSTRAINT "PatientDrugHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientExamFinding" ADD CONSTRAINT "PatientExamFinding_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientDiagnosis" ADD CONSTRAINT "PatientDiagnosis_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientManagementPlan" ADD CONSTRAINT "PatientManagementPlan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientInvestigation" ADD CONSTRAINT "PatientInvestigation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
