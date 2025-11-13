import type { SleepSession } from '../types';
import { STORAGE_KEYS } from '../types';
import type { StorageAdapter } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export class SleepAPI {
  storage: StorageAdapter;

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  async getAllSessions(): Promise<SleepSession[]> {
    const data = await this.storage.getItem(STORAGE_KEYS.SLEEP_SESSIONS);
    if (!data) return [];

    const sessions = JSON.parse(data);
    // Convert date strings back to Date objects
    return sessions.map((session: any) => ({
      ...session,
      startTime: new Date(session.startTime),
      endTime: session.endTime ? new Date(session.endTime) : null,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
    }));
  }

  async getSessionById(id: string): Promise<SleepSession | null> {
    const sessions = await this.getAllSessions();
    return sessions.find((s) => s.id === id) || null;
  }

  async createSession(
    startTime: Date = new Date()
  ): Promise<SleepSession> {
    const newSession: SleepSession = {
      id: uuidv4(),
      startTime,
      endTime: null,
      duration: 0,
      quality: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const sessions = await this.getAllSessions();
    sessions.push(newSession);
    await this.saveSessions(sessions);

    return newSession;
  }

  async updateSession(
    id: string,
    updates: Partial<SleepSession>
  ): Promise<SleepSession | null> {
    const sessions = await this.getAllSessions();
    const index = sessions.findIndex((s) => s.id === id);

    if (index === -1) return null;

    sessions[index] = {
      ...sessions[index],
      ...updates,
      updatedAt: new Date(),
    };

    await this.saveSessions(sessions);
    return sessions[index];
  }

  async deleteSession(id: string): Promise<boolean> {
    const sessions = await this.getAllSessions();
    const filtered = sessions.filter((s) => s.id !== id);

    if (filtered.length === sessions.length) return false;

    await this.saveSessions(filtered);
    return true;
  }

  async endSession(id: string, endTime: Date = new Date(), quality: number): Promise<SleepSession | null> {
    const session = await this.getSessionById(id);
    if (!session) return null;

    const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000 / 60);

    return await this.updateSession(id, {
      endTime,
      duration,
      quality,
    });
  }

  private async saveSessions(sessions: SleepSession[]): Promise<void> {
    await this.storage.setItem(
      STORAGE_KEYS.SLEEP_SESSIONS,
      JSON.stringify(sessions)
    );
  }
}
