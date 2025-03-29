import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.$connect();
    //console.log("Database connected successfully");

    //const patientData = await req.json();
    
    const patients = await prisma.patient.findMany();
    //console.log(patients);

    return new Response(JSON.stringify(patients), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch (error) {
    console.error("Error getting patients:", error);
    return new Response(JSON.stringify({ error: "Failed to get patients" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
