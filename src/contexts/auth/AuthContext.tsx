/**
 * Auth Context Provider
 * Manages authentication state and provides auth methods to the app
 */

'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useCallback,
} from 'react';
import {
  AuthContextType,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '@/types/auth';
import { authReducer } from './reducer';
import { initialState } from './types';
import * as authActions from './actions';

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const isLoggingOutRef = useRef(false);

  // Check for existing session on mount
  useEffect(() => {
    authActions.checkAuthStatus(dispatch, isLoggingOutRef);
  }, []);

  // Wrap all actions to use the dispatch and refs from this component
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      return authActions.login(credentials, dispatch);
    },
    []
  );

  const register = useCallback(
    async (userData: RegisterCredentials): Promise<void> => {
      return authActions.register(userData, dispatch);
    },
    []
  );

  const loginWithGoogle = useCallback(async (): Promise<void> => {
    return authActions.loginWithGoogle(dispatch);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    return authActions.logout(dispatch, isLoggingOutRef);
  }, []);

  const logoutAll = useCallback(async (): Promise<void> => {
    return authActions.logoutAll(dispatch, isLoggingOutRef);
  }, []);

  const updateProfile = useCallback(
    async (userData: Partial<User>): Promise<void> => {
      return authActions.updateProfile(userData, state.user, dispatch);
    },
    [state.user]
  );

  const refreshAuth = useCallback(async (): Promise<void> => {
    return authActions.refreshAuth(dispatch, isLoggingOutRef);
  }, []);

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    return authActions.checkAuthStatus(dispatch, isLoggingOutRef);
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Helper function to update user in context without calling API
  // Used when API is called directly elsewhere (e.g., profile page)
  const updateUserInContext = useCallback((userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  }, []);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    loginWithGoogle,
    logout,
    logoutAll,
    updateProfile,
    refreshAuth,
    checkAuthStatus,
    clearError,
    updateUserInContext,
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
