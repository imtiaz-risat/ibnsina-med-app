import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET a specific doctor by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const doctorId = parseInt(id);

    if (isNaN(doctorId)) {
      return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
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

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor" },
      { status: 500 }
    );
  }
}

// PATCH - Update doctor
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const doctorId = parseInt(id);
    const body = await request.json();

    if (isNaN(doctorId)) {
      return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
    }

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!existingDoctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // If username is being updated, check if new username is unique
    if (body.username && body.username !== existingDoctor.username) {
      const usernameExists = await prisma.doctor.findUnique({
        where: { username: body.username },
      });

      if (usernameExists) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }
    }

    // No need to hash password - use it directly
    let updateData = { ...body };

    // Update the doctor
    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: updateData,
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
      { error: "Failed to update doctor" },
      { status: 500 }
    );
  }
}

// DELETE - Delete doctor
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const doctorId = parseInt(id);

    if (isNaN(doctorId)) {
      return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
    }

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!existingDoctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Delete the doctor
    await prisma.doctor.delete({
      where: { id: doctorId },
    });

    return NextResponse.json(
      { message: "Doctor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      { error: "Failed to delete doctor" },
      { status: 500 }
    );
  }
}
