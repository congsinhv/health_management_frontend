'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

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

        const response = await api.auth.verifyEmail(token);

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

      await api.auth.resendVerification();

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
        return <Loader2 className='h-12 w-12 animate-spin text-blue-500' />;
      case 'success':
        return <CheckCircle className='h-12 w-12 text-green-500' />;
      case 'error':
      case 'expired':
      case 'invalid':
        return <XCircle className='h-12 w-12 text-red-500' />;
      default:
        return <Mail className='h-12 w-12 text-gray-500' />;
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

  const getAlertVariant = () => {
    switch (verificationState.status) {
      case 'success':
        return 'default';
      case 'error':
      case 'expired':
      case 'invalid':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-4 text-center'>
          <div className='flex justify-center'>{getIcon()}</div>
          <CardTitle className='text-2xl font-bold'>{getTitle()}</CardTitle>
          <CardDescription>
            {verificationState.status === 'loading'
              ? 'Vui lòng đợi trong khi chúng tôi xác thực email của bạn'
              : verificationState.status === 'success'
                ? 'Bạn sẽ được chuyển hướng đến trang đăng nhập trong giây lát'
                : 'Có vấn đề với quá trình xác thực email'}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <Alert variant={getAlertVariant()}>
            <AlertDescription>{verificationState.message}</AlertDescription>
          </Alert>

          <div className='space-y-3'>
            {verificationState.status === 'success' && (
              <Button
                onClick={() => router.push('/auth/login?verified=true')}
                className='w-full'
              >
                Đến trang đăng nhập
              </Button>
            )}

            {(verificationState.status === 'expired' ||
              verificationState.status === 'error') && (
              <Button
                onClick={handleResendVerification}
                className='w-full'
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi lại email xác thực'
                )}
              </Button>
            )}

            <Button
              variant='outline'
              onClick={() => router.push('/auth/login')}
              className='w-full'
            >
              Quay lại đăng nhập
            </Button>

            {(verificationState.status === 'invalid' ||
              verificationState.status === 'error') && (
              <Button
                variant='outline'
                onClick={() => router.push('/auth/register')}
                className='w-full'
              >
                Đăng ký tài khoản mới
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <Loader2 className='mx-auto mb-4 h-8 w-8 animate-spin' />
            <p>Đang tải...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
