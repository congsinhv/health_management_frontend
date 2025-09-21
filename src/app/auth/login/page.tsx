'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthForm, validateLogin } from '@/hooks/useAuthForm';
import { LoginCredentials } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error } = useAuth();

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
  } = useAuthForm<LoginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: validateLogin,
    onSubmit: async credentials => {
      await login(credentials);
      router.push('/dashboard');
    },
  });

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-lg'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-2xl font-bold'>
            Welcome Back
          </CardTitle>
          <CardDescription className='text-center'>
            Sign in to your Health Management account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
              <div className='rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                value={values.email}
                onChange={e => handleChange('email', e.target.value)}
                className={getFieldError('email') ? 'border-red-500' : ''}
              />
              {getFieldError('email') && (
                <p className='text-sm text-red-600 dark:text-red-400'>
                  {getFieldError('email')}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                value={values.password}
                onChange={e => handleChange('password', e.target.value)}
                className={getFieldError('password') ? 'border-red-500' : ''}
              />
              {getFieldError('password') && (
                <p className='text-sm text-red-600 dark:text-red-400'>
                  {getFieldError('password')}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className='mt-4 text-center text-sm'>
            <Link
              href='#'
              className='text-blue-600 hover:underline dark:text-blue-400'
            >
              Forgot your password?
            </Link>
          </div>

          <div className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
            Don&apos;t have an account?{' '}
            <Link
              href='/auth/register'
              className='text-blue-600 hover:underline dark:text-blue-400'
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
