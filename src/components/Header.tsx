import React from 'react';
import { MapPin, RotateCcw } from 'lucide-react';
import type { SyncStatus } from '../types';

interface HeaderProps {
  onResetClick: () => void;
  loading: boolean;
  syncStatus: SyncStatus;
  adminMode: boolean;
}

const getSyncStatusInfo = (status: SyncStatus) => {
  switch (status) {
    case 'connected':
      return { text: 'Cloud Sync', color: 'text-green-600', icon: '🌐' };
    case 'loading':
      return { text: 'Syncing...', color: 'text-blue-600', icon: '⏳' };
    case 'error':
      return { text: 'Local Only', color: 'text-red-600', icon: '⚠️' };
    default:
      return { text: 'Local Storage', color: 'text-gray-600', icon: '💾' };
  }
};

export const Header: React.FC<HeaderProps> = ({
  onResetClick,
  loading,
  syncStatus,
  adminMode
}) => {
  const syncInfo = getSyncStatusInfo(syncStatus);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <MapPin className="w-8 h-8 text-blue-600" />
            {adminMode && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Travel Day Tracker</h1>
            <p className="text-sm sm:text-base text-gray-600">Automatic cloud sync with simple user switching</p>
          </div>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-4">
          <div className={`flex items-center gap-2 text-sm ${syncInfo.color}`}>
            <span className="text-base">{syncInfo.icon}</span>
            <span className="font-medium">{syncInfo.text}</span>
          </div>
          <button
            onClick={onResetClick}
            disabled={loading}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
            title="Reset All Data"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};