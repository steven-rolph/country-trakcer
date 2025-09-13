import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Trip } from '../types';

interface DeleteTripModalProps {
  isOpen: boolean;
  trip: Trip | null;
  onConfirm: (adminPassword: string) => void;
  onCancel: () => void;
}

export const DeleteTripModal: React.FC<DeleteTripModalProps> = ({
  isOpen,
  trip,
  onConfirm,
  onCancel
}) => {
  const [adminPassword, setAdminPassword] = useState('');

  const handleConfirm = () => {
    if (adminPassword.trim()) {
      onConfirm(adminPassword);
      setAdminPassword('');
    }
  };

  const handleCancel = () => {
    onCancel();
    setAdminPassword('');
  };

  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Trip</h3>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this trip?
          </p>

          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-2xl">
                {trip.country === 'Greece' ? '🇬🇷' : '🇬🇧'}
              </span>
              <span className="font-medium">{trip.country}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                trip.user === 'Cheryl' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {trip.user}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {new Date(trip.departureDate).toLocaleDateString('en-GB')} to {new Date(trip.arrivalDate).toLocaleDateString('en-GB')}
            </p>
            {trip.notes && (
              <p className="text-sm text-gray-500 mt-1">{trip.notes}</p>
            )}
          </div>

          <p className="text-red-600 text-sm font-medium mb-4">
            This action cannot be undone.
          </p>

          <div className="mb-4">
            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Password:
            </label>
            <input
              type="password"
              id="adminPassword"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              autoFocus
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!adminPassword.trim()}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              adminPassword.trim()
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Delete Trip
          </button>
        </div>
      </div>
    </div>
  );
};