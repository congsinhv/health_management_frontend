'use client';

import { useAuth } from '@/contexts/AuthContext';
import { api, tokenStorage } from '@/lib/api';
import { logger } from '@/lib/logger';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        logger.debug('Xử lý callback Google OAuth', {
          hasCode: !!code,
          hasState: !!state,
          hasError: !!error,
        });

        if (error) {
          logger.authError('Google OAuth error', new Error(error));
          router.push('/auth/login?error=oauth_cancelled');
          return;
        }

        if (!code) {
          logger.authError('Không nhận được mã xác thực từ Google');
          router.push('/auth/login?error=oauth_failed');
          return;
        }

        // Verify state parameter for security
        const storedState = sessionStorage.getItem('google_oauth_state');
        if (state && storedState && state !== storedState) {
          logger.authError('OAuth state không khớp - có thể bị tấn công CSRF');
          sessionStorage.removeItem('google_oauth_state');
          router.push('/auth/login?error=oauth_failed');
          return;
        }

        logger.debug('Gọi API Google callback', {
          code: code.substring(0, 20) + '...',
          state: state?.substring(0, 20) + '...',
        });

        // Call the Google callback API
        const response = await api.auth.googleCallback({
          code,
          state: state || undefined,
        });

        logger.debug('Google callback response received', {
          hasUser: !!response.user,
          hasAccessToken: !!response.access_token,
          hasRefreshToken: !!response.refresh_token,
          userId: response.user?.id,
          email: response.user?.email,
        });

        // Store tokens in localStorage
        if (response.access_token) {
          tokenStorage.setToken(response.access_token);
          logger.debug('Access token stored in localStorage');
        }

        if (response.refresh_token) {
          tokenStorage.setRefreshToken(response.refresh_token);
          logger.debug('Refresh token stored in localStorage');
        }

        // Check auth status to update the context
        logger.debug('Kiểm tra trạng thái xác thực sau callback');
        await checkAuthStatus();

        // Redirect to dashboard/home page
        logger.debug('Chuyển hướng sau đăng nhập Google thành công');
        router.push('/dashboard');
      } catch (error) {
        logger.authError(
          'Google OAuth callback thất bại',
          error instanceof Error ? error : new Error('Google callback failed')
        );

        // Clear any partial tokens that might have been set
        tokenStorage.clearTokens();

        // Redirect to login with error
        const errorMessage =
          error instanceof Error ? error.message : 'Google OAuth thất bại';
        router.push(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
      }
    };

    handleGoogleCallback();
  }, [searchParams, router, checkAuthStatus]);

  return (
    <div className='from-health-100 to-health-200 flex min-h-screen items-center justify-center bg-gradient-to-br'>
      <div className='text-center'>
        <div className='border-health-600 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2'></div>
        <h2 className='mb-2 text-xl font-semibold text-gray-900'>
          Hoàn tất đăng nhập Google
        </h2>
        <p className='text-gray-600'>
          Vui lòng đợi trong khi chúng tôi hoàn tất xác thực của bạn...
        </p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className='from-health-100 to-health-200 flex min-h-screen items-center justify-center bg-gradient-to-br'>
          <div className='text-center'>
            <div className='border-health-600 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2'></div>
            <h2 className='mb-2 text-xl font-semibold text-gray-900'>
              Đang tải...
            </h2>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
