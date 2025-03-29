"use client";
import { useCallback, useState } from "react";
import { ExpandableSection } from "../../expandableSection";
import AttachmentBox from "../../attachmentBox";
import TreatmentBox from "../../treatmentBox";
import toast, { Toaster } from "react-hot-toast";
import { pdf } from "@react-pdf/renderer";
import PrescriptionPDF from "../../../../components/prescriptionPDF";
import { useSession } from "next-auth/react";

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

export default function EditPrescription({
  patientId,
  patientData,
  prescriptionId,
  prescriptionData,
  presetData,
}) {
  const { data: session } = useSession();
  //   console.log("patientData in newPrescription:" + patientData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // prescription data
    complaints: prescriptionData.PrescriptionComplaint || [],
    treatments: prescriptionData.PrescriptionTreatment || [],
    advice: prescriptionData.PrescriptionAdvice || [],
    attachments: prescriptionData.PrescriptionAttachment || [],
    hasNextVisit: prescriptionData.hasNextVisit || false,
    nextVisitDate: prescriptionData.nextVisitDate || "",
    // patient data
    personalHistory: patientData.PatientPersonalHistory || [],
    familyHistory: patientData.PatientFamilyHistory || [],
    medicalHistory: patientData.PatientMedicalHistory || [],
    surgicalHistory: patientData.PatientSurgicalHistory || [],
    drugHistory: patientData.PatientDrugHistory || [],
    examinationFinding: patientData.PatientExamFinding || [],
    diagnosis: patientData.PatientDiagnosis || [],
    managementPlan: patientData.PatientManagementPlan || [],
    investigation: patientData.PatientInvestigation || [],
  });

  console.log("formData:" + JSON.stringify(formData));

  // Unified update function
  // Memoize the update function
  const updateFormData = useCallback((section, data) => {
    setFormData((prev) => {
      // Only update if data changed
      if (JSON.stringify(prev[section]) === JSON.stringify(data)) return prev;
      return { ...prev, [section]: data };
    });
  }, []); // Empty dependency array since setFormData is stable

  const handleViewProfile = () => {
    // Add your logic here to handle the view profile button click
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Attempting to update...");
    try {
      // Collecting All data for Prescription
      const prescriptionData = {
        patientId: patientData.id,
        doctorId: session?.user?.id,
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
        examinationFinding: formData.examinationFinding,
        diagnosis: formData.diagnosis,
        managementPlan: formData.managementPlan,
        investigation: formData.investigation,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/prescription/${prescriptionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prescriptionData),
        }
      );

      if (!response.ok) throw new Error("Submission failed: " + response);

      // const result = await response.json();
      toast.success("Prescription updated successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      // Add error state handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = async (e) => {
    e.preventDefault();

    try {
      const pdfBlob = await pdf(
        <PrescriptionPDF
          prescription={{
            // ...formData,
            patientName: patientData.name,
            patientId: patientData.id,
            age: patientData.age,
            gender: patientData.gender,
            maritalStatus: patientData.maritalStatus,
            prescriptionDateCreated: prescriptionData.dateCreated,
            doctorName: `${session?.user?.firstname} ${session?.user?.lastname}`,
            complaints: formData.complaints,
            treatments: formData.treatments,
            advice: formData.advice,
            personalHistory: formData.personalHistory,
            familyHistory: formData.familyHistory,
            medicalHistory: formData.medicalHistory,
            drugHistory: formData.drugHistory,
            surgicalHistory: formData.surgicalHistory,
            examinationFinding: formData.examinationFinding,
            diagnosis: formData.diagnosis,
            managementPlan: formData.managementPlan,
            investigation: formData.investigation,
            hasNextVisit: formData.hasNextVisit,
            nextVisitDate: formData.nextVisitDate,
          }}
        />
      ).toBlob();

      const url = URL.createObjectURL(pdfBlob);
      const win = window.open(url);
      // win.onload = () => win.print();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl">
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="border border-blue-200 rounded-md py-2 px-4 mb-4">
          <div className="flex flex-col-reverse sm:flex-row items-start justify-between mb-2">
            <div className="flex flex-row items-center">
              Patient ID{" "}
              <input
                type="text"
                placeholder="Patient ID"
                className="mt-1 ml-2 text-sm border-b border-gray-200 focus:border-gray-500 outline-none"
                value={patientData.id}
                onChange={(e) =>
                  setPatientData({ ...patientData, id: e.target.value })
                }
              />
            </div>
            <p className="text-sm text-gray-600">Date: 03-Feb-2025</p>
          </div>
          <div className="flex flex-row items-baseline mb-2">
            <div className="font-semibold mr-4 ">
              Patient Name:{" "}
              <span className="border-b border-gray-200">
                {patientData.name}
              </span>
            </div>
            <div className="flex flex-row items-center justify-stretch space-x-4">
              <div className="flex flex-row items-center justify-between space-x-4">
                <div className="text-sm text-gray-600 mr-4">
                  Age:{" "}
                  <span className="border-b border-gray-200">
                    {patientData.age}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mr-4">
                  Gender:{" "}
                  <span className="border-b border-gray-200">
                    {patientData.gender}
                  </span>
                </div>
              </div>
              <button
                className="bg-blue-500 text-white hover:bg-blue-600 text-sm px-2 py-1 rounded"
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
              initialItems={formData.complaints.map((item) => ({
                topic: item.complaint,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={presetData?.complaintPresets || complaintSuggestions}
              onUpdate={(data) => updateFormData("complaints", data)}
            />
            <ExpandableSection
              title="Personal History"
              initialItems={formData.personalHistory.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={
                presetData?.personalHistoryPresets || complaintSuggestions
              }
              onUpdate={(data) => updateFormData("personalHistory", data)}
            />
            <ExpandableSection
              title="Family History"
              initialItems={formData.familyHistory.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={
                presetData?.familyHistoryPresets || complaintSuggestions
              }
              onUpdate={(data) => updateFormData("familyHistory", data)}
            />
            <ExpandableSection
              title="Medical History"
              initialItems={formData.medicalHistory.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={
                presetData?.medicalHistoryPresets || complaintSuggestions
              }
              onUpdate={(data) => updateFormData("medicalHistory", data)}
            />
            <ExpandableSection
              title="Surgical History"
              initialItems={formData.surgicalHistory.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={
                presetData?.surgicalHistoryPresets || complaintSuggestions
              }
              onUpdate={(data) => updateFormData("surgicalHistory", data)}
            />
            <ExpandableSection
              title="Drug History"
              initialItems={formData.drugHistory.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={
                presetData?.drugHistoryPresets || complaintSuggestions
              }
              onUpdate={(data) => updateFormData("drugHistory", data)}
            />
            <ExpandableSection
              title="Examination Finding"
              initialItems={formData.examinationFinding.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={
                presetData?.examFindingPresets || complaintSuggestions
              }
              onUpdate={(data) => updateFormData("examinationFinding", data)}
            />
            <ExpandableSection
              title="Diagnosis"
              initialItems={formData.diagnosis.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={presetData?.diagnosisPresets || complaintSuggestions}
              onUpdate={(data) => updateFormData("diagnosis", data)}
            />
            <ExpandableSection
              title="Management Plan"
              initialItems={formData.managementPlan.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={
                presetData?.managementPlanPresets || complaintSuggestions
              }
              onUpdate={(data) => updateFormData("managementPlan", data)}
            />
            <ExpandableSection
              title="Investigation"
              initialItems={formData.investigation.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={
                presetData?.investigationPresets || complaintSuggestions
              }
              onUpdate={(data) => updateFormData("investigation", data)}
            />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <TreatmentBox
              initialItems={formData.treatments.map((item) => ({
                drugName: item.drug,
                dose: item.dose,
                rule: item.rule,
                duration: item.duration,
              }))}
              onUpdate={(treatments) =>
                updateFormData("treatments", treatments)
              }
            />
            <ExpandableSection
              title="Advice"
              initialItems={formData.advice.map((item) => ({
                topic: item.advice,
                value: item.value,
              }))}
              defaultExpanded={true}
              suggestions={presetData?.advicePresets || adviceSuggestions}
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
                    className="h-4 w-4 text-black border-blue-300 rounded focus:ring-gray-500"
                  />
                  <label className="text-sm font-medium text-gray-900">
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
                  className="w-48 px-2 py-1 text-sm border border-gray-200 rounded-md focus:border-black outline-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div className="mt-2 flex flex-row gap-2">
              <button
                className="w-full px-4 py-2 text-blue-500 transition-colors duration-200 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white"
                onClick={handlePrint}
              >
                Print Prescription
              </button>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white transition-colors duration-200 bg-blue-500 rounded-md hover:bg-blue-700"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Prescription"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
