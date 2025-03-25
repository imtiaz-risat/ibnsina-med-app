import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.$connect();

    const complaints = await prisma.complaint.findMany({
      select: {
        complaint: true,
      },
    });
    const complaintPresets = complaints.map((item) => item.complaint);

    const treatments = await prisma.treatment.findMany({
      select: {
        treatment: true,
      },
    });
    const treatmentPresets = treatments.map((item) => item.treatment);

    const advices = await prisma.advice.findMany({
      select: {
        advice: true,
      },
    });
    const advicePresets = advices.map((item) => item.advice);

    const investigations = await prisma.investigation.findMany({
      select: {
        investigation: true,
      },
    });
    const investigationPresets = investigations.map(
      (item) => item.investigation
    );

    const managementPlans = await prisma.managementPlan.findMany({
      select: {
        managementPlan: true,
      },
    });
    const managementPlanPresets = managementPlans.map(
      (item) => item.managementPlan
    );

    const personalHistory = await prisma.personalHistory.findMany({
      select: {
        personalHistory: true,
      },
    });
    const personalHistoryPresets = personalHistory.map(
      (item) => item.personalHistory
    );

    const familyHistory = await prisma.familyHistory.findMany({
      select: {
        familyHistory: true,
      },
    });
    const familyHistoryPresets = familyHistory.map(
      (item) => item.familyHistory
    );

    const drugHistory = await prisma.drugHistory.findMany({
      select: {
        drugHistory: true,
      },
    });
    const drugHistoryPresets = drugHistory.map((item) => item.drugHistory);

    const examFindings = await prisma.examFinding.findMany({
      select: {
        examFinding: true,
      },
    });
    const examFindingPresets = examFindings.map((item) => item.examFinding);

    const diagnoses = await prisma.diagnosis.findMany({
      select: {
        diagnosis: true,
      },
    });
    const diagnosisPresets = diagnoses.map((item) => item.diagnosis);

    const medicalHistories = await prisma.medicalHistory.findMany({
      select: {
        medicalHistory: true,
      },
    });
    const medicalHistoryPresets = medicalHistories.map(
      (item) => item.medicalHistory
    );

    const surgicalHistories = await prisma.surgicalHistory.findMany({
      select: {
        surgicalHistory: true,
      },
    });
    const surgicalHistoryPresets = surgicalHistories.map(
      (item) => item.surgicalHistory
    );

    return new Response(
      JSON.stringify({
        complaintPresets,
        treatmentPresets,
        advicePresets,
        investigationPresets,
        managementPlanPresets,
        personalHistoryPresets,
        familyHistoryPresets,
        drugHistoryPresets,
        examFindingPresets,
        diagnosisPresets,
        medicalHistoryPresets,
        surgicalHistoryPresets,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
