-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "refBy" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);
