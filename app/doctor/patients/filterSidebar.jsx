"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, X, Filter } from "lucide-react";

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

  return (
    <div className="w-full md:w-64 bg-white p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-900" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        {getSelectedCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Clear all
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(filterOptions).map(([sectionId, section]) => (
          <div key={sectionId} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection(sectionId)}
              className="flex justify-between items-center w-full py-2 text-left font-medium"
            >
              <span>{section.title}</span>
              {expandedSections.has(sectionId) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {expandedSections.has(sectionId) && (
              <div className="mt-2 space-y-2">
                {section.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedFilters[sectionId]?.includes(option.id) || false
                      }
                      onChange={() =>
                        handleCheckboxChange(sectionId, option.id)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      {option.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({option.count})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
