import type { Trip, SyncStatus } from '../types';

class RedisService {
  private apiBaseUrl = '/api/trips';

  constructor() {
    console.log('Using Redis via API endpoints');
  }

  private getFallbackKey(key: string): string {
    return `country-tracker:${key}`;
  }

  async saveTrips(trips: Trip[]): Promise<SyncStatus> {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save',
          trips
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      return result.status || 'connected';
    } catch (error) {
      console.error('Failed to save trips:', error);
      
      // Fallback to localStorage
      try {
        localStorage.setItem(this.getFallbackKey('trips'), JSON.stringify(trips));
        localStorage.setItem(this.getFallbackKey('lastUpdated'), new Date().toISOString());
        return 'idle';
      } catch (fallbackError) {
        console.error('Failed to save to localStorage:', fallbackError);
        return 'error';
      }
    }
  }

  async loadTrips(): Promise<{ trips: Trip[]; lastUpdated: string; status: SyncStatus }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}?action=load`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        trips: result.trips || [],
        lastUpdated: result.lastUpdated || new Date().toISOString(),
        status: result.status || 'connected'
      };
    } catch (error) {
      console.error('Failed to load trips from API:', error);
      
      // Fallback to localStorage
      try {
        const tripsData = localStorage.getItem(this.getFallbackKey('trips'));
        const lastUpdated = localStorage.getItem(this.getFallbackKey('lastUpdated'));
        
        return {
          trips: tripsData ? JSON.parse(tripsData) : [],
          lastUpdated: lastUpdated || new Date().toISOString(),
          status: 'idle'
        };
      } catch (fallbackError) {
        console.error('Failed to load from localStorage:', fallbackError);
        return {
          trips: [],
          lastUpdated: new Date().toISOString(),
          status: 'error'
        };
      }
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
      action,
      user,
      details
    };

    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'log-activity',
          activity
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to log activity to API:', error);
      
      // Fallback to localStorage
      try {
        const existing = localStorage.getItem(this.getFallbackKey('activity')) || '[]';
        const activities = JSON.parse(existing);
        activities.push({
          timestamp: new Date().toISOString(),
          ...activity
        });
        
        const recentActivities = activities.slice(-100);
        localStorage.setItem(this.getFallbackKey('activity'), JSON.stringify(recentActivities));
      } catch (fallbackError) {
        console.error('Failed to log activity to localStorage:', fallbackError);
      }
    }
  }

  async clearAllData(adminPassword?: string): Promise<SyncStatus> {
    try {
      const response = await fetch(`${this.apiBaseUrl}?action=clear-all`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminPassword
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Also clear localStorage as fallback
      localStorage.removeItem(this.getFallbackKey('trips'));
      localStorage.removeItem(this.getFallbackKey('lastUpdated'));
      localStorage.removeItem(this.getFallbackKey('activity'));
      
      return result.status || 'connected';
    } catch (error) {
      console.error('Failed to clear data:', error);
      
      // Re-throw auth errors
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        throw error;
      }
      
      // Try to clear localStorage anyway for other errors
      try {
        localStorage.removeItem(this.getFallbackKey('trips'));
        localStorage.removeItem(this.getFallbackKey('lastUpdated'));
        localStorage.removeItem(this.getFallbackKey('activity'));
        return 'idle';
      } catch (fallbackError) {
        console.error('Failed to clear localStorage:', fallbackError);
        return 'error';
      }
    }
  }

  async getConnectionStatus(): Promise<SyncStatus> {
    try {
      const response = await fetch(`${this.apiBaseUrl}?action=load`);
      return response.ok ? 'connected' : 'error';
    } catch {
      return 'error';
    }
  }
}

export const redisService = new RedisService();