import { logger } from './logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Token storage utilities
export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  setToken: (token: string): void => {
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
    const token = tokenStorage.getToken();
    return !!token;
  },
};

interface ApiErrorData {
  message?: string;
  detail?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: ApiErrorData
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface UserProfile {
  id?: number;
  user_id?: number;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  date_of_birth?: string;
  family_medical_history?: string;
  goal?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserData {
  id?: number;
  email?: string;
  phone_number?: string;
  email_verified?: boolean;
  is_active?: boolean;
  provider?: string;
  created_at?: string;
  updated_at?: string;
  profile?: UserProfile | null;
  [key: string]: unknown;
}

interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user?: UserData;
}

interface GoogleAuthResponse {
  authorization_url: string;
  state: string;
}

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';

  logger.apiRequest(method, endpoint, {
    headers: options.headers,
    hasBody: !!options.body,
  });

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add Authorization header only for protected endpoints and when token exists
  const token = tokenStorage.getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // Handle 401 Unauthorized - try to refresh token
      const isAuthEndpoint =
        endpoint.includes('/auth/login') ||
        endpoint.includes('/auth/register') ||
        endpoint.includes('/auth/refresh');
      if (
        response.status === 401 &&
        !(config as any)._retry &&
        !isAuthEndpoint
      ) {
        const originalRequest = config as any;

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise<T>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken: unknown) => {
              if (typeof newToken !== 'string') {
                throw new ApiError('Invalid token received', 401);
              }
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${newToken}`,
              };
              return apiRequest<T>(endpoint, originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken) {
          // No refresh token, clear tokens and reject
          processQueue(new Error('No refresh token'), null);
          tokenStorage.clearTokens();
          isRefreshing = false;

          // Redirect to login if in browser
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }

          throw new ApiError('Phiên đăng nhập đã hết hạn', 401);
        }

        try {
          // Try to refresh the token
          const refreshResponse = await fetch(
            `${API_BASE_URL}/api/v1/auth/refresh`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh_token: refreshToken }),
            }
          );

          if (!refreshResponse.ok) {
            // Refresh failed, clear tokens and reject
            processQueue(new Error('Refresh token invalid'), null);
            tokenStorage.clearTokens();
            isRefreshing = false;

            // Redirect to login if in browser
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }

            throw new ApiError('Phiên đăng nhập đã hết hạn', 401);
          }

          const tokenData: TokenPair = await refreshResponse.json();

          // Update stored tokens
          tokenStorage.setToken(tokenData.access_token);
          tokenStorage.setRefreshToken(tokenData.refresh_token);

          // Update authorization header
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${tokenData.access_token}`,
          };

          // Process queued requests
          processQueue(null, tokenData.access_token);

          // Retry original request
          isRefreshing = false;
          return apiRequest<T>(endpoint, originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and reject
          processQueue(refreshError, null);
          tokenStorage.clearTokens();
          isRefreshing = false;

          // Redirect to login if in browser
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }

          throw new ApiError('Phiên đăng nhập đã hết hạn', 401);
        }
      }

      // Handle other errors
      let errorData: ApiErrorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const errorMessage =
        errorData.message || errorData.detail || 'Đã xảy ra lỗi';

      logger.apiError(
        method,
        endpoint,
        response.status,
        new Error(errorMessage)
      );

      throw new ApiError(errorMessage, response.status, errorData);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return response.text() as unknown as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Lỗi kết nối mạng';
    logger.apiError(
      method,
      endpoint,
      0,
      error instanceof Error ? error : new Error(errorMessage)
    );

    throw new ApiError(errorMessage, 0);
  }
}

