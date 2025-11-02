'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
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
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ResendState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

function ResendVerificationContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [resendState, setResendState] = useState<ResendState>({
    status: 'idle',
    message: '',
  });
  const [countdown, setCountdown] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Redirect if email is already verified
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.emailVerified) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, user?.emailVerified, router]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendVerification = async () => {
    try {
      setResendState({
        status: 'loading',
        message: 'Đang gửi email xác thực...',
      });

      const response = await api.auth.resendVerification();

      logger.authSuccess('Gửi lại email xác thực thành công');

      setResendState({
        status: 'success',
        message:
          response.message ||
          'Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.',
      });

      // Start 60 second countdown
      setCountdown(60);
    } catch (error) {
      logger.authError(
        'Gửi lại email xác thực thất bại',
        error instanceof Error ? error : new Error('Resend verification failed')
      );

      const errorMessage =
        error instanceof Error && error.message.includes('already verified')
          ? 'Email của bạn đã được xác thực rồi.'
          : 'Không thể gửi lại email xác thực. Vui lòng thử lại sau.';

      setResendState({
        status: 'error',
        message: errorMessage,
      });
    }
  };

  const getIcon = () => {
    switch (resendState.status) {
      case 'loading':
        return <Loader2 className='h-12 w-12 animate-spin text-blue-500' />;
      case 'success':
        return <CheckCircle className='h-12 w-12 text-green-500' />;
      case 'error':
        return <XCircle className='h-12 w-12 text-red-500' />;
      default:
        return <Mail className='h-12 w-12 text-gray-500' />;
    }
  };

  const getTitle = () => {
    switch (resendState.status) {
      case 'loading':
        return 'Đang gửi email...';
      case 'success':
        return 'Email đã được gửi!';
      case 'error':
        return 'Gửi email thất bại';
      default:
        return 'Gửi lại email xác thực';
    }
  };

  const getAlertVariant = () => {
    switch (resendState.status) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center justify-center space-y-4'>
              <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
              <p className='text-center text-gray-600'>Đang kiểm tra...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't render if not authenticated or already verified (will redirect)
  if (!isAuthenticated || user?.emailVerified) {
    return null;
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-4 text-center'>
          <div className='flex justify-center'>{getIcon()}</div>
          <CardTitle className='text-2xl font-bold'>{getTitle()}</CardTitle>
          <CardDescription>
            {resendState.status === 'idle'
              ? 'Chúng tôi cần xác thực email của bạn. Vui lòng kiểm tra hộp thư hoặc yêu cầu gửi lại email xác thực.'
              : resendState.status === 'success'
                ? 'Email đã được gửi đến địa chỉ email của bạn.'
                : 'Có vấn đề khi gửi email xác thực.'}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {user?.email && (
            <div className='rounded-md border border-blue-200 bg-blue-50 p-3 text-center'>
              <p className='text-sm text-blue-800'>
                Email sẽ được gửi đến: <strong>{user.email}</strong>
              </p>
            </div>
          )}

          {resendState.message && (
            <Alert variant={getAlertVariant()}>
              <AlertDescription>{resendState.message}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-3'>
            <Button
              onClick={handleResendVerification}
              className='w-full'
              disabled={resendState.status === 'loading' || countdown > 0}
            >
              {resendState.status === 'loading' ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang gửi...
                </>
              ) : countdown > 0 ? (
                `Gửi lại sau ${countdown}s`
              ) : (
                'Gửi lại email xác thực'
              )}
            </Button>

            <Button
              variant='outline'
              onClick={() => router.push('/dashboard')}
              className='w-full'
            >
              Quay lại trang chủ
            </Button>

            <Link href='/auth/login' className='block'>
              <Button variant='ghost' className='w-full'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResendVerificationPage() {
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
      <ResendVerificationContent />
    </Suspense>
  );
}
