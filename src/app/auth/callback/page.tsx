'use client';

import { useAuth } from '@/contexts/auth';
import { authService } from '@/services/auth';
import { tokenStorage } from '@/lib/storage';
import { logger } from '@/lib/logger';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        logger.debug('Xử lý callback OAuth', {
          hasCode: !!code,
          hasState: !!state,
          hasError: !!error,
        });

        if (error) {
          logger.authError('OAuth error', new Error(error));
          router.push('/auth/login?error=oauth_cancelled');
          return;
        }

        if (!code) {
          logger.authError('Không nhận được mã xác thực từ OAuth provider');
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

        logger.debug('Gọi API OAuth callback', {
          code: code.substring(0, 20) + '...',
          state: state?.substring(0, 20) + '...',
        });

        // Call the Google callback API
        const response = await authService.googleCallback({
          code,
          state: state || undefined,
        });

        logger.debug('OAuth callback response received', {
          hasUser: !!response.user,
          hasAccessToken: !!response.access_token,
          hasRefreshToken: !!response.refresh_token,
          userId: response.user?.id,
          email: response.user?.email,
        });

        // Store tokens in localStorage
        if (response.access_token) {
          tokenStorage.setAccessToken(response.access_token);
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
        logger.debug('Chuyển hướng sau đăng nhập OAuth thành công');
        router.push('/dashboard');
      } catch (error) {
        logger.authError(
          'OAuth callback thất bại',
          error instanceof Error ? error : new Error('OAuth callback failed')
        );

        // Clear any partial tokens that might have been set
        tokenStorage.clearTokens();

        // Redirect to login with error
        const errorMessage =
          error instanceof Error ? error.message : 'OAuth thất bại';
        router.push(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router, checkAuthStatus]);

  return (
    <div className='from-health-100 to-health-200 flex min-h-screen items-center justify-center bg-gradient-to-br'>
      <div className='text-center'>
        <div className='border-health-600 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2'></div>
        <h2 className='mb-2 text-xl font-semibold text-gray-900'>
          Hoàn tất đăng nhập
        </h2>
        <p className='text-gray-600'>
          Vui lòng đợi trong khi chúng tôi hoàn tất xác thực của bạn...
        </p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
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
      <OAuthCallbackContent />
    </Suspense>
  );
}
