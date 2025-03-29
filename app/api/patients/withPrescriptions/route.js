import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all patients with their related prescription data
    const patients = await prisma.patient.findMany({
      include: {
        Prescription: {
          include: {
            PrescriptionComplaint: true,
            PrescriptionTreatment: true,
            PrescriptionAdvice: true,
            PrescriptionAttachment: true,
          },
        },
        PatientPersonalHistory: true,
        PatientFamilyHistory: true,
        PatientMedicalHistory: true,
        PatientSurgicalHistory: true,
        PatientDrugHistory: true,
        PatientExamFinding: true,
        PatientDiagnosis: true,
        PatientManagementPlan: true,
        PatientInvestigation: true,
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients with prescriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients with prescriptions", details: error.message },
      { status: 500 }
    );
  }
}