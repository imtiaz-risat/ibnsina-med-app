import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all doctors
export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
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

    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

// POST - Create a new doctor
export async function POST(request) {
  try {
    const body = await request.json();
    const { firstname, lastname, username, password, gender, phone, address } =
      body;

    // Validate required fields
    if (
      !firstname ||
      !lastname ||
      !username ||
      !password ||
      !gender ||
      !phone ||
      !address
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { username },
    });

    if (existingDoctor) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Create the doctor with plain password
    const newDoctor = await prisma.doctor.create({
      data: {
        firstname,
        lastname,
        username,
        password, // Store password as plain text
        gender,
        phone,
        address,
      },
    });

    // Return the created doctor without password
    const { password: _, ...doctorWithoutPassword } = newDoctor;
    return NextResponse.json(doctorWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(
      { error: "Failed to create doctor" },
      { status: 500 }
    );
  }
}
