import type { SleepSession } from '../types';
import { subDays, subHours } from 'date-fns';

export function generateMockSessions(): SleepSession[] {
  const now = new Date();

  return [
    {
      id: '1',
      startTime: subDays(subHours(now, 7.5), 0),
      endTime: subDays(now, 0),
      duration: 450, // 7h 30m
      quality: 85,
      createdAt: subDays(now, 0),
      updatedAt: subDays(now, 0),
    },
    {
      id: '2',
      startTime: subDays(subHours(now, 8.25), 1),
      endTime: subDays(subHours(now, 0.25), 1),
      duration: 495, // 8h 15m
      quality: 92,
      createdAt: subDays(now, 1),
      updatedAt: subDays(now, 1),
    },
    {
      id: '3',
      startTime: subDays(subHours(now, 6.75), 2),
      endTime: subDays(subHours(now, 0.5), 2),
      duration: 405, // 6h 45m
      quality: 78,
      createdAt: subDays(now, 2),
      updatedAt: subDays(now, 2),
    },
    {
      id: '4',
      startTime: subDays(subHours(now, 7.83), 3),
      endTime: subDays(subHours(now, 0.33), 3),
      duration: 470, // 7h 50m
      quality: 88,
      createdAt: subDays(now, 3),
      updatedAt: subDays(now, 3),
    },
  ];
}
