'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Avatar } from '@/components/shared/Avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AVATAR_CONFIG } from '@/lib/constants';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    router.push('/profile');
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div
      className={`flex h-[73px] w-full items-center justify-center bg-white ${className}`}
    >
      <div className='mx-auto flex w-full max-w-[1340px] items-center justify-between px-12 py-1 md:px-6'>
        <Link href='/'>
          <div className='flex items-center justify-center no-underline'>
            <Image
              src='/Healthcare_logo.svg'
              alt='logo'
              width={100}
              height={100}
              className='h-auto w-[140px] md:w-[100px]'
            />
          </div>
        </Link>
        <div className='flex items-center gap-10 md:gap-5'>
          <div className='text-sm leading-5 font-[var(--font-gilroy)] font-medium text-gray-900 no-underline transition-colors duration-200 hover:text-gray-900/80 md:text-xs'>
            <Link href='/'>Về chúng tôi</Link>
          </div>

          <div className='text-sm leading-5 font-[var(--font-gilroy)] font-medium text-gray-900 no-underline transition-colors duration-200 hover:text-gray-900/80 md:text-xs'>
            <Link href='/chatbox'>Dự đoán sức khỏe</Link>
          </div>
          <div className='text-sm leading-5 font-[var(--font-gilroy)] font-medium text-gray-900 no-underline transition-colors duration-200 hover:text-gray-900/80 md:text-xs'>
            <Link href='/'>Liên hệ</Link>
          </div>
          {isAuthenticated && user ? (
            <div className='flex items-center justify-center'>
              <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <PopoverTrigger asChild>
                  <button
                    className='flex h-11 w-11 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-900 no-underline transition-all duration-200 hover:scale-105 hover:bg-gray-200 md:h-10 md:w-10'
                    aria-label='User menu'
                  >
                    <Avatar
                      src={user?.profilePicture}
                      alt='Profile'
                      size={AVATAR_CONFIG.HEADER_SIZE}
                      className='h-full w-full rounded-full object-cover'
                      userId={user?.id}
                      priority
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align='end'
                  className='w-[180px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg md:w-[160px]'
                >
                  <div className='flex flex-col gap-1'>
                    <button
                      onClick={handleProfile}
                      className='flex w-full cursor-pointer items-center gap-3 rounded border-none bg-transparent p-2.5 text-left text-sm font-[var(--font-gilroy)] font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 md:gap-3 md:p-2 md:text-[13px]'
                      aria-label='Go to profile'
                    >
                      <User
                        size={16}
                        className='flex-shrink-0 text-gray-500 md:h-3.5 md:w-3.5'
                      />
                      <span className='flex-1'>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className='flex w-full cursor-pointer items-center gap-3 rounded border-none bg-transparent p-2.5 text-left text-sm font-[var(--font-gilroy)] font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 md:gap-3 md:p-2 md:text-[13px]'
                      aria-label='Log out'
                    >
                      <LogOut
                        size={16}
                        className='flex-shrink-0 text-gray-500 md:h-3.5 md:w-3.5'
                      />
                      <span className='flex-1'>Log out</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className='flex items-center justify-center'>
              <Button
                onClick={handleLogin}
                variant='outline'
                size='sm'
                className='h-9 cursor-pointer rounded-md border border-gray-300 bg-white px-4 text-sm font-[var(--font-gilroy)] font-medium text-gray-900 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 active:scale-95 md:h-8 md:px-3 md:text-xs'
              >
                Đăng nhập
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
