"use client";

import { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  X,
  FileText,
  Edit2,
  Check,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function SectionHeader({ title, onToggle, isExpanded }) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-t-md cursor-pointer group shadow-sm"
    >
      <h2 className="text-sm font-medium flex items-center">{title}</h2>
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
    <div className="flex items-center gap-2 mb-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm bg-white border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 hover:border-blue-400 transition-colors shadow-sm"
      >
        <Paperclip className="w-4 h-4" />
        Select Files to Attach
      </button>
    </div>
  );
}

function FileList({ files, onRemove, onUpdateMetadata }) {
  if (files.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 italic text-sm border border-dashed border-gray-200 rounded-md">
        No files attached
      </div>
    );
  }

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

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();

    // You could expand this with more detailed icons based on extension
    const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
      extension
    );
    const isPdf = extension === "pdf";
    const isDocument = ["doc", "docx", "txt", "rtf", "odt"].includes(extension);

    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="space-y-4">
      {files.map((fileData, index) => (
        <div
          key={`${fileData.file.name}-${index}`}
          className="p-4 bg-white rounded-md space-y-3 border border-gray-200 shadow-sm hover:border-blue-200 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getFileIcon(fileData.file.name)}
              <span className="text-sm text-blue-600 font-medium">
                {fileData.file.name}
                <span className="ml-2 text-xs text-gray-500">
                  ({(fileData.file.size / 1024).toFixed(1)} KB)
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleViewFile(fileData.file)}
                className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                title="View file"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDownloadFile(fileData.file, fileData.name)}
                className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                title="Download file"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemove(index)}
                className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div>
              {fileData.isEditing ? (
                <input
                  type="text"
                  value={fileData.name}
                  onChange={(e) =>
                    onUpdateMetadata(index, { name: e.target.value })
                  }
                  placeholder="Enter file name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">
                    {fileData.name}
                  </span>
                  <button
                    onClick={() => onUpdateMetadata(index, { isEditing: true })}
                    className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                    title="Edit file details"
                  >
                    <Edit2 className="w-4 h-4" />
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        onUpdateMetadata(index, { isEditing: false })
                      }
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                  {fileData.description || "No description provided"}
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
    <div className="border border-gray-200 rounded-md shadow-sm mb-3">
      <SectionHeader
        title={`${title} (${files.length})`}
        onToggle={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
      />
      {isExpanded && (
        <div className="p-3 border-t border-gray-200 bg-white">
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
