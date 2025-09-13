import type { Trip, SyncStatus } from '../types';

class RedisService {
  constructor() {
    // For now, we'll use localStorage as the primary storage
    // This ensures the app works reliably while we set up proper cloud storage
    console.log('Using localStorage as primary storage');
  }

  private getFallbackKey(key: string): string {
    return `country-tracker:${key}`;
  }

  async saveTrips(trips: Trip[]): Promise<SyncStatus> {
    const timestamp = new Date().toISOString();
    
    try {
      localStorage.setItem(this.getFallbackKey('trips'), JSON.stringify(trips));
      localStorage.setItem(this.getFallbackKey('lastUpdated'), timestamp);
      return 'idle' as SyncStatus;
    } catch (error) {
      console.error('Failed to save trips:', error);
      return 'error' as SyncStatus;
    }
  }

  async loadTrips(): Promise<{ trips: Trip[]; lastUpdated: string; status: SyncStatus }> {
    try {
      const tripsData = localStorage.getItem(this.getFallbackKey('trips'));
      const lastUpdated = localStorage.getItem(this.getFallbackKey('lastUpdated'));
      
      const trips = tripsData ? JSON.parse(tripsData) : [];
      return {
        trips,
        lastUpdated: lastUpdated || new Date().toISOString(),
        status: 'idle' as SyncStatus
      };
    } catch (error) {
      console.error('Failed to load trips:', error);
      return {
        trips: [],
        lastUpdated: new Date().toISOString(),
        status: 'error' as SyncStatus
      };
    }
  }

  async addTrip(trip: Trip): Promise<SyncStatus> {
    const { trips } = await this.loadTrips();
    const newTrips = [...trips, trip];
    return this.saveTrips(newTrips);
  }

  async updateTrip(tripId: string, updatedTrip: Trip): Promise<SyncStatus> {
    const { trips } = await this.loadTrips();
    const newTrips = trips.map(trip => trip.id === tripId ? updatedTrip : trip);
    return this.saveTrips(newTrips);
  }

  async deleteTrip(tripId: string): Promise<SyncStatus> {
    const { trips } = await this.loadTrips();
    const newTrips = trips.filter(trip => trip.id !== tripId);
    return this.saveTrips(newTrips);
  }

  async logActivity(action: string, user: string, details: string): Promise<void> {
    const activity = {
      timestamp: new Date().toISOString(),
      action,
      user,
      details
    };

    try {
      const existing = localStorage.getItem(this.getFallbackKey('activity')) || '[]';
      const activities = JSON.parse(existing);
      activities.push(activity);
      
      // Keep only last 100 activities
      const recentActivities = activities.slice(-100);
      localStorage.setItem(this.getFallbackKey('activity'), JSON.stringify(recentActivities));
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  async clearAllData(): Promise<SyncStatus> {
    try {
      localStorage.removeItem(this.getFallbackKey('trips'));
      localStorage.removeItem(this.getFallbackKey('lastUpdated'));
      localStorage.removeItem(this.getFallbackKey('activity'));
      return 'idle' as SyncStatus;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return 'error' as SyncStatus;
    }
  }

  getConnectionStatus(): SyncStatus {
    return 'idle'; // Always return idle since we're using localStorage
  }
}

export const redisService = new RedisService();