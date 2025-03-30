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

    // For validation, get total visits
    const totalVisitsInDB = await prisma.prescription.count();

    // Get current date
    const today = new Date();

    // Calculate the start and end dates for the last 6 months
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 5);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Get all prescriptions for the last 6 months in a single query
    const allPrescriptions = await prisma.prescription.findMany({
      where: {
        dateCreated: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        dateCreated: true,
      },
      orderBy: {
        dateCreated: "asc",
      },
    });

    // Create a map to store month data
    const monthMap = new Map();

    // Initialize all months in the range with zero counts
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();

      // Create a key for this month (YYYY-MM format for sorting)
      const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

      // Create a readable label (e.g., "Jan 2023")
      const monthLabel =
        monthDate.toLocaleString("default", { month: "short" }) + " " + year;

      // Add to map with zero count
      monthMap.set(monthKey, { label: monthLabel, count: 0 });
    }

    // Count prescriptions by month
    allPrescriptions.forEach((prescription) => {
      const prescDate = new Date(prescription.dateCreated);
      const year = prescDate.getFullYear();
      const month = prescDate.getMonth();

      // Create the same key format
      const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

      // Only increment count if this month is in our map
      if (monthMap.has(monthKey)) {
        const monthData = monthMap.get(monthKey);
        monthData.count++;
        monthMap.set(monthKey, monthData);
      }
    });

    // Convert map to arrays for the API response
    // Sort by date (oldest to newest)
    const sortedEntries = Array.from(monthMap.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    const labels = [];
    const data = [];

    sortedEntries.forEach(([_, monthInfo]) => {
      labels.push(monthInfo.label);
      data.push(monthInfo.count);
    });

    // Calculate total from our data for validation
    const calculatedTotal = data.reduce((sum, count) => sum + count, 0);

    return NextResponse.json({
      labels,
      data,
      totalVisits: calculatedTotal,
      totalInDB: totalVisitsInDB,
    });
  } catch (error) {
    console.error("Error fetching visits trend:", error);
    return NextResponse.json(
      { error: "Failed to fetch visits trend" },
      { status: 500 }
    );
  }
}
