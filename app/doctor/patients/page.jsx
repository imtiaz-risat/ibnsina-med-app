"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { LiaFilePrescriptionSolid } from "react-icons/lia";
import { Filter } from "lucide-react";
import { SearchBox } from "./searchBox";
import { Pagination } from "./pagination";
import { FilterSidebar } from "./filterSidebar";
import { presetsToFilterOptions, updateFilterOptionsCounts, filterPatients } from "./utils/presetsToFilterOptions";

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
        const presetsRes = await fetch("/api/presets");
        if (!presetsRes.ok) {
          throw new Error("Failed to fetch presets");
        }
        const presetsData = await presetsRes.json();
        
        // Fetch patients with prescriptions
        const patientsRes = await fetch("/api/patients/withPrescriptions");
        if (!patientsRes.ok) {
          throw new Error("Failed to fetch patients with prescriptions");
        }
        const patientsData = await patientsRes.json();
        
        // Convert presets to filter options format
        const initialFilterOptions = presetsToFilterOptions(presetsData);
        
        // Update filter options with counts based on patient data
        const updatedFilterOptions = updateFilterOptionsCounts(initialFilterOptions, patientsData);
        
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
    return <div>Loading patients...</div>;
  }

  if (error) {
    return <div>Error loading patients: {error.message}</div>;
  }

  const handleFilterChange = (section, values) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [section]: values,
    }));
    setCurrentPage(1);
  };

  // Filter patients using the utility function
  const filteredPatients = filterPatients(patients, selectedFilters, searchQuery);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPatients.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedPatients = filteredPatients.slice(
    startIndex,
    startIndex + perPage
  );

  return (
    <div className="container w-full mx-auto">
      <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center gap-4 sm:gap-20 mb-4">
        <div className="flex items-center gap-2">
          {/* <FiUsers className="w-5 h-5 text-black hidden md:block" /> */}
          <h1 className="text-2xl font-bold text-black text-nowrap">
            Registered Patients
          </h1>
        </div>

        <div className="w-full flex items-center gap-2 ">
          <button
            className="md:hidden text-gray-600 hover:text-gray-800"
            onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
          >
            <div className="flex items-center gap-1">
              <div className="text-sm font-medium">Filters</div>
              <Filter />
            </div>
          </button>
          <SearchBox onSearch={setSearchQuery} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 overflow-x-auto ">
          <table className="min-w-full bg-white border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-100  text-nowrap">
                <th className="py-2 px-4 border-b text-left font-medium text-sm">
                  ID
                </th>
                <th className="py-2 px-4 border-b text-left font-medium text-sm">
                  Name
                </th>
                <th className="py-2 px-4 border-b text-left font-medium text-sm">
                  Gender
                </th>
                <th className="py-2 px-4 border-b text-left font-medium text-sm">
                  Date of Birth
                </th>
                <th className="py-2 px-4 border-b text-left font-medium text-sm">
                  Phone
                </th>
                <th className="py-2 px-4 border-b text-left font-medium text-sm">
                  Note
                </th>
                <th className="py-2 px-4 border-b text-left font-medium text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 text-sm">
                  <td className="py-2 px-4 border-b">{patient.id}</td>
                  <td className="py-2 px-4 border-b text-nowrap">
                    {patient.name}
                  </td>
                  <td className="py-2 px-4 border-b">{patient.gender}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{patient.phone}</td>
                  <td className="py-2 px-4 border-b text-ellipsis">
                    {patient.note || "-"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/doctor/prescribe/${patient.id}`}
                        className="flex items-center gap-1 text-nowrap px-2 py-1 text-xs text-blue-600 border border-gray-200 rounded-md hover:bg-blue-50"
                      >
                        New Prescription
                        <LiaFilePrescriptionSolid />
                      </Link>
                      <Link
                        href={`/doctor/patients/${patient.id}`}
                        className="flex items-center gap-1 text-nowrap px-2 py-1 text-xs text-green-600 border border-gray-200 rounded-md hover:bg-green-50"
                      >
                        View Profile
                        <FiEye />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="my-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onPerPageChange={setPerPage}
              perPage={perPage}
            />
          </div>
        </div>

        <div
          className={`fixed inset-y-0 right-0 transition-transform transform overflow-y-auto ${
            isFilterSidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:static md:translate-x-0 w-64 md:w-64`}
        >
          <FilterSidebar
            filterOptions={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );
}
