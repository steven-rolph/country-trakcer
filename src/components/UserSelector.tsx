import React from 'react';
import { User } from 'lucide-react';
import type { User as UserType, SyncStatus } from '../types';

interface UserSelectorProps {
  selectedUser: UserType;
  onUserChange: (user: UserType) => void;
  syncStatus: SyncStatus;
}

const getUserColor = (user: UserType): string => {
  return user === 'Steven' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-green-100 text-green-800 border-green-300';
};

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

export const UserSelector: React.FC<UserSelectorProps> = ({
  selectedUser,
  onUserChange,
  syncStatus
}) => {
  const users: UserType[] = ['Steven', 'Partner'];
  const syncInfo = getSyncStatusInfo(syncStatus);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-600" />
        <span className="text-sm text-gray-600">User:</span>
        <div className="flex gap-1">
          {users.map((user) => (
            <button
              key={user}
              onClick={() => onUserChange(user)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                selectedUser === user
                  ? getUserColor(user)
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {user}
            </button>
          ))}
        </div>
      </div>
      
      <div className={`flex items-center gap-1 text-xs ${syncInfo.color}`}>
        <span>{syncInfo.icon}</span>
        <span>{syncInfo.text}</span>
      </div>
    </div>
  );
};