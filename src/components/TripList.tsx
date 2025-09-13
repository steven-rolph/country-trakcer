import React from 'react';
import { MapPin, Download, Upload, Edit3, Trash2 } from 'lucide-react';
import type { Trip, User } from '../types';
import { TripEditor } from './TripEditor';

interface TripListProps {
  trips: Trip[];
  editingTrip: string | null;
  onEditTrip: (id: string) => void;
  onUpdateTrip: (id: string, updatedTrip: Partial<Trip>) => void;
  onDeleteTrip: (id: string) => void;
  onCancelEdit: () => void;
  onExportData: () => void;
  onImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  calculateDays: (startDate: string, endDate: string) => number;
  getUserColor: (user: User) => string;
}

export const TripList: React.FC<TripListProps> = ({
  trips,
  editingTrip,
  onEditTrip,
  onUpdateTrip,
  onDeleteTrip,
  onCancelEdit,
  onExportData,
  onImportData,
  calculateDays,
  getUserColor
}) => {
  const sortedTrips = [...trips].sort((a, b) => 
    new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Trip History</h2>
          <div className="flex space-x-2">
            <button
              onClick={onExportData}
              className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
            <label className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center cursor-pointer">
              <Upload className="w-4 h-4 mr-1" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={onImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
      
      {sortedTrips.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No trips recorded yet. Add your first trip above!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {sortedTrips.map((trip) => (
            <div key={trip.id} className="p-6">
              {editingTrip === trip.id ? (
                <TripEditor
                  trip={trip}
                  onSave={(updatedTrip) => onUpdateTrip(trip.id, updatedTrip)}
                  onCancel={onCancelEdit}
                />
              ) : (
                <div className={`flex items-center justify-between border-l-4 ${getUserColor(trip.user)} pl-4`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${trip.country === 'Greece' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{trip.country}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${trip.user === 'Steven' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {trip.user}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {trip.departureDate} to {trip.arrivalDate}
                        <span className="ml-2 text-gray-400">
                          ({calculateDays(trip.departureDate, trip.arrivalDate)} days)
                        </span>
                      </p>
                      {trip.notes && (
                        <p className="text-sm text-gray-500 mt-1">{trip.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditTrip(trip.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTrip(trip.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};