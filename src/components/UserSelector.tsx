import React from 'react';
import { User } from 'lucide-react';
import type { User as UserType } from '../types';

interface UserSelectorProps {
  selectedUser: UserType;
  onUserChange: (user: UserType) => void;
}

const getUserColor = (user: UserType): string => {
  return user === 'Cheryl' ? 'bg-blue-100 text-blue-800 border-blue-400' : 'bg-green-100 text-green-800 border-green-400';
};

export const UserSelector: React.FC<UserSelectorProps> = ({
  selectedUser,
  onUserChange
}) => {
  const users: UserType[] = ['Cheryl', 'Nigel'];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
      <div className="flex items-center gap-2 flex-shrink-0">
        <User className="h-5 w-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">User:</span>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        {users.map((user) => (
          <button
            key={user}
            onClick={() => onUserChange(user)}
            className={`flex-1 sm:flex-initial sm:min-w-[120px] px-6 py-3 text-base font-semibold rounded-lg border-2 transition-all duration-200 touch-manipulation ${
              selectedUser === user
                ? getUserColor(user) + ' transform scale-105 shadow-md'
                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 hover:border-gray-400 hover:shadow-sm'
            }`}
          >
            {user}
          </button>
        ))}
      </div>
    </div>
  );
};