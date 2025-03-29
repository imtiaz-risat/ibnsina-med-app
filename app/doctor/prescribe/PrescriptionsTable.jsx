"use client";

import Link from "next/link";
import { useState } from "react";
import { Pagination } from "../patients/pagination";
import { FiEdit, FiEye, FiPrinter, FiTrash2 } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import { pdf } from "@react-pdf/renderer";
import PrescriptionPDF from "../../components/prescriptionPDF";

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
        // Optimistic UI update
        setAllPrescriptions((prev) =>
          prev.filter((p) => p.id !== prescriptionId)
        );

        await fetch(`/api/prescription/${prescriptionId}`, {
          method: "DELETE",
        });

        toast.success("Deleted successfully");
      } catch (error) {
        // Rollback on error
        setAllPrescriptions(prescriptions);
        console.error("Delete failed:", error);
        toast.error("Delete Failed");
      }
    }
  };

  const handlePrint = async (prescriptionId) => {
    try {
      // Fetch the prescription data with all related information
      const response = await fetch(`/api/prescription/${prescriptionId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch prescription: ${response.statusText}`);
      }

      const prescriptionData = await response.json();

      // We also need to fetch patient details including history
      const patientResponse = await fetch(
        `/api/patients/${prescriptionData.patientId}`
      );

      if (!patientResponse.ok) {
        throw new Error(
          `Failed to fetch patient data: ${patientResponse.statusText}`
        );
      }

      const patientData = await patientResponse.json();

      // Format the data for PrescriptionPDF component
      const formattedData = {
        patientName: patientData.name || "N/A",
        patientId: prescriptionData.patientId,
        age: patientData.age || "N/A",
        gender: patientData.gender || "N/A",
        maritalStatus: patientData.maritalStatus || "N/A",
        prescriptionDateCreated: prescriptionData.dateCreated,
        doctorName: prescriptionData.doctor
          ? `${prescriptionData.doctor.firstname} ${prescriptionData.doctor.lastname}`
          : "N/A",

        // Transform prescription-specific data
        complaints:
          prescriptionData.PrescriptionComplaint?.map((item) => ({
            topic: item.complaint,
            value: item.value,
          })) || [],

        treatments:
          prescriptionData.PrescriptionTreatment?.map((item) => ({
            drugName: item.drug,
            dose: item.dose,
            rule: item.rule,
            duration: item.duration,
          })) || [],

        advice:
          prescriptionData.PrescriptionAdvice?.map((item) => ({
            topic: item.advice,
            value: item.value || "",
          })) || [],

        // Transform patient history data
        personalHistory:
          patientData.PatientPersonalHistory?.map((item) => ({
            topic: item.attribute,
            value: item.value,
          })) || [],

        familyHistory:
          patientData.PatientFamilyHistory?.map((item) => ({
            topic: item.attribute,
            value: item.value,
          })) || [],

        medicalHistory:
          patientData.PatientMedicalHistory?.map((item) => ({
            topic: item.attribute,
            value: item.value,
          })) || [],

        drugHistory:
          patientData.PatientDrugHistory?.map((item) => ({
            topic: item.attribute,
            value: item.value,
          })) || [],

        surgicalHistory:
          patientData.PatientSurgicalHistory?.map((item) => ({
            topic: item.attribute,
            value: item.value,
          })) || [],

        examinationFinding:
          patientData.PatientExamFinding?.map((item) => ({
            topic: item.attribute,
            value: item.value,
          })) || [],

        diagnosis:
          patientData.PatientDiagnosis?.map((item) => ({
            topic: item.attribute,
            value: item.value,
          })) || [],

        managementPlan:
          patientData.PatientManagementPlan?.map((item) => ({
            topic: item.attribute,
            value: item.value,
          })) || [],

        investigation:
          patientData.PatientInvestigation?.map((item) => ({
            topic: item.attribute,
            value: item.value,
          })) || [],

        hasNextVisit: prescriptionData.nextVisit ? true : false,
        nextVisitDate: prescriptionData.nextVisit || "",
      };

      //console.log("Formatted data for PDF:", formattedData);

      // Generate the PDF
      const pdfBlob = await pdf(
        <PrescriptionPDF prescription={formattedData} />
      ).toBlob();

      // Open the PDF in a new tab
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");

      // Clean up when the browser closes the window
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF: " + error.message);
    }
  };

  return (
    <div className="rounded-sm overflow-hidden">
      <Toaster />
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
                  href={`/doctor/patients/${prescription.patientId}`}
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
