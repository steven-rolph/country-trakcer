import React from 'react';
import { User } from 'lucide-react';
import type { Traveler } from '../types';

interface TravelerSelectorProps {
  selectedTraveler: Traveler;
  onTravelerChange: (traveler: Traveler) => void;
}

export const TravelerSelector: React.FC<TravelerSelectorProps> = ({
  selectedTraveler,
  onTravelerChange
}) => {
  const travelers: Traveler[] = ['Person 1', 'Person 2'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center space-x-4">
        <User className="w-5 h-5 text-gray-600" />
        <h3 className="text-sm font-medium text-gray-700">Viewing trips for:</h3>
        <div className="flex space-x-2">
          {travelers.map((traveler) => (
            <button
              key={traveler}
              onClick={() => onTravelerChange(traveler)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTraveler === traveler
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {traveler}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};