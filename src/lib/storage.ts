/**
 * Token storage utilities
 * SSR-safe localStorage wrapper for managing authentication tokens
 */

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refresh_token', token);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Verify tokens were actually removed
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      if (accessToken || refreshToken) {
        // If removeItem failed, try setting to empty string and removing again
        localStorage.setItem('access_token', '');
        localStorage.setItem('refresh_token', '');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } catch (error) {
      // Log error but don't throw - try alternative methods
      console.error('Failed to clear tokens from localStorage:', error);
      try {
        // Fallback: set to empty string
        localStorage.setItem('access_token', '');
        localStorage.setItem('refresh_token', '');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } catch (fallbackError) {
        console.error('Fallback token clearing also failed:', fallbackError);
      }
    }
  },

  hasValidToken: (): boolean => {
    const token = tokenStorage.getAccessToken();
    return !!token;
  },
};
