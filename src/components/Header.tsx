import React from 'react';
import { MapPin, Settings, Download, Upload, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
  onLoadData: () => void;
  onSaveData: () => void;
  onResetClick: () => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSettingsClick,
  onLoadData,
  onSaveData,
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
            <p className="text-gray-600">Track travel days for residence requirements</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onSettingsClick}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onLoadData}
            disabled={loading}
            className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
            title="Load from GitHub"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onSaveData}
            disabled={loading}
            className="p-2 text-green-400 hover:text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
            title="Save to GitHub"
          >
            <Upload className="w-5 h-5" />
          </button>
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