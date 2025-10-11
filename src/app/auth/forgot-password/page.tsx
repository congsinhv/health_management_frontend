'use client';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCountdown } from '@/hooks/useCountdown';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import { ArrowLeft, CheckCircle, Mail, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

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
      <div className='flex min-h-screen bg-white'>
        {/* Left Side - Success Message */}
        <div className='flex w-full flex-col lg:w-[661px]'>
          {/* Header */}
          <div className='flex items-start justify-between px-12 pt-12'>
            <Logo />
            <div className='flex items-center gap-3'>
              <span className='text-xs italic text-[#657282]'>
                Nhớ mật khẩu?
              </span>
              <Link href='/auth/login'>
                <Button
                  variant='outline'
                  size='default'
                  className='h-9 rounded-full px-6'
                >
                  <span className='mt-[3px] text-xs font-medium italic text-gray-600'>
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

                <h1 className='mb-4 text-2xl font-medium leading-9 tracking-[0.07px] text-[#101828]'>
                  Email đã được gửi!
                </h1>

                <p className='mb-6 text-base font-normal leading-6 tracking-tight text-[#6a7282]'>
                  Nếu email <strong className='text-[#101828]'>{email}</strong>{' '}
                  tồn tại trong hệ thống của chúng tôi, chúng tôi đã gửi cho
                  bạn liên kết đặt lại mật khẩu.
                </p>

                <p className='mb-8 text-sm text-[#95a1af]'>
                  Kiểm tra hộp thư đến và thư mục spam của bạn. Liên kết sẽ hết
                  hạn sau 1 giờ.
                </p>
              </div>

              <div className='space-y-3'>
                <Button
                  onClick={() => {
                    reset();
                    setEmail('');
                    countdown.restart();
                  }}
                  variant='gradient'
                  size='lg'
                  className='w-full'
                >
                  <RefreshCw className='mr-2 h-4 w-4' />
                  <span className='font-semibold'>Gửi email khác</span>
                </Button>

                <div className='flex gap-3'>
                  <Link href='/auth/login' className='flex-1'>
                    <Button variant='outline' size='lg' className='w-full'>
                      <ArrowLeft className='mr-2 h-4 w-4' />
                      <span className='font-medium'>Đăng nhập</span>
                    </Button>
                  </Link>

                  <Link href='/auth/register' className='flex-1'>
                    <Button variant='outline' size='lg' className='w-full'>
                      <span className='font-medium'>Đăng ký</span>
                    </Button>
                  </Link>
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

  return (
    <div className='flex min-h-screen bg-white'>
      {/* Left Side - Form */}
      <div className='flex w-full flex-col lg:w-[661px]'>
        {/* Header */}
        <div className='flex items-start justify-between px-12 pt-12'>
          <Logo />
          <div className='flex items-center gap-3'>
            <span className='text-xs italic text-[#657282]'>
              Nhớ mật khẩu?
            </span>
            <Link href='/auth/login'>
              <Button
                variant='outline'
                size='default'
                className='h-9 rounded-full px-6'
              >
                <span className='mt-[3px] text-xs font-medium italic text-gray-600'>
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
              <h1 className='text-2xl font-medium leading-9 tracking-[0.07px] text-[#101828]'>
                Quên mật khẩu?
              </h1>
              <p className='text-base font-normal leading-6 tracking-tight text-[#6a7282]'>
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết
                để đặt lại mật khẩu.
              </p>
            </div>

            {error && (
              <div className='rounded-md border border-red-200 bg-red-50 p-3 text-xs italic text-red-500'>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-1'>
              {/* Email */}
              <div>
                <Label htmlFor='email' className='mb-2 block'>
                  Địa chỉ email
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Nhập email của bạn'
                  value={email}
                  onChange={e => handleEmailChange(e.target.value)}
                  onBlur={() => setTouched(true)}
                  disabled={isLoading}
                  className={
                    emailError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }
                />
                <div className='mt-1 min-h-[20px]'>
                  {emailError && (
                    <p className='text-xs italic text-red-500'>{emailError}</p>
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
                        Đang gửi liên kết đặt lại...
                      </span>
                    </>
                  ) : (
                    <>
                      <Mail className='mr-2 h-4 w-4' />
                      <span className='font-semibold'>
                        Gửi liên kết đặt lại
                      </span>
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
