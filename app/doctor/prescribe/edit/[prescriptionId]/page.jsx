import PrescriptionForm from "../../prescriptionForm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

async function getPrescriptionData(prescriptionId) {
  try {
    const res = await fetch(`/api/prescription/${prescriptionId}`);
    if (!res.ok) throw new Error("Failed to fetch prescription");
    return await res.json();
  } catch (error) {
    console.error("Prescription fetch error:", error);
    return null;
  }
}

export default async function EditPrescription({ params }) {
  const prescriptionData = await getPrescriptionData(params.prescriptionId);

  if (!prescriptionData) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSkeleton />}>
        <PrescriptionForm
          prescriptionId={params.prescriptionId}
          initialData={{
            patient: prescriptionData.patient,
            complaints: prescriptionData.PrescriptionComplaint,
            treatments: prescriptionData.PrescriptionTreatment,
            advice: prescriptionData.PrescriptionAdvice.map((a) => a.advice),
            attachments: prescriptionData.PrescriptionAttachment,
            nextVisit: prescriptionData.nextVisit,
          }}
          isEditMode={true}
        />
      </Suspense>
    </div>
  );
}
