
import React from 'react';
import { DayOfWeek } from '../types';
import { ALL_DAYS_OF_WEEK } from '../constants';

interface DayOfWeekSelectorProps {
  selectedDays: DayOfWeek[];
  onChange: (selectedDays: DayOfWeek[]) => void;
}

const DayOfWeekSelector: React.FC<DayOfWeekSelectorProps> = ({ selectedDays, onChange }) => {
  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">Farmable Days (Optional)</label>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {ALL_DAYS_OF_WEEK.map(day => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={`px-3 py-2 text-xs sm:text-sm rounded-md transition-all duration-150 ease-in-out
              ${selectedDays.includes(day) ? 'bg-sky-500 text-white shadow-md scale-105' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}`}
          >
            {day.substring(0,3)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DayOfWeekSelector;
