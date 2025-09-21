'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '@/types/auth';

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

  // Simulate API calls - replace with actual API endpoints
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // No token found - user is not authenticated (not an error)
        dispatch({ type: 'LOGOUT' });
        return;
      }

      // In a real app, verify token with backend
      // For now, we'll simulate with localStorage data
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        // Token exists but no user data - clear everything
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      // Only dispatch error for actual failures, not missing tokens
      console.error('Failed to check auth status:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Simulate API call - replace with actual endpoint
      // const response = await fetch(`${API_BASE_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });

      // For demo purposes, simulate successful login
      if (credentials.email && credentials.password) {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Store auth data in localStorage (in production, use secure storage)
        localStorage.setItem('auth_token', 'mock_jwt_token');
        localStorage.setItem('refresh_token', 'mock_refresh_token');
        localStorage.setItem('user_data', JSON.stringify(mockUser));

        dispatch({ type: 'AUTH_SUCCESS', payload: mockUser });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Validate password confirmation
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Simulate API call - replace with actual endpoint
      // const response = await fetch(`${API_BASE_URL}/auth/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     firstName: credentials.firstName,
      //     lastName: credentials.lastName,
      //     email: credentials.email,
      //     password: credentials.password,
      //   }),
      // });

      // For demo purposes, simulate successful registration
      const mockUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store auth data in localStorage
      localStorage.setItem('auth_token', 'mock_jwt_token');
      localStorage.setItem('refresh_token', 'mock_refresh_token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));

      dispatch({ type: 'AUTH_SUCCESS', payload: mockUser });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    // Clear stored auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');

    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      // Simulate API call - replace with actual endpoint
      // const response = await fetch(`${API_BASE_URL}/user/profile`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      //   },
      //   body: JSON.stringify(userData),
      // });

      // For demo purposes, update user data in localStorage
      if (state.user) {
        const updatedUser = {
          ...state.user,
          ...userData,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        dispatch({ type: 'UPDATE_USER', payload: userData });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update profile';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const refreshAuth = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      // Simulate API call - replace with actual endpoint
      // const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ refreshToken }),
      // });

      // For demo purposes, just check existing auth status
      await checkAuthStatus();
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: 'Failed to refresh authentication',
      });
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
    logout,
    updateProfile,
    refreshAuth,
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
          <div className='text-lg'>Loading...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // In a real app, redirect to login page
      return (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-lg'>Please log in to access this page.</div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
