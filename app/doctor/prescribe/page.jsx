import { Suspense } from "react";
import PrescriptionsTable from "./PrescriptionsTable";

async function getPrescriptions() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/prescription`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch prescriptions");
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export default async function ListOfPrescriptions() {
  const prescriptions = await getPrescriptions();
  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      <h1 className="text-2xl font-bold mb-6">All Prescriptions</h1>
      <Suspense fallback={<div>Loading prescriptions...</div>}>
        <PrescriptionsTable prescriptions={prescriptions} />
      </Suspense>
    </div>
  );
}
