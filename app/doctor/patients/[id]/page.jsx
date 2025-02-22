import PatientProfile from "./patientProfile";

async function getPatientData(patientId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`
    );
    if (!res.ok) throw new Error("Failed to fetch patient");
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

async function getPrescriptions(patientId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}/prescriptions`
    );
    if (!res.ok) throw new Error("Failed to fetch prescriptions");
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export default async function PatientPage({ params }) {
  const patient = await getPatientData(params.id);
  const prescriptions = await getPrescriptions(params.id);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-4">
      <PatientProfile initialData={patient} prescriptions={prescriptions} />
    </div>
  );
}
