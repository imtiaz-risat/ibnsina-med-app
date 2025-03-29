"use client";
import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [presets, setPresets] = useState({
    complaints: [],
    personalHistory: [],
    familyHistory: [],
    drugHistory: [],
    examFindings: [],
    diagnoses: [],
    medicalHistory: [],
    surgicalHistory: [],
    treatments: [],
    managementPlans: [],
    investigations: [],
    advices: [],
  });

  const [newItems, setNewItems] = useState({
    complaints: "",
    personalHistory: "",
    familyHistory: "",
    drugHistory: "",
    examFindings: "",
    diagnoses: "",
    medicalHistory: "",
    surgicalHistory: "",
    treatments: "",
    managementPlans: "",
    investigations: "",
    advices: "",
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("complaints");

  // State for deletion confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: "", value: "" });

  // State for toast notification
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchPresets();
  }, []);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchPresets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/presets");
      if (response.ok) {
        const data = await response.json();
        setPresets({
          complaints: data.complaintPresets || [],
          personalHistory: data.personalHistoryPresets || [],
          familyHistory: data.familyHistoryPresets || [],
          drugHistory: data.drugHistoryPresets || [],
          examFindings: data.examFindingPresets || [],
          diagnoses: data.diagnosisPresets || [],
          medicalHistory: data.medicalHistoryPresets || [],
          surgicalHistory: data.surgicalHistoryPresets || [],
          treatments: data.treatmentPresets || [],
          managementPlans: data.managementPlanPresets || [],
          investigations: data.investigationPresets || [],
          advices: data.advicePresets || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch presets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewItems({
      ...newItems,
      [activeTab]: e.target.value,
    });
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const addItem = async () => {
    if (!newItems[activeTab].trim()) return;

    try {
      const response = await fetch("/api/presets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: activeTab,
          value: newItems[activeTab],
        }),
      });

      if (response.ok) {
        const updatedPresets = {
          ...presets,
          [activeTab]: [...presets[activeTab], newItems[activeTab]],
        };
        setPresets(updatedPresets);
        setNewItems({
          ...newItems,
          [activeTab]: "",
        });

        // Show success toast
        showToast(`Added new ${activeTab} successfully`);
      }
    } catch (error) {
      console.error("Failed to add item:", error);
      showToast(`Failed to add ${activeTab}`, "error");
    }
  };

  const confirmDelete = (type, item) => {
    setItemToDelete({ type, value: item });
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete({ type: "", value: "" });
  };

  const deleteItem = async () => {
    const { type, value } = itemToDelete;

    try {
      const response = await fetch("/api/presets", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          value,
        }),
      });

      if (response.ok) {
        const updatedItems = presets[type].filter((i) => i !== value);
        setPresets({
          ...presets,
          [type]: updatedItems,
        });

        // Show success toast
        showToast(`Deleted ${type} successfully`);
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      showToast(`Failed to delete ${type}`, "error");
    } finally {
      // Close the modal
      setShowDeleteModal(false);
      setItemToDelete({ type: "", value: "" });
    }
  };

  const presetTabs = [
    { id: "complaints", label: "Complaints" },
    { id: "personalHistory", label: "Personal History" },
    { id: "familyHistory", label: "Family History" },
    { id: "drugHistory", label: "Drug History" },
    { id: "examFindings", label: "Examination Findings" },
    { id: "diagnoses", label: "Diagnoses" },
    { id: "medicalHistory", label: "Medical History" },
    { id: "surgicalHistory", label: "Surgical History" },
    { id: "treatments", label: "Treatments" },
    { id: "managementPlans", label: "Management Plans" },
    { id: "investigations", label: "Investigations" },
    { id: "advices", label: "Advices" },
  ];

  if (loading) {
    return <div className="p-6">Loading preset data...</div>;
  }

  return (
    <div className="p-6 relative">
      {/* Toast notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Presets</h2>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 mb-4 border-b">
          {presetTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm rounded-t-lg ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-4">
          {presetTabs.map((tab) => (
            <div
              key={tab.id}
              className={activeTab === tab.id ? "block" : "hidden"}
            >
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border rounded-md"
                    placeholder={`Add new ${tab.label.toLowerCase()}`}
                    value={newItems[tab.id]}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addItem();
                    }}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    onClick={addItem}
                  >
                    Add
                  </button>
                </div>

                <div className="mt-4 border rounded-md">
                  {presets[tab.id].length === 0 ? (
                    <p className="p-4 text-gray-500">No items added yet</p>
                  ) : (
                    <ul className="divide-y">
                      {presets[tab.id].map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-3"
                        >
                          <span>{item}</span>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => confirmDelete(tab.id, item)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete "{itemToDelete.value}" from{" "}
              {itemToDelete.type}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                onClick={deleteItem}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
