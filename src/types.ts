export type Traveler = 'Person 1' | 'Person 2';

export type Trip = {
  id: string;
  traveler: Traveler;
  country: 'Greece' | 'UK';
  departureDate: string;
  arrivalDate: string;
  notes?: string;
};

export type AppData = {
  trips: Trip[];
  lastUpdated: string;
};

export type GitHubConfig = {
  token: string;
  repo: string;
  owner: string;
  filename: string;
};

export type CountryStats = {
  Greece: number;
  UK: number;
};

export type TravelerStats = {
  [traveler in Traveler]: CountryStats;
};