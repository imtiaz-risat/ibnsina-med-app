/**
 * Converts presets data from the API into the format expected by the FilterSidebar component
 * @param {Object} presets - The presets data from the API
 * @returns {Object} - Filter options in the format expected by FilterSidebar
 */
export function presetsToFilterOptions(presets) {
  // Initialize the filter options object
  const filterOptions = {};

  // Map complaints
  if (presets.complaintPresets?.length > 0) {
    filterOptions.complaints = {
      title: "Complaints",
      options: presets.complaintPresets.map(complaint => ({
        id: complaint.toLowerCase().replace(/\s+/g, '_'),
        label: complaint,
        count: 0 // This will be updated when we count occurrences
      }))
    };
  }

  // Map personal history
  if (presets.personalHistoryPresets?.length > 0) {
    filterOptions.personalHistory = {
      title: "Personal History",
      options: presets.personalHistoryPresets.map(history => ({
        id: history.toLowerCase().replace(/\s+/g, '_'),
        label: history,
        count: 0
      }))
    };
  }

  // Map family history
  if (presets.familyHistoryPresets?.length > 0) {
    filterOptions.familyHistory = {
      title: "Family History",
      options: presets.familyHistoryPresets.map(history => ({
        id: history.toLowerCase().replace(/\s+/g, '_'),
        label: history,
        count: 0
      }))
    };
  }

  // Map medical history
  if (presets.medicalHistoryPresets?.length > 0) {
    filterOptions.medicalHistory = {
      title: "Medical History",
      options: presets.medicalHistoryPresets.map(history => ({
        id: history.toLowerCase().replace(/\s+/g, '_'),
        label: history,
        count: 0
      }))
    };
  }

  // Map surgical history
  if (presets.surgicalHistoryPresets?.length > 0) {
    filterOptions.surgicalHistory = {
      title: "Surgical History",
      options: presets.surgicalHistoryPresets.map(history => ({
        id: history.toLowerCase().replace(/\s+/g, '_'),
        label: history,
        count: 0
      }))
    };
  }

  // Map drug history
  if (presets.drugHistoryPresets?.length > 0) {
    filterOptions.drugHistory = {
      title: "Drug History",
      options: presets.drugHistoryPresets.map(history => ({
        id: history.toLowerCase().replace(/\s+/g, '_'),
        label: history,
        count: 0
      }))
    };
  }

  // Map examination findings
  if (presets.examFindingPresets?.length > 0) {
    filterOptions.examinations = {
      title: "Examinations",
      options: presets.examFindingPresets.map(finding => ({
        id: finding.toLowerCase().replace(/\s+/g, '_'),
        label: finding,
        count: 0
      }))
    };
  }

  // Map diagnoses
  if (presets.diagnosisPresets?.length > 0) {
    filterOptions.diagnosis = {
      title: "Diagnosis",
      options: presets.diagnosisPresets.map(diagnosis => ({
        id: diagnosis.toLowerCase().replace(/\s+/g, '_'),
        label: diagnosis,
        count: 0
      }))
    };
  }

  // Add gender filter (this is not from presets but is needed)
  filterOptions.gender = {
    title: "Gender",
    options: [
      { id: "male", label: "Male", count: 0 },
      { id: "female", label: "Female", count: 0 },
      { id: "other", label: "Other", count: 0 },
    ],
  };

  return filterOptions;
}

/**
 * Updates the counts in filter options based on patients data
 * @param {Object} filterOptions - The filter options object
 * @param {Array} patients - Array of patients with their prescriptions
 * @returns {Object} - Updated filter options with counts
 */
