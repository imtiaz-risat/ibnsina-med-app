"use client";

import Link from "next/link";
import { FiEdit, FiTrash, FiPrinter } from "react-icons/fi";

export default function PrescriptionsTable({ prescriptions }) {
  const handleDelete = async (prescriptionId) => {
    if (confirm("Are you sure you want to delete this prescription?")) {
      try {
        await fetch(`/api/prescription/${prescriptionId}`, {
          method: "DELETE",
        });
        // Refresh the page or update state
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handlePrint = (prescriptionId) => {
    window.open(`/doctor/prescribe/print/${prescriptionId}`, "_blank");
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Prescription ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Patient
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Doctor
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {prescriptions.map((prescription) => (
            <tr key={prescription.id}>
              <td className="px-6 py-4 text-sm">{prescription.id}</td>
              <td className="px-6 py-4 text-sm">
                {prescription.patient?.name || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm">
                {new Date(prescription.dateCreated).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm">
                {prescription.doctor?.firstname +
                  " " +
                  prescription.doctor?.lastname || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm flex gap-3">
                <Link
                  href={`/doctor/prescribe/edit/${prescription.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(prescription.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePrint(prescription.id)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FiPrinter className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
