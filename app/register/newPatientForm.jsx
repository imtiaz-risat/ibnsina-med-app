"use client";
import { useState } from "react";

const NewPatientForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "Male",
    maritalStatus: "Single",
    district: "",
    occupation: "",
    refBy: "",
    phone: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Register New Patient
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Fill in the details below to add a new patient
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Date of Birth */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter patient name"
                required
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Gender and Marital Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="maritalStatus"
                className="block text-sm font-medium text-gray-700"
              >
                Marital Status
              </label>
              <select
                name="maritalStatus"
                id="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>
          </div>

          {/* District and Occupation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700"
              >
                District
              </label>
              <input
                type="text"
                name="district"
                id="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter district"
                required
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium text-gray-700"
              >
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                id="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Enter occupation"
                required
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Referred By and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="refBy"
                className="block text-sm font-medium text-gray-700"
              >
                Referred By
              </label>
              <input
                type="text"
                name="refBy"
                id="refBy"
                value={formData.refBy}
                onChange={handleChange}
                placeholder="Enter reference"
                required
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700"
            >
              Note
            </label>
            <textarea
              name="note"
              id="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Add any additional notes"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Patient
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPatientForm;
