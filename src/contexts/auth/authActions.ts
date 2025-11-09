/**
 * Auth actions
 * Contains all authentication-related business logic
 */

import { authService } from '@/services/auth';
import { userService } from '@/services/user';
import { tokenStorage } from '@/lib/storage';
import { logger } from '@/lib/logger';
import { fromUserDTO } from '@/lib/transforms';
import { STORAGE_KEYS, SUCCESS_MESSAGES } from '@/lib/constants';
import { LoginCredentials, RegisterCredentials, User } from '@/types/auth';
import { toast } from 'sonner';
import { AuthAction } from './authTypes';
import type { Dispatch, MutableRefObject } from 'react';

/**
 * Check authentication status and restore session if valid
 */
export async function checkAuthStatus(
  dispatch: Dispatch<AuthAction>,
  isLoggingOutRef: MutableRefObject<boolean>
): Promise<void> {
  // Skip auth check if logout is in progress
  if (isLoggingOutRef.current) {
    return;
  }

  dispatch({ type: 'AUTH_START' });

  try {
    // Check if we have a refresh token first
    const refreshToken = tokenStorage.getRefreshToken();
    const accessToken = tokenStorage.getAccessToken();

    // If no tokens at all, user is not authenticated
    if (!refreshToken && !accessToken) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Chưa đăng nhập' });
      return;
    }

    // If we have refresh token but no access token, try to refresh
    if (refreshToken && !accessToken) {
      logger.debug('Không có access token, thử làm mới với refresh token');
      try {
        const tokenData = await authService.refresh();
        tokenStorage.setAccessToken(tokenData.access_token);
        tokenStorage.setRefreshToken(tokenData.refresh_token);
        logger.debug('Đã làm mới token thành công');
      } catch (refreshError) {
        logger.authError(
          'Làm mới token thất bại',
          refreshError instanceof Error
            ? refreshError
            : new Error('Token refresh failed')
        );
        tokenStorage.clearTokens();
        dispatch({
          type: 'AUTH_ERROR',
          payload: 'Phiên đăng nhập đã hết hạn',
        });
        return;
      }
    }

    logger.debug('Kiểm tra trạng thái xác thực với token từ localStorage');

    // Try to get user info with the stored token
    const userData = await authService.me();

    logger.debug('Trạng thái xác thực hợp lệ', {
      userId: userData.id,
      email: userData.email,
    });

    // Convert API response to User type
    const user = fromUserDTO(userData);

    dispatch({ type: 'AUTH_SUCCESS', payload: user });
  } catch (error) {
    logger.authError(
      'Kiểm tra trạng thái xác thực thất bại',
      error instanceof Error ? error : new Error('Auth status check failed')
    );

    // If error is 401, try to refresh token before giving up
    if (
      error instanceof Error &&
      (error.message.includes('401') ||
        error.message.includes('Phiên đăng nhập đã hết hạn'))
    ) {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          logger.debug('Thử làm mới token sau khi kiểm tra thất bại');
          const tokenData = await authService.refresh();
          tokenStorage.setAccessToken(tokenData.access_token);
          tokenStorage.setRefreshToken(tokenData.refresh_token);

          // Retry getting user info
          const userData = await authService.me();
          const user = fromUserDTO(userData);

          dispatch({ type: 'AUTH_SUCCESS', payload: user });
          return;
        } catch (refreshError) {
          logger.authError(
            'Làm mới token thất bại sau khi kiểm tra',
            refreshError instanceof Error
              ? refreshError
              : new Error('Token refresh failed')
          );
        }
      }
    }

    // Clear invalid tokens
    tokenStorage.clearTokens();
    dispatch({ type: 'AUTH_ERROR', payload: 'Phiên đăng nhập đã hết hạn' });
  }
}

/**
 * Login with email and password
 */
