"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiPaperclip,
  FiX,
  FiFile,
  FiEdit2,
  FiCheck,
  FiDownload,
  FiEye,
} from "react-icons/fi";

function SectionHeader({ title, onToggle, isExpanded }) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center justify-between bg-blue-500 text-white p-2 rounded-t-md cursor-pointer group"
    >
      <h2 className="text-sm font-medium">{title}</h2>
      <div className="flex items-center gap-1">
        <span className="transition-transform duration-200 group-hover:scale-110">
          {isExpanded ? "−" : "+"}
        </span>
      </div>
    </div>
  );
}

function FileUploader({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const filesWithMetadata = files.map((file) => ({
        file,
        name: file.name,
        description: "",
        isEditing: true,
      }));
      onFileSelect(filesWithMetadata);
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 px-3 py-1 text-sm text-gray-900 bg-transparent border border-blue-400 hover:text-white rounded-md hover:bg-blue-500"
      >
        <FiPaperclip className="w-4 h-4" />
        Attach Files
      </button>
    </div>
  );
}

function FileList({ files, onRemove, onUpdateMetadata }) {
  if (files.length === 0) return null;

  const handleViewFile = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const handleDownloadFile = (file, customName) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = customName || file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      {files.map((fileData, index) => (
        <div
          key={`${fileData.file.name}-${index}`}
          className="p-3 bg-blue-50 rounded-md space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiFile className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-500">
                Original: {fileData.file.name}(
                {(fileData.file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleViewFile(fileData.file)}
                className="p-1.5 text-blue-400 hover:text-blue-500 rounded-full hover:bg-blue-200"
                title="View file"
              >
                <FiEye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDownloadFile(fileData.file, fileData.name)}
                className="p-1.5 text-blue-400 hover:text-blue-500 rounded-full hover:bg-blue-200"
                title="Download file"
              >
                <FiDownload className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemove(index)}
                className="p-1.5 text-blue-400 hover:text-red-500 rounded-full hover:bg-red-50"
                title="Remove file"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              {fileData.isEditing ? (
                <input
                  type="text"
                  value={fileData.name}
                  onChange={(e) =>
                    onUpdateMetadata(index, { name: e.target.value })
                  }
                  placeholder="Enter file name"
                  className="w-full px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-blue-500 outline-none"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{fileData.name}</span>
                  <button
                    onClick={() => onUpdateMetadata(index, { isEditing: true })}
                    className="p-1 text-blue-400 hover:text-blue-500 rounded-full"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div>
              {fileData.isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={fileData.description}
                    onChange={(e) =>
                      onUpdateMetadata(index, { description: e.target.value })
                    }
                    placeholder="Enter file description"
                    rows={2}
                    className="w-full px-2 py-1 text-sm border border-blue-200 rounded-md focus:border-blue-500 outline-none resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        onUpdateMetadata(index, { isEditing: false })
                      }
                      className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-800"
                    >
                      <FiCheck className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-blue-600">
                  {fileData.description || "No description"}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AttachmentBox({
  title = "Attachments",
  defaultExpanded = false,
  onFilesChange,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [files, setFiles] = useState([]);

  const handleFileSelect = (newFiles) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      if (onFilesChange) onFilesChange(updatedFiles);
      return updatedFiles;
    });
  };

  // Update Attachment
  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      if (onFilesChange) onFilesChange(updatedFiles);
      return updatedFiles;
    });
  };

  const handleUpdateMetadata = (index, updates) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file, i) =>
        i === index ? { ...file, ...updates } : file
      );
      if (onFilesChange) onFilesChange(updatedFiles);
      return updatedFiles;
    });
  };

  return (
    <div className="border border-blue-200 rounded-md">
      <SectionHeader
        title={`${title} (${files.length})`}
        onToggle={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
      />
      {isExpanded && (
        <div className="p-2 border-t border-blue-200">
          <FileUploader onFileSelect={handleFileSelect} />
          <FileList
            files={files}
            onRemove={handleRemoveFile}
            onUpdateMetadata={handleUpdateMetadata}
          />
        </div>
      )}
    </div>
  );
}
