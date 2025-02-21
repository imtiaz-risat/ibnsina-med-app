import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(params.id) },
      include: {
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

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Patient fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient", details: error.message },
      { status: 500 }
    );
  }
}
