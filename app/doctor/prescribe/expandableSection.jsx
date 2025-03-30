"use client";

import { useState, useEffect, useRef } from "react";

function SectionHeader({ title, onToggle, isExpanded, itemCount }) {
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
    <div className="flex items-start gap-1 mb-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Enter attribute"
          className="w-full px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-black outline-none"
        />
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute w-fit top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-md shadow-lg max-h-32 overflow-y-auto z-10"
          >
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setTopic(suggestion);
                  setShowSuggestions(false);
                }}
                className="w-full px-2 py-1 text-sm text-left hover:bg-blue-50 whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value (optional)"
        className="flex-1 px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-black outline-none"
      />
      <button
        onClick={handleAdd}
        disabled={!topic.trim()}
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        Add
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
      <div className="flex items-center gap-1 p-1 bg-blue-50 rounded-md">
        <input
          type="text"
          value={editedTopic}
          onChange={(e) => setEditedTopic(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-black outline-none"
        />
        <input
          type="text"
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-black outline-none"
        />
        <button
          onClick={handleSave}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-800"
        >
          Save
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-2 py-1 text-xs border border-blue-200 rounded-md hover:bg-blue-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 hover:bg-blue-50 rounded-md group">
      <span className="flex-1 text-sm">{topic}</span>
      <span className="flex-1 text-sm">{value}</span>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="px-2 py-1 text-xs border border-blue-200 rounded-md hover:bg-blue-100 mr-1"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(id)}
          className="px-2 py-1 text-xs text-red-600 border border-blue-200 rounded-md hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function TopicList({ items, onEdit, onDelete }) {
  return (
    <div>
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
    <div className="border border-blue-200 rounded-md">
      <SectionHeader
        title={title}
        onToggle={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
        itemCount={items.length}
      />
      {isExpanded && (
        <div className="p-2 border-t border-blue-200">
          <TopicInput suggestions={suggestions} onAdd={handleAdd} />
          <TopicList
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}
