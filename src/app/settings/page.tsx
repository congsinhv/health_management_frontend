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

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
  };

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
              className='text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
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
              className='text-blue-600 hover:text-blue-800 dark:text-blue-400'
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
            Settings
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Manage your account preferences and privacy settings
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='currentPassword'>Current Password</Label>
                <Input id='currentPassword' type='password' />
              </div>
              <div>
                <Label htmlFor='newPassword'>New Password</Label>
                <Input id='newPassword' type='password' />
              </div>
              <div>
                <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                <Input id='confirmPassword' type='password' />
              </div>
              <Button>Change Password</Button>
              <div className='border-t pt-4'>
                <Button variant='outline' className='w-full'>
                  Enable Two-Factor Authentication
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose how you want to be notified about your health reminders
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <Label htmlFor='emailNotifications'>
                    Email Notifications
                  </Label>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Receive health reminders via email
                  </p>
                </div>
                <input
                  type='checkbox'
                  id='emailNotifications'
                  checked={notifications.email}
                  onChange={e =>
                    handleNotificationChange('email', e.target.checked)
                  }
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <Label htmlFor='pushNotifications'>Push Notifications</Label>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Get browser notifications
                  </p>
                </div>
                <input
                  type='checkbox'
                  id='pushNotifications'
                  checked={notifications.push}
                  onChange={e =>
                    handleNotificationChange('push', e.target.checked)
                  }
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <Label htmlFor='smsNotifications'>SMS Notifications</Label>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Receive text message reminders
                  </p>
                </div>
                <input
                  type='checkbox'
                  id='smsNotifications'
                  checked={notifications.sms}
                  onChange={e =>
                    handleNotificationChange('sms', e.target.checked)
                  }
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
              </div>
              <Button>Save Notification Preferences</Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>
                Control your data sharing and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <Label>Share Data for Research</Label>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Help improve healthcare through anonymous data sharing
                  </p>
                </div>
                <input
                  type='checkbox'
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <Label>Analytics & Improvements</Label>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Help us improve the app with usage analytics
                  </p>
                </div>
                <input
                  type='checkbox'
                  defaultChecked
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
              </div>
              <Button>Save Privacy Settings</Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export or delete your health data
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h4 className='mb-2 font-medium'>Export Data</h4>
                <p className='mb-3 text-sm text-gray-600 dark:text-gray-400'>
                  Download all your health data in a portable format
                </p>
                <Button variant='outline'>Export All Data</Button>
              </div>
              <div className='border-t pt-4'>
                <h4 className='mb-2 font-medium text-red-600 dark:text-red-400'>
                  Danger Zone
                </h4>
                <p className='mb-3 text-sm text-gray-600 dark:text-gray-400'>
                  Permanently delete your account and all associated data
                </p>
                <Button variant='destructive'>Delete Account</Button>
              </div>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <Label htmlFor='theme'>Theme</Label>
                  <select
                    id='theme'
                    className='border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                    defaultValue='system'
                  >
                    <option value='light'>Light</option>
                    <option value='dark'>Dark</option>
                    <option value='system'>System</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor='language'>Language</Label>
                  <select
                    id='language'
                    className='border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                    defaultValue='en'
                  >
                    <option value='en'>English</option>
                    <option value='es'>Español</option>
                    <option value='fr'>Français</option>
                    <option value='de'>Deutsch</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor='timezone'>Timezone</Label>
                  <select
                    id='timezone'
                    className='border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                    defaultValue='utc-5'
                  >
                    <option value='utc-8'>Pacific Time (UTC-8)</option>
                    <option value='utc-7'>Mountain Time (UTC-7)</option>
                    <option value='utc-6'>Central Time (UTC-6)</option>
                    <option value='utc-5'>Eastern Time (UTC-5)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor='units'>Unit System</Label>
                  <select
                    id='units'
                    className='border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                    defaultValue='metric'
                  >
                    <option value='metric'>Metric (kg, cm, °C)</option>
                    <option value='imperial'>Imperial (lbs, ft, °F)</option>
                  </select>
                </div>
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
