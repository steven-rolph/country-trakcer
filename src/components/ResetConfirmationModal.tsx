import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onConfirm: (clearCloudData: boolean, adminPassword?: string) => void;
  onCancel: () => void;
  hasCloudData: boolean;
  adminMode: boolean;
}

export const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  hasCloudData,
  adminMode
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [clearCloudData, setClearCloudData] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleConfirm = () => {
    if (confirmationText === 'RESET') {
      onConfirm(clearCloudData, adminPassword);
      setConfirmationText('');
      setClearCloudData(false);
      setAdminPassword('');
    }
  };

  const handleCancel = () => {
    onCancel();
    setConfirmationText('');
    setClearCloudData(false);
    setAdminPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Reset All Data</h3>
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
            This action will permanently delete:
          </p>
          <ul className="text-sm text-gray-500 space-y-1 mb-4 ml-4">
            <li>• All trip data for both users</li>
            <li>• User preferences</li>
            <li>• All locally stored data</li>
            {hasCloudData && clearCloudData && (
              <li className="text-red-600 font-medium">• Data from cloud storage</li>
            )}
          </ul>

          {hasCloudData && adminMode && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="clearCloudData"
                  checked={clearCloudData}
                  onChange={(e) => setClearCloudData(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="clearCloudData" className="text-sm font-medium text-gray-700">
                  Also clear data from cloud storage
                </label>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                {clearCloudData 
                  ? "⚠️ This will permanently delete all data from cloud storage"
                  : "ℹ️ Cloud data will remain and will be reloaded next time you open the app"
                }
              </p>
              {clearCloudData && (
                <div className="mt-3">
                  <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Password:
                  </label>
                  <input
                    type="password"
                    id="adminPassword"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  />
                </div>
              )}
            </div>
          )}

          <p className="text-red-600 text-sm font-medium mb-4">
            This action cannot be undone.
          </p>
          <p className="text-gray-600 text-sm mb-3">
            To confirm, type <strong>RESET</strong> in the field below:
          </p>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type RESET to confirm"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            autoFocus
          />
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
            disabled={confirmationText !== 'RESET'}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              confirmationText === 'RESET'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};