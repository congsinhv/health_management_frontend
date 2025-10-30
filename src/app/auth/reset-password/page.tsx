'use client';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrength } from '@/components/ui/password-strength';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import { AlertTriangle, ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  // Check if token exists on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    // For now, assume token is valid if it exists
    // Token validation will happen when user submits the form
    setTokenValid(true);
  }, [token]);

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Mật khẩu là bắt buộc';
    if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
    if (!/[a-z]/.test(password)) return 'Mật khẩu phải chứa chữ thường';
    if (!/[A-Z]/.test(password)) return 'Mật khẩu phải chứa chữ hoa';
    if (!/\d/.test(password)) return 'Mật khẩu phải chứa số';
    return null;
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ): string | null => {
    if (!confirmPassword) return 'Vui lòng xác nhận mật khẩu';
    if (confirmPassword !== password) return 'Mật khẩu xác nhận không khớp';
    return null;
  };

  const passwordError = touched.password ? validatePassword(password) : null;
  const confirmPasswordError = touched.confirmPassword
    ? validateConfirmPassword(confirmPassword, password)
    : null;
  const isValid =
    !passwordError && !confirmPasswordError && password && confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      password: true,
      confirmPassword: true,
    });

    const passwordValidationError = validatePassword(password);
    const confirmPasswordValidationError = validateConfirmPassword(
      confirmPassword,
      password
    );

    if (passwordValidationError || confirmPasswordValidationError) {
      return;
    }

    if (!token) {
      const errorMessage = 'Không có mã đặt lại mật khẩu';
      setError(errorMessage);
      logger.authError('Reset password attempt without token');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      logger.debug('Bắt đầu đặt lại mật khẩu');

      await api.auth.resetPassword({ token, new_password: password });
      setIsSuccess(true);

      logger.authSuccess('Đặt lại mật khẩu thành công');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.';

      setError(errorMessage);

      logger.authError(
        'Đặt lại mật khẩu thất bại',
        err instanceof Error ? err : new Error(errorMessage)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    field: 'password' | 'confirmPassword',
    value: string
  ) => {
    if (field === 'password') {
      setPassword(value);
    } else {
      setConfirmPassword(value);
    }
    setError(null);
  };

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#00bba7]'></div>
          <p className='text-[#6a7282]'>Đang xác thực mã đặt lại...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className='flex min-h-screen bg-white'>
        <div className='flex w-full flex-col lg:w-[661px]'>
          {/* Header */}
          <div className='flex items-start justify-between px-12 pt-12'>
            <Logo />
            <div className='flex items-center gap-3'>
              <span className='text-xs text-[#657282] italic'>
                Nhớ mật khẩu?
              </span>
              <Link href='/auth/login'>
                <Button
                  variant='outline'
                  size='default'
                  className='h-9 rounded-full px-6'
                >
                  <span className='mt-[3px] text-xs font-medium text-gray-600 italic'>
                    ĐĂNG NHẬP
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Error Content */}
          <div className='flex flex-1 items-center justify-center px-12'>
            <div className='w-full max-w-[26rem] space-y-8'>
              <div className='text-center'>
                <AlertTriangle className='mx-auto mb-6 h-16 w-16 text-red-500' />
                <h1 className='mb-4 text-2xl leading-9 font-medium tracking-[0.07px] text-[#101828]'>
                  Liên kết đặt lại không hợp lệ
                </h1>
                <p className='text-base leading-6 font-normal tracking-tight text-[#6a7282]'>
                  Liên kết này không hợp lệ hoặc đã hết hạn. Liên kết đặt lại có
                  hiệu lực trong 1 giờ.
                </p>
              </div>

              <div className='flex flex-col space-y-3'>
                <Link href='/auth/forgot-password'>
                  <Button variant='gradient' size='lg' className='w-full'>
                    <span className='font-semibold'>Yêu cầu liên kết mới</span>
                  </Button>
                </Link>

                <Link href='/auth/login'>
                  <Button variant='outline' size='lg' className='w-full'>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    <span className='font-medium'>Quay lại đăng nhập</span>
                  </Button>
                </Link>
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

  // Success state
  if (isSuccess) {
    return (
      <div className='flex min-h-screen bg-white'>
        <div className='flex w-full flex-col lg:w-[661px]'>
          {/* Header */}
          <div className='flex items-start justify-between px-12 pt-12'>
            <Logo />
            <div className='flex items-center gap-3'>
              <span className='text-xs text-[#657282] italic'>
                Nhớ mật khẩu?
              </span>
              <Link href='/auth/login'>
                <Button
                  variant='outline'
                  size='default'
                  className='h-9 rounded-full px-6'
                >
                  <span className='mt-[3px] text-xs font-medium text-gray-600 italic'>
                    ĐĂNG NHẬP
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Success Content */}
          <div className='flex flex-1 items-center justify-center px-12'>
            <div className='w-full max-w-[26rem] space-y-8'>
              <div className='text-center'>
                <CheckCircle className='mx-auto mb-6 h-16 w-16 text-green-500' />
                <h1 className='mb-4 text-2xl leading-9 font-medium tracking-[0.07px] text-[#101828]'>
                  Mật khẩu đã được cập nhật!
                </h1>
                <p className='text-base leading-6 font-normal tracking-tight text-[#6a7282]'>
                  Bây giờ bạn có thể đăng nhập với mật khẩu mới.
                </p>
              </div>

              <Link href='/auth/login'>
                <Button variant='gradient' size='lg' className='w-full'>
                  <span className='font-semibold'>Tiếp tục đăng nhập</span>
                </Button>
              </Link>
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

  // Reset password form
  return (
    <div className='flex min-h-screen bg-white'>
      {/* Left Side - Form */}
      <div className='flex w-full flex-col lg:w-[661px]'>
        {/* Header */}
        <div className='flex items-start justify-between px-12 pt-12'>
          <Logo />
          <div className='flex items-center gap-3'>
            <span className='text-xs text-[#657282] italic'>Nhớ mật khẩu?</span>
            <Link href='/auth/login'>
              <Button
                variant='outline'
                size='default'
                className='h-9 rounded-full px-6'
              >
                <span className='mt-[3px] text-xs font-medium text-gray-600 italic'>
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
                Đặt mật khẩu mới
              </h1>
              <p className='text-base leading-6 font-normal tracking-tight text-[#6a7282]'>
                Vui lòng nhập mật khẩu mới của bạn bên dưới.
              </p>
            </div>

            {error && (
              <div className='rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-500 italic'>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-1'>
              {/* New Password */}
              <div>
                <Label htmlFor='password' className='mb-2 block'>
                  Mật khẩu mới
                </Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Nhập mật khẩu mới của bạn'
                  value={password}
                  onChange={e => handleChange('password', e.target.value)}
                  onBlur={() =>
                    setTouched(prev => ({ ...prev, password: true }))
                  }
                  disabled={isLoading}
                  className={
                    passwordError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }
                />
                <div className='mt-1 min-h-[20px]'>
                  {passwordError && (
                    <p className='text-xs text-red-500 italic'>
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className='py-2'>
                  <PasswordStrength password={password} />
                </div>
              )}

              {/* Confirm Password */}
              <div>
                <Label htmlFor='confirmPassword' className='mb-2 block'>
                  Xác nhận mật khẩu mới
                </Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='Xác nhận mật khẩu mới của bạn'
                  value={confirmPassword}
                  onChange={e =>
                    handleChange('confirmPassword', e.target.value)
                  }
                  onBlur={() =>
                    setTouched(prev => ({ ...prev, confirmPassword: true }))
                  }
                  disabled={isLoading}
                  className={
                    confirmPasswordError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }
                />
                <div className='mt-1 min-h-[20px]'>
                  {confirmPasswordError && (
                    <p className='text-xs text-red-500 italic'>
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className='pt-3'>
                <Button
                  type='submit'
                  variant='gradient'
                  size='lg'
                  className='w-full'
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                      <span className='font-semibold'>
                        Đang cập nhật mật khẩu...
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className='mr-2 h-4 w-4' />
                      <span className='font-semibold'>Cập nhật mật khẩu</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-white'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#00bba7]'></div>
            <p className='text-[#6a7282]'>Đang tải...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
