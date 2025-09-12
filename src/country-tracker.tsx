import React, { useState, useEffect } from 'react';
import type { Trip, AppData, GitHubConfig, CountryStats, Traveler } from './types';
import {
  Header,
  GitHubSettings,
  StatsCards,
  TripForm,
  TripList,
  LoadingSpinner,
  TravelerSelector,
  ResetConfirmationModal
} from './components';

const CountryTracker: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTraveler, setSelectedTraveler] = useState<Traveler>('Person 1');
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>({
    token: '',
    repo: '',
    owner: '',
    filename: 'country-tracker-data.json'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingTrip, setEditingTrip] = useState<string | null>(null);
  const [newTrip, setNewTrip] = useState<Partial<Trip>>({
    traveler: 'Person 1',
    country: 'Greece',
    departureDate: '',
    arrivalDate: '',
    notes: ''
  });

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('github-config');
    if (savedConfig) {
      setGithubConfig(JSON.parse(savedConfig));
    }
  }, []);

  const saveGitHubConfig = () => {
    localStorage.setItem('github-config', JSON.stringify(githubConfig));
    setShowSettings(false);
  };

  const syncWithGitHub = async (data?: AppData) => {
    if (!githubConfig.token || !githubConfig.repo || !githubConfig.owner) {
      alert('Please configure GitHub settings first');
      return;
    }

    setLoading(true);
    try {
      const url = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${githubConfig.filename}`;
      const headers = {
        'Authorization': `token ${githubConfig.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      };

      if (data) {
        // Save to GitHub
        let sha = '';
        try {
          const getResponse = await fetch(url, { headers });
          if (getResponse.ok) {
            const fileData = await getResponse.json();
            sha = fileData.sha;
          }
        } catch (_e) {
          // File might not exist yet
        }

        const content = btoa(JSON.stringify(data, null, 2));
        const body = {
          message: `Update country tracker data - ${new Date().toISOString()}`,
          content,
          ...(sha && { sha })
        };

        const response = await fetch(url, {
          method: 'PUT',
          headers,
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
      } else {
        // Load from GitHub
        const response = await fetch(url, { headers });
        if (response.ok) {
          const fileData = await response.json();
          const content = atob(fileData.content);
          const data: AppData = JSON.parse(content);
          // Migrate old trip data that doesn't have traveler field
          const migratedTrips = (data.trips || []).map(trip => ({
            ...trip,
            traveler: trip.traveler || 'Person 1' as Traveler
          }));
          setTrips(migratedTrips);
        } else if (response.status !== 404) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('GitHub sync error:', error);
      alert('Failed to sync with GitHub. Check your configuration and token permissions.');
    }
    setLoading(false);
  };

  const saveData = async () => {
    const data: AppData = {
      trips,
      lastUpdated: new Date().toISOString()
    };
    await syncWithGitHub(data);
  };

  const loadData = async () => {
    await syncWithGitHub();
  };

  const addTrip = () => {
    if (!newTrip.country || !newTrip.departureDate || !newTrip.arrivalDate || !newTrip.traveler) {
      alert('Please fill in all required fields');
      return;
    }

    const trip: Trip = {
      id: Date.now().toString(),
      traveler: newTrip.traveler as Traveler,
      country: newTrip.country as 'Greece' | 'UK',
      departureDate: newTrip.departureDate,
      arrivalDate: newTrip.arrivalDate,
      notes: newTrip.notes || ''
    };

    setTrips([...trips, trip]);
    setNewTrip({ 
      traveler: selectedTraveler, 
      country: 'Greece', 
      departureDate: '', 
      arrivalDate: '', 
      notes: '' 
    });
  };

  const deleteTrip = (id: string) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  const updateTrip = (id: string, updatedTrip: Partial<Trip>) => {
    setTrips(trips.map(trip => trip.id === id ? { ...trip, ...updatedTrip } : trip));
    setEditingTrip(null);
  };

  const exportData = () => {
    const data: AppData = {
      trips,
      lastUpdated: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `country-tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: AppData = JSON.parse(e.target?.result as string);
        // Migrate old trip data that doesn't have traveler field
        const migratedTrips = (data.trips || []).map(trip => ({
          ...trip,
          traveler: trip.traveler || 'Person 1' as Traveler
        }));
        setTrips(migratedTrips);
        alert('Data imported successfully');
      } catch {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
  };

  const getCountryStats = (traveler: Traveler): CountryStats => {
    const currentYear = new Date().getFullYear();
    const stats: CountryStats = { Greece: 0, UK: 0 };
    
    trips
      .filter(trip => trip.traveler === traveler)
      .forEach(trip => {
        const startYear = new Date(trip.departureDate).getFullYear();
        const endYear = new Date(trip.arrivalDate).getFullYear();
        
        if (startYear <= currentYear && endYear >= currentYear) {
          const days = calculateDays(trip.departureDate, trip.arrivalDate);
          stats[trip.country] += days;
        }
      });
    
    return stats;
  };

  const getFilteredTrips = (traveler: Traveler) => {
    return trips.filter(trip => trip.traveler === traveler);
  };

  const handleTravelerChange = (traveler: Traveler) => {
    setSelectedTraveler(traveler);
    setNewTrip(prev => ({ ...prev, traveler }));
  };

  const handleResetAllData = async (deleteFromGitHub: boolean) => {
    setLoading(true);

    try {
      // Delete from GitHub if requested and config is available
      if (deleteFromGitHub && githubConfig.token && githubConfig.repo && githubConfig.owner) {
        await deleteGitHubFile();
      }

      // Clear all state
      setTrips([]);
      setSelectedTraveler('Person 1');
      setGithubConfig({
        token: '',
        repo: '',
        owner: '',
        filename: 'country-tracker-data.json'
      });
      setNewTrip({
        traveler: 'Person 1',
        country: 'Greece',
        departureDate: '',
        arrivalDate: '',
        notes: ''
      });
      setEditingTrip(null);
      setShowSettings(false);
      setShowResetModal(false);

      // Clear localStorage
      localStorage.removeItem('github-config');

      const message = deleteFromGitHub 
        ? 'All data has been reset and GitHub file deleted successfully.'
        : 'All local data has been reset successfully. GitHub file remains unchanged.';
      
      alert(message);
    } catch (error) {
      console.error('Reset error:', error);
      alert('Reset completed with errors. Some data may not have been cleared from GitHub.');
    } finally {
      setLoading(false);
    }
  };

  const deleteGitHubFile = async () => {
    const url = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${githubConfig.filename}`;
    const headers = {
      'Authorization': `token ${githubConfig.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    try {
      // Get current file to obtain SHA
      const getResponse = await fetch(url, { headers });
      if (getResponse.ok) {
        const fileData = await getResponse.json();
        
        // Delete the file
        const deleteResponse = await fetch(url, {
          method: 'DELETE',
          headers,
          body: JSON.stringify({
            message: 'Delete country tracker data - Reset all data',
            sha: fileData.sha
          })
        });

        if (!deleteResponse.ok) {
          throw new Error(`GitHub API error: ${deleteResponse.status}`);
        }
      }
      // If file doesn't exist (404), that's fine - nothing to delete
    } catch (error) {
      console.error('Error deleting GitHub file:', error);
      throw error;
    }
  };

  const stats = getCountryStats(selectedTraveler);
  const filteredTrips = getFilteredTrips(selectedTraveler);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Header
          onSettingsClick={() => setShowSettings(!showSettings)}
          onLoadData={loadData}
          onSaveData={saveData}
          onResetClick={() => setShowResetModal(true)}
          loading={loading}
        />

        {showSettings && (
          <GitHubSettings
            config={githubConfig}
            onConfigChange={setGithubConfig}
            onSave={saveGitHubConfig}
            onCancel={() => setShowSettings(false)}
          />
        )}

        <TravelerSelector
          selectedTraveler={selectedTraveler}
          onTravelerChange={handleTravelerChange}
        />

        <StatsCards 
          stats={stats} 
          totalTrips={filteredTrips.length} 
          selectedTraveler={selectedTraveler}
        />

        <TripForm
          newTrip={newTrip}
          selectedTraveler={selectedTraveler}
          onTripChange={setNewTrip}
          onAddTrip={addTrip}
        />

        <TripList
          trips={filteredTrips}
          editingTrip={editingTrip}
          onEditTrip={setEditingTrip}
          onUpdateTrip={updateTrip}
          onDeleteTrip={deleteTrip}
          onCancelEdit={() => setEditingTrip(null)}
          onExportData={exportData}
          onImportData={importData}
          calculateDays={calculateDays}
        />

        {loading && <LoadingSpinner />}

        <ResetConfirmationModal
          isOpen={showResetModal}
          onConfirm={handleResetAllData}
          onCancel={() => setShowResetModal(false)}
          hasGitHubConfig={!!(githubConfig.token && githubConfig.repo && githubConfig.owner)}
        />
      </div>
    </div>
  );
};


export default CountryTracker;