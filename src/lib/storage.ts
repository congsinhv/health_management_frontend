/**
 * Token storage utilities
 * SSR-safe localStorage wrapper for managing authentication tokens
 */

import { STORAGE_KEYS } from './constants';
import { logger } from './logger';

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      // Verify tokens were actually removed
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (accessToken || refreshToken) {
        // If removeItem failed, try setting to empty string and removing again
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, '');
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, '');
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
    } catch (error) {
      // Log error but don't throw - try alternative methods
      logger.error(
        'Failed to clear tokens from localStorage',
        error instanceof Error ? error : new Error('Unknown error')
      );
      try {
        // Fallback: set to empty string
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, '');
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, '');
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      } catch (fallbackError) {
        logger.error(
          'Fallback token clearing also failed',
          fallbackError instanceof Error
            ? fallbackError
            : new Error('Unknown error')
        );
      }
    }
  },

  hasValidToken: (): boolean => {
    const token = tokenStorage.getAccessToken();
    return !!token;
  },
};
