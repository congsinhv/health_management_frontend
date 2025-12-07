'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';

export function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    window.location.href = '/';
  };

  return (
    <header className='border-b bg-white dark:bg-gray-800'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <Link href='/dashboard' className='flex items-center space-x-2'>
          <div className='from-health-500 to-health-600 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r'>
            <div className='flex h-4 w-4 items-center justify-center rounded-full bg-white'>
              <div className='from-health-500 to-health-600 h-2 w-2 rounded-full bg-gradient-to-r'></div>
            </div>
          </div>
          <span className='from-health-600 to-health-700 font-gilroy bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent'>
            Khealth
          </span>
        </Link>
        <nav className='hidden space-x-6 md:flex'>
          <Link
            href='/dashboard'
            className={
              isActive('/dashboard')
                ? 'text-health-600 hover:text-health-700 dark:text-health-400 font-medium'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
            }
          >
            Dashboard
          </Link>
          <Link
            href='/health-tracking'
            className={
              isActive('/health-tracking')
                ? 'text-health-600 hover:text-health-700 dark:text-health-400 font-medium'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
            }
          >
            Health Tracking
          </Link>
          <Link
            href='/profile'
            className={
              isActive('/profile')
                ? 'text-health-600 hover:text-health-700 dark:text-health-400 font-medium'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
            }
          >
            Profile
          </Link>
          <Link
            href='/settings'
            className={
              isActive('/settings')
                ? 'text-health-600 hover:text-health-700 dark:text-health-400 font-medium'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
            }
          >
            Settings
          </Link>
        </nav>
        <div className='flex items-center space-x-4'>
          {user && (
            <span className='text-[0.85rem] text-gray-600 dark:text-gray-300'>
              Welcome, {user.firstName}!
            </span>
          )}
          <Button variant='outline' size='sm' onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
