"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LuUser, LuLoader2, LuX, LuCheck, LuAlertCircle } from "react-icons/lu";

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
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setLoading(false);
        setError("You must be logged in to view this page");
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
      setSuccessMessage("Profile updated successfully!");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* <LuLoader2 className="w-10 h-10 animate-spin text-blue-600" /> */}
        <p className="mt-4 text-xl font-semibold">Loading profile...</p>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-semibold">Doctor profile not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex items-center">
            <LuCheck className="mr-2" />
            {successMessage}
          </div>
        )}

        {error && isEditing && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center">
            <LuAlertCircle className="mr-2" />
            {error}
          </div>
        )}

        <div className="flex items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mr-6">
            <LuUser className="w-12 h-12 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Dr. {doctor.firstname} {doctor.lastname}
            </h1>
            <p className="text-gray-600">ID: {doctor.id}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Personal Information
                  </h2>
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Username:</span>
                      <span>{doctor.username}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Gender:</span>
                      <span>{doctor.gender}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Contact Information</h2>
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    {/* <LuLoader2 className="animate-spin mr-2" /> */}
                    Saving...
                  </>
                ) : (
                  <>
                    <LuCheck className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded flex items-center"
              >
                <LuX className="mr-2" />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Personal Information
                  </h2>
                  <div className="mt-2 space-y-2">
                    <div className="flex">
                      <span className="font-medium w-32">First Name:</span>
                      <span>{doctor.firstname}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Last Name:</span>
                      <span>{doctor.lastname}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Username:</span>
                      <span>{doctor.username}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Gender:</span>
                      <span>{doctor.gender}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Contact Information</h2>
                  <div className="mt-2 space-y-2">
                    <div className="flex">
                      <span className="font-medium w-32">Phone:</span>
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Address:</span>
                      <span>{doctor.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
