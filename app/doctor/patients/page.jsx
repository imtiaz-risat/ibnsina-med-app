"use client";

import { useState } from "react";
import { FiUsers } from "react-icons/fi";
import { LiaFilePrescriptionSolid } from "react-icons/lia";
import { RiFolderUserLine } from "react-icons/ri";
import { SearchBox } from "./searchBox";
import { Pagination } from "./pagination";
import { patients } from "./mockPatient";
import { FilterSidebar } from "./filterSidebar";
import { filterOptions } from "./mockFilterOptions";

export default function PatientList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (section, values) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [section]: values,
    }));
    setCurrentPage(1);
  };

  // Filter and sort patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Add more complex filtering logic here based on selectedFilters
    const matchesGender =
      !selectedFilters.gender?.length ||
      selectedFilters.gender.includes(patient.gender.toLowerCase());

    return matchesSearch && matchesGender;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPatients.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedPatients = filteredPatients.slice(
    startIndex,
    startIndex + perPage
  );

  return (
    <div className="container w-full mx-auto">
      <div className="flex flex-col items-start justify-between md:flex-row gap-6 mb-4">
        <div className="flex items-center gap-2">
          <FiUsers className="w-5 h-5 text-black" />
          <h1 className="text-2xl font-bold text-black">Registered Patients</h1>
        </div>

        <SearchBox onSearch={setSearchQuery} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
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
                  <td className="py-2 px-4 border-b">{patient.name}</td>
                  <td className="py-2 px-4 border-b">{patient.gender}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{patient.phone}</td>
                  <td className="py-2 px-4 border-b">{patient.note || "-"}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded text-blue-500">
                        <LiaFilePrescriptionSolid className="h-6 w-6" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <RiFolderUserLine className="h-6 w-6" />
                      </button>
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

        <FilterSidebar
          filterOptions={filterOptions}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
}
