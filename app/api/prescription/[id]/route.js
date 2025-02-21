import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

// PUT Update Prescription (Same as previous implementation)
