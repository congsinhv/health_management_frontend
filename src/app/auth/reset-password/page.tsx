'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordStrength } from '@/components/ui/password-strength';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import { Lock, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
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
      <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='border-health-600 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2'></div>
          <p className='text-gray-600 dark:text-gray-400'>
            Đang xác thực mã đặt lại...
          </p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <AlertTriangle className='mx-auto mb-4 h-16 w-16 text-red-500' />
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Liên kết đặt lại không hợp lệ
            </h2>
            <p className='mt-4 text-gray-600 dark:text-gray-400'>
              Liên kết này không hợp lệ hoặc đã hết hạn. Liên kết đặt lại có
              hiệu lực trong 1 giờ.
            </p>
          </div>

          <div className='flex flex-col space-y-4'>
            <Link href='/auth/forgot-password'>
              <Button className='w-full'>Yêu cầu liên kết mới</Button>
            </Link>

            <Link href='/auth/login'>
              <Button variant='ghost' className='w-full'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <CheckCircle className='mx-auto mb-4 h-16 w-16 text-green-500' />
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Mật khẩu đã được cập nhật!
            </h2>
            <p className='mt-4 text-gray-600 dark:text-gray-400'>
              Bây giờ bạn có thể đăng nhập với mật khẩu mới.
            </p>
          </div>

          <Link href='/auth/login'>
            <Button className='w-full'>Tiếp tục đăng nhập</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Đặt mật khẩu mới
          </h2>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            Vui lòng nhập mật khẩu mới của bạn bên dưới.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-2'>
            <Label htmlFor='password'>Mật khẩu mới</Label>
            <Input
              id='password'
              type='password'
              placeholder='Nhập mật khẩu mới của bạn'
              value={password}
              onChange={e => handleChange('password', e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              disabled={isLoading}
              className={
                passwordError ? 'border-red-500 focus:border-red-500' : ''
              }
            />
            {passwordError && (
              <p className='text-sm text-red-600'>{passwordError}</p>
            )}
          </div>

          {password && <PasswordStrength password={password} />}

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Xác nhận mật khẩu mới</Label>
            <Input
              id='confirmPassword'
              type='password'
              placeholder='Xác nhận mật khẩu mới của bạn'
              value={confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              onBlur={() =>
                setTouched(prev => ({ ...prev, confirmPassword: true }))
              }
              disabled={isLoading}
              className={
                confirmPasswordError
                  ? 'border-red-500 focus:border-red-500'
                  : ''
              }
            />
            {confirmPasswordError && (
              <p className='text-sm text-red-600'>{confirmPasswordError}</p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                Đang cập nhật mật khẩu...
              </>
            ) : (
              <>
                <Lock className='mr-2 h-4 w-4' />
                Cập nhật mật khẩu
              </>
            )}
          </Button>

          <div className='text-center'>
            <Link href='/auth/login'>
              <Button variant='ghost' className='text-sm'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
          <div className='text-center'>
            <div className='border-health-600 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2'></div>
            <p className='text-gray-600 dark:text-gray-400'>Đang tải...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
