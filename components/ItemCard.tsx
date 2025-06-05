
import React from 'react';
import { TrackedItem, Material, ItemType } from '../types';
import { EditIcon, TrashIcon, EyeIcon, CameraIcon } from './icons';

interface ItemCardProps {
  item: TrackedItem;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onView, onEdit, onDelete }) => {
  const totalMaterialsNeeded = item.materials.reduce((sum, mat) => sum + mat.needed, 0);
  const totalMaterialsPossessed = item.materials.reduce((sum, mat) => sum + mat.possessed, 0);
  const progress = totalMaterialsNeeded > 0 ? (totalMaterialsPossessed / totalMaterialsNeeded) * 100 : 0;

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-200 ease-out">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-sky-400">{item.name}</h3>
            <p className="text-sm text-slate-400">{item.type}</p>
          </div>
          {item.photoUrl ? (
            <img src={item.photoUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover border-2 border-slate-700" />
          ) : (
            <div className="w-16 h-16 rounded-md bg-slate-700 flex items-center justify-center">
              <CameraIcon className="w-8 h-8 text-slate-500" />
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-sm text-slate-300">Materials Progress:</p>
          <div className="w-full bg-slate-700 rounded-full h-2.5 mt-1">
            <div
              className="bg-sky-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-1 text-right">{totalMaterialsPossessed} / {totalMaterialsNeeded} ({progress.toFixed(1)}%)</p>
        </div>
        
        {item.totalMaterialsScreenshotUrl && (
          <p className="text-xs text-slate-400 mt-2 flex items-center">
            <CameraIcon className="w-4 h-4 mr-1 text-sky-500"/> Screenshot available
          </p>
        )}
      </div>

      <div className="bg-slate-700 p-3 flex justify-end space-x-2">
        <button
          onClick={() => onView(item.id)}
          className="p-2 rounded-md text-slate-300 hover:bg-sky-600 hover:text-white transition-colors"
          title="View Details"
        >
          <EyeIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onEdit(item.id)}
          className="p-2 rounded-md text-slate-300 hover:bg-yellow-500 hover:text-white transition-colors"
          title="Edit Item"
        >
          <EditIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-md text-slate-300 hover:bg-red-600 hover:text-white transition-colors"
          title="Delete Item"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
