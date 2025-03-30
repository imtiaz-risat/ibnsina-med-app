"use client";
import { useCallback, useState } from "react";
import { ExpandableSection } from "../expandableSection";
import AttachmentBox from "../attachmentBox";
import TreatmentBox from "../treatmentBox";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { pdf } from "@react-pdf/renderer";
import PrescriptionPDF from "../../../components/prescriptionPDF";
import { useSession } from "next-auth/react";

export default function NewPrescription({
  patientId,
  patientData,
  presetData,
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // prescription data
    complaints: [],
    treatments: [],
    advice: [],
    attachments: [],
    hasNextVisit: false,
    nextVisitDate: "",
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

  //console.log("formData:" + JSON.stringify(formData));

  // Unified update function
  // Memoize the update function
  const updateFormData = useCallback((section, data) => {
    setFormData((prev) => {
      // Only update if data changed
      if (JSON.stringify(prev[section]) === JSON.stringify(data)) return prev;
      return { ...prev, [section]: data };
    });
  }, []);

  const handleViewProfile = () => {
    // Navigate to the patient's profile page
    router.push(`/doctor/patients/${patientId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    //console.log("Attempting to save...");
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/prescription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prescriptionData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, details: ${errorText}`
        );
      }

      const result = await response.json();
      toast.success("Prescription saved successfully!");
      router.push(`/doctor/prescribe/edit/${result.id}`);
    } catch (error) {
      toast.error("Submission failed: " + error);
      console.error("Submission error:", error);
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
            patientName: patientData.name,
            patientId: patientData.id,
            age: patientData.age,
            gender: patientData.gender,
            maritalStatus: patientData.maritalStatus,
            prescriptionDateCreated: new Date().toISOString(),
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
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="border border-gray-200 rounded-md py-2 px-4 mb-4">
          <div className="flex flex-col-reverse sm:flex-row items-start justify-between mb-2">
            <div className="flex flex-row items-center">
              Patient ID{" "}
              {/* <input
                type="text"
                placeholder="Patient ID"
                className="mt-1 ml-2 text-sm border-b border-gray-200 focus:border-black outline-none"
                value={patientData.id}
                onChange={(e) =>
                  setPatientData({ ...patientData, id: e.target.value })
                }
              /> */}
              <span className="border-b border-gray-200 px-2">
                {patientData.id}
              </span>
            </div>
            <p className="text-sm text-gray-600">Date: 03-Feb-2025</p>
          </div>
          <div className="flex flex-row items-baseline mb-2">
            <div className="font-semibold mr-4 ">
              Patient Name:{" "}
              <span className="border-b border-gray-200 px-2">
                {patientData.name}
              </span>
            </div>
            <div className="flex flex-row items-center justify-stretch space-x-4">
              <div className="flex flex-row items-center justify-between space-x-4">
                <div className="text-sm text-gray-600 mr-4">
                  Age:{" "}
                  <span className="border-b border-gray-200 px-2">
                    {patientData.age}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mr-4">
                  Gender:{" "}
                  <span className="border-b border-gray-200 px-2">
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
              defaultExpanded={false}
              suggestions={presetData.complaintPresets}
              onUpdate={(data) => updateFormData("complaints", data)}
            />
            <ExpandableSection
              title="Personal History"
              initialItems={formData.personalHistory.map((item) => ({
                topic: item.attribute, // Map 'attribute' to 'topic'
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={presetData.personalHistoryPresets}
              onUpdate={(data) => updateFormData("personalHistory", data)}
            />
            <ExpandableSection
              title="Family History"
              initialItems={formData.familyHistory.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={presetData.familyHistoryPresets}
              onUpdate={(data) => updateFormData("familyHistory", data)}
            />
            <ExpandableSection
              title="Medical History"
              initialItems={formData.medicalHistory.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={presetData.medicalHistoryPresets}
              onUpdate={(data) => updateFormData("medicalHistory", data)}
            />
            <ExpandableSection
              title="Surgical History"
              initialItems={formData.surgicalHistory.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={presetData.surgicalHistoryPresets}
              onUpdate={(data) => updateFormData("surgicalHistory", data)}
            />
            <ExpandableSection
              title="Drug History"
              initialItems={formData.drugHistory.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={presetData.drugHistoryPresets}
              onUpdate={(data) => updateFormData("drugHistory", data)}
            />
            <ExpandableSection
              title="Examination Finding"
              initialItems={formData.examinationFinding.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={presetData.examFindingPresets}
              onUpdate={(data) => updateFormData("examinationFinding", data)}
            />
            <ExpandableSection
              title="Diagnosis"
              initialItems={formData.diagnosis.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={presetData.diagnosisPresets}
              onUpdate={(data) => updateFormData("diagnosis", data)}
            />
            <ExpandableSection
              title="Management Plan"
              initialItems={formData.managementPlan.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={presetData.managementPlanPresets}
              onUpdate={(data) => updateFormData("managementPlan", data)}
            />
            <ExpandableSection
              title="Investigation"
              initialItems={formData.investigation.map((item) => ({
                topic: item.attribute,
                value: item.value,
              }))}
              defaultExpanded={false}
              suggestions={presetData.investigationPresets}
              onUpdate={(data) => updateFormData("investigation", data)}
            />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <TreatmentBox
              onUpdate={(treatments) =>
                updateFormData("treatments", treatments)
              }
              treatmentSuggestions={presetData.treatmentPresets}
            />
            <ExpandableSection
              title="Advice"
              defaultExpanded={true}
              suggestions={presetData.advicePresets}
              onUpdate={(data) => updateFormData("advice", data)}
            />
            <AttachmentBox
              title="Attachments"
              defaultExpanded={true}
              onFilesChange={(attachments) =>
                updateFormData("attachments", attachments)
              }
            />
            <div className="mt-4 p-3 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.hasNextVisit}
                    onChange={(e) =>
                      updateFormData("hasNextVisit", e.target.checked)
                    }
                    className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
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
                className="w-full px-4 py-2 text-blue-500 transition-colors duration-200 border border-blue-500 rounded-md hover:bg-blue-600 hover:text-white"
                onClick={handlePrint}
              >
                Print Prescription
              </button>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white transition-colors duration-200 bg-blue-500 rounded-md hover:bg-blue-600"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Prescription"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
