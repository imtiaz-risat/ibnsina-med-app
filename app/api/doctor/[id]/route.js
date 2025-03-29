import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        gender: true,
        phone: true,
        address: true,
        // Don't include password for security
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor data" },
      { status: 500 }
    );
  }
}
