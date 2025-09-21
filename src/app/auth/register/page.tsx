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
import { useAuthForm, validateRegister } from '@/hooks/useAuthForm';
import { RegisterCredentials } from '@/types/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, error } = useAuth();

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
  } = useAuthForm<RegisterCredentials>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: validateRegister,
    onSubmit: async credentials => {
      await register(credentials);
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
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4 dark:from-gray-900 dark:to-gray-800'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-2xl font-bold'>
            Create Account
          </CardTitle>
          <CardDescription className='text-center'>
            Join Health Management to start tracking your health journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
              <div className='rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400'>
                {error}
              </div>
            )}

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  type='text'
                  placeholder='John'
                  value={values.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                  className={getFieldError('firstName') ? 'border-red-500' : ''}
                />
                {getFieldError('firstName') && (
                  <p className='text-sm text-red-600 dark:text-red-400'>
                    {getFieldError('firstName')}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  type='text'
                  placeholder='Doe'
                  value={values.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                  className={getFieldError('lastName') ? 'border-red-500' : ''}
                />
                {getFieldError('lastName') && (
                  <p className='text-sm text-red-600 dark:text-red-400'>
                    {getFieldError('lastName')}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='john.doe@example.com'
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
                placeholder='Create a strong password'
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

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Confirm your password'
                value={values.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                className={
                  getFieldError('confirmPassword') ? 'border-red-500' : ''
                }
              />
              {getFieldError('confirmPassword') && (
                <p className='text-sm text-red-600 dark:text-red-400'>
                  {getFieldError('confirmPassword')}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
            Already have an account?{' '}
            <Link
              href='/auth/login'
              className='text-emerald-600 hover:underline dark:text-emerald-400'
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
