import React, { useState, useEffect, useCallback } from 'react';
import type { Trip, AppData, CountryStats, User, SyncStatus } from './types';
import {
  Header,
  StatsCards,
  TripForm,
  TripList,
  LoadingSpinner,
  UserSelector,
  ResetConfirmationModal
} from './components';
import { redisService } from './services/redis';

const CountryTracker: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>('Cheryl');
  const [showResetModal, setShowResetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [editingTrip, setEditingTrip] = useState<string | null>(null);
  const [newTrip, setNewTrip] = useState<Partial<Trip>>({
    user: 'Cheryl',
    country: 'Greece',
    departureDate: '',
    arrivalDate: '',
    notes: ''
  });

  // Load user preference and data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('selected-user') as User;
    if (savedUser && (savedUser === 'Cheryl' || savedUser === 'Nigel')) {
      setSelectedUser(savedUser);
      setNewTrip(prev => ({ ...prev, user: savedUser }));
    }
    loadData();
  }, []);

  const saveData = useCallback(async () => {
    setSyncStatus('loading');
    try {
      const status = await redisService.saveTrips(trips);
      setSyncStatus(status);
    } catch (error) {
      console.error('Save error:', error);
      setSyncStatus('error');
    }
  }, [trips]);

  // Auto-save when trips change
  useEffect(() => {
    if (trips.length > 0) {
      saveData();
    }
  }, [trips, saveData]);

  const loadData = async () => {
    setSyncStatus('loading');
    try {
      const { trips: loadedTrips, status } = await redisService.loadTrips();
      // Migrate old trip data from traveler to user
      const migratedTrips = loadedTrips.map((trip: Trip & { traveler?: string }) => ({
        ...trip,
        user: trip.user || (trip.traveler as User) || 'Cheryl' as User
      }));
      setTrips(migratedTrips);
      setSyncStatus(status);
    } catch (error) {
      console.error('Load error:', error);
      setSyncStatus('error');
    }
  };

  const addTrip = async () => {
    if (!newTrip.country || !newTrip.departureDate || !newTrip.arrivalDate || !newTrip.user) {
      alert('Please fill in all required fields');
      return;
    }

    const trip: Trip = {
      id: Date.now().toString(),
      user: newTrip.user as User,
      country: newTrip.country as 'Greece' | 'UK',
      departureDate: newTrip.departureDate,
      arrivalDate: newTrip.arrivalDate,
      notes: newTrip.notes || ''
    };

    setTrips([...trips, trip]);
    setNewTrip({ 
      user: selectedUser, 
      country: 'Greece', 
      departureDate: '', 
      arrivalDate: '', 
      notes: '' 
    });

    // Log activity
    await redisService.logActivity('add_trip', selectedUser, `Added trip to ${trip.country}`);
  };

  const deleteTrip = async (id: string) => {
    const trip = trips.find(t => t.id === id);
    setTrips(trips.filter(trip => trip.id !== id));
    
    if (trip) {
      await redisService.logActivity('delete_trip', trip.user, `Deleted trip to ${trip.country}`);
    }
  };

  const updateTrip = async (id: string, updatedTrip: Partial<Trip>) => {
    const trip = trips.find(t => t.id === id);
    setTrips(trips.map(trip => trip.id === id ? { ...trip, ...updatedTrip } : trip));
    setEditingTrip(null);
    
    if (trip && updatedTrip.country) {
      await redisService.logActivity('update_trip', trip.user, `Updated trip to ${updatedTrip.country}`);
    }
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
        // Migrate old trip data from traveler to user
        const migratedTrips = (data.trips || []).map((trip: Trip & { traveler?: string }) => ({
          ...trip,
          user: trip.user || (trip.traveler as User) || 'Cheryl' as User
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

  const getCountryStats = (user: User): CountryStats => {
    const currentYear = new Date().getFullYear();
    const stats: CountryStats = { Greece: 0, UK: 0 };
    
    trips
      .filter(trip => trip.user === user)
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

  const getFilteredTrips = (user: User) => {
    return trips.filter(trip => trip.user === user);
  };

  const getUserColor = (user: User): string => {
    return user === 'Cheryl' ? 'border-l-blue-500' : 'border-l-green-500';
  };

  const handleUserChange = (user: User) => {
    setSelectedUser(user);
    setNewTrip(prev => ({ ...prev, user }));
    localStorage.setItem('selected-user', user);
  };

  const handleResetAllData = async (clearCloudData: boolean) => {
    setLoading(true);
    setSyncStatus('loading');

    try {
      // Clear cloud data if requested
      if (clearCloudData) {
        await redisService.clearAllData();
      }

      // Clear all state
      setTrips([]);
      setSelectedUser('Cheryl');
      setNewTrip({
        user: 'Cheryl',
        country: 'Greece',
        departureDate: '',
        arrivalDate: '',
        notes: ''
      });
      setEditingTrip(null);
      setShowResetModal(false);

      // Clear localStorage
      localStorage.removeItem('selected-user');

      // Log the reset activity
      await redisService.logActivity('reset_data', 'System', clearCloudData ? 'Full reset including cloud data' : 'Local reset only');

      const message = clearCloudData 
        ? 'All data has been reset including cloud storage.'
        : 'Local data has been reset. Cloud data remains unchanged.';
      
      alert(message);
      setSyncStatus('idle');
    } catch (error) {
      console.error('Reset error:', error);
      alert('Reset completed with errors. Some data may not have been cleared.');
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const stats = getCountryStats(selectedUser);
  const filteredTrips = getFilteredTrips(selectedUser);

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <Header
          onResetClick={() => setShowResetModal(true)}
          loading={loading}
          syncStatus={syncStatus}
        />

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <UserSelector
            selectedUser={selectedUser}
            onUserChange={handleUserChange}
          />
        </div>

        <StatsCards 
          stats={stats} 
          totalTrips={filteredTrips.length} 
          selectedUser={selectedUser}
        />

        <TripForm
          newTrip={newTrip}
          selectedUser={selectedUser}
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
          getUserColor={getUserColor}
        />

        {loading && <LoadingSpinner />}

        <ResetConfirmationModal
          isOpen={showResetModal}
          onConfirm={handleResetAllData}
          onCancel={() => setShowResetModal(false)}
          hasCloudData={syncStatus === 'connected'}
        />
      </div>
    </div>
  );
};


export default CountryTracker;