export async function login(
  credentials: LoginCredentials,
  dispatch: Dispatch<AuthAction>
): Promise<void> {
  dispatch({ type: 'AUTH_START' });

  try {
    logger.debug('Đăng nhập với email', { email: credentials.email });

    const tokenData = await authService.login(credentials);

    logger.debug('Đăng nhập thành công');

    // Store tokens in localStorage
    tokenStorage.setAccessToken(tokenData.access_token);
    tokenStorage.setRefreshToken(tokenData.refresh_token);

    // Get user data
    const userData = await authService.me();

    // Convert API response to User type
    const user = fromUserDTO(userData);

    dispatch({ type: 'AUTH_SUCCESS', payload: user });

    toast.success(SUCCESS_MESSAGES.LOGIN);

    // Check if email is verified, show warning if not
    if (!user.emailVerified) {
      toast.warning(
        'Vui lòng xác thực email của bạn để sử dụng đầy đủ tính năng.',
        {
          duration: 6000,
        }
      );
    }
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
}

/**
 * Register new user account
 */
export async function register(
  userData: RegisterCredentials,
  dispatch: Dispatch<AuthAction>
): Promise<void> {
  dispatch({ type: 'AUTH_START' });

  try {
    logger.debug('Đăng ký tài khoản mới', { email: userData.email });

    // Register user - this does NOT automatically log them in
    await authService.register({
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      password: userData.password,
      provider: 'portal',
      is_active: true,
      email_verified: false,
    });

    logger.debug('Đăng ký thành công');

    // Do NOT auto-login after registration
    // User must verify their email first
    dispatch({ type: 'REGISTER_SUCCESS' });

    toast.success(
      SUCCESS_MESSAGES.REGISTER +
        ' Vui lòng kiểm tra email để xác thực tài khoản.',
      {
        duration: 5000,
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error &&
      error.message === 'User with this email already exists'
        ? 'Email đã tồn tại'
        : error instanceof Error && error.message.includes('email')
          ? 'Email không hợp lệ hoặc đã tồn tại'
          : 'Đăng ký thất bại';

    logger.authError(
      'Đăng ký thất bại',
      error instanceof Error ? error : new Error(errorMessage)
    );

    dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
    toast.error(errorMessage);
    throw error;
  }
}

/**
 * Login with Google OAuth
 */
export async function loginWithGoogle(
  dispatch: Dispatch<AuthAction>
): Promise<void> {
  dispatch({ type: 'AUTH_START' });

  try {
    logger.debug('Bắt đầu đăng nhập với Google');

    // Get Google OAuth URL
    const { authorization_url, state } = await authService.googleLogin();

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
}

/**
 * Helper function to force clear tokens from localStorage
 */
function forceClearTokens(): void {
  if (typeof window === 'undefined') return;

  try {
    // Multiple removal attempts
    for (let i = 0; i < 3; i++) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      // Check if cleared
      if (
        !localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) &&
        !localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      ) {
        break;
      }
      // If still present, try setting to empty first
      if (i < 2) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, '');
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, '');
      }
    }
  } catch (e) {
    logger.authError('Failed to force clear tokens', e as Error);
  }
}

/**
 * Logout from current device
 */
