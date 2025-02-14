import { NextResponse } from "next/server";
import { patients } from "@/app/doctor/patients/mockPatient";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    // Find the patient from mock data
    const patientData = patients.find((p) => p.id.toString() === id);

    if (!patientData) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Enhance the patient data with additional mock information
    const patient = {
      ...patientData,
      email: `${patientData.name.toLowerCase().replace(" ", ".")}@example.com`,
      address: "123 Main Street, Anytown, ST 12345",
      emergencyContact: "Family Member - +880 1234567890",
      prescriptions: [
        {
          date: "Oct 24, 2023",
          diagnosis: "Acute Bronchitis",
          doctorName: "Smith",
        },
        {
          date: "Sep 15, 2023",
          diagnosis: "Regular Checkup",
          doctorName: "Smith",
        },
      ],
      medicalNotes: [
        {
          content: patientData.note,
          doctor: "Dr. Smith",
          date: "Oct 24, 2023",
        },
        {
          content: "No known drug allergies. Regular exercise recommended.",
          doctor: "Dr. Smith",
          date: "Sep 15, 2023",
        },
      ],
    };

    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch patient data" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const data = await request.json();
    // TODO: Update patient data in database

    return NextResponse.json({ message: "Patient data updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update patient data" },
      { status: 500 }
    );
  }
}
