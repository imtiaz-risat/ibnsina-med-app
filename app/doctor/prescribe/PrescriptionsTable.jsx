"use client";

import Link from "next/link";
import { useState } from "react";
import { Pagination } from "../patients/pagination";
import { FiEdit, FiEye, FiPrinter, FiTrash2 } from "react-icons/fi";

export default function PrescriptionsTable({ prescriptions }) {
  const [allPrescriptions, setAllPrescriptions] = useState(prescriptions);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const totalPages = Math.ceil(allPrescriptions.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedPrescriptions = allPrescriptions.slice(startIndex, endIndex);

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
    <div className="rounded-sm overflow-hidden">
      <table className="min-w-full bg-white border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left font-medium text-sm">
              ID
            </th>
            <th className="py-2 px-4 border-b text-left font-medium text-sm">
              Patient
            </th>
            <th className="py-2 px-4 border-b text-left font-medium text-sm">
              Date
            </th>
            <th className="py-2 px-4 border-b text-left font-medium text-sm">
              Doctor
            </th>
            <th className="py-2 px-4 border-b text-left font-medium text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedPrescriptions.map((prescription) => (
            <tr key={prescription.id} className="hover:bg-gray-50 text-sm">
              <td className="py-2 px-4 border-b">{prescription.id}</td>
              <td className="py-2 px-4 border-b">
                {prescription.patient?.name || "N/A"}
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(prescription.dateCreated).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">
                {prescription.doctor?.firstname +
                  " " +
                  prescription.doctor?.lastname || "N/A"}
              </td>
              <td className="py-2 px-4 border-b flex gap-2">
                <Link
                  href={`/doctor/prescribe/edit/${prescription.id}`}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-600 border border-gray-200 rounded-md hover:bg-indigo-50"
                >
                  Edit
                  <FiEdit />
                </Link>
                <Link
                  href={`/doctor/patients/profile/${prescription.patientId}`}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 border border-gray-200 rounded-md hover:bg-indigo-50"
                >
                  View Profile
                  <FiEye />
                </Link>
                <button
                  onClick={() => handlePrint(prescription.id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  Print
                  <FiPrinter />
                </button>
                <button
                  onClick={() => handleDelete(prescription.id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 border border-gray-200 rounded-md hover:bg-red-50"
                >
                  Delete
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPerPageChange={setPerPage}
          perPage={perPage}
        />
      </div>
    </div>
  );
}
