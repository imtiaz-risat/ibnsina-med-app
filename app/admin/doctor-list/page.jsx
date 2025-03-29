"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    doctorId: null,
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchDoctors();
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

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/doctors");
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      setDoctors(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const confirmDelete = (doctorId) => {
    setDeleteModal({ show: true, doctorId });
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, doctorId: null });
  };

  const deleteDoctor = async () => {
    try {
      const doctorId = deleteModal.doctorId;
      const response = await fetch(`/api/admin/doctors/${doctorId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }

      setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
      showToast("Doctor deleted successfully");
    } catch (error) {
      showToast("Failed to delete doctor", "error");
      console.error("Error deleting doctor:", error);
    } finally {
      setDeleteModal({ show: false, doctorId: null });
    }
  };

  if (loading) {
    return <div className="p-6">Loading doctors...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctor List</h1>
        <Link
          href="/admin/add-doctor"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add New Doctor
        </Link>
      </div>

      {doctors.length === 0 ? (
        <p className="text-gray-500">No doctors found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {doctor.firstname} {doctor.lastname}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/edit-doctor/${doctor.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => confirmDelete(doctor.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this doctor? This action cannot be
              undone.
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
                onClick={deleteDoctor}
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
