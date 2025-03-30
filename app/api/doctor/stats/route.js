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

    // Get count of all patients
    const totalPatients = await prisma.patient.count();

    // Count all prescriptions (visits)
    const totalVisits = await prisma.prescription.count();

    // Get prescriptions with next visit date within the next week
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const nextWeekVisits = await prisma.prescription.count({
      where: {
        nextVisit: {
          gte: today,
          lte: nextWeek,
        },
      },
    });

    return NextResponse.json({
      totalPatients,
      totalPrescriptions: totalVisits,
      nextWeekVisits,
    });
  } catch (error) {
    console.error("Error fetching doctor stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
