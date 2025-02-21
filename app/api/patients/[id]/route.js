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
    const age = patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : null;

    return NextResponse.json({ ...patient, age });
  } catch (error) {
    console.error("Patient fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient", details: error.message },
      { status: 500 }
    );
  }
}

function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  if (dob > today) return "0Y-0M-0D"; // Handle future dates gracefully

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  // Adjust if the current month is before the birth month
  if (months < 0) {
    years--;
    months += 12;
  }

  // Adjust if the current day is before the birth day
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  return `${years}Y-${months}M-${days}D`;
}
