import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET All Prescription Data
export async function GET() {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: {
        patient: {
          select: {
            name: true,
          },
        },
        doctor: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
      orderBy: { dateCreated: "desc" },
    });

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}

// Create Prescription
export async function POST(request) {
  try {
    //console.log("Creating prescription...");

    // Parse request body
    const body = await request.json();
    // //console.log("Request Body:", body);

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

    // Creates New Prescription and Related Data
    const newPrescription = await prisma.prescription.create({
      data: {
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        nextVisit: hasNextVisit ? new Date(nextVisitDate) : null,
        PrescriptionComplaint: {
          create: complaints?.map((complaint) => ({
            complaint: complaint.topic,
            value: complaint.value,
          })),
        },
        PrescriptionTreatment: {
          create: treatments?.map((treatment) => ({
            drug: treatment.drugName,
            dose: treatment.dose,
            rule: treatment.rule,
            duration: treatment.duration,
          })),
        },
        PrescriptionAdvice: {
          create: advice?.map((advice) => ({ advice: advice.topic })),
        },
        PrescriptionAttachment: {
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

    return NextResponse.json(newPrescription, { status: 201 });
  } catch (error) {
    console.error("Prescription creation error:", error.stack);
    return NextResponse.json(
      { error: "Failed to create prescription", details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE Prescription
export async function PUT(request) {
  try {
    //console.log("Updating prescription...");

    // Parse request body
    const body = await request.json();
    //console.log("Request Body:", body);

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
      examinationFindings = [],
      diagnosis = [],
      managementPlan = [],
      investigation = [],
    } = body;

    // Updates Prescription Related Data
    const updatedPrescription = await prisma.prescription.update({
      where: { id: parseInt(prescriptionId) },
      data: {
        nextVisit: hasNextVisit ? new Date(nextVisitDate) : null,
        PrescriptionComplaint: {
          deleteMany: {},
          create: complaints?.map((complaint) => ({
            complaint: complaint.text,
            value: complaint.value,
          })),
        },
        PrescriptionTreatment: {
          deleteMany: {},
          create: treatments?.map((treatment) => ({
            drug: treatment.drug,
            dose: treatment.dose,
            rule: treatment.rule,
            duration: treatment.duration,
          })),
        },
        PrescriptionAdvice: {
          deleteMany: {},
          create: advice?.map((adviceItem) => ({ advice: adviceItem })),
        },
        PrescriptionAttachment: {
          deleteMany: {},
          create: attachments?.map((attachment) => ({
            file: attachment.file,
            name: attachment.name,
            description: attachment.description,
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
        PatientPersonalHistory: {
          deleteMany: {},
          create: personalHistory?.map((history) => ({
            patientId: parseInt(patientId),
            attribute: history.topic,
            value: history.value || null,
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
          create: examinationFindings?.map((examination) => ({
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

    return NextResponse.json(updatedPrescription);
  } catch (error) {
    console.error("Prescription update error:", error);
    return NextResponse.json(
      { error: "Failed to update prescription", details: error.message },
      { status: 500 }
    );
  }
}
