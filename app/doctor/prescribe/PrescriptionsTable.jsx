"use client";

import Link from "next/link";
import { useState } from "react";
import { Pagination } from "../patients/pagination";
import {
  FiEdit,
  FiEye,
  FiPrinter,
  FiTrash2,
  FiSearch,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import { pdf } from "@react-pdf/renderer";
import PrescriptionPDF from "../../components/prescriptionPDF";

// Add a DeleteConfirmationModal component
function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  prescriptionId,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FiAlertTriangle className="text-red-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Are you sure you want to delete prescription #{prescriptionId}? This
            action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(prescriptionId)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PrescriptionsTable({ prescriptions }) {
  const [allPrescriptions, setAllPrescriptions] = useState(prescriptions);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Add state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);

  // Filter prescriptions based on search term
  const filteredPrescriptions = searchTerm
    ? allPrescriptions.filter(
        (p) =>
          p.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.doctor?.firstname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          p.doctor?.lastname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          p.id.toString().includes(searchTerm)
      )
    : allPrescriptions;

  const totalPages = Math.ceil(filteredPrescriptions.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedPrescriptions = filteredPrescriptions.slice(
    startIndex,
    endIndex
  );

  // Function to open delete confirmation modal
  const openDeleteModal = (prescriptionId) => {
    setPrescriptionToDelete(prescriptionId);
    setIsDeleteModalOpen(true);
  };

  // Function to handle actual deletion after confirmation
  const confirmDelete = async (prescriptionId) => {
    try {
      // Optimistic UI update
      setAllPrescriptions((prev) =>
        prev.filter((p) => p.id !== prescriptionId)
      );

      // Close the modal
      setIsDeleteModalOpen(false);

      // Perform the delete operation
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
    <div className="w-full">
      <Toaster position="top-right" />

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        prescriptionId={prescriptionToDelete}
      />

      {/* Search and filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-5/6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search prescriptions by patient name, doctor name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Total: {filteredPrescriptions.length} prescriptions</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedPrescriptions.length > 0 ? (
              paginatedPrescriptions.map((prescription) => (
                <tr
                  key={prescription.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{prescription.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {prescription.patient?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(prescription.dateCreated).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Dr.{" "}
                    {prescription.doctor?.firstname +
                      " " +
                      prescription.doctor?.lastname || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/doctor/prescribe/edit/${prescription.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        <FiEdit size={14} />
                        <span>Edit</span>
                      </Link>
                      <Link
                        href={`/doctor/patients/${prescription.patientId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                      >
                        <FiEye size={14} />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => openDeleteModal(prescription.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                      >
                        <FiTrash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {searchTerm
                    ? "No prescriptions match your search"
                    : "No prescriptions found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
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
