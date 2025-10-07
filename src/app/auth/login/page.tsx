'use client';

import { Google } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthForm, validateLogin } from '@/hooks/useAuthForm';
import { LoginCredentials } from '@/types/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    login,
    loginWithGoogle,
    isAuthenticated,
    isLoading,
    error,
    clearError,
  } = useAuth();

  useEffect(() => {
    if (error) {
      clearError();
    }
  });

  // State for URL-based messages
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlSuccess, setUrlSuccess] = useState<string | null>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Handle URL parameters (errors and success messages)
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const verifiedParam = searchParams.get('verified');

    if (errorParam) {
      switch (errorParam) {
        case 'oauth_cancelled':
          setUrlError('Đăng nhập Google đã bị hủy. Vui lòng thử lại.');
          break;
        case 'oauth_failed':
          setUrlError('Đăng nhập Google thất bại. Vui lòng thử lại.');
          break;
        default:
          setUrlError(decodeURIComponent(errorParam));
      }
    }

    if (verifiedParam === 'true') {
      setUrlSuccess(
        'Email đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.'
      );
    }

    // Clear parameters from URL after showing messages
    if (errorParam || verifiedParam) {
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      url.searchParams.delete('verified');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const {
    values,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit,
    getFieldError,
  } = useAuthForm<LoginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: validateLogin,
    onSubmit: async credentials => {
      try {
        setUrlError(null); // Clear any URL errors
        setUrlSuccess(null); // Clear any URL success messages
        await login(credentials);
        // Small delay to show the success toast before redirecting
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } catch (error) {
        // Error is already handled by the AuthContext with toast
        console.error('Login failed:', error);
      }
    },
  });

  // Combined loading state for better UX
  const isFormLoading = isLoading || isSubmitting;

  // Combined error message (prioritize form errors over URL errors)
  const displayError = error || urlError;

  return (
    <div className='from-health-50 to-health-200 flex min-h-screen items-center justify-center bg-gradient-to-br p-4 dark:from-gray-900 dark:to-gray-800'>
      <Card className='w-full max-w-md border-0 bg-white shadow-xl backdrop-blur-sm dark:bg-gray-900/80'>
        <CardHeader className='space-y-1 pb-2 text-center'>
          <div className='from-health-500 to-health-600 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white'>
              <div className='from-health-500 to-health-600 h-4 w-4 rounded-full bg-gradient-to-r'></div>
            </div>
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900 dark:text-white'>
            Chào Mừng Trở Lại
          </CardTitle>
          <CardDescription className='text-gray-600 dark:text-gray-400'>
            Đăng nhập vào tài khoản Quản lý Sức khỏe của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {displayError && (
            <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'>
              {displayError}
            </div>
          )}

          {urlSuccess && (
            <div className='rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'>
              {urlSuccess}
            </div>
          )}

          {/* Google Sign In Button */}
          <Button
            type='button'
            variant='outline'
            className='w-full border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
            onClick={() => {
              setUrlError(null); // Clear any URL errors
              loginWithGoogle();
            }}
            disabled={isFormLoading}
          >
            {isFormLoading ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent'></div>
                Đang kết nối...
              </>
            ) : (
              <>
                <Google className='mr-2 h-4 w-4' />
                Tiếp tục với Google
              </>
            )}
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-gray-300 dark:border-gray-600' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400'>
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='Nhập email của bạn'
                value={values.email}
                onChange={e => handleChange('email', e.target.value)}
                disabled={isFormLoading}
                className={
                  getFieldError('email')
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'focus:border-health-500 focus:ring-health-500'
                }
              />
              {getFieldError('email') && (
                <p className='text-sm text-red-600 dark:text-red-400'>
                  {getFieldError('email')}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Mật khẩu</Label>
              <Input
                id='password'
                type='password'
                placeholder='Nhập mật khẩu của bạn'
                value={values.password}
                onChange={e => handleChange('password', e.target.value)}
                disabled={isFormLoading}
                className={
                  getFieldError('password')
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'focus:border-health-500 focus:ring-health-500'
                }
              />
              {getFieldError('password') && (
                <p className='text-sm text-red-600 dark:text-red-400'>
                  {getFieldError('password')}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='from-health-500 to-health-600 hover:from-health-600 hover:to-health-700 w-full transform bg-gradient-to-r text-white shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100'
              disabled={!isValid || isFormLoading}
            >
              {isFormLoading ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>

          <div className='mt-4 text-center text-sm'>
            <Link
              href='/auth/forgot-password'
              className={`text-health-600 hover:text-health-700 dark:text-health-400 dark:hover:text-health-300 font-medium hover:underline ${
                isFormLoading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
            Chưa có tài khoản?{' '}
            <Link
              href='/auth/register'
              className={`text-health-600 hover:text-health-700 dark:text-health-400 dark:hover:text-health-300 font-medium hover:underline ${
                isFormLoading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Đăng ký
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-lg'>Đang tải...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
