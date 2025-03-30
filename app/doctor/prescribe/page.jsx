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
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prescriptions</h1>
        <p className="text-gray-600">
          View and manage all patient prescriptions
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Suspense
          fallback={
            <div className="flex justify-center items-center p-6">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Loading prescriptions...</p>
              </div>
            </div>
          }
        >
          <PrescriptionsTable prescriptions={prescriptions} />
        </Suspense>
      </div>
    </div>
  );
}
