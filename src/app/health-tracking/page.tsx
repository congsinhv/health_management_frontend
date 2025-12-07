'use client';

import { useState } from 'react';
import Link from 'next/link';
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

export default function HealthTrackingPage() {
  const [activeTab, setActiveTab] = useState('vitals');

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Navigation Header */}
      <header className='border-b bg-white dark:bg-gray-800'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500'></div>
            <span className='text-xl font-bold'>Health Management</span>
          </div>
          <nav className='hidden space-x-6 md:flex'>
            <Link
              href='/dashboard'
              className='text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
            >
              Dashboard
            </Link>
            <Link
              href='/health-tracking'
              className='text-blue-600 hover:text-blue-800 dark:text-blue-400'
            >
              Health Tracking
            </Link>
            <Link
              href='/profile'
              className='text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
            >
              Profile
            </Link>
            <Link
              href='/settings'
              className='text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
            >
              Settings
            </Link>
          </nav>
          <Button variant='outline' size='sm'>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto p-4'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Health Tracking
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Monitor and log your health metrics
          </p>
        </div>

        {/* Tab Navigation */}
        <div className='mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800'>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`rounded-md px-3 py-2 text-[0.85rem] font-medium transition-colors ${
              activeTab === 'vitals'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Vital Signs
          </button>
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`rounded-md px-3 py-2 text-[0.85rem] font-medium transition-colors ${
              activeTab === 'symptoms'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Symptoms
          </button>
          <button
            onClick={() => setActiveTab('medications')}
            className={`rounded-md px-3 py-2 text-[0.85rem] font-medium transition-colors ${
              activeTab === 'medications'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Medications
          </button>
          <button
            onClick={() => setActiveTab('lifestyle')}
            className={`rounded-md px-3 py-2 text-[0.85rem] font-medium transition-colors ${
              activeTab === 'lifestyle'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Lifestyle
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'vitals' && (
          <div className='grid gap-6 lg:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Blood Pressure</CardTitle>
                <CardDescription>
                  Record your blood pressure reading
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='systolic'>Systolic (mmHg)</Label>
                    <Input id='systolic' type='number' placeholder='120' />
                  </div>
                  <div>
                    <Label htmlFor='diastolic'>Diastolic (mmHg)</Label>
                    <Input id='diastolic' type='number' placeholder='80' />
                  </div>
                </div>
                <Button className='w-full'>Save Reading</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Heart Rate</CardTitle>
                <CardDescription>
                  Log your heart rate measurement
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='heartRate'>Heart Rate (BPM)</Label>
                  <Input id='heartRate' type='number' placeholder='72' />
                </div>
                <Button className='w-full'>Save Reading</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weight</CardTitle>
                <CardDescription>Track your weight changes</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='weight'>Weight (kg)</Label>
                  <Input
                    id='weight'
                    type='number'
                    step='0.1'
                    placeholder='70.5'
                  />
                </div>
                <Button className='w-full'>Save Weight</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temperature</CardTitle>
                <CardDescription>Record your body temperature</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='temperature'>Temperature (°C)</Label>
                  <Input
                    id='temperature'
                    type='number'
                    step='0.1'
                    placeholder='36.5'
                  />
                </div>
                <Button className='w-full'>Save Temperature</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'symptoms' && (
          <Card>
            <CardHeader>
              <CardTitle>Symptom Log</CardTitle>
              <CardDescription>
                Record any symptoms you&apos;re experiencing
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='symptom'>Symptom</Label>
                <Input
                  id='symptom'
                  placeholder='e.g., Headache, Fatigue, Nausea'
                />
              </div>
              <div>
                <Label htmlFor='severity'>Severity (1-10)</Label>
                <Input
                  id='severity'
                  type='number'
                  min='1'
                  max='10'
                  placeholder='5'
                />
              </div>
              <div>
                <Label htmlFor='notes'>Additional Notes</Label>
                <textarea
                  id='notes'
                  className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-[0.85rem] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                  placeholder='Describe the symptom in more detail...'
                />
              </div>
              <Button className='w-full'>Log Symptom</Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'medications' && (
          <Card>
            <CardHeader>
              <CardTitle>Medication Tracker</CardTitle>
              <CardDescription>Log your medication intake</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='medication'>Medication Name</Label>
                <Input id='medication' placeholder='e.g., Aspirin, Vitamin D' />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='dosage'>Dosage</Label>
                  <Input id='dosage' placeholder='e.g., 100mg, 1 tablet' />
                </div>
                <div>
                  <Label htmlFor='frequency'>Frequency</Label>
                  <Input
                    id='frequency'
                    placeholder='e.g., Daily, Twice daily'
                  />
                </div>
              </div>
              <Button className='w-full'>Log Medication</Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'lifestyle' && (
          <div className='grid gap-6 lg:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Sleep Tracking</CardTitle>
                <CardDescription>Log your sleep patterns</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='sleepHours'>Hours of Sleep</Label>
                  <Input
                    id='sleepHours'
                    type='number'
                    step='0.5'
                    placeholder='8'
                  />
                </div>
                <div>
                  <Label htmlFor='sleepQuality'>Quality (1-10)</Label>
                  <Input
                    id='sleepQuality'
                    type='number'
                    min='1'
                    max='10'
                    placeholder='7'
                  />
                </div>
                <Button className='w-full'>Log Sleep</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Water Intake</CardTitle>
                <CardDescription>Track your daily hydration</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='waterIntake'>Water (Liters)</Label>
                  <Input
                    id='waterIntake'
                    type='number'
                    step='0.1'
                    placeholder='2.0'
                  />
                </div>
                <Button className='w-full'>Log Water Intake</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exercise</CardTitle>
                <CardDescription>Record your physical activity</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='exercise'>Exercise Type</Label>
                  <Input
                    id='exercise'
                    placeholder='e.g., Running, Swimming, Yoga'
                  />
                </div>
                <div>
                  <Label htmlFor='duration'>Duration (minutes)</Label>
                  <Input id='duration' type='number' placeholder='30' />
                </div>
                <Button className='w-full'>Log Exercise</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mood</CardTitle>
                <CardDescription>
                  Track your emotional well-being
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='mood'>Mood (1-10)</Label>
                  <Input
                    id='mood'
                    type='number'
                    min='1'
                    max='10'
                    placeholder='7'
                  />
                </div>
                <div>
                  <Label htmlFor='moodNotes'>Notes</Label>
                  <Input
                    id='moodNotes'
                    placeholder='What affected your mood today?'
                  />
                </div>
                <Button className='w-full'>Log Mood</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
