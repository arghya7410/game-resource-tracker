
import React, { useState, useCallback } from 'react';
import { CameraIcon } from './icons';

interface FileUploadProps {
  onFileSelect: (fileDataUrl: string) => void;
  currentImageUrl?: string;
  label: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, currentImageUrl, label }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isUrlMode, setIsUrlMode] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      onFileSelect(urlInput.trim());
      setUrlInput('');
    }
  }, [urlInput, onFileSelect]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      {currentImageUrl && (
        <div className="my-2">
          <img src={currentImageUrl} alt="Current" className="max-h-32 rounded border border-slate-600" />
        </div>
      )}
      <div className="flex items-center space-x-2">
        <button 
          type="button"
          onClick={() => setIsUrlMode(false)} 
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${!isUrlMode ? 'bg-sky-500 text-white' : 'bg-slate-600 hover:bg-slate-500 text-slate-300'}`}
        >
          Upload File
        </button>
        <button 
          type="button"
          onClick={() => setIsUrlMode(true)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${isUrlMode ? 'bg-sky-500 text-white' : 'bg-slate-600 hover:bg-slate-500 text-slate-300'}`}
        >
          Use URL
        </button>
      </div>
      {!isUrlMode ? (
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md hover:border-sky-500 transition-colors">
          <div className="space-y-1 text-center">
            <CameraIcon className="mx-auto h-10 w-10 text-slate-400" />
            <div className="flex text-sm text-slate-500">
              <label
                htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
                className="relative cursor-pointer rounded-md font-medium text-sky-400 hover:text-sky-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-700 focus-within:ring-sky-500"
              >
                <span>Upload a file</span>
                <input id={`file-upload-${label.replace(/\s+/g, '-')}`} name={`file-upload-${label.replace(/\s+/g, '-')}`} type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      ) : (
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.png"
            className="flex-1 block w-full rounded-none rounded-l-md bg-slate-700 border-slate-600 focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 text-slate-100"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="inline-flex items-center px-3 py-2 border border-l-0 border-slate-600 rounded-r-md bg-slate-600 text-sm font-medium text-slate-300 hover:bg-slate-500 transition-colors"
          >
            Load URL
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
