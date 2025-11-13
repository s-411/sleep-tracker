// Storage abstraction layer for cross-platform compatibility

export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Web implementation using localStorage
export class WebStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }
}

// Mobile implementation using AsyncStorage
export class MobileStorageAdapter implements StorageAdapter {
  asyncStorage: any;

  constructor(asyncStorage: any) {
    this.asyncStorage = asyncStorage;
  }

  async getItem(key: string): Promise<string | null> {
    return await this.asyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.asyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await this.asyncStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    await this.asyncStorage.clear();
  }
}
