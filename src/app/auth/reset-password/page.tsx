'use client';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordStrength } from '@/components/ui/password-strength';
import { authService } from '@/services/auth';
import { logger } from '@/lib/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import * as z from 'zod';

const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Mật khẩu là bắt buộc')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[a-z]/, 'Mật khẩu phải chứa chữ thường')
      .regex(/[A-Z]/, 'Mật khẩu phải chứa chữ hoa')
      .regex(/\d/, 'Mật khẩu phải chứa số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
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

  async function onSubmit(data: ResetPasswordFormValues) {
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

      await authService.resetPassword({ token, new_password: data.password });
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
  }

  // Clear error when form values change
  const passwordValue = form.watch('password');
  if (error && passwordValue) {
    setError(null);
  }

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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-1'
              >
                {/* New Password */}
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Nhập mật khẩu mới của bạn'
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Strength Indicator */}
                {form.watch('password') && (
                  <div className='py-2'>
                    <PasswordStrength password={form.watch('password')} />
                  </div>
                )}

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Xác nhận mật khẩu mới của bạn'
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className='pt-3'>
                  <Button
                    type='submit'
                    variant='gradient'
                    size='lg'
                    className='w-full'
                    disabled={isLoading || form.formState.isSubmitting}
                  >
                    {isLoading || form.formState.isSubmitting ? (
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
            </Form>
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
