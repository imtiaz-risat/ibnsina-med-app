"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, X, Filter, CheckSquare } from "lucide-react";

export function FilterSidebar({
  filterOptions,
  selectedFilters,
  onFilterChange,
}) {
  const [expandedSections, setExpandedSections] = useState(new Set(["gender"]));

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleCheckboxChange = (section, optionId) => {
    const currentFilters = selectedFilters[section] || [];
    const newFilters = currentFilters.includes(optionId)
      ? currentFilters.filter((id) => id !== optionId)
      : [...currentFilters, optionId];
    onFilterChange(section, newFilters);
  };

  const clearAllFilters = () => {
    Object.keys(filterOptions).forEach((section) => {
      onFilterChange(section, []);
    });
  };

  const getSelectedCount = () => {
    return Object.values(selectedFilters).reduce(
      (acc, curr) => acc + curr.length,
      0
    );
  };

  const selectedCount = getSelectedCount();

  return (
    <div className="w-full h-full md:h-auto bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-900" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {selectedCount > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
              {selectedCount}
            </span>
          )}
        </div>
        {selectedCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Clear all
            <X className="w-3.5 h-3.5 ml-1" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {Object.entries(filterOptions).map(([sectionId, section]) => (
          <div
            key={sectionId}
            className="border border-gray-100 rounded-md overflow-hidden bg-white"
          >
            <button
              onClick={() => toggleSection(sectionId)}
              className="flex justify-between items-center w-full px-4 py-3 text-left font-medium bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm text-gray-800">{section.title}</span>
              {expandedSections.has(sectionId) ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {expandedSections.has(sectionId) && (
              <div className="p-3 space-y-2 bg-white max-h-[250px] overflow-y-auto">
                {section.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedFilters[sectionId]?.includes(option.id) || false
                      }
                      onChange={() =>
                        handleCheckboxChange(sectionId, option.id)
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-sm text-gray-700">
                        {option.label}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          selectedFilters[sectionId]?.includes(option.id)
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {option.count}
                      </span>
                    </div>
                  </label>
                ))}
                {section.options.length === 0 && (
                  <div className="text-sm text-gray-500 py-2 text-center">
                    No options available
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
