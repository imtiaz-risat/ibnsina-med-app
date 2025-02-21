import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get Single Prescription Data from prescriptionId
export async function GET(request, { params }) {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        patient: true,
        doctor: true,
        PrescriptionComplaint: true,
        PrescriptionTreatment: true,
        PrescriptionAdvice: true,
        PrescriptionAttachment: true,
      },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(prescription);
  } catch (error) {
    console.error("Prescription fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescription", details: error.message },
      { status: 500 }
    );
  }
}

// PUT Update Prescription
export async function PUT(request, { params }) {
  try {
    console.log("Updating prescription...");

    // Parse request body
    const body = await request.json();
    console.log("Request Body:", body);

    const {
      patientId,
      doctorId,
      complaints,
      treatments,
      advice,
      attachments,
      hasNextVisit,
      nextVisitDate,
      personalHistory = [],
      familyHistory = [],
      medicalHistory = [],
      surgicalHistory = [],
      drugHistory = [],
      examinationFinding = [],
      diagnosis = [],
      managementPlan = [],
      investigation = [],
    } = body;

    // Validation
    if (!patientId || !doctorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Updates Prescription Related Data
    const updatedPrescription = await prisma.prescription.update({
      where: { id: parseInt(params.id) },
      data: {
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        nextVisit: hasNextVisit ? new Date(nextVisitDate) : null,
        PrescriptionComplaint: {
          deleteMany: {},
          create: complaints?.map((complaint) => ({
            complaint: complaint.topic,
            value: complaint.value,
          })),
        },
        PrescriptionTreatment: {
          deleteMany: {},
          create: treatments?.map((treatment) => ({
            drug: treatment.drugName,
            dose: treatment.dose,
            rule: treatment.rule,
            duration: treatment.duration,
          })),
        },
        PrescriptionAdvice: {
          deleteMany: {},
          create: advice?.map((advice) => ({ advice: advice.topic })),
        },
        PrescriptionAttachment: {
          deleteMany: {},
          create: attachments?.map((attachment) => ({
            file: "Browser can not access file paths",
          })),
        },
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    // Updates Patient Related Data
    const updatePatientData = await prisma.patient.update({
      where: { id: patientId },
      data: {
        PatientPersonalHistory: {
          deleteMany: {},
          create: personalHistory?.map((history) => ({
            attribute: history.topic,
            value: history.value,
          })),
        },
        PatientFamilyHistory: {
          deleteMany: {},
          create: familyHistory?.map((history) => ({
            attribute: history.topic,
            value: history.value,
          })),
        },
        PatientMedicalHistory: {
          deleteMany: {},
          create: medicalHistory?.map((history) => ({
            attribute: history.topic,
            value: history.value,
          })),
        },
        PatientSurgicalHistory: {
          deleteMany: {},
          create: surgicalHistory?.map((history) => ({
            attribute: history.topic,
            value: history.value,
          })),
        },
        PatientDrugHistory: {
          deleteMany: {},
          create: drugHistory?.map((history) => ({
            attribute: history.topic,
            value: history.value,
          })),
        },
        PatientExamFinding: {
          deleteMany: {},
          create: examinationFinding?.map((examination) => ({
            attribute: examination.topic,
            value: examination.value,
          })),
        },
        PatientDiagnosis: {
          deleteMany: {},
          create: diagnosis?.map((diagnosis) => ({
            attribute: diagnosis.topic,
            value: diagnosis.value,
          })),
        },
        PatientManagementPlan: {
          deleteMany: {},
          create: managementPlan?.map((plan) => ({
            attribute: plan.topic,
            value: plan.value,
          })),
        },
        PatientInvestigation: {
          deleteMany: {},
          create: investigation?.map((investigation) => ({
            attribute: investigation.topic,
            value: investigation.value,
          })),
        },
      },
    });

    return NextResponse.json(updatedPrescription, { status: 201 });
  } catch (error) {
    console.error("Prescription creation error:", error.stack);
    return NextResponse.json(
      { error: "Failed to create prescription", details: error.message },
      { status: 500 }
    );
  }
}
