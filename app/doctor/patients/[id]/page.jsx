"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SlUser, SlUserFemale } from "react-icons/sl";

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // TODO: Replace with actual API endpoint
        const response = await fetch(`/api/patients/${id}`);
        if (!response.ok) throw new Error("Failed to fetch patient data");
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section with Profile and Actions */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            {patient.gender === "Male" ? (
              <SlUser size={36} />
            ) : (
              <SlUserFemale size={36} />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{patient.name}</h1>
            <p className="text-gray-600">Patient ID: {patient.id}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
            Edit Profile
          </button>
          <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-black">
            New Prescription
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Information Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p>{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p>{patient.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p>{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p>{patient.contact}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p>{patient.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p>{patient.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Emergency Contact</p>
              <p>{patient.emergencyContact}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 gap-4">
          {/* Previous Prescriptions Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Previous Prescriptions
            </h2>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 text-sm border-b">
                  <th className="pb-2 font-normal">Date</th>
                  <th className="pb-2 font-normal">Doctor</th>
                  <th className="pb-2 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patient.prescriptions?.map((prescription, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{prescription.date}</td>
                    <td className="py-3">Dr. {prescription.doctorName}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button className="bg-white text-black border px-3 py-1 rounded-md hover:bg-black hover:text-white">
                          Edit
                        </button>
                        <button className="bg-white text-black border px-3 py-1 rounded-md hover:bg-black hover:text-white">
                          View PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Medical Notes Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Medical Notes</h2>
            <div className="space-y-4">
              {patient.medicalNotes?.map((note, index) => (
                <div
                  key={index}
                  className="border-l-4 border-gray-800 pl-4 py-2"
                >
                  <p>{note.content}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Added by {note.doctor} - {note.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
