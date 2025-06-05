
import React, { useState, useEffect } from 'react';
import { TrackedItem, ItemType } from '../types';
import { ITEM_TYPE_OPTIONS } from '../constants';
import FileUpload from './FileUpload';
import { PlusIcon, EditIcon, ChevronLeftIcon } from './icons';

interface ItemFormProps {
  item?: TrackedItem;
  onSubmit: (item: Omit<TrackedItem, 'id' | 'materials'> & { id?: string }) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [type, setType] = useState<ItemType>(ItemType.Character);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPhotoUrl(item.photoUrl);
      setType(item.type);
    } else {
      // Reset for new item
      setName('');
      setPhotoUrl(undefined);
      setType(ItemType.Character);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        alert("Item name is required.");
        return;
    }
    onSubmit({
      id: item?.id,
      name: name.trim(),
      photoUrl,
      type,
    });
  };

  const inputClass = "mt-1 block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50 p-2 text-slate-100 placeholder-slate-400";
  const labelClass = "block text-sm font-medium text-slate-300";

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      <button
        onClick={onCancel}
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-sky-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
      >
        <ChevronLeftIcon className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-sky-400 mb-6">
          {item ? 'Edit Item' : `Add New ${type}`}
        </h2>
        
        <div>
          <label htmlFor="itemName" className={labelClass}>Name*</label>
          <input
            type="text"
            id="itemName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder={`Enter ${type.toLowerCase()} name`}
            required
          />
        </div>

        <div>
          <label htmlFor="itemType" className={labelClass}>Type*</label>
          <select
            id="itemType"
            value={type}
            onChange={(e) => setType(e.target.value as ItemType)}
            className={inputClass}
          >
            {ITEM_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <FileUpload 
          label={`${type} Photo (Optional)`}
          onFileSelect={setPhotoUrl}
          currentImageUrl={photoUrl}
        />
        
        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-md text-slate-300 bg-slate-600 hover:bg-slate-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600 transition-colors flex items-center space-x-2"
          >
            {item ? <EditIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
            <span>{item ? 'Save Changes' : `Add ${type}`}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
