
import React, { useState, useCallback } from 'react';
import { TrackedItem, Material, DayOfWeek } from '../types';
import FileUpload from './FileUpload';
import MaterialForm from './MaterialForm';
import ImageModal from './ImageModal';
import { CameraIcon, PlusIcon, TrashIcon, EditIcon, ChevronLeftIcon, CheckIcon, EyeIcon } from './icons';

interface ItemDetailViewProps {
  item: TrackedItem;
  onUpdateItem: (item: TrackedItem) => void;
  onBack: () => void;
}

const MaterialRow: React.FC<{
  material: Material;
  onUpdateMaterial: (updatedMaterial: Material) => void;
  onDeleteMaterial: (materialId: string) => void;
  onEditMaterial: (material: Material) => void;
}> = ({ material, onUpdateMaterial, onDeleteMaterial, onEditMaterial }) => {
  const [possessed, setPossessed] = useState(material.possessed);
  const [isEditingPossessed, setIsEditingPossessed] = useState(false);

  const handlePossessedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPossessed(Math.max(0, parseInt(e.target.value, 10) || 0));
  };

  const savePossessed = () => {
    onUpdateMaterial({ ...material, possessed });
    setIsEditingPossessed(false);
  };

  const progress = material.needed > 0 ? (material.possessed / material.needed) * 100 : 0;
  const isCompleted = material.possessed >= material.needed;

  return (
    <div className={`p-3 rounded-md transition-all duration-200 ${isCompleted ? 'bg-green-800 bg-opacity-30' : 'bg-slate-700'} hover:bg-slate-600`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center mb-2 sm:mb-0">
          {material.iconUrl && <img src={material.iconUrl} alt={material.name} className="w-10 h-10 rounded-md mr-3 object-contain border border-slate-600" />}
          <div>
            <h4 className={`font-semibold ${isCompleted ? 'text-green-400 line-through' : 'text-sky-300'}`}>{material.name}</h4>
            <div className="text-xs text-slate-400">
              {isEditingPossessed ? (
                <div className="flex items-center space-x-1 mt-1">
                  <input 
                    type="number" 
                    value={possessed} 
                    onChange={handlePossessedChange}
                    onBlur={savePossessed}
                    onKeyPress={(e) => e.key === 'Enter' && savePossessed()}
                    className="w-16 bg-slate-800 border border-slate-600 rounded px-1 py-0.5 text-xs text-slate-100" 
                    autoFocus
                  />
                   <button onClick={savePossessed} className="p-0.5 bg-sky-500 rounded text-white hover:bg-sky-600"><CheckIcon className="w-3 h-3"/></button>
                </div>
              ) : (
                <span onClick={() => setIsEditingPossessed(true)} className="cursor-pointer hover:text-sky-400">
                  {material.possessed} / {material.needed}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0 self-end sm:self-center">
          <button onClick={() => onEditMaterial(material)} className="p-1.5 text-slate-400 hover:text-yellow-400 transition-colors" title="Edit Material"><EditIcon className="w-4 h-4"/></button>
          <button onClick={() => onDeleteMaterial(material.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors" title="Delete Material"><TrashIcon className="w-4 h-4"/></button>
        </div>
      </div>
      {material.farmableDays && material.farmableDays.length > 0 && (
        <div className="mt-2 text-xs text-slate-400">
          Farmable: {material.farmableDays.map(d => d.substring(0,3)).join(', ')}
        </div>
      )}
      <div className="w-full bg-slate-600 rounded-full h-1.5 mt-2">
        <div
          className={`${isCompleted ? 'bg-green-500' : 'bg-sky-500'} h-1.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};


const ItemDetailView: React.FC<ItemDetailViewProps> = ({ item, onUpdateItem, onBack }) => {
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>(undefined);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const handleScreenshotUpload = useCallback((url: string) => {
    onUpdateItem({ ...item, totalMaterialsScreenshotUrl: url });
  }, [item, onUpdateItem]);

  const addOrUpdateMaterial = useCallback((material: Material) => {
    const existingMaterialIndex = item.materials.findIndex(m => m.id === material.id);
    let updatedMaterials;
    if (existingMaterialIndex > -1) {
      updatedMaterials = [...item.materials];
      updatedMaterials[existingMaterialIndex] = material;
    } else {
      updatedMaterials = [...item.materials, material];
    }
    onUpdateItem({ ...item, materials: updatedMaterials });
    setShowMaterialForm(false);
    setEditingMaterial(undefined);
  }, [item, onUpdateItem]);

  const deleteMaterial = useCallback((materialId: string) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      const updatedMaterials = item.materials.filter(m => m.id !== materialId);
      onUpdateItem({ ...item, materials: updatedMaterials });
    }
  }, [item, onUpdateItem]);
  
  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setShowMaterialForm(true);
  };

  const totalMaterialsNeeded = item.materials.reduce((sum, mat) => sum + mat.needed, 0);
  const totalMaterialsPossessed = item.materials.reduce((sum, mat) => sum + mat.possessed, 0);
  const overallProgress = totalMaterialsNeeded > 0 ? (totalMaterialsPossessed / totalMaterialsNeeded) * 100 : 0;

  return (
    <div className="container mx-auto p-4 md:p-6">
       <button
        onClick={onBack}
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-sky-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
      >
        <ChevronLeftIcon className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="p-6 bg-slate-700 bg-opacity-50">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {item.photoUrl ? (
              <img src={item.photoUrl} alt={item.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border-4 border-slate-600 shadow-lg" />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-slate-600 flex items-center justify-center border-4 border-slate-600 shadow-lg">
                <CameraIcon className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500" />
              </div>
            )}
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-sky-400">{item.name}</h2>
              <p className="text-lg text-slate-400">{item.type}</p>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="p-6">
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Overall Progress</h3>
            <div className="w-full bg-slate-700 rounded-full h-3.5">
                <div
                className="bg-gradient-to-r from-sky-500 to-blue-500 h-3.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
                ></div>
            </div>
            <p className="text-sm text-slate-400 mt-1 text-right">{totalMaterialsPossessed} / {totalMaterialsNeeded} ({overallProgress.toFixed(1)}%)</p>
        </div>


        {/* Materials Section */}
        <div className="p-6 border-t border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-slate-200">Required Materials</h3>
            <button
              onClick={() => { setEditingMaterial(undefined); setShowMaterialForm(!showMaterialForm); }}
              className="flex items-center px-3 py-1.5 text-sm rounded-md text-white bg-sky-500 hover:bg-sky-600 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1" /> {showMaterialForm && !editingMaterial ? 'Cancel' : 'Add Material'}
            </button>
          </div>

          {showMaterialForm && (
            <div className="mb-6 p-1 rounded-lg shadow-inner bg-slate-800 transition-all duration-300 ease-out">
              <MaterialForm 
                material={editingMaterial}
                onSubmit={addOrUpdateMaterial} 
                onCancel={() => { setShowMaterialForm(false); setEditingMaterial(undefined); }}
              />
            </div>
          )}

          {item.materials.length > 0 ? (
            <div className="space-y-3">
              {item.materials.sort((a,b) => (a.possessed/a.needed) - (b.possessed/b.needed)).map(material => ( // Sort by completion
                <MaterialRow 
                  key={material.id} 
                  material={material} 
                  onUpdateMaterial={addOrUpdateMaterial} 
                  onDeleteMaterial={deleteMaterial}
                  onEditMaterial={handleEditMaterial}
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-4">No materials added yet. Click "Add Material" to get started.</p>
          )}
        </div>

        {/* Screenshot Section */}
        <div className="p-6 border-t border-slate-700">
          <h3 className="text-xl font-semibold text-slate-200 mb-4">Total Materials Screenshot</h3>
          {item.totalMaterialsScreenshotUrl && (
            <div className="mb-4 relative group cursor-pointer" onClick={() => setModalImageUrl(item.totalMaterialsScreenshotUrl!)}>
              <img 
                src={item.totalMaterialsScreenshotUrl} 
                alt="Total materials summary" 
                className="max-w-xs max-h-64 rounded-lg border-2 border-slate-600 shadow-md group-hover:opacity-80 transition-opacity" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
                <EyeIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300"/>
              </div>
            </div>
          )}
          <FileUpload
            label={item.totalMaterialsScreenshotUrl ? "Change Screenshot" : "Upload Screenshot"}
            onFileSelect={handleScreenshotUpload}
            currentImageUrl={item.totalMaterialsScreenshotUrl}
          />
        </div>
      </div>

      {modalImageUrl && <ImageModal imageUrl={modalImageUrl} onClose={() => setModalImageUrl(null)} />}
    </div>
  );
};

export default ItemDetailView;
