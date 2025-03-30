import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // // Get the authenticated session - Uncomment when auth is set up
    // const session = await getServerSession(authOptions);
    //
    // if (!session || session.user.role !== "DOCTOR") {
    //   return NextResponse.json(
    //     { error: "Unauthorized access" },
    //     { status: 401 }
    //   );
    // }
    //
    // const doctorId = parseInt(session.user.id);

    // For testing, use a fixed doctorId
    const doctorId = 1;

    const today = new Date();

    // Get upcoming visits for all doctors
    const upcomingPrescriptions = await prisma.prescription.findMany({
      where: {
        nextVisit: {
          gte: today, // Starting from today
        },
      },
      include: {
        patient: {
          select: {
            id: true,
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
      orderBy: {
        nextVisit: "asc",
      },
      take: 10, // Limit to next 10 appointments
    });

    // Format the appointments for the frontend
    const formattedAppointments = upcomingPrescriptions.map((prescription) => {
      const nextVisitDate = new Date(prescription.nextVisit);

      return {
        id: prescription.id,
        patientName: prescription.patient.name,
        doctorName: `Dr. ${prescription.doctor.firstname} ${prescription.doctor.lastname}`,
        date: nextVisitDate.toISOString(),
        patientId: prescription.patient.id,
      };
    });

    return NextResponse.json({
      appointments: formattedAppointments,
    });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
