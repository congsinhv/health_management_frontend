'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCountdown } from '@/hooks/useCountdown';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import {
  ArrowLeft,
  CheckCircle,
  Mail,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const { requestReset, isLoading, error, isSuccess, clearError, reset } =
    useForgotPassword();
  const countdown = useCountdown(60); // 60 minutes

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) return 'Email là bắt buộc';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Vui lòng nhập địa chỉ email hợp lệ';
    }
    return null;
  };

  const emailError = touched ? validateEmail(email) : null;
  const isValid = !emailError && email.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const validationError = validateEmail(email);
    if (validationError) return;

    try {
      await requestReset(email);
      if (isSuccess) {
        countdown.restart(); // Start countdown when email is successfully sent
      }
    } catch {
      // Error is handled by the hook
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) clearError();
  };

  if (isSuccess) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <CheckCircle className='mx-auto mb-6 h-16 w-16 text-green-500' />

            <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
              Email đã được gửi!
            </h2>

            <p className='mb-6 text-gray-600 dark:text-gray-400'>
              Nếu email <strong>{email}</strong> tồn tại trong hệ thống của
              chúng tôi, chúng tôi đã gửi cho bạn liên kết đặt lại mật khẩu.
            </p>

            <p className='mb-8 text-sm text-gray-500 dark:text-gray-500'>
              Kiểm tra hộp thư đến và thư mục spam của bạn. Liên kết sẽ hết hạn
              sau 1 giờ.
            </p>
          </div>

          <div className='space-y-4'>
            <Button
              onClick={() => {
                reset();
                setEmail('');
                countdown.restart();
              }}
              variant='outline'
              className='w-full'
            >
              <RefreshCw className='mr-2 h-4 w-4' />
              Gửi email khác
            </Button>

            <div className='flex space-x-3'>
              <Link href='/auth/login' className='flex-1'>
                <Button variant='ghost' className='w-full'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Quay lại đăng nhập
                </Button>
              </Link>

              <Link href='/auth/register' className='flex-1'>
                <Button
                  variant='ghost'
                  className='w-full text-blue-600 hover:text-blue-700 dark:text-blue-400'
                >
                  Tạo tài khoản
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Quên mật khẩu?
          </h2>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để
            đặt lại mật khẩu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-2'>
            <Label htmlFor='email'>Địa chỉ email</Label>
            <Input
              id='email'
              type='email'
              placeholder='Nhập email của bạn'
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
              onBlur={() => setTouched(true)}
              disabled={isLoading}
              className={
                emailError ? 'border-red-500 focus:border-red-500' : ''
              }
            />
            {emailError && <p className='text-sm text-red-600'>{emailError}</p>}
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                Đang gửi liên kết đặt lại...
              </>
            ) : (
              <>
                <Mail className='mr-2 h-4 w-4' />
                Gửi liên kết đặt lại
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
