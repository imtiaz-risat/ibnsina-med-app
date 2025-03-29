"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditDoctorPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "", // Empty by default, will only be sent if filled
    gender: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch doctor data
  useEffect(() => {
    async function fetchDoctor() {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/doctors/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch doctor data");
        }

        const doctorData = await response.json();
        setFormData({
          firstname: doctorData.firstname,
          lastname: doctorData.lastname,
          username: doctorData.username,
          password: "", // Don't show password
          gender: doctorData.gender,
          phone: doctorData.phone,
          address: doctorData.address,
        });
        setError(null);
      } catch (error) {
        setError(error.message);
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    }

    fetchDoctor();
  }, [id]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      // Remove password field if it's empty
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      const response = await fetch(`/api/admin/doctors/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update doctor");
      }

      showToast("Doctor updated successfully");

      // Clear password field after successful update
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    } catch (error) {
      setError(error.message);
      showToast(error.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading doctor data...</div>;
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
        <h1 className="text-2xl font-bold">Edit Doctor</h1>
        <Link
          href="/admin/doctor-list"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Back to List
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name *
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password (Leave empty to keep current)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Leave empty to keep current password"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ${
                updating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Updating..." : "Update Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
