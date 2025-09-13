import { Redis } from '@upstash/redis';
import type { Trip, SyncStatus } from '../types';

class RedisService {
  private redis: Redis | null = null;
  private fallbackEnabled = true;

  constructor() {
    try {
      // Check for Redis URL first (Vercel provides this)
      const redisUrl = import.meta.env.VITE_REDIS_URL;
      
      if (redisUrl) {
        console.log('Using Redis URL from environment');
        // Use fromURL method which handles the Redis protocol URL
        this.redis = Redis.fromURL(redisUrl);
      } else {
        console.log('Trying Upstash environment variables');
        // Fallback to standard Upstash environment variables
        this.redis = Redis.fromEnv();
      }
      console.log('Redis connection initialized successfully');
    } catch (error) {
      console.warn('Redis not configured, using localStorage fallback', error);
      this.redis = null;
    }
  }

  private getFallbackKey(key: string): string {
    return `country-tracker:${key}`;
  }

  private async withFallback<T>(
    redisOperation: () => Promise<T>,
    fallbackOperation: () => T,
    defaultValue: T
  ): Promise<T> {
    if (!this.redis || !this.fallbackEnabled) {
      return fallbackOperation();
    }

    try {
      const result = await redisOperation();
      return result !== null ? result : defaultValue;
    } catch (error) {
      console.warn('Redis operation failed, falling back to localStorage:', error);
      return fallbackOperation();
    }
  }

  async saveTrips(trips: Trip[]): Promise<SyncStatus> {
    const timestamp = new Date().toISOString();
    
    return this.withFallback(
      async () => {
        await this.redis!.set('country-tracker:trips', JSON.stringify(trips));
        await this.redis!.set('country-tracker:lastUpdated', timestamp);
        return 'connected' as SyncStatus;
      },
      () => {
        localStorage.setItem(this.getFallbackKey('trips'), JSON.stringify(trips));
        localStorage.setItem(this.getFallbackKey('lastUpdated'), timestamp);
        return 'idle' as SyncStatus;
      },
      'error' as SyncStatus
    );
  }

  async loadTrips(): Promise<{ trips: Trip[]; lastUpdated: string; status: SyncStatus }> {
    return this.withFallback(
      async () => {
        const tripsData = await this.redis!.get<string>('country-tracker:trips');
        const lastUpdated = await this.redis!.get<string>('country-tracker:lastUpdated');
        
        const trips = tripsData ? JSON.parse(tripsData) : [];
        return {
          trips,
          lastUpdated: lastUpdated || new Date().toISOString(),
          status: 'connected' as SyncStatus
        };
      },
      () => {
        const tripsData = localStorage.getItem(this.getFallbackKey('trips'));
        const lastUpdated = localStorage.getItem(this.getFallbackKey('lastUpdated'));
        
        const trips = tripsData ? JSON.parse(tripsData) : [];
        return {
          trips,
          lastUpdated: lastUpdated || new Date().toISOString(),
          status: 'idle' as SyncStatus
        };
      },
      {
        trips: [],
        lastUpdated: new Date().toISOString(),
        status: 'error' as SyncStatus
      }
    );
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

    this.withFallback(
      async () => {
        const existing = await this.redis!.get<string>('country-tracker:activity') || '[]';
        const activities = JSON.parse(existing);
        activities.push(activity);
        
        // Keep only last 100 activities
        const recentActivities = activities.slice(-100);
        await this.redis!.set('country-tracker:activity', JSON.stringify(recentActivities));
      },
      () => {
        const existing = localStorage.getItem(this.getFallbackKey('activity')) || '[]';
        const activities = JSON.parse(existing);
        activities.push(activity);
        
        // Keep only last 100 activities
        const recentActivities = activities.slice(-100);
        localStorage.setItem(this.getFallbackKey('activity'), JSON.stringify(recentActivities));
      },
      undefined
    );
  }

  async clearAllData(): Promise<SyncStatus> {
    return this.withFallback(
      async () => {
        await this.redis!.del('country-tracker:trips');
        await this.redis!.del('country-tracker:lastUpdated'); 
        await this.redis!.del('country-tracker:activity');
        return 'connected' as SyncStatus;
      },
      () => {
        localStorage.removeItem(this.getFallbackKey('trips'));
        localStorage.removeItem(this.getFallbackKey('lastUpdated'));
        localStorage.removeItem(this.getFallbackKey('activity'));
        return 'idle' as SyncStatus;
      },
      'error' as SyncStatus
    );
  }

  getConnectionStatus(): SyncStatus {
    return this.redis ? 'connected' : 'idle';
  }
}

export const redisService = new RedisService();