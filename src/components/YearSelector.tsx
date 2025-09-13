import React from 'react';
import { Calendar } from 'lucide-react';
import type { User } from '../types';

interface YearSelectorProps {
  selectedYear: number;
  availableYears: number[];
  selectedUser: User;
  onYearChange: (year: number) => void;
}

const getYearButtonStyle = (year: number, selectedYear: number, selectedUser: User): string => {
  if (year === selectedYear) {
    const userColor = selectedUser === 'Cheryl' 
      ? 'bg-blue-600 text-white border-blue-600' 
      : 'bg-green-600 text-white border-green-600';
    return `${userColor} transform scale-105 shadow-md`;
  }
  return 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 hover:border-gray-400 hover:shadow-sm';
};

export const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  availableYears,
  selectedUser,
  onYearChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Calendar className="h-5 w-5 text-gray-600" />
          <span className="text-lg font-semibold text-gray-900">Statistics for:</span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all duration-200 touch-manipulation ${getYearButtonStyle(year, selectedYear, selectedUser)}`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};