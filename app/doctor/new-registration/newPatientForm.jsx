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
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Register New Patient
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Fill in the details below to add a new patient
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 sm:gap-8">
          {/* Name and Date of Birth */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="peer w-full border px-2 border-gray-300 placeholder-transparent   transition-colors bg-transparent py-2.5"
                placeholder="Patient Name"
              />
              <label
                htmlFor="name"
                className="absolute left-3 -top-3 text-sm text-gray-600 bg-white px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Patient Name
              </label>
            </div>

            <div className="relative">
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="peer w-full border px-2 border-gray-300 placeholder-transparent   transition-colors bg-transparent py-2.5"
              />
              <label
                htmlFor="dateOfBirth"
                className="absolute left-3 -top-3 text-sm text-gray-600 bg-white px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Date of Birth
              </label>
            </div>
          </div>

          {/* Gender and Marital Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 px-2   transition-colors bg-transparent py-2.5 appearance-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <label
                htmlFor="gender"
                className="absolute left-3 -top-3 text-sm text-gray-600 bg-white px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Gender
              </label>
            </div>

            <div className="relative">
              <select
                name="maritalStatus"
                id="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full border border-gray-300 px-2   transition-colors bg-transparent py-2.5 appearance-none cursor-pointer"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              <label
                htmlFor="maritalStatus"
                className="absolute left-3 -top-3 text-sm text-gray-600 bg-white px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Marital Status
              </label>
            </div>
          </div>

          {/* District and Occupation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                name="district"
                id="district"
                value={formData.district}
                onChange={handleChange}
                required
                className=" peer w-full border px-2 border-gray-300 placeholder-transparent transition-colors bg-transparent py-2.5"
                placeholder="District"
              />
              <label
                htmlFor="district"
                className="absolute left-3 -top-3 text-sm text-gray-600 bg-white px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600"
              >
                District
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                name="occupation"
                id="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
                className="peer w-full border px-2 border-gray-300 placeholder-transparent transition-colors bg-transparent py-2.5"
                placeholder="Occupation"
              />
              <label
                htmlFor="occupation"
                className="absolute left-3 -top-3 text-sm text-gray-600 bg-white px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Occupation
              </label>
            </div>
          </div>

          {/* Reference By and Phone */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                name="refBy"
                id="refBy"
                value={formData.refBy}
                onChange={handleChange}
                className="peer w-full border px-2 border-gray-300 placeholder-transparent   transition-colors bg-transparent py-2.5"
                placeholder="Referred By"
              />
              <label
                htmlFor="refBy"
                className="absolute left-3 -top-3 text-sm text-gray-600 bg-white px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Referred By
              </label>
            </div>

            <div className="relative">
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="peer w-full border px-2 border-gray-300 placeholder-transparent   transition-colors bg-transparent py-2.5"
                placeholder="Phone Number"
              />
              <label
                htmlFor="phone"
                className="absolute left-3 -top-3 text-sm text-gray-600 bg-white px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Phone Number
              </label>
            </div>
          </div>

          {/* Note */}
          <div className="relative">
            <textarea
              name="note"
              id="note"
              value={formData.note}
              onChange={handleChange}
              rows="4"
              className="peer w-full border border-gray-300 placeholder-transparent   transition-colors bg-transparent p-4 resize-none"
              placeholder="Additional Notes"
            ></textarea>
            <label
              htmlFor="note"
              className="absolute left-3 -top-3 text-sm text-gray-600 bg-white px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Additional Notes
            </label>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
            >
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPatientForm;
