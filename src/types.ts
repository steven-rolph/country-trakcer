export type User = 'Steven' | 'Partner';

export type Trip = {
  id: string;
  user: User;
  country: 'Greece' | 'UK';
  departureDate: string;
  arrivalDate: string;
  notes?: string;
};

export type AppData = {
  trips: Trip[];
  lastUpdated: string;
};

export type CountryStats = {
  Greece: number;
  UK: number;
};

export type UserStats = {
  [user in User]: CountryStats;
};

export type SyncStatus = 'idle' | 'loading' | 'error' | 'connected';