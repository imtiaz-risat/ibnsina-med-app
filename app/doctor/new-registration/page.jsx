"use client";
import React from "react";
import NewPatientForm from "./newPatientForm";
import toast, { Toaster } from "react-hot-toast";

const NewRegistrationPage = () => {
  const addPatient = async (patientData) => {
    try {
      const response = await fetch("/api/doctor/addPatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      if (response.ok) {
        const newPatient = await response.json();
        toast.success("Patient added successfully!");
        return newPatient;
      } else {
        toast.error("Failed to add patient");
      }
    } catch (error) {
      console.error("[Form Catch] Error adding patient:", error);
      toast.error("[Form Catch] Failed to add patient");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <NewPatientForm onSubmit={addPatient} />
      <Toaster />
    </div>
  );
};

export default NewRegistrationPage;
