import { Suspense } from "react";
import NewPrescription from "./newPrescription";

async function getPatientData(patientId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`
    );
    if (!res.ok) throw new Error("Failed to fetch patient");
    const data = await res.json();
    //console.log(data);
    return data;
  } catch (error) {
    console.error("Patient fetch error:", error);
    return null;
  }
}

async function getPresetData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/presets`);
    if (!res.ok) throw new Error("Failed to fetch presets");
    const data = await res.json();
    //console.log(data);
    return data;
  } catch (error) {
    console.error("Presets fetch error:", error);
    return null;
  }
}

export default async function CreatePrescription({ params }) {
  const patientData = await getPatientData(params.patientId);

  if (!patientData) {
    return <>Patient does not exist</>;
  }

  const presetData = await getPresetData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<>Loading Data...</>}>
        <NewPrescription
          patientId={params.patientId}
          patientData={patientData}
          isEditMode={false}
          presetData={presetData}
        />
      </Suspense>
    </div>
  );
}
