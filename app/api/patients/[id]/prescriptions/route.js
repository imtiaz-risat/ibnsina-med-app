import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    // Fetch prescriptions with doctor information included
    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: parseInt(params.id) },
      include: {
        doctor: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
      orderBy: {
        dateCreated: "desc", // Most recent prescriptions first
      },
    });

    // Map through the results to add doctorName field
    const prescriptionsWithDoctorName = prescriptions.map((prescription) => {
      return {
        ...prescription,
        doctorName: `${prescription.doctor.firstname} ${prescription.doctor.lastname}`,
        // Optionally remove the doctor object if you don't need other doctor details
        doctor: undefined,
      };
    });

    return NextResponse.json(prescriptionsWithDoctorName);
  } catch (error) {
    console.error("Prescription fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions", details: error.message },
      { status: 500 }
    );
  }
}