export const api = {
  // Authentication endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiRequest<TokenPair>('/api/v1/auth/login-with-refresh', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (userData: {
      email: string;
      first_name: string;
      last_name: string;
      password: string;
      provider?: string;
      is_active?: boolean;
      email_verified?: boolean;
    }) =>
      apiRequest<Omit<UserData, 'password'>>('/api/v1/users/', {
        method: 'POST',
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          first_name: userData.first_name,
          last_name: userData.last_name,
          provider: userData.provider || 'portal',
          is_active: userData.is_active ?? true,
          email_verified: userData.email_verified ?? false,
        }),
      }),

    // Refresh authentication using refresh token
    refresh: () => {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new ApiError('Không có refresh token', 401);
      }
      return apiRequest<TokenPair>('/api/v1/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    },

    // Logout - revoke refresh token
    logout: (refreshToken?: string) => {
      // Use provided token or get from storage
      const token = refreshToken || tokenStorage.getRefreshToken();
      if (!token) {
        // If no refresh token, just return success
        return Promise.resolve({ message: 'Logged out' });
      }
      return apiRequest<{ message: string }>('/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: token }),
      });
    },

    // Logout all devices - revoke all refresh tokens
    logoutAll: (accessToken?: string) => {
      // Use provided token or get from storage
      const token = accessToken || tokenStorage.getToken();
      // Build headers with access token if available
      // Note: apiRequest will merge these with default headers
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      return apiRequest<{ message: string }>('/api/v1/auth/logout-all', {
        method: 'POST',
        headers,
      });
    },

    me: () => apiRequest<UserData>('/api/v1/auth/me'),

    // Google OAuth endpoints
    googleLogin: () =>
      apiRequest<GoogleAuthResponse>('/api/v1/auth/google/login'),

    googleCallback: (data: { code: string; state?: string }) =>
      apiRequest<AuthResponse>('/api/v1/auth/google/callback', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    // Email verification endpoints
    verifyEmail: (token: string, method: 'GET' | 'POST' = 'GET') => {
      if (method === 'POST') {
        return apiRequest<{ message: string }>('/api/v1/auth/verify-email', {
          method: 'POST',
          body: JSON.stringify({ token }),
        });
      }
      return apiRequest<{ message: string }>(
        `/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`,
        {
          method: 'GET',
        }
      );
    },

    resendVerification: () =>
      apiRequest<{ message: string }>('/api/v1/auth/resend-verification', {
        method: 'POST',
      }),

    // Password reset endpoints
    requestPasswordReset: (email: string) =>
      apiRequest<{ message: string }>('/api/v1/auth/request-password-reset', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    resetPassword: (data: { token: string; new_password: string }) =>
      apiRequest<{ message: string }>('/api/v1/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    changePassword: (data: {
      current_password: string;
      new_password: string;
    }) =>
      apiRequest<{ message: string }>('/api/v1/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getProfile: () => apiRequest<UserData>('/api/v1/auth/me'),
  },

  // User endpoints
  users: {
    /**
     * Get user profile by user ID
     * Returns full user data including profile information
     */
    getProfile: (userId: number) =>
      apiRequest<UserData>(`/api/v1/users/${userId}`, {
        method: 'GET',
      }),

    /**
     * Update user profile
     * Supports partial updates - only fields provided will be updated
     * @param userId - The ID of the user to update
     * @param data - Partial user data to update
     */
    updateProfile: (
      userId: number,
      data: {
        email?: string;
        is_active?: boolean;
        first_name?: string;
        last_name?: string;
        avatar_url?: string;
        gender?: string;
        height_cm?: number;
        weight_kg?: number;
        date_of_birth?: string; // YYYY-MM-DD format
        family_medical_history?: string;
        goal?: string;
      }
    ) =>
      apiRequest<UserData>(`/api/v1/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Upload endpoints
  upload: {
    /**
     * Upload an image file to GCS bucket and return public URL
     * @param file - The image file to upload
     * @param folder - Optional folder path in the bucket (e.g., 'avatars', 'profile-pictures')
     * @returns Public URL of the uploaded image
     */
    uploadImage: async (
      file: File,
      folder?: string
    ): Promise<{ url: string }> => {
      // Validate file type
      const validImageTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
      ];
      if (!validImageTypes.includes(file.type)) {
        throw new ApiError(
          'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF)',
          400
        );
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new ApiError('Kích thước file không được vượt quá 10MB', 400);
      }

      const url = `${API_BASE_URL}/api/v1/upload/image`;
      const token = tokenStorage.getToken();

      // Build form data
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }

      // Build headers
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      logger.apiRequest('POST', '/api/v1/upload/image', {
        headers: { Authorization: token ? 'Bearer ***' : 'none' },
        hasBody: true,
      });

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: formData,
        });

        if (!response.ok) {
          // Handle 401 Unauthorized - try to refresh token
          if (response.status === 401 && token) {
            try {
              const refreshToken = tokenStorage.getRefreshToken();
              if (refreshToken) {
                const refreshResponse = await fetch(
                  `${API_BASE_URL}/api/v1/auth/refresh`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                  }
                );

                if (refreshResponse.ok) {
                  const tokenData: TokenPair = await refreshResponse.json();
                  tokenStorage.setToken(tokenData.access_token);
                  tokenStorage.setRefreshToken(tokenData.refresh_token);

                  // Retry upload with new token
                  headers.Authorization = `Bearer ${tokenData.access_token}`;
                  const retryResponse = await fetch(url, {
                    method: 'POST',
                    headers,
                    body: formData,
                  });

                  if (!retryResponse.ok) {
                    const errorData = await retryResponse.json().catch(() => ({
                      message: retryResponse.statusText,
                    }));
                    throw new ApiError(
                      errorData.message || 'Không thể upload ảnh',
                      retryResponse.status,
                      errorData
                    );
                  }

                  return await retryResponse.json();
                }
              }
            } catch {
              tokenStorage.clearTokens();
              if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
              }
              throw new ApiError('Phiên đăng nhập đã hết hạn', 401);
            }
          }

          // Handle other errors
          let errorData: ApiErrorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: response.statusText };
          }

          const errorMessage =
            errorData.message || errorData.detail || 'Không thể upload ảnh';

          logger.apiError(
            'POST',
            '/api/v1/upload/image',
            response.status,
            new Error(errorMessage)
          );

          throw new ApiError(errorMessage, response.status, errorData);
        }

        const result = await response.json();
        return result;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        const errorMessage =
          error instanceof Error ? error.message : 'Lỗi kết nối mạng';
        logger.apiError(
          'POST',
          '/api/v1/upload/image',
          0,
          error instanceof Error ? error : new Error(errorMessage)
        );

        throw new ApiError(errorMessage, 0);
      }
    },
  },
};

export default api;
