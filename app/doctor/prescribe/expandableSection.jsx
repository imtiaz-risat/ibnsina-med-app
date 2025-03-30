"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
} from "lucide-react";

function SectionHeader({ title, onToggle, isExpanded, itemCount }) {
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

function TopicInput({ suggestions, onAdd }) {
  const [topic, setTopic] = useState("");
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  const handleAdd = () => {
    if (topic.trim()) {
      onAdd(topic.trim(), value.trim());
      setTopic("");
      setValue("");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredSuggestions = topic
    ? suggestions.filter((s) => s.toLowerCase().includes(topic.toLowerCase()))
    : suggestions;

  return (
    <div className="flex flex-col sm:flex-row items-start gap-2 mb-3">
      <div className="relative flex-1 w-full">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Enter attribute"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute min-w-full top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-20"
            style={{ width: "auto", maxWidth: "250px" }}
          >
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setTopic(suggestion);
                  setShowSuggestions(false);
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 break-words"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative flex-1 w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value (optional)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
        />
      </div>
      <button
        onClick={handleAdd}
        disabled={!topic.trim()}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1 shadow-sm self-stretch"
      >
        <Plus className="w-4 h-4" />
        <span>Add</span>
      </button>
    </div>
  );
}

function TopicListItem({ id, topic, value, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTopic, setEditedTopic] = useState(topic);
  const [editedValue, setEditedValue] = useState(value);

  const handleSave = () => {
    onEdit(id, editedTopic, editedValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 p-3 bg-blue-50 rounded-md mb-2 shadow-sm border border-blue-100 max-w-full overflow-hidden">
        <input
          type="text"
          value={editedTopic}
          onChange={(e) => setEditedTopic(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
        <input
          type="text"
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
        <div className="flex flex-wrap gap-2 mt-1">
          <button
            onClick={handleSave}
            className="px-3 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
          >
            <Save className="w-3 h-3" />
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-2 text-xs border border-gray-300 bg-white rounded-md hover:bg-gray-50 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-md group mb-1.5 border border-gray-100 transition-colors">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-800 truncate">
            {topic}
          </span>
        </div>
        <span className="text-sm text-gray-500 mt-0.5 truncate">{value}</span>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-blue-600 rounded hover:bg-blue-50 transition-colors mr-1"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-1.5 text-red-600 rounded hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function TopicList({ items, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 italic text-sm">
        No items added yet
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {items.map((item, index) => (
        <TopicListItem
          key={index}
          id={index}
          topic={item.topic}
          value={item.value}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export function ExpandableSection({
  title,
  initialItems = [],
  defaultExpanded = false,
  suggestions = [],
  sectionKey, // New prop to identify section
  onUpdate, // New prop to send data back
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [items, setItems] = useState(initialItems);

  const handleAdd = (topic, value) => {
    setItems((prevItems) => [...prevItems, { topic, value }]);
  };

  const handleEdit = (id, topic, value) => {
    setItems((prevItems) =>
      prevItems.map((item, i) => (i === id ? { ...item, topic, value } : item))
    );
  };

  const handleDelete = (id) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== id));
  };

  // useEffect to send updates to parent component
  useEffect(() => {
    onUpdate && onUpdate(items);
  }, [items, onUpdate]);

  return (
    <div className="border border-gray-200 rounded-md shadow-sm mb-3">
      <SectionHeader
        title={title}
        onToggle={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
        itemCount={items.length}
      />
      {isExpanded && (
        <div className="p-3 border-t border-gray-200 bg-white">
          <TopicInput suggestions={suggestions} onAdd={handleAdd} />
          <div className="overflow-x-auto">
            <TopicList
              items={items}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
}
