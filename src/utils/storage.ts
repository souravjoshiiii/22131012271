import { ShortenedUrl } from '../types';
import { logger } from './logger';

const STORAGE_KEYS = {
  SHORTENED_URLS: 'url_shortener_urls',
  SETTINGS: 'url_shortener_settings',
  THEME: 'url_shortener_theme'
} as const;

export class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private getItem<T>(key: string): T | null {
    if (!this.isStorageAvailable()) {
      logger.warn('localStorage is not available');
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      logger.error('Error reading from localStorage', { key, error });
      return null;
    }
  }

  private setItem<T>(key: string, value: T): boolean {
    if (!this.isStorageAvailable()) {
      logger.warn('localStorage is not available');
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Error writing to localStorage', { key, error });
      return false;
    }
  }

  // URL Management
  getShortenedUrls(): ShortenedUrl[] {
    return this.getItem<ShortenedUrl[]>(STORAGE_KEYS.SHORTENED_URLS) || [];
  }

  saveShortenedUrls(urls: ShortenedUrl[]): boolean {
    // Keep only the last 5 URLs
    const limitedUrls = urls.slice(-5);
    return this.setItem(STORAGE_KEYS.SHORTENED_URLS, limitedUrls);
  }

  addShortenedUrl(url: ShortenedUrl): boolean {
    const urls = this.getShortenedUrls();
    urls.push(url);
    return this.saveShortenedUrls(urls);
  }

  removeShortenedUrl(id: string): boolean {
    const urls = this.getShortenedUrls();
    const filteredUrls = urls.filter(url => url.id !== id);
    return this.saveShortenedUrls(filteredUrls);
  }

  clearShortenedUrls(): boolean {
    return this.setItem(STORAGE_KEYS.SHORTENED_URLS, []);
  }

  // Settings Management
  getSettings(): Record<string, any> {
    return this.getItem<Record<string, any>>(STORAGE_KEYS.SETTINGS) || {};
  }

  saveSettings(settings: Record<string, any>): boolean {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  getSetting<T>(key: string, defaultValue: T): T {
    const settings = this.getSettings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
  }

  setSetting<T>(key: string, value: T): boolean {
    const settings = this.getSettings();
    settings[key] = value;
    return this.saveSettings(settings);
  }

  // Theme Management
  getTheme(): 'light' | 'dark' {
    return this.getItem<'light' | 'dark'>(STORAGE_KEYS.THEME) || 'light';
  }

  setTheme(theme: 'light' | 'dark'): boolean {
    return this.setItem(STORAGE_KEYS.THEME, theme);
  }

  // Utility methods
  clearAll(): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      logger.error('Error clearing localStorage', { error });
      return false;
    }
  }

  getStorageSize(): number {
    if (!this.isStorageAvailable()) {
      return 0;
    }

    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }
}

// Export singleton instance
export const storage = StorageManager.getInstance();

// Convenience functions
export const getShortenedUrls = () => storage.getShortenedUrls();
export const saveShortenedUrls = (urls: ShortenedUrl[]) => storage.saveShortenedUrls(urls);
export const addShortenedUrl = (url: ShortenedUrl) => storage.addShortenedUrl(url);
export const removeShortenedUrl = (id: string) => storage.removeShortenedUrl(id);
export const clearShortenedUrls = () => storage.clearShortenedUrls();
export const getTheme = () => storage.getTheme();
export const setTheme = (theme: 'light' | 'dark') => storage.setTheme(theme); 