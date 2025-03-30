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

    // Get all patients in the system
    const patients = await prisma.patient.findMany({
      select: {
        dateOfBirth: true,
      },
    });

    const today = new Date();
    const currentYear = today.getFullYear();

    // Define age ranges
    const ageRanges = [
      { label: "0-18", min: 0, max: 18 },
      { label: "19-35", min: 19, max: 35 },
      { label: "36-50", min: 36, max: 50 },
      { label: "51-65", min: 51, max: 65 },
      { label: "65+", min: 66, max: 150 }, // Set an upper bound for practical reasons
    ];

    // Calculate age distribution
    const ageDistribution = ageRanges.map((range) => {
      const count = patients.filter((patient) => {
        if (!patient.dateOfBirth) return false;

        const birthYear = new Date(patient.dateOfBirth).getFullYear();
        const age = currentYear - birthYear;
        return age >= range.min && age <= range.max;
      }).length;

      return count;
    });

    // If there's no data, provide sample data
    if (patients.length === 0) {
      return NextResponse.json({
        labels: ageRanges.map((range) => range.label),
        data: [15, 30, 25, 20, 10], // Sample data
      });
    }

    return NextResponse.json({
      labels: ageRanges.map((range) => range.label),
      data: ageDistribution,
    });
  } catch (error) {
    console.error("Error fetching patient demographics:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient demographics" },
      { status: 500 }
    );
  }
}
