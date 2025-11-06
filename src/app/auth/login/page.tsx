'use client';

import { Google } from '@/components/icons';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthForm, validateLogin } from '@/hooks/useAuthForm';
import { LoginCredentials } from '@/types/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';

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
  }, [error, clearError]);

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

  const { values, isSubmitting, handleChange, handleSubmit, getFieldError } =
    useAuthForm<LoginCredentials>({
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
    <div className='flex min-h-screen bg-white'>
      {/* Left Side - Form */}
      <div className='flex w-full flex-col lg:w-[661px]'>
        {/* Header */}
        <div className='flex items-start justify-between px-12 pt-12'>
          <Logo />
          <div className='flex items-center gap-3'>
            <span className='text-xs text-[#657282] italic'>
              Chưa có tài khoản?
            </span>
            <Link href='/auth/register'>
              <Button
                variant='outline'
                size='default'
                className='h-9 rounded-full px-6'
              >
                <span className='mt-[3px] text-xs font-medium text-gray-600 italic'>
                  ĐĂNG KÝ
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Form Content */}
        <div className='flex flex-1 items-center justify-center px-12'>
          <div className='w-full max-w-[26rem] space-y-8'>
            {/* Title and Description */}
            <div className='space-y-2'>
              <h1 className='text-2xl leading-9 font-medium tracking-[0.07px] text-[#101828]'>
                Chào Mừng Trở Lại
              </h1>
              <p className='text-base leading-6 font-normal tracking-tight text-[#6a7282]'>
                Đăng nhập vào tài khoản của bạn
              </p>
            </div>

            {displayError && (
              <div className='rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-500 italic'>
                {displayError}
              </div>
            )}

            {urlSuccess && (
              <div className='rounded-md border border-green-200 bg-green-50 p-3 text-xs text-green-500 italic'>
                {urlSuccess}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-1'>
              {/* Email */}
              <div>
                <Label htmlFor='email' className='mb-2 block'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Nhập email của bạn'
                  value={values.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className={
                    getFieldError('email')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }
                  disabled={isFormLoading}
                />
                <div className='mt-1 min-h-[20px]'>
                  {getFieldError('email') && (
                    <p className='text-xs text-red-500 italic'>
                      {getFieldError('email')}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor='password' className='mb-2 block'>
                  Mật khẩu
                </Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Nhập mật khẩu của bạn'
                  value={values.password}
                  onChange={e => handleChange('password', e.target.value)}
                  className={
                    getFieldError('password')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }
                  disabled={isFormLoading}
                />
                <div className='mt-1 min-h-[20px]'>
                  {getFieldError('password') && (
                    <p className='text-xs text-red-500 italic'>
                      {getFieldError('password')}
                    </p>
                  )}
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className='flex justify-end pt-1 pb-3'>
                <Link
                  href='/auth/forgot-password'
                  className={`text-xs text-[#657282] italic hover:text-[#101828] hover:underline ${
                    isFormLoading ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                variant='gradient'
                size='lg'
                className='w-full'
                disabled={isFormLoading}
              >
                {isFormLoading ? (
                  <>
                    <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                    <span className='font-semibold'>Đang đăng nhập...</span>
                  </>
                ) : (
                  <span className='font-semibold'>Đăng nhập</span>
                )}
              </Button>
            </form>

            {/* Social Login Section */}
            <div className='space-y-2'>
              <div className='text-center'>
                <span className='text-xs text-[#95a1af] italic'>
                  Đăng nhập với
                </span>
              </div>
              <div className='flex items-center justify-center'>
                <Button
                  type='button'
                  variant='social'
                  size='icon-lg'
                  onClick={() => {
                    setUrlError(null); // Clear any URL errors
                    loginWithGoogle();
                  }}
                  disabled={isFormLoading}
                  className='flex items-center justify-center'
                >
                  <Google className='h-5 w-5' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className='relative hidden flex-1 bg-gradient-to-br from-[#e6f9f0] to-[#d1f5e3] lg:block'>
        <div className='flex h-full items-center justify-center p-12'>
          <Image
            src='/images/medical-physician-doctor-man.png'
            alt='Medical Professional'
            fill
            className='object-cover'
          />
        </div>
      </div>
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
