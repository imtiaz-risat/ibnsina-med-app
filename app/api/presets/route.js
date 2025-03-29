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

export async function POST(request) {
  try {
    const { type, value } = await request.json();

    if (!type || !value) {
      return new Response(
        JSON.stringify({ error: "Type and value are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let result;

    switch (type) {
      case "complaints":
        result = await prisma.complaint.create({
          data: { complaint: value },
        });
        break;
      case "personalHistory":
        result = await prisma.personalHistory.create({
          data: { personalHistory: value },
        });
        break;
      case "familyHistory":
        result = await prisma.familyHistory.create({
          data: { familyHistory: value },
        });
        break;
      case "drugHistory":
        result = await prisma.drugHistory.create({
          data: { drugHistory: value },
        });
        break;
      case "examFindings":
        result = await prisma.examFinding.create({
          data: { examFinding: value },
        });
        break;
      case "diagnoses":
        result = await prisma.diagnosis.create({
          data: { diagnosis: value },
        });
        break;
      case "medicalHistory":
        result = await prisma.medicalHistory.create({
          data: { medicalHistory: value },
        });
        break;
      case "surgicalHistory":
        result = await prisma.surgicalHistory.create({
          data: { surgicalHistory: value },
        });
        break;
      case "treatments":
        result = await prisma.treatment.create({
          data: { treatment: value },
        });
        break;
      case "managementPlans":
        result = await prisma.managementPlan.create({
          data: { managementPlan: value },
        });
        break;
      case "investigations":
        result = await prisma.investigation.create({
          data: { investigation: value },
        });
        break;
      case "advices":
        result = await prisma.advice.create({
          data: { advice: value },
        });
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid preset type" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding preset:", error);
    return new Response(JSON.stringify({ error: "Failed to add preset" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request) {
  try {
    const { type, value } = await request.json();

    if (!type || !value) {
      return new Response(
        JSON.stringify({ error: "Type and value are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let result;

    switch (type) {
      case "complaints":
        result = await prisma.complaint.deleteMany({
          where: { complaint: value },
        });
        break;
      case "personalHistory":
        result = await prisma.personalHistory.deleteMany({
          where: { personalHistory: value },
        });
        break;
      case "familyHistory":
        result = await prisma.familyHistory.deleteMany({
          where: { familyHistory: value },
        });
        break;
      case "drugHistory":
        result = await prisma.drugHistory.deleteMany({
          where: { drugHistory: value },
        });
        break;
      case "examFindings":
        result = await prisma.examFinding.deleteMany({
          where: { examFinding: value },
        });
        break;
      case "diagnoses":
        result = await prisma.diagnosis.deleteMany({
          where: { diagnosis: value },
        });
        break;
      case "medicalHistory":
        result = await prisma.medicalHistory.deleteMany({
          where: { medicalHistory: value },
        });
        break;
      case "surgicalHistory":
        result = await prisma.surgicalHistory.deleteMany({
          where: { surgicalHistory: value },
        });
        break;
      case "treatments":
        result = await prisma.treatment.deleteMany({
          where: { treatment: value },
        });
        break;
      case "managementPlans":
        result = await prisma.managementPlan.deleteMany({
          where: { managementPlan: value },
        });
        break;
      case "investigations":
        result = await prisma.investigation.deleteMany({
          where: { investigation: value },
        });
        break;
      case "advices":
        result = await prisma.advice.deleteMany({
          where: { advice: value },
        });
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid preset type" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting preset:", error);
    return new Response(JSON.stringify({ error: "Failed to delete preset" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