export function updateFilterOptionsCounts(filterOptions, patients) {
  if (!patients || !filterOptions) return filterOptions;

  // Create a deep copy to avoid mutating the original
  const updatedOptions = JSON.parse(JSON.stringify(filterOptions));

  // Count gender occurrences
  if (updatedOptions.gender) {
    const genderCounts = {};
    patients.forEach(patient => {
      const gender = patient.gender.toLowerCase();
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });

    updatedOptions.gender.options.forEach(option => {
      option.count = genderCounts[option.id] || 0;
    });
  }

  // Count complaints occurrences
  if (updatedOptions.complaints) {
    const complaintCounts = {};
    patients.forEach(patient => {
      patient.Prescription?.forEach(prescription => {
        prescription.PrescriptionComplaint?.forEach(complaint => {
          const id = complaint.complaint.toLowerCase().replace(/\s+/g, '_');
          complaintCounts[id] = (complaintCounts[id] || 0) + 1;
        });
      });
    });

    updatedOptions.complaints.options.forEach(option => {
      option.count = complaintCounts[option.id] || 0;
    });
  }

  // Count personal history occurrences
  if (updatedOptions.personalHistory) {
    const personalHistoryCounts = {};
    patients.forEach(patient => {
      patient.PatientPersonalHistory?.forEach(history => {
        const id = history.attribute.toLowerCase().replace(/\s+/g, '_');
        personalHistoryCounts[id] = (personalHistoryCounts[id] || 0) + 1;
      });
    });

    updatedOptions.personalHistory.options.forEach(option => {
      option.count = personalHistoryCounts[option.id] || 0;
    });
  }

  // Count family history occurrences
  if (updatedOptions.familyHistory) {
    const familyHistoryCounts = {};
    patients.forEach(patient => {
      patient.PatientFamilyHistory?.forEach(history => {
        const id = history.attribute.toLowerCase().replace(/\s+/g, '_');
        familyHistoryCounts[id] = (familyHistoryCounts[id] || 0) + 1;
      });
    });

    updatedOptions.familyHistory.options.forEach(option => {
      option.count = familyHistoryCounts[option.id] || 0;
    });
  }

  // Count medical history occurrences
  if (updatedOptions.medicalHistory) {
    const medicalHistoryCounts = {};
    patients.forEach(patient => {
      patient.PatientMedicalHistory?.forEach(history => {
        const id = history.attribute.toLowerCase().replace(/\s+/g, '_');
        medicalHistoryCounts[id] = (medicalHistoryCounts[id] || 0) + 1;
      });
    });

    updatedOptions.medicalHistory.options.forEach(option => {
      option.count = medicalHistoryCounts[option.id] || 0;
    });
  }

  // Count surgical history occurrences
  if (updatedOptions.surgicalHistory) {
    const surgicalHistoryCounts = {};
    patients.forEach(patient => {
      patient.PatientSurgicalHistory?.forEach(history => {
        const id = history.attribute.toLowerCase().replace(/\s+/g, '_');
        surgicalHistoryCounts[id] = (surgicalHistoryCounts[id] || 0) + 1;
      });
    });

    updatedOptions.surgicalHistory.options.forEach(option => {
      option.count = surgicalHistoryCounts[option.id] || 0;
    });
  }

  // Count drug history occurrences
  if (updatedOptions.drugHistory) {
    const drugHistoryCounts = {};
    patients.forEach(patient => {
      patient.PatientDrugHistory?.forEach(history => {
        const id = history.attribute.toLowerCase().replace(/\s+/g, '_');
        drugHistoryCounts[id] = (drugHistoryCounts[id] || 0) + 1;
      });
    });

    updatedOptions.drugHistory.options.forEach(option => {
      option.count = drugHistoryCounts[option.id] || 0;
    });
  }

  // Count examinations occurrences
  if (updatedOptions.examinations) {
    const examinationCounts = {};
    patients.forEach(patient => {
      patient.PatientExamFinding?.forEach(finding => {
        const id = finding.attribute.toLowerCase().replace(/\s+/g, '_');
        examinationCounts[id] = (examinationCounts[id] || 0) + 1;
      });
    });

    updatedOptions.examinations.options.forEach(option => {
      option.count = examinationCounts[option.id] || 0;
    });
  }

  // Count diagnosis occurrences
  if (updatedOptions.diagnosis) {
    const diagnosisCounts = {};
    patients.forEach(patient => {
      patient.PatientDiagnosis?.forEach(diagnosis => {
        const id = diagnosis.attribute.toLowerCase().replace(/\s+/g, '_');
        diagnosisCounts[id] = (diagnosisCounts[id] || 0) + 1;
      });
    });

    updatedOptions.diagnosis.options.forEach(option => {
      option.count = diagnosisCounts[option.id] || 0;
    });
  }

  return updatedOptions;
}

