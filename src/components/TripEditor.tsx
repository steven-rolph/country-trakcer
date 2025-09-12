import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import type { Trip, Traveler } from '../types';

interface TripEditorProps {
  trip: Trip;
  onSave: (trip: Partial<Trip>) => void;
  onCancel: () => void;
}

export const TripEditor: React.FC<TripEditorProps> = ({ trip, onSave, onCancel }) => {
  const [editedTrip, setEditedTrip] = useState<Partial<Trip>>({
    traveler: trip.traveler,
    country: trip.country,
    departureDate: trip.departureDate,
    arrivalDate: trip.arrivalDate,
    notes: trip.notes
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          value={editedTrip.traveler}
          onChange={(e) => setEditedTrip({ ...editedTrip, traveler: e.target.value as Traveler })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Person 1">Person 1</option>
          <option value="Person 2">Person 2</option>
        </select>
        <select
          value={editedTrip.country}
          onChange={(e) => setEditedTrip({ ...editedTrip, country: e.target.value as 'Greece' | 'UK' })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Greece">Greece</option>
          <option value="UK">UK</option>
        </select>
        <input
          type="date"
          value={editedTrip.departureDate}
          onChange={(e) => setEditedTrip({ ...editedTrip, departureDate: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="date"
          value={editedTrip.arrivalDate}
          onChange={(e) => setEditedTrip({ ...editedTrip, arrivalDate: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Notes"
          value={editedTrip.notes || ''}
          onChange={(e) => setEditedTrip({ ...editedTrip, notes: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onSave(editedTrip)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
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