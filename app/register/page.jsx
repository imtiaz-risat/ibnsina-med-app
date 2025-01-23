"use client";
import React from "react";
import NewPatientForm from "./newPatientForm";

const RegisterPage = () => {
  const addPatient = async (patientData) => {
    try {
      const response = await fetch("/api/addPatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      if (response.ok) {
        const newPatient = await response.json();
        alert("Patient added successfully!");
      } else {
        const errorData = await response.json();
        console.error(
          "[Response not ok] Error adding patient:",
          errorData.error
        );
        alert("[Response not ok] Failed to add patient");
      }
    } catch (error) {
      console.error("[Form Catch] Error adding patient:", error);
      alert("[Form Catch] Failed to add patient");
    }
  };

  return (
    <div>
      <NewPatientForm onSubmit={addPatient} />
    </div>
  );
};

export default RegisterPage;