/**
 * Filters patients based on selected filters
 * @param {Array} patients - Array of patients with their prescriptions
 * @param {Object} selectedFilters - Object containing selected filter values
 * @param {string} searchQuery - Search query string
 * @returns {Array} - Filtered patients array
 */
export function filterPatients(patients, selectedFilters, searchQuery = "") {
  if (!patients) return [];
  
  return patients.filter(patient => {
    // Search query filter
    const matchesSearch = searchQuery ? (
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toString().includes(searchQuery.toLowerCase())
    ) : true;

    if (!matchesSearch) return false;

    // Gender filter
    const matchesGender = !selectedFilters.gender?.length || 
      selectedFilters.gender.includes(patient.gender.toLowerCase());

    if (!matchesGender) return false;

    // Complaints filter
    const matchesComplaints = !selectedFilters.complaints?.length || 
      patient.Prescription?.some(prescription => 
        prescription.PrescriptionComplaint?.some(complaint => 
          selectedFilters.complaints.includes(complaint.complaint.toLowerCase().replace(/\s+/g, '_'))
        )
      );

    if (!matchesComplaints) return false;

    // Personal history filter
    const matchesPersonalHistory = !selectedFilters.personalHistory?.length || 
      patient.PatientPersonalHistory?.some(history => 
        selectedFilters.personalHistory.includes(history.attribute.toLowerCase().replace(/\s+/g, '_'))
      );

    if (!matchesPersonalHistory) return false;

    // Family history filter
    const matchesFamilyHistory = !selectedFilters.familyHistory?.length || 
      patient.PatientFamilyHistory?.some(history => 
        selectedFilters.familyHistory.includes(history.attribute.toLowerCase().replace(/\s+/g, '_'))
      );

    if (!matchesFamilyHistory) return false;

    // Medical history filter
    const matchesMedicalHistory = !selectedFilters.medicalHistory?.length || 
      patient.PatientMedicalHistory?.some(history => 
        selectedFilters.medicalHistory.includes(history.attribute.toLowerCase().replace(/\s+/g, '_'))
      );

    if (!matchesMedicalHistory) return false;

    // Surgical history filter
    const matchesSurgicalHistory = !selectedFilters.surgicalHistory?.length || 
      patient.PatientSurgicalHistory?.some(history => 
        selectedFilters.surgicalHistory.includes(history.attribute.toLowerCase().replace(/\s+/g, '_'))
      );

    if (!matchesSurgicalHistory) return false;

    // Drug history filter
    const matchesDrugHistory = !selectedFilters.drugHistory?.length || 
      patient.PatientDrugHistory?.some(history => 
        selectedFilters.drugHistory.includes(history.attribute.toLowerCase().replace(/\s+/g, '_'))
      );

    if (!matchesDrugHistory) return false;

    // Examinations filter
    const matchesExaminations = !selectedFilters.examinations?.length || 
      patient.PatientExamFinding?.some(finding => 
        selectedFilters.examinations.includes(finding.attribute.toLowerCase().replace(/\s+/g, '_'))
      );

    if (!matchesExaminations) return false;

    // Diagnosis filter
    const matchesDiagnosis = !selectedFilters.diagnosis?.length || 
      patient.PatientDiagnosis?.some(diagnosis => 
        selectedFilters.diagnosis.includes(diagnosis.attribute.toLowerCase().replace(/\s+/g, '_'))
      );

    if (!matchesDiagnosis) return false;

    // If all filters pass, include the patient
    return true;
  });
}