'use client';

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

export default function ProfilePage() {
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
              className='text-blue-600 hover:text-blue-800 dark:text-blue-400'
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
            Profile
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Manage your personal information and health details
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Profile Photo & Basic Info */}
          <Card className='lg:col-span-1'>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col items-center space-y-4'>
              <div className='flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 text-2xl font-bold text-white'>
                JD
              </div>
              <Button variant='outline' size='sm'>
                Change Photo
              </Button>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='firstName'>First Name</Label>
                  <Input id='firstName' defaultValue='John' />
                </div>
                <div>
                  <Label htmlFor='lastName'>Last Name</Label>
                  <Input id='lastName' defaultValue='Doe' />
                </div>
              </div>
              <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  defaultValue='john.doe@example.com'
                />
              </div>
              <div>
                <Label htmlFor='phone'>Phone Number</Label>
                <Input id='phone' type='tel' defaultValue='+1 (555) 123-4567' />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='dateOfBirth'>Date of Birth</Label>
                  <Input
                    id='dateOfBirth'
                    type='date'
                    defaultValue='1990-01-15'
                  />
                </div>
                <div>
                  <Label htmlFor='gender'>Gender</Label>
                  <select
                    id='gender'
                    className='border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                    defaultValue='male'
                  >
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='other'>Other</option>
                    <option value='prefer-not-to-say'>Prefer not to say</option>
                  </select>
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Health Information */}
          <Card className='lg:col-span-3'>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
              <CardDescription>
                Basic health metrics and medical information
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                  <Label htmlFor='height'>Height (cm)</Label>
                  <Input id='height' type='number' defaultValue='175' />
                </div>
                <div>
                  <Label htmlFor='currentWeight'>Current Weight (kg)</Label>
                  <Input
                    id='currentWeight'
                    type='number'
                    step='0.1'
                    defaultValue='70.5'
                  />
                </div>
                <div>
                  <Label htmlFor='bloodType'>Blood Type</Label>
                  <select
                    id='bloodType'
                    className='border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                    defaultValue='o-positive'
                  >
                    <option value=''>Select blood type</option>
                    <option value='a-positive'>A+</option>
                    <option value='a-negative'>A-</option>
                    <option value='b-positive'>B+</option>
                    <option value='b-negative'>B-</option>
                    <option value='o-positive'>O+</option>
                    <option value='o-negative'>O-</option>
                    <option value='ab-positive'>AB+</option>
                    <option value='ab-negative'>AB-</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor='allergies'>Allergies</Label>
                <textarea
                  id='allergies'
                  className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                  placeholder='List any known allergies...'
                  defaultValue='Peanuts, Shellfish'
                />
              </div>
              <div>
                <Label htmlFor='conditions'>Medical Conditions</Label>
                <textarea
                  id='conditions'
                  className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                  placeholder='List any ongoing medical conditions...'
                />
              </div>
              <div>
                <Label htmlFor='medications'>Current Medications</Label>
                <textarea
                  id='medications'
                  className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                  placeholder='List current medications and dosages...'
                />
              </div>
              <Button>Update Health Information</Button>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className='lg:col-span-3'>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>
                Designate someone to contact in case of emergency
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <Label htmlFor='emergencyName'>Contact Name</Label>
                  <Input id='emergencyName' defaultValue='Jane Doe' />
                </div>
                <div>
                  <Label htmlFor='emergencyRelation'>Relationship</Label>
                  <Input id='emergencyRelation' defaultValue='Spouse' />
                </div>
                <div>
                  <Label htmlFor='emergencyPhone'>Phone Number</Label>
                  <Input
                    id='emergencyPhone'
                    type='tel'
                    defaultValue='+1 (555) 987-6543'
                  />
                </div>
                <div>
                  <Label htmlFor='emergencyEmail'>Email (Optional)</Label>
                  <Input
                    id='emergencyEmail'
                    type='email'
                    defaultValue='jane.doe@example.com'
                  />
                </div>
              </div>
              <Button>Save Emergency Contact</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
