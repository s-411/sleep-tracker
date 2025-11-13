// Core data types for sleep tracking

export interface SleepSession {
  id: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in minutes
  quality: number; // percentage 0-100
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SleepStatistics {
  averageDuration: number;
  averageQuality: number;
  totalSessions: number;
  bestSession: SleepSession | null;
  worstSession: SleepSession | null;
}

export interface UserPreferences {
  targetSleepDuration: number; // in minutes
  bedtimeReminder: boolean;
  reminderTime?: string;
  darkMode: boolean;
}

// Storage keys
export const STORAGE_KEYS = {
  SLEEP_SESSIONS: 'sleep_tracker_sessions',
  USER_PREFERENCES: 'sleep_tracker_preferences',
  ONBOARDING_COMPLETE: 'sleep_tracker_onboarding_complete',
} as const;

// Navigation types
export type NavigationRoute =
  | 'home'
  | 'tracking'
  | 'history'
  | 'details'
  | 'onboarding'
  | 'settings';
