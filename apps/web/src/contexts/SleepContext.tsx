import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { SleepSession } from '@sleep-tracker/shared';
import { SleepAPI, WebStorageAdapter, generateMockSessions } from '@sleep-tracker/shared';

interface SleepContextType {
  sessions: SleepSession[];
  isLoading: boolean;
  activeSession: SleepSession | null;
  createSession: () => Promise<void>;
  endSession: (id: string, quality: number) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
}

const SleepContext = createContext<SleepContextType | undefined>(undefined);

const api = new SleepAPI(new WebStorageAdapter());

export function SleepProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<SleepSession | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      let allSessions = await api.getAllSessions();
      
      // If no sessions exist, generate mock data
      if (allSessions.length === 0) {
        const mockSessions = generateMockSessions();
        for (const session of mockSessions) {
          await api.createSession(session.startTime);
          await api.endSession(session.id, session.endTime!, session.quality);
        }
        allSessions = await api.getAllSessions();
      }

      setSessions(allSessions.sort((a, b) => 
        b.startTime.getTime() - a.startTime.getTime()
      ));

      // Check for active session
      const active = allSessions.find(s => s.endTime === null);
      setActiveSession(active || null);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createSession() {
    try {
      const newSession = await api.createSession();
      setSessions(prev => [newSession, ...prev]);
      setActiveSession(newSession);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }

  async function endSession(id: string, quality: number) {
    try {
      const updated = await api.endSession(id, new Date(), quality);
      if (updated) {
        setSessions(prev => prev.map(s => s.id === id ? updated : s));
        setActiveSession(null);
      }
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  async function deleteSession(id: string) {
    try {
      await api.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  }

  return (
    <SleepContext.Provider
      value={{
        sessions,
        isLoading,
        activeSession,
        createSession,
        endSession,
        deleteSession,
      }}
    >
      {children}
    </SleepContext.Provider>
  );
}

export function useSleep() {
  const context = useContext(SleepContext);
  if (!context) {
    throw new Error('useSleep must be used within SleepProvider');
  }
  return context;
}
