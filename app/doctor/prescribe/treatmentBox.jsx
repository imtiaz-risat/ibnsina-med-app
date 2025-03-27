"use client";

import { useState, useEffect } from "react";
import { FiCheck } from "react-icons/fi";

// Treatment suggestions
const suggestions = {
  drugName: [
    "Paracetamol",
    "Amoxicillin",
    "Omeprazole",
    "Metformin",
    "Amlodipine",
    "Losartan",
    "Ibuprofen",
    "Cetirizine",
    "Azithromycin",
    "Pantoprazole",
  ],
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
      className="flex items-center justify-between bg-blue-500 text-white p-2 rounded-t-md cursor-pointer group"
    >
      <h2 className="text-sm font-medium">
        {title}
        {itemCount > 0 && ` (${itemCount})`}
      </h2>
      <div className="flex items-center gap-1">
        <span className="transition-transform duration-200 group-hover:scale-110">
          {isExpanded ? "−" : "+"}
        </span>
      </div>
    </div>
  );
}

function TreatmentInput({ onAdd }) {
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
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-md shadow-lg max-h-32 overflow-y-auto z-10">
        {filteredSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setValue(suggestion);
              setShowSuggestions((prev) => ({ ...prev, [field]: false }));
            }}
            className="w-full px-2 py-1 text-sm text-left hover:bg-blue-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-2 mb-2">
      <div className="grid grid-cols-4 gap-2">
        <div className="relative">
          <input
            type="text"
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
            onFocus={() =>
              setShowSuggestions((prev) => ({ ...prev, drugName: true }))
            }
            onBlur={() =>
              setTimeout(
                () =>
                  setShowSuggestions((prev) => ({ ...prev, drugName: false })),
                200
              )
            }
            placeholder="Drug name"
            className="w-full px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-blue-500 outline-none"
          />
          {renderSuggestionsList("drugName", drugName, setDrugName)}
        </div>
        <div className="relative">
          <input
            type="text"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            onFocus={() =>
              setShowSuggestions((prev) => ({ ...prev, dose: true }))
            }
            onBlur={() =>
              setTimeout(
                () => setShowSuggestions((prev) => ({ ...prev, dose: false })),
                200
              )
            }
            placeholder="Dose"
            className="w-full px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-blue-500 outline-none"
          />
          {renderSuggestionsList("dose", dose, setDose)}
        </div>
        <div className="relative">
          <input
            type="text"
            value={rule}
            onChange={(e) => setRule(e.target.value)}
            onFocus={() =>
              setShowSuggestions((prev) => ({ ...prev, rule: true }))
            }
            onBlur={() =>
              setTimeout(
                () => setShowSuggestions((prev) => ({ ...prev, rule: false })),
                200
              )
            }
            placeholder="Rule"
            className="w-full px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-blue-500 outline-none"
          />
          {renderSuggestionsList("rule", rule, setRule)}
        </div>
        <div className="relative">
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            onFocus={() =>
              setShowSuggestions((prev) => ({ ...prev, duration: true }))
            }
            onBlur={() =>
              setTimeout(
                () =>
                  setShowSuggestions((prev) => ({ ...prev, duration: false })),
                200
              )
            }
            placeholder="Duration"
            className="w-full px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-blue-500 outline-none"
          />
          {renderSuggestionsList("duration", duration, setDuration)}
        </div>
      </div>
      <button
        onClick={handleAdd}
        disabled={
          !drugName.trim() || !dose.trim() || !rule.trim() || !duration.trim()
        }
        className="w-full px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        Add Treatment
      </button>
    </div>
  );
}

function TreatmentList({ items, onEdit, onDelete }) {
  return (
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
      <div className="p-2 bg-blue-50 rounded-md space-y-2">
        <div className="grid grid-cols-4 gap-2">
          <input
            type="text"
            value={editedItem.drugName}
            onChange={(e) =>
              setEditedItem({ ...editedItem, drugName: e.target.value })
            }
            placeholder="Drug name"
            className="px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            value={editedItem.dose}
            onChange={(e) =>
              setEditedItem({ ...editedItem, dose: e.target.value })
            }
            placeholder="Dose"
            className="px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            value={editedItem.rule}
            onChange={(e) =>
              setEditedItem({ ...editedItem, rule: e.target.value })
            }
            placeholder="Rule"
            className="px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            value={editedItem.duration}
            onChange={(e) =>
              setEditedItem({ ...editedItem, duration: e.target.value })
            }
            placeholder="Duration"
            className="px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-blue-500 outline-none"
          />
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
            className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            <FiCheck className="w-3.5 h-3.5" />
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md group">
      <div className="grid grid-cols-4 gap-2 flex-1">
        <span className="text-sm">{item.drugName}</span>
        <span className="text-sm">{item.dose}</span>
        <span className="text-sm">{item.rule}</span>
        <span className="text-sm">{item.duration}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsEditing(true)}
          className="px-2 py-1 text-xs border border-blue-200 rounded-md hover:bg-blue-100 mr-1"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-2 py-1 text-xs text-red-600 border border-blue-200 rounded-md hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function TreatmentBox({ initialItems = [], onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [items, setItems] = useState(initialItems);

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
    <div className="border border-blue-200 rounded-md">
      <SectionHeader
        onToggle={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
        itemCount={items.length}
      />
      {isExpanded && (
        <div className="p-2 border-t border-blue-200">
          <TreatmentInput onAdd={handleAdd} />
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
