
import React from 'react';
import { CalendarDaysIcon } from './icons';

interface HeaderProps {
  onNavigateToDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToDashboard }) => {
  return (
    <header className="bg-slate-800 shadow-lg p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onNavigateToDashboard}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && onNavigateToDashboard()}
        >
          <CalendarDaysIcon className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold text-sky-400">Gacha Resource Tracker</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
