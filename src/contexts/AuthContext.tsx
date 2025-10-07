'use client';

import { api, tokenStorage } from '@/lib/api';
import { logger } from '@/lib/logger';
import {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '@/types/auth';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { toast } from 'sonner';

// Auth reducer actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check for existing session
  error: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Check if we have a valid token first
      if (!tokenStorage.hasValidToken()) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Chưa đăng nhập' });
        return;
      }

      logger.debug('Kiểm tra trạng thái xác thực với token từ localStorage');

      // Try to get user info with the stored token
      const userData = await api.auth.me();

      logger.debug('Trạng thái xác thực hợp lệ', {
        userId: userData.id,
        email: userData.email,
      });

      // Convert API response to User type
      const user: User = {
        id: userData.id?.toString() || '',
        email: userData.email || '',
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        profilePicture: userData.avatar_url || undefined,
        phoneNumber: userData.phone_number || undefined,
        createdAt: userData.created_at || new Date().toISOString(),
        updatedAt: userData.updated_at || new Date().toISOString(),
      };

      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      logger.authError(
        'Kiểm tra trạng thái xác thực thất bại',
        error instanceof Error ? error : new Error('Auth status check failed')
      );

      // Clear invalid tokens
      tokenStorage.clearTokens();
      dispatch({ type: 'AUTH_ERROR', payload: 'Phiên đăng nhập đã hết hạn' });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      logger.debug('Đăng nhập với email', { email: credentials.email });

      const response = await api.auth.login(credentials);

      logger.debug('Đăng nhập thành công');

      // Store tokens in localStorage
      tokenStorage.setToken(response.access_token);
      tokenStorage.setRefreshToken(response.refresh_token);

      // Get user data
      const userData = await api.auth.me();

      // Convert API response to User type
      const user: User = {
        id: userData.id?.toString() || '',
        email: userData.email || '',
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        profilePicture: userData.avatar_url || undefined,
        phoneNumber: userData.phone_number || undefined,
        createdAt: userData.created_at || new Date().toISOString(),
        updatedAt: userData.updated_at || new Date().toISOString(),
      };

      dispatch({ type: 'AUTH_SUCCESS', payload: user });

      toast.success('Đăng nhập thành công!');
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message === 'Invalid credentials'
          ? 'Email hoặc mật khẩu không chính xác'
          : 'Đăng nhập thất bại';

      logger.authError(
        'Đăng nhập thất bại',
        error instanceof Error ? error : new Error(errorMessage)
      );

      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData: RegisterCredentials): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      logger.debug('Đăng ký tài khoản mới', { email: userData.email });

      await api.auth.register({
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        password: userData.password,
      });

      logger.debug('Đăng ký thành công');

      // Login
      const loginResponse = await api.auth.login({
        email: userData.email,
        password: userData.password,
      });

      // Store tokens in localStorage
      tokenStorage.setToken(loginResponse.access_token);
      tokenStorage.setRefreshToken(loginResponse.refresh_token);

      // Get user data
      const userDataResponse = await api.auth.me();

      // Convert API response to User type
      const user: User = {
        id: userData.id?.toString() || '',
        email: userDataResponse.email || '',
        firstName: userDataResponse.first_name || '',
        lastName: userDataResponse.last_name || '',
        profilePicture: userDataResponse.avatar_url || undefined,
        phoneNumber: userDataResponse.phone_number || undefined,
        createdAt: userDataResponse.created_at || new Date().toISOString(),
        updatedAt: userDataResponse.updated_at || new Date().toISOString(),
      };

      dispatch({ type: 'AUTH_SUCCESS', payload: user });

      toast.success('Đăng ký thành công!');
    } catch (error) {
      const errorMessage =
        error instanceof Error &&
        error.message === 'User with this email already exists'
          ? 'Email đã tồn tại'
          : 'Đăng ký thất bại';

      logger.authError(
        'Đăng ký thất bại',
        error instanceof Error ? error : new Error(errorMessage)
      );

      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    dispatch({ type: 'AUTH_START' });

    try {
      logger.debug('Bắt đầu đăng nhập với Google');

      // Get Google OAuth URL
      const { authorization_url, state } = await api.auth.googleLogin();

      // Store state in sessionStorage for CSRF protection (not sensitive data)
      sessionStorage.setItem('google_oauth_state', state);

      logger.debug('Chuyển hướng đến Google OAuth', {
        hasAuthUrl: !!authorization_url,
        hasState: !!state,
      });

      // Redirect to Google OAuth
      window.location.href = authorization_url;
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message === 'Invalid state'
          ? 'Đăng nhập Google thất bại'
          : 'Đăng nhập Google thất bại';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });

      logger.authError(
        'Đăng nhập Google thất bại',
        error instanceof Error ? error : new Error(errorMessage)
      );

      // Show error toast
      toast.error('Đăng nhập Google thất bại', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      logger.debug('Đăng xuất');

      // Call logout API (optional - to invalidate server-side sessions)
      try {
        await api.auth.logout();
      } catch (error) {
        // Ignore logout API errors - we'll clear local tokens anyway
        logger.debug('Logout API failed, continuing with local cleanup', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // Clear tokens from localStorage
      tokenStorage.clearTokens();

      dispatch({ type: 'LOGOUT' });
      toast.success('Đã đăng xuất');

      logger.debug('Đăng xuất thành công');
    } catch (error) {
      logger.authError(
        'Đăng xuất thất bại',
        error instanceof Error ? error : new Error('Logout failed')
      );

      // Even if logout API fails, clear local tokens
      tokenStorage.clearTokens();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      logger.debug('Bắt đầu cập nhật thông tin cá nhân', {
        userId: state.user?.id,
        fields: Object.keys(userData),
      });

      // Map frontend user fields to backend format
      const backendUserData: Record<string, string> = {};
      if (userData.firstName) backendUserData.first_name = userData.firstName;
      if (userData.lastName) backendUserData.last_name = userData.lastName;
      if (userData.email) backendUserData.email = userData.email;
      if (userData.phoneNumber)
        backendUserData.phone_number = userData.phoneNumber;

      const updatedUser = await api.users.updateProfile(backendUserData);

      const user: User = {
        id: updatedUser.id?.toString() || '',
        email: updatedUser.email || '',
        firstName: updatedUser.first_name || '',
        lastName: updatedUser.last_name || '',
        profilePicture: updatedUser.avatar_url || undefined,
        phoneNumber: updatedUser.phone_number || undefined,
        createdAt: updatedUser.created_at || new Date().toISOString(),
        updatedAt: updatedUser.updated_at || new Date().toISOString(),
      };

      dispatch({ type: 'UPDATE_USER', payload: user });

      logger.authSuccess('Cập nhật thông tin cá nhân thành công', {
        userId: user.id,
      });

      // Show success toast
      toast.success('Thông tin tài khoản đã được cập nhật thành công', {
        description: 'Thông tin cá nhân của bạn đã được cập nhật.',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Cập nhật thông tin tài khoản thất bại';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });

      logger.authError(
        'Cập nhật thông tin cá nhân thất bại',
        error instanceof Error ? error : new Error(errorMessage),
        {
          userId: state.user?.id,
        }
      );

      // Show error toast
      toast.error('Cập nhật thông tin tài khoản thất bại', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const refreshAuth = async () => {
    try {
      logger.debug('Bắt đầu làm mới phiên đăng nhập');

      // Refresh tokens - httpOnly cookies will be updated by server
      await api.auth.refresh();

      // Verify the new session and get user data
      await checkAuthStatus();

      logger.authSuccess('Làm mới phiên đăng nhập thành công');
    } catch (error) {
      logger.authError(
        'Làm mới phiên đăng nhập thất bại',
        error instanceof Error ? error : new Error('Refresh failed')
      );

      // Refresh failed, logout user
      await logout();
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    refreshAuth,
    checkAuthStatus,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for protected routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-lg'>Đang tải...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-lg'>
            Vui lòng đăng nhập để truy cập trang này.
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
