"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Edit2,
  Trash2,
  Save,
  Check,
} from "lucide-react";

// Default suggestions for treatment
const defaultSuggestions = {
  dose: [
    "500mg",
    "250mg",
    "100mg",
    "1000mg",
    "5mg",
    "50mg",
    "10mg",
    "20mg",
    "25mg",
    "750mg",
  ],
  rule: [
    "1+0+1",
    "1+1+1",
    "0+0+1",
    "1+0+0",
    "1+1+0",
    "0+1+0",
    "0+1+1",
    "1+1+1+1",
    "1 daily",
    "2 daily",
  ],
  duration: [
    "7 days",
    "10 days",
    "14 days",
    "1 month",
    "2 months",
    "3 months",
    "5 days",
    "3 days",
    "Continue",
    "Until next visit",
  ],
};

function SectionHeader({
  title = "Treatments",
  onToggle,
  isExpanded,
  itemCount,
}) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-t-md cursor-pointer group shadow-sm"
    >
      <h2 className="text-sm font-medium flex items-center">
        {title}
        {itemCount > 0 && (
          <span className="ml-2 bg-white bg-opacity-20 text-white text-xs px-2 py-0.5 rounded-full">
            {itemCount}
          </span>
        )}
      </h2>
      <div className="flex items-center gap-1">
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
        ) : (
          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
        )}
      </div>
    </div>
  );
}

function TreatmentInput({ onAdd, suggestions }) {
  const [drugName, setDrugName] = useState("");
  const [dose, setDose] = useState("");
  const [rule, setRule] = useState("");
  const [duration, setDuration] = useState("");
  const [showSuggestions, setShowSuggestions] = useState({
    drugName: false,
    dose: false,
    rule: false,
    duration: false,
  });

  // Add refs for each suggestion dropdown
  const suggestionRefs = {
    drugName: useRef(null),
    dose: useRef(null),
    rule: useRef(null),
    duration: useRef(null),
  };

  // Handle outside clicks for all suggestion dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      const newState = { ...showSuggestions };
      let changed = false;

      Object.keys(suggestionRefs).forEach((field) => {
        if (
          showSuggestions[field] &&
          suggestionRefs[field].current &&
          !suggestionRefs[field].current.contains(event.target)
        ) {
          newState[field] = false;
          changed = true;
        }
      });

      if (changed) {
        setShowSuggestions(newState);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);

  const handleAdd = () => {
    if (drugName.trim() && dose.trim() && rule.trim() && duration.trim()) {
      onAdd({
        drugName: drugName.trim(),
        dose: dose.trim(),
        rule: rule.trim(),
        duration: duration.trim(),
      });
      setDrugName("");
      setDose("");
      setRule("");
      setDuration("");
    }
  };

  const getFilteredSuggestions = (field, value) => {
    return suggestions[field].filter((s) =>
      s.toLowerCase().includes(value.toLowerCase())
    );
  };

  const renderSuggestionsList = (field, value, setValue) => {
    const filteredSuggestions = getFilteredSuggestions(field, value);
    if (!showSuggestions[field] || filteredSuggestions.length === 0)
      return null;

    return (
      <div
        ref={suggestionRefs[field]}
        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-20"
      >
        {filteredSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setValue(suggestion);
              setShowSuggestions((prev) => ({ ...prev, [field]: false }));
            }}
            className="w-full px-3 py-2 text-sm text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
            Drug Name
          </label>
          <input
            type="text"
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
            onFocus={() =>
              setShowSuggestions((prev) => ({ ...prev, drugName: true }))
            }
            placeholder="Medication name"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
          />
          {renderSuggestionsList("drugName", drugName, setDrugName)}
        </div>
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
            Dose
          </label>
          <input
            type="text"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            onFocus={() =>
              setShowSuggestions((prev) => ({ ...prev, dose: true }))
            }
            placeholder="e.g., 500mg"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
          />
          {renderSuggestionsList("dose", dose, setDose)}
        </div>
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
            Rule
          </label>
          <input
            type="text"
            value={rule}
            onChange={(e) => setRule(e.target.value)}
            onFocus={() =>
              setShowSuggestions((prev) => ({ ...prev, rule: true }))
            }
            placeholder="e.g., 1+0+1"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
          />
          {renderSuggestionsList("rule", rule, setRule)}
        </div>
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
            Duration
          </label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            onFocus={() =>
              setShowSuggestions((prev) => ({ ...prev, duration: true }))
            }
            placeholder="e.g., 7 days"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
          />
          {renderSuggestionsList("duration", duration, setDuration)}
        </div>
      </div>
      <button
        onClick={handleAdd}
        disabled={
          !drugName.trim() || !dose.trim() || !rule.trim() || !duration.trim()
        }
        className="w-full px-4 py-2.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
      >
        <Plus className="w-4 h-4" />
        <span>Add Treatment</span>
      </button>
    </div>
  );
}

