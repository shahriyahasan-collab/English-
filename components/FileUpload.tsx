import React, { useRef, useState } from 'react';
import { Upload, FileAudio, FileVideo, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        onFileSelect(file);
      } else {
        alert('Please upload an audio or video file.');
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  if (selectedFile) {
    const isVideo = selectedFile.type.startsWith('video/');
    
    return (
      <div className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex items-center justify-between animate-fade-in transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${isVideo ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
            {isVideo ? <FileVideo size={24} /> : <FileAudio size={24} />}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-200 truncate max-w-xs md:max-w-md">{selectedFile.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        </div>
        <button 
          onClick={onClear}
          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-700'
        }
      `}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleInputChange}
        accept="audio/*,video/*"
        className="hidden"
      />
      <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full mb-4">
        <Upload size={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Upload Conversation</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center px-4">
        Drag & drop your audio or video file here, or click to browse.
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">Supports MP3, WAV, MP4, MOV, WEBM</p>
    </div>
  );
};