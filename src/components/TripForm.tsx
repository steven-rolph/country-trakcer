import React from 'react';
import { Plus } from 'lucide-react';
import type { Trip, User } from '../types';

interface TripFormProps {
  newTrip: Partial<Trip>;
  selectedUser: User;
  onTripChange: (trip: Partial<Trip>) => void;
  onAddTrip: () => void;
}

export const TripForm: React.FC<TripFormProps> = ({
  newTrip,
  selectedUser,
  onTripChange,
  onAddTrip
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Plus className="w-5 h-5 mr-2" />
        Add New Trip for {selectedUser}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <select
          value={newTrip.country}
          onChange={(e) => onTripChange({ ...newTrip, country: e.target.value as 'Greece' | 'UK' })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Greece">Greece</option>
          <option value="UK">UK</option>
        </select>
        <input
          type="date"
          placeholder="Departure Date"
          value={newTrip.departureDate}
          onChange={(e) => onTripChange({ ...newTrip, departureDate: e.target.value })}
          className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${
            selectedUser === 'Cheryl'
              ? 'focus:ring-blue-500 focus:border-blue-500'
              : 'focus:ring-green-500 focus:border-green-500'
          }`}
        />
        <input
          type="date"
          placeholder="Arrival Date"
          value={newTrip.arrivalDate}
          onChange={(e) => onTripChange({ ...newTrip, arrivalDate: e.target.value })}
          className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${
            selectedUser === 'Cheryl'
              ? 'focus:ring-blue-500 focus:border-blue-500'
              : 'focus:ring-green-500 focus:border-green-500'
          }`}
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={newTrip.notes}
          onChange={(e) => onTripChange({ ...newTrip, notes: e.target.value })}
          className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${
            selectedUser === 'Cheryl'
              ? 'focus:ring-blue-500 focus:border-blue-500'
              : 'focus:ring-green-500 focus:border-green-500'
          }`}
        />
      </div>
      <button
        onClick={onAddTrip}
        className={`mt-4 px-4 py-2 text-white rounded-lg flex items-center ${
          selectedUser === 'Cheryl'
            ? 'bg-blue-700 hover:bg-blue-800'
            : 'bg-green-700 hover:bg-green-800'
        }`}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Trip
      </button>
    </div>
  );
};