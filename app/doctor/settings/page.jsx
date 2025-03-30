"use client";
import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  X,
  Settings,
  CheckSquare,
  Loader,
} from "lucide-react";

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
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 text-lg font-medium">
          Loading preset data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Toast notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-3 transition-all duration-300 ${
            toast.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Manage Presets
              </h2>
            </div>
            <p className="mt-2 text-gray-600 text-sm">
              Configure preset values for patient records and prescriptions
            </p>
          </div>

          {/* Tab navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-1 p-2">
              {presetTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 mb-1 ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {presetTabs.map((tab) => (
              <div
                key={tab.id}
                className={activeTab === tab.id ? "animate-fadeIn" : "hidden"}
              >
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        placeholder={`Add new ${tab.label.toLowerCase()}`}
                        value={newItems[tab.id]}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addItem();
                        }}
                      />
                    </div>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors duration-200"
                      onClick={addItem}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="py-3 px-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-medium text-gray-700 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-blue-500" />
                        {tab.label} List
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full">
                          {presets[tab.id].length}
                        </span>
                      </h3>
                    </div>

                    {presets[tab.id].length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-1">No items added yet</p>
                        <p className="text-sm text-gray-400">
                          Add your first {tab.label.toLowerCase()} using the
                          input above
                        </p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {presets[tab.id].map((item, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors group"
                          >
                            <span className="text-gray-800">{item}</span>
                            <button
                              className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => confirmDelete(tab.id, item)}
                              title={`Delete ${item}`}
                            >
                              <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4 border border-gray-200">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Confirm Deletion
                </h3>
              </div>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                "{itemToDelete.value}"
              </span>{" "}
              from{" "}
              <span className="font-medium text-gray-900">
                {itemToDelete.type}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                onClick={deleteItem}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
