
import React, { useState, useEffect } from 'react';
import { Material, DayOfWeek } from '../types';
import FileUpload from './FileUpload';
import DayOfWeekSelector from './DayOfWeekSelector';
import { PlusIcon, EditIcon } from './icons';

interface MaterialFormProps {
  material?: Material;
  onSubmit: (material: Material) => void;
  onCancel: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ material, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState<string | undefined>(undefined);
  const [needed, setNeeded] = useState(0);
  const [possessed, setPossessed] = useState(0);
  const [farmableDays, setFarmableDays] = useState<DayOfWeek[]>([]);

  useEffect(() => {
    if (material) {
      setName(material.name);
      setIconUrl(material.iconUrl);
      setNeeded(material.needed);
      setPossessed(material.possessed);
      setFarmableDays(material.farmableDays || []);
    } else {
      // Reset for new material
      setName('');
      setIconUrl(undefined);
      setNeeded(0);
      setPossessed(0);
      setFarmableDays([]);
    }
  }, [material]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || needed <= 0) {
      alert("Material name and quantity needed (must be > 0) are required.");
      return;
    }
    onSubmit({
      id: material?.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      iconUrl,
      needed: Number(needed),
      possessed: Number(possessed),
      farmableDays,
    });
    // Reset form if it was for a new material
    if (!material) {
        setName('');
        setIconUrl(undefined);
        setNeeded(0);
        setPossessed(0);
        setFarmableDays([]);
    }
  };
  
  const inputClass = "mt-1 block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50 p-2 text-slate-100 placeholder-slate-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-700 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-sky-400">{material ? 'Edit Material' : 'Add New Material'}</h3>
      <div>
        <label htmlFor="materialName" className="block text-sm font-medium text-slate-300">Material Name*</label>
        <input
          type="text"
          id="materialName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="e.g., Hero's Wit"
          required
        />
      </div>

      <FileUpload 
        label="Material Icon (Optional)"
        onFileSelect={setIconUrl}
        currentImageUrl={iconUrl}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantityNeeded" className="block text-sm font-medium text-slate-300">Quantity Needed*</label>
          <input
            type="number"
            id="quantityNeeded"
            value={needed}
            onChange={(e) => setNeeded(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className={inputClass}
            min="0"
            required
          />
        </div>
        <div>
          <label htmlFor="quantityPossessed" className="block text-sm font-medium text-slate-300">Quantity Possessed</label>
          <input
            type="number"
            id="quantityPossessed"
            value={possessed}
            onChange={(e) => setPossessed(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className={inputClass}
            min="0"
          />
        </div>
      </div>

      <DayOfWeekSelector selectedDays={farmableDays} onChange={setFarmableDays} />
      
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium rounded-md text-slate-300 bg-slate-600 hover:bg-slate-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600 transition-colors flex items-center space-x-1"
        >
          {material ? <EditIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
          <span>{material ? 'Save Changes' : 'Add Material'}</span>
        </button>
      </div>
    </form>
  );
};

export default MaterialForm;
