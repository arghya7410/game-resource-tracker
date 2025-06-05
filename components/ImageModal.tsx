
import React from 'react';
import { XMarkIcon } from './icons';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 p-4 rounded-lg shadow-xl max-w-3xl max-h-[90vh] overflow-auto relative transform transition-all duration-300 scale-95 opacity-0 animate-modal-appear"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-100 transition-colors z-10 bg-slate-700 rounded-full p-1"
          aria-label="Close image viewer"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>        
        <img src={imageUrl} alt="Enlarged view" className="max-w-full max-h-[85vh] rounded" />
      </div>
    </div>
  );
};

export default ImageModal;
