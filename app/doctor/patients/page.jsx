"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiEye, FiUsers } from "react-icons/fi";
import { LiaFilePrescriptionSolid } from "react-icons/lia";
import { Filter } from "lucide-react";
import { SearchBox } from "./searchBox";
import { Pagination } from "./pagination";
import { FilterSidebar } from "./filterSidebar";
import {
  presetsToFilterOptions,
  updateFilterOptionsCounts,
  filterPatients,
} from "./utils/presetsToFilterOptions";

export default function PatientList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const [patients, setPatients] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch presets and patients with prescriptions
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch presets
        let presetsData = null;
        try {
          const presetsRes = await fetch("/api/presets");
          if (presetsRes.ok) {
            presetsData = await presetsRes.json();
          } else {
            console.warn("Could not fetch presets, using default filters");
          }
        } catch (presetsError) {
          console.warn(
            "Error fetching presets, using default filters:",
            presetsError
          );
        }

        // Fetch patients with prescriptions
        const patientsRes = await fetch("/api/patients/withPrescriptions");
        if (!patientsRes.ok) {
          throw new Error("Failed to fetch patients with prescriptions");
        }
        const patientsData = await patientsRes.json();

        // Convert presets to filter options format
        const initialFilterOptions = presetsToFilterOptions(presetsData);

        // Update filter options with counts based on patient data
        const updatedFilterOptions = updateFilterOptionsCounts(
          initialFilterOptions,
          patientsData
        );

        setFilterOptions(updatedFilterOptions);
        setPatients(patientsData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []); // Empty dependency array means this runs once on component mount

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading patients...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-center text-gray-900">
            Error Loading Patients
          </h3>
          <p className="mt-2 text-sm text-center text-gray-600">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  const handleFilterChange = (section, values) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [section]: values,
    }));
    setCurrentPage(1);
  };

  // Filter patients using the utility function
  const filteredPatients = filterPatients(
    patients,
    selectedFilters,
    searchQuery
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredPatients.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedPatients = filteredPatients.slice(
    startIndex,
    startIndex + perPage
  );

  return (
    <div className="container w-full mx-auto px-4 py-6">
      <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center gap-4 sm:gap-20 mb-6">
        <div className="flex items-center gap-2">
          <FiUsers className="w-6 h-6 text-gray-900 hidden md:block" />
          <h1 className="text-2xl font-bold text-gray-900 text-nowrap">
            Registered Patients
          </h1>
        </div>

        <div className="w-full flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
          >
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </button>
          <SearchBox onSearch={setSearchQuery} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 overflow-hidden rounded-lg shadow-sm">
          <div className="bg-white p-1 sm:p-2 rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                      ID
                    </th>
                    <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note
                    </th>
                    <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPatients.length > 0 ? (
                    paginatedPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          #{patient.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium text-nowrap">
                          {patient.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              patient.gender === "Male"
                                ? "bg-blue-100 text-blue-800"
                                : patient.gender === "Female"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {patient.gender}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(patient.dateOfBirth).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {patient.phone}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 max-w-[150px] truncate">
                          {patient.note || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/doctor/prescribe/${patient.id}`}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              <LiaFilePrescriptionSolid className="w-3.5 h-3.5" />
                              <span>Prescribe</span>
                            </Link>
                            <Link
                              href={`/doctor/patients/${patient.id}`}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-100 rounded-md hover:bg-green-100 transition-colors"
                            >
                              <FiEye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <span className="text-lg font-medium">
                            {searchQuery
                              ? "No patients match your search criteria"
                              : "No patients found"}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {searchQuery || selectedFilters
                              ? "Try adjusting your search or filters"
                              : "Register new patients to get started"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 mb-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onPerPageChange={setPerPage}
                perPage={perPage}
              />
            </div>
          </div>
        </div>

        <div
          className={`fixed inset-y-0 right-0 z-30 transition-transform transform overflow-y-auto ${
            isFilterSidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:static md:translate-x-0 w-72 md:w-64 md:flex-shrink-0`}
        >
          <div className="h-full md:h-auto">
            <FilterSidebar
              filterOptions={filterOptions}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
