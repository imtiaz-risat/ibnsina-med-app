import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: parseInt(params.id) },
    });
    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("Prescription fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions", details: error.message },
      { status: 500 }
    );
  }
}
