"use client";
import { useState } from "react";
import { ExpandableSection } from "./expandableSection";
import AttachmentBox from "./attachmentBox";
import TreatmentBox from "./treatmentBox";

// Sample suggestions for each section
const complaintSuggestions = [
  "Fever",
  "Headache",
  "Cough",
  "Cold",
  "Body Pain",
  "Fatigue",
  "Nausea",
  "Dizziness",
];

const treatmentSuggestions = [
  "Paracetamol",
  "Antibiotics",
  "Antihistamine",
  "Pain Reliever",
  "Cough Syrup",
  "Vitamin C",
  "Rest",
  "Hydration",
];

const adviceSuggestions = [
  "Rest for 3 days",
  "Drink plenty of water",
  "Avoid cold foods",
  "Light exercise",
  "Regular medication",
  "Follow-up in a week",
  "Blood test required",
  "Avoid stress",
];

export default function PrescriptionForm({
  initialData,
  isEditMode = false,
  prescriptionId,
}) {
  const [patientData, setPatientData] = useState(initialData.patient || {});

  const [formData, setFormData] = useState({
    complaints: initialData.complaints || [],
    treatments: initialData.treatments || [],
    advice: initialData.advice || [],
    attachments: initialData.attachments || [],
    hasNextVisit: initialData.hasNextVisit || false,
    nextVisitDate: initialData.nextVisitDate || "",
    personalHistory: initialData.personalHistory || [],
    familyHistory: initialData.familyHistory || [],
    medicalHistory: initialData.medicalHistory || [],
    surgicalHistory: initialData.surgicalHistory || [],
    drugHistory: initialData.drugHistory || [],
    examFindings: initialData.examFindings || [],
    diagnosis: initialData.diagnosis || [],
    managementPlan: initialData.managementPlan || [],
    investigations: initialData.investigations || [],
  });

  // Unified update function
  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleViewProfile = () => {
    // Add your logic here to handle the view profile button click
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Attempting to save...");
    try {
      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/prescription/${prescriptionId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/prescription`;

      const method = isEditMode ? "PUT" : "POST";

      // Collecting All data for Prescription
      const prescriptionData = {
        patientId: initialData.patient.id,
        doctorId: 1, // Replace with actual auth ID
        complaints: formData.complaints,
        treatments: formData.treatments,
        advice: formData.advice,
        attachments: formData.attachments,
        hasNextVisit: formData.hasNextVisit,
        nextVisitDate: formData.nextVisitDate,
        personalHistory: formData.personalHistory,
        familyHistory: formData.familyHistory,
        medicalHistory: formData.medicalHistory,
        surgicalHistory: formData.surgicalHistory,
        drugHistory: formData.drugHistory,
        examinationFindings: formData.examinationFindings,
        diagnosis: formData.diagnosis,
        managementPlan: formData.managementPlan,
        investigation: formData.investigation,
      };

      const response = fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionData),
      });

      if (!response.ok) throw new Error("Submission failed: " + response);

      const result = response.json();
      router.push(`/doctor/prescriptions/${result.id}`);
    } catch (error) {
      console.error("Submission error:", error);
      // Add error state handling here
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="border border-blue-200 rounded-md py-2 px-4 mb-4">
          <div className="flex flex-col-reverse sm:flex-row items-start justify-between mb-2">
            <div className="flex flex-row items-center">
              Patient ID{" "}
              <input
                type="text"
                placeholder="Patient ID"
                className="mt-1 ml-2 text-sm border-b border-blue-200 focus:border-blue-500 outline-none"
                value={patientData.id}
                onChange={(e) =>
                  setPatientData({ ...patientData, id: e.target.value })
                }
              />
            </div>
            <p className="text-sm text-blue-600">Date: 03-Feb-2025</p>
          </div>
          <div className="flex flex-row items-baseline mb-2">
            <div className="font-semibold mr-4 ">
              Patient Name:{" "}
              <span className="border-b border-blue-200">
                {patientData.name}
              </span>
            </div>
            <div className="flex flex-row items-center justify-stretch space-x-4">
              <div className="flex flex-row items-center justify-between space-x-4">
                <div className="text-sm text-gray-600 mr-4">
                  Age:{" "}
                  <span className="border-b border-blue-200">
                    {patientData.age}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mr-4">
                  Gender:{" "}
                  <span className="border-b border-blue-200">
                    {patientData.gender}
                  </span>
                </div>
              </div>
              <button
                className="bg-blue-800 text-white hover:bg-blue-500 text-sm px-2 py-1 rounded"
                onClick={() => handleViewProfile()}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 h-[32rem] overflow-y-scroll">
            <ExpandableSection
              title="Patient Complaints"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
              onUpdate={(data) => updateFormData("complaints", data)}
            />
            <ExpandableSection
              title="Personal History"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
              onUpdate={(data) => updateFormData("personalHistory", data)}
            />
            <ExpandableSection
              title="Family History"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
              onUpdate={(data) => updateFormData("familyHistory", data)}
            />
            <ExpandableSection
              title="Medical History"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
              onUpdate={(data) => updateFormData("medicalHistory", data)}
            />
            <ExpandableSection
              title="Surgical History"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
              onUpdate={(data) => updateFormData("surgicalHistory", data)}
            />
            <ExpandableSection
              title="Drug History"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
              onUpdate={(data) => updateFormData("drugHistory", data)}
            />
            <ExpandableSection
              title="Examination Findings"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
              onUpdate={(data) => updateFormData("examinationFindings", data)}
            />
            <ExpandableSection
              title="Diagnosis"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
              onUpdate={(data) => updateFormData("diagnosis", data)}
            />
            <ExpandableSection
              title="Management Plan"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
              onUpdate={(data) => updateFormData("managementPlan", data)}
            />
            <ExpandableSection
              title="Investigation"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
              onUpdate={(data) => updateFormData("investigation", data)}
            />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <TreatmentBox
              onUpdate={(treatments) =>
                updateFormData("treatments", treatments)
              }
            />
            <ExpandableSection
              title="Advice"
              defaultExpanded={true}
              suggestions={adviceSuggestions}
              onUpdate={(data) => updateFormData("advice", data)}
            />
            <AttachmentBox
              title="Attachments"
              defaultExpanded={true}
              onFilesChange={(attachments) =>
                updateFormData("attachments", attachments)
              }
            />
            <div className="mt-4 p-3 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.hasNextVisit}
                    onChange={(e) =>
                      updateFormData("hasNextVisit", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-500 border-blue-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-blue-900">
                    Next Visit Date/Follow Up
                  </label>
                </div>
                <input
                  type="date"
                  value={formData.nextVisitDate}
                  onChange={(e) =>
                    updateFormData("nextVisitDate", e.target.value)
                  }
                  disabled={!formData.hasNextVisit}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-48 px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-blue-500 outline-none disabled:bg-blue-50 disabled:text-blue-500"
                />
              </div>
            </div>

            <div className="mt-2 flex flex-row gap-2">
              <button
                type="submit"
                className="w-full px-4 py-2 text-blue-500 transition-colors duration-200 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white"
              >
                Print Prescription
              </button>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white transition-colors duration-200 bg-blue-800 rounded-md hover:bg-blue-500"
                onClick={handleSubmit}
              >
                Save Prescription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
