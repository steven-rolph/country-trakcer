import React from 'react';
import type { GitHubConfig } from '../types';

interface GitHubSettingsProps {
  config: GitHubConfig;
  onConfigChange: (config: GitHubConfig) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const GitHubSettings: React.FC<GitHubSettingsProps> = ({
  config,
  onConfigChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">GitHub Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="GitHub Token"
          value={config.token}
          onChange={(e) => onConfigChange({ ...config, token: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Repository Owner"
          value={config.owner}
          onChange={(e) => onConfigChange({ ...config, owner: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Repository Name"
          value={config.repo}
          onChange={(e) => onConfigChange({ ...config, repo: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Filename"
          value={config.filename}
          onChange={(e) => onConfigChange({ ...config, filename: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};