import PrescriptionForm from "./prescriptionForm";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function getPatientData(patientId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`
    );
    if (!res.ok) throw new Error("Failed to fetch patient");
    return await res.json();
  } catch (error) {
    console.error("Patient fetch error:", error);
    return null;
  }
}

export default async function CreatePrescription({ params }) {
  const patientData = await getPatientData(params.patientId);

  if (!patientData) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<>Loading...</>}>
        <PrescriptionForm
          patientId={params.patientId}
          initialData={{
            patient: patientData,
            complaints: [],
            treatments: [],
            advice: [],
            attachments: [],
          }}
          isEditMode={false}
        />
      </Suspense>
    </div>
  );
}
