import React from 'react';
import { MapPin, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onResetClick: () => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onResetClick,
  loading
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MapPin className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Travel Day Tracker</h1>
            <p className="text-gray-600">Automatic cloud sync with simple user switching</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onResetClick}
            disabled={loading}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
            title="Reset All Data"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};