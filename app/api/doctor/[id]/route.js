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

// Add PUT method for updating doctor profile
export async function PUT(request, { params }) {
  const id = params.id;

  try {
    const data = await request.json();

    // Only allow updating these fields for security
    const { firstname, lastname, phone, address } = data;

    const updatedDoctor = await prisma.doctor.update({
      where: { id: parseInt(id) },
      data: {
        firstname,
        lastname,
        phone,
        address,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        gender: true,
        phone: true,
        address: true,
      },
    });

    return NextResponse.json(updatedDoctor);
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { error: "Failed to update doctor data" },
      { status: 500 }
    );
  }
}