export async function logout(
  dispatch: Dispatch<AuthAction>,
  isLoggingOutRef: MutableRefObject<boolean>
): Promise<void> {
  // Prevent concurrent logout attempts
  if (isLoggingOutRef.current) {
    logger.debug('Logout already in progress, skipping');
    return;
  }

  isLoggingOutRef.current = true;

  try {
    logger.debug('Đăng xuất');

    // Save refresh token BEFORE clearing (needed for API call)
    const refreshToken = tokenStorage.getRefreshToken();

    // Clear tokens FIRST (defensive approach - ensure cleanup even if API fails)
    tokenStorage.clearTokens();

    // Verify tokens were cleared
    const accessToken = tokenStorage.getAccessToken();
    const remainingRefreshToken = tokenStorage.getRefreshToken();
    if (accessToken || remainingRefreshToken) {
      logger.debug('Tokens still present after clear, forcing removal');
      forceClearTokens();
    }

    // Call logout API to revoke refresh token (best effort)
    // Pass the saved refresh token since we already cleared it from storage
    try {
      await authService.logout(refreshToken || undefined);
    } catch (error) {
      // Ignore logout API errors - tokens are already cleared locally
      logger.debug('Logout API failed, but tokens already cleared locally', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    dispatch({ type: 'LOGOUT' });
    toast.success(SUCCESS_MESSAGES.LOGOUT);

    logger.debug('Đăng xuất thành công');
  } catch (error) {
    logger.authError(
      'Đăng xuất thất bại',
      error instanceof Error ? error : new Error('Logout failed')
    );

    // Ensure tokens are cleared even if something went wrong
    tokenStorage.clearTokens();
    dispatch({ type: 'LOGOUT' });
  } finally {
    // Always reset the flag
    isLoggingOutRef.current = false;
  }
}

/**
 * Logout from all devices
 */
export async function logoutAll(
  dispatch: Dispatch<AuthAction>,
  isLoggingOutRef: MutableRefObject<boolean>
): Promise<void> {
  // Prevent concurrent logout attempts
  if (isLoggingOutRef.current) {
    logger.debug('Logout already in progress, skipping');
    return;
  }

  isLoggingOutRef.current = true;

  try {
    logger.debug('Đăng xuất tất cả thiết bị');

    // Save access token BEFORE clearing (needed for API call)
    const accessToken = tokenStorage.getAccessToken();

    // Clear tokens FIRST (defensive approach - ensure cleanup even if API fails)
    tokenStorage.clearTokens();

    // Verify tokens were cleared
    const remainingAccessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();
    if (remainingAccessToken || refreshToken) {
      logger.debug('Tokens still present after clear, forcing removal');
      forceClearTokens();
    }

    // Call logout-all API to revoke all refresh tokens (best effort)
    // Pass the saved access token since we already cleared it from storage
    try {
      await authService.logoutAll(accessToken || undefined);
    } catch (error) {
      // Ignore logout API errors - tokens are already cleared locally
      logger.debug(
        'Logout all API failed, but tokens already cleared locally',
        {
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );
    }

    dispatch({ type: 'LOGOUT' });
    toast.success('Đã đăng xuất tất cả thiết bị');

    logger.debug('Đăng xuất tất cả thiết bị thành công');
  } catch (error) {
    logger.authError(
      'Đăng xuất tất cả thiết bị thất bại',
      error instanceof Error ? error : new Error('Logout all failed')
    );

    // Ensure tokens are cleared even if something went wrong
    tokenStorage.clearTokens();
    dispatch({ type: 'LOGOUT' });
  } finally {
    // Always reset the flag
    isLoggingOutRef.current = false;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  userData: Partial<User>,
  currentUser: User | null,
  dispatch: Dispatch<AuthAction>
): Promise<void> {
  try {
    if (!currentUser?.id) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }

    logger.debug('Bắt đầu cập nhật thông tin cá nhân', {
      userId: currentUser?.id,
      fields: Object.keys(userData),
    });

    // Parse user ID to number
    const userId = Number(currentUser.id);
    if (isNaN(userId)) {
      throw new Error('ID người dùng không hợp lệ');
    }

    // Map frontend user fields to backend format
    const backendUserData: Record<string, string | undefined> = {};
    if (userData.firstName) backendUserData.first_name = userData.firstName;
    if (userData.lastName) backendUserData.last_name = userData.lastName;
    if (userData.email) backendUserData.email = userData.email;
    if (userData.phoneNumber)
      backendUserData.phone_number = userData.phoneNumber;
    if (userData.profilePicture)
      backendUserData.avatar_url = userData.profilePicture;

    // Remove undefined values
    Object.keys(backendUserData).forEach(
      key =>
        backendUserData[key as keyof typeof backendUserData] === undefined &&
        delete backendUserData[key as keyof typeof backendUserData]
    );

    // Ensure body is not empty
    if (Object.keys(backendUserData).length === 0) {
      logger.debug('Không có dữ liệu để cập nhật');
      return;
    }

    const updatedUser = await userService.updateProfile(userId, {
      email: backendUserData.email,
      first_name: backendUserData.first_name,
      last_name: backendUserData.last_name,
      avatar_url: backendUserData.avatar_url,
    });

    const user = fromUserDTO(updatedUser);

    dispatch({ type: 'UPDATE_USER', payload: user });

    logger.authSuccess('Cập nhật thông tin cá nhân thành công', {
      userId: user.id,
    });

    // Show success toast
    toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED, {
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
        userId: currentUser?.id,
      }
    );

    // Show error toast
    toast.error('Cập nhật thông tin tài khoản thất bại', {
      description: errorMessage,
    });
    throw error;
  }
}

/**
 * Refresh authentication tokens
 */
export async function refreshAuth(
  dispatch: Dispatch<AuthAction>,
  isLoggingOutRef: MutableRefObject<boolean>
): Promise<void> {
  try {
    logger.debug('Bắt đầu làm mới phiên đăng nhập');

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Không có refresh token');
    }

    // Refresh tokens - returns new access_token and refresh_token (token rotation)
    const tokenData = await authService.refresh();

    // Update stored tokens with new ones
    tokenStorage.setAccessToken(tokenData.access_token);
    tokenStorage.setRefreshToken(tokenData.refresh_token);

    // Verify the new session and get user data
    await checkAuthStatus(dispatch, isLoggingOutRef);

    logger.authSuccess('Làm mới phiên đăng nhập thành công');
  } catch (error) {
    logger.authError(
      'Làm mới phiên đăng nhập thất bại',
      error instanceof Error ? error : new Error('Refresh failed')
    );

    // Refresh failed, logout user
    tokenStorage.clearTokens();
    dispatch({ type: 'LOGOUT' });
    throw error;
  }
}
