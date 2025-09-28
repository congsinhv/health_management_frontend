'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { useAuthForm, validateRegister } from '@/hooks/useAuthForm';
import { RegisterCredentials } from '@/types/auth';
import { Google } from '@/components/icons';

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
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
  }, []);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const {
    values,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit,
    getFieldError,
  } = useAuthForm<RegisterCredentials>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: validateRegister,
    onSubmit: async credentials => {
      try {
        await register(credentials);
        // Small delay to show the success toast before redirecting
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (error) {
        // Error is already handled by the AuthContext with toast
        console.error('Registration failed:', error);
      }
    },
  });

  // Combined loading state for better UX
  const isFormLoading = isLoading || isSubmitting;

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
            Tạo Tài Khoản
          </CardTitle>
          <CardDescription className='text-gray-600 dark:text-gray-400'>
            Tham gia Health Management để bắt đầu hành trình sức khỏe của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {error && (
            <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'>
              {error}
            </div>
          )}

          {/* Google Sign Up Button */}
          <Button
            type='button'
            variant='outline'
            className='w-full border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
            onClick={loginWithGoogle}
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
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>Tên</Label>
                <Input
                  id='firstName'
                  type='text'
                  placeholder='Văn A'
                  value={values.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                  className={
                    getFieldError('firstName')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'focus:border-health-500 focus:ring-health-500'
                  }
                  disabled={isFormLoading}
                />
                {getFieldError('firstName') && (
                  <p className='text-sm text-red-600 dark:text-red-400'>
                    {getFieldError('firstName')}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Họ</Label>
                <Input
                  id='lastName'
                  type='text'
                  placeholder='Nguyễn'
                  value={values.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                  className={
                    getFieldError('lastName')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'focus:border-health-500 focus:ring-health-500'
                  }
                  disabled={isFormLoading}
                />
                {getFieldError('lastName') && (
                  <p className='text-sm text-red-600 dark:text-red-400'>
                    {getFieldError('lastName')}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='nguyenvana@example.com'
                value={values.email}
                onChange={e => handleChange('email', e.target.value)}
                className={
                  getFieldError('email')
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'focus:border-health-500 focus:ring-health-500'
                }
                disabled={isFormLoading}
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
                placeholder='Tạo mật khẩu mạnh'
                value={values.password}
                onChange={e => handleChange('password', e.target.value)}
                className={
                  getFieldError('password')
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'focus:border-health-500 focus:ring-health-500'
                }
                disabled={isFormLoading}
              />
              {getFieldError('password') && (
                <p className='text-sm text-red-600 dark:text-red-400'>
                  {getFieldError('password')}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Xác nhận mật khẩu</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Xác nhận mật khẩu của bạn'
                value={values.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                className={
                  getFieldError('confirmPassword')
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'focus:border-health-500 focus:ring-health-500'
                }
                disabled={isFormLoading}
              />
              {getFieldError('confirmPassword') && (
                <p className='text-sm text-red-600 dark:text-red-400'>
                  {getFieldError('confirmPassword')}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='from-health-500 to-health-600 hover:from-health-600 hover:to-health-700 w-full transform bg-gradient-to-r text-white shadow-lg transition-all duration-200 hover:scale-[1.02]'
              disabled={!isValid || isFormLoading}
            >
              {isFormLoading ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  Đang tạo tài khoản...
                </>
              ) : (
                'Tạo tài khoản'
              )}
            </Button>
          </form>

          <div className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
            Đã có tài khoản?{' '}
            <Link
              href='/auth/login'
              className={`text-health-600 hover:text-health-700 dark:text-health-400 dark:hover:text-health-300 font-medium hover:underline ${
                isFormLoading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
