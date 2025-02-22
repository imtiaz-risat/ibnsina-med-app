"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SlUser, SlUserFemale } from "react-icons/sl";
import { FiEdit, FiPrinter, FiTrash2 } from "react-icons/fi";

export default function PatientProfile({ initialData, prescriptions }) {
  const [patient, setPatient] = useState(initialData);
  const [allPrescriptions, setAllPrescriptions] = useState(prescriptions);

  const handleDelete = async (prescriptionId) => {
    if (confirm("Are you sure you want to delete this prescription?")) {
      try {
        // Optimistic UI update
        setAllPrescriptions((prev) =>
          prev.filter((p) => p.id !== prescriptionId)
        );

        await fetch(`/api/prescription/${prescriptionId}`, {
          method: "DELETE",
        });

        // Background refresh to ensure sync
        const res = await fetch(`/api/patients/${patient.id}/prescriptions`);
        const newData = await res.json();
        setAllPrescriptions(newData);
        alert("Deleted successfully");
      } catch (error) {
        // Rollback on error
        const res = await fetch(`/api/patients/${patient.id}/prescriptions`);
        const newData = await res.json();
        setAllPrescriptions(newData);
        alert("Delete failed: " + error.message);
      }
    }
  };

  return (
    <div>
      <div className="px-6  max-w-7xl mx-auto">
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
                <p>{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p>{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p>{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Marital Status</p>
                <p>{patient.maritalStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Occupation</p>
                <p>{patient.occupation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">District</p>
                <p>{patient.district}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ref By</p>
                <p>{patient.refBy}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 gap-4">
            {/* Previous Prescriptions Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">
                Previous Prescriptions
              </h2>
              {allPrescriptions.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No prescriptions registered yet
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600 text-sm border-b">
                      <th className="pb-2 font-normal">Date</th>
                      <th className="pb-2 font-normal">Doctor</th>
                      <th className="pb-2 font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPrescriptions?.map((prescription, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3">
                          {new Date(
                            prescription.dateCreated
                          ).toLocaleDateString()}
                        </td>
                        <td className="py-3">{prescription.doctorId}</td>
                        <td className="py-3 flex gap-2">
                          <Link
                            href={`/doctor/prescribe/edit/${prescription.id}`}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-600 border border-gray-200 rounded-md hover:bg-indigo-50"
                          >
                            Edit
                            <FiEdit />
                          </Link>
                          <button
                            onClick={() => handlePrint(prescription.id)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50"
                          >
                            Print
                            <FiPrinter />
                          </button>
                          <button
                            onClick={() => handleDelete(prescription.id)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 border border-gray-200 rounded-md hover:bg-red-50"
                          >
                            Delete
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Medical Notes Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Medical Notes</h2>
              {patient.notes?.length > 0 ? (
                <div className="space-y-4">
                  {patient.notes?.map((note, index) => (
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
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No notes yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
