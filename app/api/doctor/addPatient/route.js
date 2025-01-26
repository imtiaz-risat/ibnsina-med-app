import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    const patientData = await req.json();

    const newPatient = await prisma.patient.create({
      data: {
        ...patientData,
        dateOfBirth: new Date(patientData.dateOfBirth),
      },
    });

    return new Response(JSON.stringify(newPatient), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding patient:", error);
    return new Response(JSON.stringify({ error: "Failed to add patient" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
