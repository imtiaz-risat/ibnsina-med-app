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

export default function PrescriptionForm() {
  const [patientData, setPatientData] = useState({
    id: "6970",
    name: "Mohsina Tabassum Khan",
    age: "48y 5m 12d",
    gender: "Female",
    treatment: "",
    advice: "",
    nextVisitDate: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [hasNextVisit, setHasNextVisit] = useState(false);
  const [nextVisitDate, setNextVisitDate] = useState("");

  const handleViewProfile = () => {
    // Add your logic here to handle the view profile button click
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Format the data
    const formattedData = {
      complaints: patientData.complaints,
      onExamination: patientData.onExamination,
      diagnosis: patientData.diagnosis,
      investigations: patientData.investigations,
      medicines: patientData.medicines,
      advice: patientData.advice,
      attachments: attachments.map(({ file, name, description }) => ({
        file,
        name,
        description,
      })),
      nextVisit: hasNextVisit ? nextVisitDate : null,
    };
    console.log("Prescription Data:", formattedData);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="border border-gray-200 rounded-md py-2 px-4 mb-4">
          <div className="flex flex-col-reverse sm:flex-row items-start justify-between mb-2">
            <div className="flex flex-row items-center">
              Patient ID{" "}
              <input
                type="text"
                placeholder="Patient ID"
                className="mt-1 ml-2 text-sm border-b border-gray-200 focus:border-black outline-none"
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
                className="bg-gray-800 text-white hover:bg-black text-sm px-2 py-1 rounded"
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
            />
            <ExpandableSection
              title="Personal History"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
            />
            <ExpandableSection
              title="Family History"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
            />
            <ExpandableSection
              title="Medical History"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
            />
            <ExpandableSection
              title="Surgical History"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
            />
            <ExpandableSection
              title="Drug History"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
            />
            <ExpandableSection
              title="Examination Findings"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
            />
            <ExpandableSection
              title="Diagnosis"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
            />
            <ExpandableSection
              title="Management Plan"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
            />
            <ExpandableSection
              title="Investigation"
              defaultExpanded={false}
              suggestions={complaintSuggestions}
            />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <TreatmentBox />
            <ExpandableSection
              title="Advice"
              defaultExpanded={true}
              suggestions={adviceSuggestions}
            />
            <AttachmentBox
              title="Attachments"
              defaultExpanded={true}
              onFilesChange={setAttachments}
            />
            <div className="mt-4 p-3 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasNextVisit}
                    onChange={(e) => setHasNextVisit(e.target.checked)}
                    className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <label className="text-sm font-medium text-gray-900">
                    Next Visit Date/Follow Up
                  </label>
                </div>
                <input
                  type="date"
                  value={nextVisitDate}
                  onChange={(e) => setNextVisitDate(e.target.value)}
                  disabled={!hasNextVisit}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-48 px-2 py-1 text-sm border border-gray-200 rounded-md focus:border-black outline-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div className="mt-2 flex flex-row gap-2">
              <button
                type="submit"
                className="w-full px-4 py-2 text-black transition-colors duration-200 border border-black rounded-md hover:bg-black hover:text-white"
                onClick={handleSubmit}
              >
                Print Prescription
              </button>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white transition-colors duration-200 bg-gray-800 rounded-md hover:bg-black"
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
