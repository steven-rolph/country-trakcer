import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import type { Trip, User } from '../types';

interface TripEditorProps {
  trip: Trip;
  onSave: (trip: Partial<Trip>) => void;
  onCancel: () => void;
}

export const TripEditor: React.FC<TripEditorProps> = ({ trip, onSave, onCancel }) => {
  const [editedTrip, setEditedTrip] = useState<Partial<Trip>>({
    user: trip.user,
    country: trip.country,
    departureDate: trip.departureDate,
    arrivalDate: trip.arrivalDate,
    notes: trip.notes
  });


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={editedTrip.user}
          onChange={(e) => setEditedTrip({ ...editedTrip, user: e.target.value as User })}
          className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${
            trip.user === 'Cheryl'
              ? 'focus:ring-blue-500 focus:border-blue-500'
              : 'focus:ring-green-500 focus:border-green-500'
          }`}
        >
          <option value="Cheryl">Cheryl</option>
          <option value="Nigel">Nigel</option>
        </select>
        <select
          value={editedTrip.country}
          onChange={(e) => setEditedTrip({ ...editedTrip, country: e.target.value as 'Greece' | 'UK' })}
          className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${
            trip.user === 'Cheryl'
              ? 'focus:ring-blue-500 focus:border-blue-500'
              : 'focus:ring-green-500 focus:border-green-500'
          }`}
        >
          <option value="Greece">Greece</option>
          <option value="UK">UK</option>
        </select>
        <input
          type="date"
          value={editedTrip.departureDate}
          onChange={(e) => setEditedTrip({ ...editedTrip, departureDate: e.target.value })}
          className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${
            trip.user === 'Cheryl'
              ? 'focus:ring-blue-500 focus:border-blue-500'
              : 'focus:ring-green-500 focus:border-green-500'
          }`}
        />
        <input
          type="date"
          value={editedTrip.arrivalDate}
          onChange={(e) => setEditedTrip({ ...editedTrip, arrivalDate: e.target.value })}
          className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${
            trip.user === 'Cheryl'
              ? 'focus:ring-blue-500 focus:border-blue-500'
              : 'focus:ring-green-500 focus:border-green-500'
          }`}
        />
      </div>
      <input
        type="text"
        placeholder="Notes"
        value={editedTrip.notes || ''}
        onChange={(e) => setEditedTrip({ ...editedTrip, notes: e.target.value })}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${
          trip.user === 'Cheryl'
            ? 'focus:ring-blue-500 focus:border-blue-500'
            : 'focus:ring-green-500 focus:border-green-500'
        }`}
      />
      <div className="flex space-x-2">
        <button
          onClick={() => onSave(editedTrip)}
          className={`px-4 py-2 text-white rounded-lg flex items-center ${
            trip.user === 'Cheryl'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
      </div>
    </div>
  );
};