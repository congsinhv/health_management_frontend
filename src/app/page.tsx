import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      {/* Header */}
      <header className='border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500'></div>
            <span className='text-xl font-bold'>Health Management</span>
          </div>
          <div className='flex items-center space-x-4'>
            <Link href='/auth/login'>
              <Button variant='ghost'>Sign In</Button>
            </Link>
            <Link href='/auth/register'>
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className='container mx-auto px-4 py-16'>
        <div className='text-center'>
          <h1 className='mb-6 text-4xl font-bold tracking-tight sm:text-6xl'>
            Take Control of Your{' '}
            <span className='bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent'>
              Health Journey
            </span>
          </h1>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            A comprehensive platform to track, monitor, and improve your health.
            From daily habits to medical records, everything in one place.
          </p>
          <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
            <Link href='/auth/register'>
              <Button size='lg' className='w-full sm:w-auto'>
                Start Your Journey
              </Button>
            </Link>
            <Link href='/auth/login'>
              <Button size='lg' variant='outline' className='w-full sm:w-auto'>
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className='mt-24 grid gap-8 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <div className='mb-2 h-12 w-12 rounded-lg bg-blue-100 p-3 dark:bg-blue-900'>
                <svg
                  className='h-6 w-6 text-blue-600 dark:text-blue-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <CardTitle>Health Tracking</CardTitle>
              <CardDescription>
                Monitor vital signs, symptoms, and daily health metrics with
                intuitive tracking tools.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className='mb-2 h-12 w-12 rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900'>
                <svg
                  className='h-6 w-6 text-emerald-600 dark:text-emerald-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <CardTitle>Smart Insights</CardTitle>
              <CardDescription>
                Get personalized recommendations and insights based on your
                health data and trends.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className='mb-2 h-12 w-12 rounded-lg bg-purple-100 p-3 dark:bg-purple-900'>
                <svg
                  className='h-6 w-6 text-purple-600 dark:text-purple-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your health data is encrypted and protected with
                enterprise-grade security measures.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
