'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { authService } from '@/services/auth';
import { logger } from '@/lib/logger';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface VerificationState {
  status: 'loading' | 'success' | 'error' | 'expired' | 'invalid';
  message: string;
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationState, setVerificationState] = useState<VerificationState>(
    {
      status: 'loading',
      message: 'Đang xác thực email...',
    }
  );
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        logger.authError(
          'Thiếu token xác thực email',
          new Error('No verification token provided')
        );
        setVerificationState({
          status: 'invalid',
          message:
            'Liên kết xác thực không hợp lệ. Vui lòng kiểm tra email của bạn.',
        });
        return;
      }

      try {
        logger.debug('Bắt đầu xác thực email', {
          tokenLength: token.length,
          tokenStart: token.substring(0, 20) + '...',
        });

        const response = await authService.verifyEmail(token);

        logger.authSuccess('Xác thực email thành công', {
          message: response.message,
        });

        setVerificationState({
          status: 'success',
          message: response.message || 'Email đã được xác thực thành công!',
        });

        // Redirect to login after successful verification
        setTimeout(() => {
          router.push('/auth/login?verified=true');
        }, 3000);
      } catch (error) {
        logger.authError(
          'Xác thực email thất bại',
          error instanceof Error
            ? error
            : new Error('Email verification failed')
        );

        // Handle different types of verification errors
        const errorMessage = error instanceof Error ? error.message : '';

        if (
          errorMessage.includes('already verified') ||
          errorMessage.includes('đã được xác thực')
        ) {
          setVerificationState({
            status: 'success',
            message:
              'Email của bạn đã được xác thực rồi. Bạn có thể đăng nhập ngay bây giờ.',
          });
          // Redirect to login after showing success
          setTimeout(() => {
            router.push('/auth/login?verified=true');
          }, 3000);
        } else if (
          errorMessage.includes('expired') ||
          errorMessage.includes('hết hạn')
        ) {
          setVerificationState({
            status: 'expired',
            message:
              'Liên kết xác thực đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.',
          });
        } else if (
          errorMessage.includes('invalid') ||
          errorMessage.includes('không hợp lệ')
        ) {
          setVerificationState({
            status: 'invalid',
            message:
              'Liên kết xác thực không hợp lệ. Vui lòng kiểm tra email của bạn.',
          });
        } else {
          setVerificationState({
            status: 'error',
            message: 'Có lỗi xảy ra khi xác thực email. Vui lòng thử lại sau.',
          });
        }
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  const handleResendVerification = async () => {
    try {
      setIsResending(true);

      await authService.resendVerification();

      setVerificationState({
        status: 'success',
        message:
          'Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.',
      });

      logger.authSuccess('Gửi lại email xác thực thành công');
    } catch (error) {
      logger.authError(
        'Gửi lại email xác thực thất bại',
        error instanceof Error ? error : new Error('Resend verification failed')
      );

      setVerificationState({
        status: 'error',
        message: 'Không thể gửi lại email xác thực. Vui lòng thử lại sau.',
      });
    } finally {
      setIsResending(false);
    }
  };

  const getIcon = () => {
    switch (verificationState.status) {
      case 'loading':
        return <Loader2 className='h-16 w-16 animate-spin text-[#657282]' />;
      case 'success':
        return <CheckCircle className='h-16 w-16 text-green-500' />;
      case 'error':
      case 'expired':
      case 'invalid':
        return <XCircle className='h-16 w-16 text-red-500' />;
      default:
        return <Mail className='h-16 w-16 text-[#657282]' />;
    }
  };

  const getTitle = () => {
    switch (verificationState.status) {
      case 'loading':
        return 'Đang xác thực email...';
      case 'success':
        return 'Xác thực thành công!';
      case 'expired':
        return 'Liên kết đã hết hạn';
      case 'invalid':
        return 'Liên kết không hợp lệ';
      case 'error':
        return 'Xác thực thất bại';
      default:
        return 'Xác thực email';
    }
  };

  return (
    <div className='flex min-h-screen bg-white'>
      {/* Left Side - Content */}
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
                <span className='mt-[3px] text-xs font-medium text-gray-600 italic'>
                  ĐĂNG NHẬP
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className='flex flex-1 items-center justify-center px-12'>
          <div className='w-full max-w-[26rem] space-y-8'>
            {/* Icon */}
            <div className='flex justify-center'>{getIcon()}</div>

            {/* Title and Description */}
            <div className='space-y-2 text-center'>
              <h1 className='text-2xl leading-9 font-medium tracking-[0.07px] text-[#101828]'>
                {getTitle()}
              </h1>
              <p className='text-base leading-6 font-normal tracking-tight text-[#6a7282]'>
                {verificationState.status === 'loading'
                  ? 'Vui lòng đợi trong khi chúng tôi xác thực email của bạn'
                  : verificationState.status === 'success'
                    ? 'Bạn sẽ được chuyển hướng đến trang đăng nhập trong giây lát'
                    : 'Có vấn đề với quá trình xác thực email'}
              </p>
            </div>

            {/* Message */}
            {verificationState.message && (
              <div
                className={`rounded-md border p-3 text-xs italic ${
                  verificationState.status === 'success'
                    ? 'border-green-200 bg-green-50 text-green-500'
                    : verificationState.status === 'error' ||
                        verificationState.status === 'expired' ||
                        verificationState.status === 'invalid'
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-blue-200 bg-blue-50 text-blue-500'
                }`}
              >
                {verificationState.message}
              </div>
            )}

            {/* Actions */}
            <div className='space-y-3'>
              {verificationState.status === 'success' && (
                <Button
                  onClick={() => router.push('/auth/login?verified=true')}
                  variant='gradient'
                  size='lg'
                  className='w-full'
                >
                  <span className='font-semibold'>Đến trang đăng nhập</span>
                </Button>
              )}

              {(verificationState.status === 'expired' ||
                verificationState.status === 'error') && (
                <Button
                  onClick={handleResendVerification}
                  variant='gradient'
                  size='lg'
                  className='w-full'
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                      <span className='font-semibold'>Đang gửi...</span>
                    </>
                  ) : (
                    <span className='font-semibold'>
                      Gửi lại email xác thực
                    </span>
                  )}
                </Button>
              )}

              <Button
                variant='outline'
                onClick={() => router.push('/auth/login')}
                size='lg'
                className='w-full'
              >
                <span className='font-semibold'>Quay lại đăng nhập</span>
              </Button>

              {(verificationState.status === 'invalid' ||
                verificationState.status === 'error') && (
                <Link href='/auth/register' className='block'>
                  <Button variant='outline' size='lg' className='w-full'>
                    <span className='font-semibold'>Đăng ký tài khoản mới</span>
                  </Button>
                </Link>
              )}
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

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-white'>
          <div className='text-center'>
            <Loader2 className='mx-auto mb-4 h-8 w-8 animate-spin text-[#657282]' />
            <p className='text-base text-[#6a7282]'>Đang tải...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