function TreatmentList({ items, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 italic text-sm border border-dashed border-gray-200 rounded-md">
        No treatments added yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3 px-3 py-2 bg-gray-50 rounded-t-md text-xs font-medium text-gray-600 uppercase tracking-wider border border-gray-200">
        <div>Drug Name</div>
        <div>Dose</div>
        <div>Rule</div>
        <div>Duration</div>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <TreatmentItem
            key={index}
            item={item}
            onEdit={(updatedItem) => onEdit(index, updatedItem)}
            onDelete={() => onDelete(index)}
          />
        ))}
      </div>
    </div>
  );
}

function TreatmentItem({ item, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleSave = () => {
    if (
      editedItem.drugName.trim() &&
      editedItem.dose.trim() &&
      editedItem.rule.trim() &&
      editedItem.duration.trim()
    ) {
      onEdit(editedItem);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-3 bg-blue-50 rounded-md space-y-3 border border-blue-100 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Drug Name
            </label>
            <input
              type="text"
              value={editedItem.drugName}
              onChange={(e) =>
                setEditedItem({ ...editedItem, drugName: e.target.value })
              }
              placeholder="Drug name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Dose
            </label>
            <input
              type="text"
              value={editedItem.dose}
              onChange={(e) =>
                setEditedItem({ ...editedItem, dose: e.target.value })
              }
              placeholder="Dose"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Rule
            </label>
            <input
              type="text"
              value={editedItem.rule}
              onChange={(e) =>
                setEditedItem({ ...editedItem, rule: e.target.value })
              }
              placeholder="Rule"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Duration
            </label>
            <input
              type="text"
              value={editedItem.duration}
              onChange={(e) =>
                setEditedItem({ ...editedItem, duration: e.target.value })
              }
              placeholder="Duration"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={
              !editedItem.drugName.trim() ||
              !editedItem.dose.trim() ||
              !editedItem.rule.trim() ||
              !editedItem.duration.trim()
            }
            className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm border border-gray-100 hover:border-gray-200 transition-colors group">
      <div className="grid grid-cols-4 gap-3 flex-1">
        <div>
          <span className="text-sm font-medium text-gray-800">
            {item.drugName}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-600">{item.dose}</span>
        </div>
        <div>
          <span className="text-sm text-gray-600">{item.rule}</span>
        </div>
        <div>
          <span className="text-sm text-gray-600">{item.duration}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-blue-600 rounded hover:bg-blue-50 transition-colors"
          title="Edit treatment"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-red-600 rounded hover:bg-red-50 transition-colors"
          title="Delete treatment"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function TreatmentBox({
  initialItems = [],
  onUpdate,
  treatmentSuggestions = defaultSuggestions, // Add this prop with default value
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [items, setItems] = useState(initialItems);

  // Use the treatmentSuggestions prop or fall back to default
  const suggestions = {
    drugName: treatmentSuggestions,
    dose: defaultSuggestions.dose,
    rule: defaultSuggestions.rule,
    duration: defaultSuggestions.duration,
  };

  const handleAdd = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleEdit = (index, updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item, i) => (i === index ? updatedItem : item))
    );
  };

  const handleDelete = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // useEffect to send updates to parent component
  useEffect(() => {
    onUpdate(items);
  }, [items, onUpdate]);

  return (
    <div className="border border-gray-200 rounded-md shadow-sm mb-3">
      <SectionHeader
        onToggle={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
        itemCount={items.length}
      />
      {isExpanded && (
        <div className="p-3 border-t border-gray-200 bg-white">
          <TreatmentInput onAdd={handleAdd} suggestions={suggestions} />
          <TreatmentList
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

export default TreatmentBox;
