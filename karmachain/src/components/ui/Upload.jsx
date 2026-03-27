import React, { useRef, useState } from 'react';
import { UploadCloud, File, X } from 'lucide-react';

export const Upload = ({ label = "Upload Proof", onChange, accept = "image/*" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (newFile) => {
    setFile(newFile);
    if (onChange) onChange(newFile);
  };

  const removeFile = () => {
    setFile(null);
    if (onChange) onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const triggerUpload = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      
      {!file ? (
        <div 
          className={`relative flex justify-center items-center w-full min-h-[140px] px-4 py-6 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 bg-white'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerUpload}
        >
          <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            accept={accept} 
            onChange={handleChange} 
          />
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-1">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              <span className="text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, PDF up to 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex items-center space-x-3 overflow-hidden text-ellipsis">
            <div className="p-2 bg-white rounded-lg border border-gray-200 flex-shrink-0">
              <File className="w-5 h-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate pr-4">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={removeFile}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
