import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import type { CountryStats, User } from '../types';

interface StatsCardsProps {
  stats: CountryStats;
  totalTrips: number;
  selectedUser: User;
  selectedYear: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, totalTrips, selectedUser, selectedYear }) => {
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{selectedUser} - Greece ({selectedYear})</p>
            <p className="text-2xl font-bold text-gray-900">{stats.Greece} days</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
            <MapPin className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{selectedUser} - UK ({selectedYear})</p>
            <p className="text-2xl font-bold text-gray-900">{stats.UK} days</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
            selectedUser === 'Cheryl' ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            <Calendar className={`w-6 h-6 ${
              selectedUser === 'Cheryl' ? 'text-blue-700' : 'text-green-700'
            }`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{selectedUser} - Total Trips</p>
            <p className="text-2xl font-bold text-gray-900">{totalTrips}</p>
          </div>
        </div>
      </div>
    </div>
  );
};