
import React from 'react';
import { TrackedItem, Material, DayOfWeek } from '../types';
import ItemCard from './ItemCard';
import { PlusIcon, CalendarDaysIcon } from './icons';
import { ALL_DAYS_OF_WEEK } from '../constants';

interface DashboardViewProps {
  items: TrackedItem[];
  onAddItem: () => void;
  onViewItem: (id: string) => void;
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

const getToday = (): DayOfWeek => {
  const dayIndex = new Date().getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
  const daysMap: DayOfWeek[] = [
    DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday,
    DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday
  ];
  return daysMap[dayIndex];
};

const TodaysFarmableMaterials: React.FC<{ items: TrackedItem[]; onViewItem: (id: string) => void }> = ({ items, onViewItem }) => {
  const today = getToday();
  const farmableToday: { item: TrackedItem; material: Material }[] = [];

  items.forEach(item => {
    item.materials.forEach(material => {
      if (material.farmableDays.includes(today) && material.possessed < material.needed) {
        farmableToday.push({ item, material });
      }
    });
  });

  if (farmableToday.length === 0) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl text-center">
        <CalendarDaysIcon className="w-12 h-12 text-sky-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-300">Nothing to farm today!</h3>
        <p className="text-sm text-slate-400">Check back tomorrow or update your material list.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
      <h3 className="text-2xl font-semibold text-sky-400 mb-4">Farmable Today ({today})</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {farmableToday.sort((a,b) => { // Sort by item name, then material name
          if (a.item.name.toLowerCase() < b.item.name.toLowerCase()) return -1;
          if (a.item.name.toLowerCase() > b.item.name.toLowerCase()) return 1;
          if (a.material.name.toLowerCase() < b.material.name.toLowerCase()) return -1;
          if (a.material.name.toLowerCase() > b.material.name.toLowerCase()) return 1;
          return 0;
        }).map(({ item, material }) => (
          <div 
            key={`${item.id}-${material.id}`} 
            className="bg-slate-700 p-3 rounded-md hover:bg-slate-600 transition-colors cursor-pointer"
            onClick={() => onViewItem(item.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                 {material.iconUrl && <img src={material.iconUrl} alt={material.name} className="w-8 h-8 rounded-md object-contain border border-slate-600" />}
                <div>
                  <p className="font-medium text-slate-100">{material.name}</p>
                  <p className="text-xs text-slate-400">{item.name} ({item.type})</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-sky-400">{material.possessed} / {material.needed}</p>
              </div>
            </div>
             <div className="w-full bg-slate-600 rounded-full h-1 mt-1.5">
                <div
                className="bg-sky-500 h-1 rounded-full"
                style={{ width: `${(material.possessed / material.needed) * 100}%` }}
                ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardView: React.FC<DashboardViewProps> = ({ items, onAddItem, onViewItem, onEditItem, onDeleteItem }) => {
  const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-slate-100">My Tracked Items</h2>
        <button
          onClick={onAddItem}
          className="flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-sky-500 hover:bg-sky-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Item
        </button>
      </div>

      <TodaysFarmableMaterials items={items} onViewItem={onViewItem} />

      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onView={onViewItem}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-800 rounded-lg shadow-xl">
          <img src="https://picsum.photos/seed/gachadashboard/300/200" alt="Placeholder" className="mx-auto mb-6 rounded-lg opacity-50" />
          <h3 className="text-2xl font-semibold text-slate-300">No items tracked yet!</h3>
          <p className="text-slate-400 mt-2">Click "Add New Item" to start tracking your gacha resources.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
