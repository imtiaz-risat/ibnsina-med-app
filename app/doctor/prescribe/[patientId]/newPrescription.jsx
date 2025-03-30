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
import {
  UserCircle,
  Calendar,
  Printer,
  Save,
  ExternalLink,
} from "lucide-react";

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

  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="w-full bg-white rounded-xl shadow-lg">
      <Toaster position="top-right" />
      <div className="p-5 sm:p-6 lg:p-8">
        {/* Patient Info Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-6 py-4 mb-6 shadow-sm border border-blue-100">
          <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-500">ID:</span>
              <span className="text-sm font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                {patientData.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{today}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Patient:
                </span>
                <span className="ml-2 text-lg font-semibold text-gray-900">
                  {patientData.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <span className="font-medium text-gray-500">Age:</span>
                  <span className="ml-1 text-gray-800">{patientData.age}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-500">Gender:</span>
                  <span className="ml-1 text-gray-800">
                    {patientData.gender}
                  </span>
                </div>
                {patientData.maritalStatus && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-500">
                      Marital Status:
                    </span>
                    <span className="ml-1 text-gray-800">
                      {patientData.maritalStatus}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-md hover:bg-blue-50 transition-colors shadow-sm"
              onClick={() => handleViewProfile()}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Patient Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Left Panel - Medical History */}
          <div className="col-span-1 h-full overflow-y-auto bg-gray-50 p-3 rounded-lg shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">
              Patient History & Data
            </h3>
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

          {/* Right Panel - Prescription */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">
                Prescription Details
              </h3>
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

              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="next-visit"
                      checked={formData.hasNextVisit}
                      onChange={(e) =>
                        updateFormData("hasNextVisit", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="next-visit"
                      className="text-sm font-medium text-gray-700"
                    >
                      Schedule Next Visit / Follow Up
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
                    className="w-full sm:w-48 px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                className="flex-1 px-4 py-3 text-blue-600 transition-colors duration-200 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 shadow-sm flex items-center justify-center gap-2"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4" />
                <span>Print Prescription</span>
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm flex items-center justify-center gap-2"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? "Saving..." : "Save Prescription"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
