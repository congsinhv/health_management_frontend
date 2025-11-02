'use client';

import { Google, FacebookIcon, AppleIcon } from '@/components/icons';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthForm, validateRegister } from '@/hooks/useAuthForm';
import { RegisterCredentials } from '@/types/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

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
  });

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
        // Small delay to show the success toast before redirecting to login
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } catch (error) {
        // Error is already handled by the AuthContext with toast
        console.error('Registration failed:', error);
      }
    },
  });

  // Combined loading state for better UX
  const isFormLoading = isLoading || isSubmitting;

  return (
    <div className='flex min-h-screen bg-white'>
      {/* Left Side - Form */}
      <div className='flex w-full flex-col lg:w-[661px]'>
        {/* Header */}
        <div className='flex items-start justify-between px-12 pt-12'>
          <Logo />
          <div className='flex items-center gap-3'>
            <span className='text-xs text-[#657282] italic'>
              Đã có tài khoản?
            </span>
            <Link href='/auth/login'>
              <Button
                variant='outline'
                size='default'
                className='h-9 rounded-full px-6'
              >
                <span className='5ext-gray-600 mt-[3px] text-xs font-medium italic'>
                  ĐĂNG NHẬP
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
                Chào mừng đến VHealth!
              </h1>
              <p className='text-base leading-6 font-normal tracking-tight text-[#6a7282]'>
                Đăng ký tài khoản của bạn
              </p>
            </div>

            {error && (
              <div className='rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-500 italic'>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-1'>
              {/* Name Fields */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='firstName' className='mb-2 block'>
                    Tên
                  </Label>
                  <Input
                    id='firstName'
                    type='text'
                    placeholder='Nhập tên của bạn'
                    value={values.firstName}
                    onChange={e => handleChange('firstName', e.target.value)}
                    className={
                      getFieldError('firstName')
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }
                    disabled={isFormLoading}
                  />
                  <div className='mt-1 min-h-[20px]'>
                    {getFieldError('firstName') && (
                      <p className='text-xs text-red-500 italic'>
                        {getFieldError('firstName')}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor='lastName' className='mb-2 block'>
                    Họ
                  </Label>
                  <Input
                    id='lastName'
                    type='text'
                    placeholder='Nhập họ của bạn'
                    value={values.lastName}
                    onChange={e => handleChange('lastName', e.target.value)}
                    className={
                      getFieldError('lastName')
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }
                    disabled={isFormLoading}
                  />
                  <div className='mt-1 min-h-[20px]'>
                    {getFieldError('lastName') && (
                      <p className='text-xs text-red-500 italic'>
                        {getFieldError('lastName')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

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
                  placeholder='Tạo mật khẩu mạnh'
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

              {/* Confirm Password */}
              <div>
                <Label htmlFor='confirmPassword' className='mb-2 block'>
                  Xác nhận mật khẩu
                </Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='Xác nhận mật khẩu của bạn'
                  value={values.confirmPassword}
                  onChange={e =>
                    handleChange('confirmPassword', e.target.value)
                  }
                  className={
                    getFieldError('confirmPassword')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }
                  disabled={isFormLoading}
                />
                <div className='mt-1 min-h-[20px]'>
                  {getFieldError('confirmPassword') && (
                    <p className='text-xs text-red-500 italic'>
                      {getFieldError('confirmPassword')}
                    </p>
                  )}
                </div>
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
                    <span className='font-semibold'>Đang tạo tài khoản...</span>
                  </>
                ) : (
                  <span className='font-semibold'>Đăng ký</span>
                )}
              </Button>
            </form>

            {/* Social Login Section */}
            <div className='space-y-2'>
              <div className='text-center'>
                <span className='text-xs text-[#95a1af] italic'>
                  Tạo tài khoản với
                </span>
              </div>
              <div className='flex items-center justify-center'>
                <Button
                  type='button'
                  variant='social'
                  size='icon-lg'
                  onClick={loginWithGoogle}
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
          {/* Placeholder for medical professional image */}
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
