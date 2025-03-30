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

    // Define case types
    const caseTypes = [
      "Checkups",
      "Acute Care",
      "Chronic Disease",
      "Preventive Care",
      "Other",
    ];

    // Get prescriptions for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get all prescriptions with their complaints for all doctors
    const prescriptions = await prisma.prescription.findMany({
      where: {
        dateCreated: {
          gte: sixMonthsAgo,
        },
      },
      include: {
        PrescriptionComplaint: true,
      },
    });

    // Map prescription complaints to our case types
    // This is a simplified mapping - in a real app, you'd need more sophisticated logic
    const categorizeComplaint = (complaint) => {
      const complaintLower = complaint.toLowerCase();

      if (
        complaintLower.includes("check") ||
        complaintLower.includes("routine")
      ) {
        return "Checkups";
      } else if (
        complaintLower.includes("acute") ||
        complaintLower.includes("emergency") ||
        complaintLower.includes("pain")
      ) {
        return "Acute Care";
      } else if (
        complaintLower.includes("chronic") ||
        complaintLower.includes("diabetes") ||
        complaintLower.includes("hypertension")
      ) {
        return "Chronic Disease";
      } else if (
        complaintLower.includes("prevent") ||
        complaintLower.includes("vaccine") ||
        complaintLower.includes("screening")
      ) {
        return "Preventive Care";
      } else {
        return "Other";
      }
    };

    // Count cases by type
    const caseCounts = Array(5).fill(0); // Initialize with zeros for our 5 categories

    // Analyze each prescription's complaints
    prescriptions.forEach((prescription) => {
      if (prescription.PrescriptionComplaint.length === 0) {
        // If no complaints, count as "Checkups" (index 0)
        caseCounts[0]++;
      } else {
        // Get the primary complaint (first one)
        const primaryComplaint =
          prescription.PrescriptionComplaint[0].complaint;
        const category = categorizeComplaint(primaryComplaint);
        const index = caseTypes.indexOf(category);
        if (index >= 0) {
          caseCounts[index]++;
        } else {
          // Fallback to "Other" (index 4)
          caseCounts[4]++;
        }
      }
    });

    // If no data found, provide fallback data to prevent empty chart
    const totalCases = caseCounts.reduce((sum, count) => sum + count, 0);
    let data = caseCounts;

    if (totalCases === 0) {
      // Provide sample data if no real data exists yet
      data = [35, 20, 25, 15, 5];
    }

    return NextResponse.json({
      labels: caseTypes,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching case distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch case distribution" },
      { status: 500 }
    );
  }
}
