import { Suspense } from "react";
import EditPrescription from "./editPresctiption";

async function getPrescriptionData(prescriptionId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/prescription/${prescriptionId}`
    );
    if (!res.ok) throw new Error("Failed to fetch prescription");
    const data = await res.json();
    //console.log("PRESCRIPTION DATA:\n ================================");
    //console.log(data);
    //console.log("-------------------------------");
    return data;
  } catch (error) {
    console.error("Prescription fetch error:", error);
    return null;
  }
}

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
  const prescriptionData = await getPrescriptionData(params.prescriptionId);
  const patientData = await getPatientData(prescriptionData.patientId);
  const presetData = await getPresetData();

  if (!patientData) {
    return <>Patient does not exist</>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<>Loading Data...</>}>
        <EditPrescription
          patientId={prescriptionData.patientId}
          patientData={patientData}
          prescriptionId={params.prescriptionId}
          prescriptionData={prescriptionData}
          presetData={presetData}
        />
      </Suspense>
    </div>
  );
}
