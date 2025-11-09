/**
 * Authentication service
 * Handles all authentication-related API calls
 */

import apiClient from './api';
import { tokenStorage } from '@/lib/storage';
import type { UserData } from '@/types/user';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user?: UserData;
}

export interface GoogleAuthResponse {
  authorization_url: string;
  state: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  provider?: string;
  is_active?: boolean;
  email_verified?: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetData {
  token: string;
  new_password: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<TokenPair> => {
    const response = await apiClient.post<TokenPair>(
      '/api/v1/auth/login-with-refresh',
      credentials
    );
    return response.data;
  },

  /**
   * Register a new user
   */
  register: async (
    userData: RegisterData
  ): Promise<Omit<UserData, 'password'>> => {
    const response = await apiClient.post<Omit<UserData, 'password'>>(
      '/api/v1/users/',
      {
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        provider: userData.provider || 'portal',
        is_active: userData.is_active ?? true,
        email_verified: userData.email_verified ?? false,
      }
    );
    return response.data;
  },

  /**
   * Refresh authentication using refresh token
   */
  refresh: async (): Promise<TokenPair> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Không có refresh token');
    }
    const response = await apiClient.post<TokenPair>('/api/v1/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * Logout - revoke refresh token
   */
  logout: async (refreshToken?: string): Promise<{ message: string }> => {
    const token = refreshToken || tokenStorage.getRefreshToken();
    if (!token) {
      return Promise.resolve({ message: 'Logged out' });
    }
    const response = await apiClient.post<{ message: string }>(
      '/api/v1/auth/logout',
      {
        refresh_token: token,
      }
    );
    return response.data;
  },

  /**
   * Logout all devices - revoke all refresh tokens
   */
  logoutAll: async (accessToken?: string): Promise<{ message: string }> => {
    const token = accessToken || tokenStorage.getAccessToken();
    const response = await apiClient.post<{ message: string }>(
      '/api/v1/auth/logout-all',
      {},
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      }
    );
    return response.data;
  },

  /**
   * Get current user profile
   */
  me: async (): Promise<UserData> => {
    const response = await apiClient.get<UserData>('/api/v1/auth/me');
    return response.data;
  },

  /**
   * Get Google OAuth login URL
   */
  googleLogin: async (): Promise<GoogleAuthResponse> => {
    const response = await apiClient.get<GoogleAuthResponse>(
      '/api/v1/auth/google/login'
    );
    return response.data;
  },

  /**
   * Handle Google OAuth callback
   */
  googleCallback: async (data: {
    code: string;
    state?: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/api/v1/auth/google/callback',
      data
    );
    return response.data;
  },

  /**
   * Verify email address
   */
  verifyEmail: async (
    token: string,
    method: 'GET' | 'POST' = 'GET'
  ): Promise<{ message: string }> => {
    if (method === 'POST') {
      const response = await apiClient.post<{ message: string }>(
        '/api/v1/auth/verify-email',
        { token }
      );
      return response.data;
    }
    const response = await apiClient.get<{ message: string }>(
      `/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`
    );
    return response.data;
  },

  /**
   * Resend email verification
   */
  resendVerification: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/api/v1/auth/resend-verification'
    );
    return response.data;
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/api/v1/auth/request-password-reset',
      { email }
    );
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (
    data: PasswordResetData
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/api/v1/auth/reset-password',
      {
        token: data.token,
        new_password: data.new_password,
      }
    );
    return response.data;
  },

  /**
   * Change password (requires authentication)
   */
  changePassword: async (
    data: ChangePasswordData
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/api/v1/auth/change-password',
      {
        current_password: data.current_password,
        new_password: data.new_password,
      }
    );
    return response.data;
  },

  /**
   * Get user profile (alias for me)
   */
  getProfile: async (): Promise<UserData> => {
    return authService.me();
  },
};
