'use client';

import { Logo } from '@/components/shared/Logo';
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
import { useCountdown } from '@/hooks/useCountdown';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle, Mail, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import * as z from 'zod';

const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Vui lòng nhập địa chỉ email hợp lệ'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export default function ForgotPasswordPage() {
  const { requestReset, isLoading, error, isSuccess, clearError, reset } =
    useForgotPassword();
  const countdown = useCountdown(60); // 60 minutes

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      await requestReset(data.email);
      if (isSuccess) {
        countdown.restart(); // Start countdown when email is successfully sent
      }
    } catch {
      // Error is handled by the hook
    }
  }

  // Clear error when form values change
  const emailValue = form.watch('email');
  if (error && emailValue) {
    clearError();
  }

  if (isSuccess) {
    return (
      <div className='flex min-h-screen bg-white'>
        {/* Left Side - Success Message */}
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
                  Email đã được gửi!
                </h1>

                <p className='mb-6 text-base leading-6 font-normal tracking-tight text-[#6a7282]'>
                  Nếu email{' '}
                  <strong className='text-[#101828]'>
                    {form.getValues('email')}
                  </strong>{' '}
                  tồn tại trong hệ thống của chúng tôi, chúng tôi đã gửi cho bạn
                  liên kết đặt lại mật khẩu.
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
                    form.reset();
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
                Quên mật khẩu?
              </h1>
              <p className='text-base leading-6 font-normal tracking-tight text-[#6a7282]'>
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết
                để đặt lại mật khẩu.
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
                className='space-y-4'
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Nhập email của bạn'
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
