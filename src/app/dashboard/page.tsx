'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Navigation } from '@/components/shared/Navigation';
import { useAuth } from '@/contexts/auth';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <Navigation />

      {/* Main Content */}
      <main className='container mx-auto p-4'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Welcome back, {user?.firstName}!
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Here&apos;s your health overview for today
          </p>
        </div>

        {/* Quick Stats */}
        <div className='mb-8 grid gap-4 md:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>Today&apos;s Steps</CardDescription>
              <CardTitle className='text-2xl'>8,432</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-green-600 dark:text-green-400'>
                +12% from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>Heart Rate</CardDescription>
              <CardTitle className='text-2xl'>72 BPM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Normal range
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>Sleep</CardDescription>
              <CardTitle className='text-2xl'>7.5h</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-blue-600 dark:text-blue-400'>
                Good quality
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>Water Intake</CardDescription>
              <CardTitle className='text-2xl'>1.8L</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-orange-600 dark:text-orange-400'>
                Goal: 2.5L
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities and Quick Actions */}
        <div className='grid gap-8 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest health entries</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Blood Pressure</p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    120/80 mmHg
                  </p>
                </div>
                <span className='text-sm text-gray-500'>2 hours ago</span>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Weight</p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    68.5 kg
                  </p>
                </div>
                <span className='text-sm text-gray-500'>Yesterday</span>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Mood</p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Good 😊
                  </p>
                </div>
                <span className='text-sm text-gray-500'>Yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common actions to track your health
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Button className='w-full justify-start' variant='outline'>
                <span className='mr-2'>🩺</span>
                Log Symptoms
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <span className='mr-2'>💊</span>
                Record Medication
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <span className='mr-2'>🏃</span>
                Track Exercise
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <span className='mr-2'>🥗</span>
                Log Meal
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
