"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  LuUser,
  LuX,
  LuCheck,
  LuMail,
  LuPhone,
  LuMapPin,
  LuSave,
  LuLoader,
  LuAlertCircle,
  LuShield,
  LuCreditCard,
} from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";

export default function DoctorProfilePage() {
  const { data: session, status } = useSession();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    async function fetchDoctorData() {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/doctor/${session.user.id}`);

          if (!response.ok) {
            throw new Error("Failed to fetch doctor data");
          }

          const data = await response.json();
          setDoctor(data);

          // Initialize form data with current values
          setFormData({
            firstname: data.firstname || "",
            lastname: data.lastname || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        } catch (err) {
          console.error("Error fetching doctor data:", err);
          setError(err.message);
          toast.error("Error loading profile: " + err.message);
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setLoading(false);
        setError("You must be logged in to view this page");
        toast.error("You must be logged in to view this page");
      }
    }

    fetchDoctorData();
  }, [session, status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.id) {
      setError("User ID not found in session");
      toast.error("User ID not found in session");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/doctor/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedDoctor = await response.json();
      setDoctor(updatedDoctor);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
      toast.error("Error updating profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    // Reset form data to original values
    setFormData({
      firstname: doctor.firstname || "",
      lastname: doctor.lastname || "",
      phone: doctor.phone || "",
      address: doctor.address || "",
    });
    setIsEditing(false);
    setError(null);
  };

  if (status === "loading" || (loading && !isEditing)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <LuLoader className="w-12 h-12 animate-spin text-blue-600" />
        <p className="mt-4 text-xl font-semibold text-gray-700">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
          <LuAlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-xl font-semibold text-red-600 text-center">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
          <LuAlertCircle className="w-16 h-16 text-amber-500 mb-4" />
          <p className="text-xl font-semibold text-gray-700 text-center">
            Doctor profile not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />

      {/* Header with Doctor Info and Action Button */}
      <div className="mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mr-4 border-2 border-gray-200">
              <LuUser className="w-10 h-10 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Dr. {doctor.firstname} {doctor.lastname}
              </h1>
              <div className="flex items-center mt-1 text-gray-600">
                <LuShield className="w-4 h-4 mr-2" />
                <span className="text-sm flex items-center gap-1">
                  ID:{" "}
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                    {doctor.id}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <MdEdit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
              >
                <LuX className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                form="profileForm"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center justify-center shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LuLoader className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <LuSave className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto">
        {isEditing ? (
          <form id="profileForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information - First Column */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center">
                  <LuUser className="mr-2 text-blue-600" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-28 flex items-center">
                        <LuCreditCard className="mr-2 text-blue-500 flex-shrink-0" />
                        Username:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {doctor.username}
                      </span>
                    </div>
                    <div className="flex items-center mt-3">
                      <span className="font-medium text-gray-700 w-28 flex items-center">
                        <LuUser className="mr-2 text-blue-500 flex-shrink-0" />
                        Gender:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {doctor.gender}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information - Second Column */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center">
                  <LuPhone className="mr-2 text-blue-600" />
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="5"
                      className="block w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center">
                <LuUser className="mr-2 text-blue-600" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700 w-40 flex items-center mb-1 md:mb-0">
                    <LuUser className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                    First Name
                  </span>
                  <span className="text-gray-900 font-medium">
                    {doctor.firstname}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700 w-40 flex items-center mb-1 md:mb-0">
                    <LuUser className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                    Last Name
                  </span>
                  <span className="text-gray-900 font-medium">
                    {doctor.lastname}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700 w-40 flex items-center mb-1 md:mb-0">
                    <LuCreditCard className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                    Username
                  </span>
                  <span className="text-gray-900 font-medium">
                    {doctor.username}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700 w-40 flex items-center mb-1 md:mb-0">
                    <LuUser className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                    Gender
                  </span>
                  <span className="text-gray-900 font-medium">
                    {doctor.gender}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center">
                <LuPhone className="mr-2 text-blue-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700 w-40 flex items-center mb-1 md:mb-0">
                    <LuPhone className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                    Phone
                  </span>
                  <span className="text-gray-900 font-medium">
                    {doctor.phone || "Not provided"}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700 w-40 flex items-start mb-1 md:mb-0 pt-1">
                    <LuMapPin className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                    Address
                  </span>
                  <span className="text-gray-900 font-medium">
                    {doctor.address || "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
