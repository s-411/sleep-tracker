import type { SleepSession, SleepStatistics } from '../types';
import { format, differenceInMinutes } from 'date-fns';

export function calculateDuration(startTime: Date, endTime: Date): number {
  return differenceInMinutes(endTime, startTime);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

export function formatDate(date: Date): string {
  return format(date, 'MMM d');
}

export function calculateStatistics(sessions: SleepSession[]): SleepStatistics {
  if (sessions.length === 0) {
    return {
      averageDuration: 0,
      averageQuality: 0,
      totalSessions: 0,
      bestSession: null,
      worstSession: null,
    };
  }

  const completedSessions = sessions.filter((s) => s.endTime !== null);

  const totalDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalQuality = completedSessions.reduce((sum, s) => sum + s.quality, 0);

  const averageDuration = totalDuration / completedSessions.length;
  const averageQuality = totalQuality / completedSessions.length;

  const bestSession = completedSessions.reduce((best, current) =>
    current.quality > (best?.quality || 0) ? current : best
  , completedSessions[0]);

  const worstSession = completedSessions.reduce((worst, current) =>
    current.quality < (worst?.quality || 100) ? current : worst
  , completedSessions[0]);

  return {
    averageDuration,
    averageQuality,
    totalSessions: completedSessions.length,
    bestSession,
    worstSession,
  };
}

export function getQualityLabel(quality: number): string {
  if (quality >= 90) return 'Excellent';
  if (quality >= 80) return 'Good';
  if (quality >= 70) return 'Fair';
  if (quality >= 60) return 'Poor';
  return 'Very Poor';
}
