'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import styles from './Header.module.scss';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/avatar/Avatar';
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
    <div className={`${styles.header} ${className}`}>
      <div className={styles.container}>
        <Link href='/'>
          <div className={styles.logo}>
            <Image
              src='/Healthcare_logo.svg'
              alt='logo'
              width={100}
              height={100}
            />
          </div>
        </Link>
        <div className={styles.nav}>
          <div className={styles.nav__item}>
            <Link href='/'>Về chúng tôi</Link>
          </div>

          <div className={styles.nav__item}>
            <Link href='/chatbox'>Dự đoán sức khỏe</Link>
          </div>
          <div className={styles.nav__item}>
            <Link href='/'>Liên hệ</Link>
          </div>
          {isAuthenticated && user ? (
            <div className={styles.profile}>
              <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={styles.profile__link}
                    aria-label='User menu'
                  >
                    <Avatar
                      src={user?.profilePicture}
                      alt='Profile'
                      size={AVATAR_CONFIG.HEADER_SIZE}
                      className={styles.profile__avatar}
                      userId={user?.id}
                      priority
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent align='end' className={styles.dropdown}>
                  <div className={styles.dropdownContent}>
                    <button
                      onClick={handleProfile}
                      className={styles.dropdownItem}
                      aria-label='Go to profile'
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className={styles.dropdownItem}
                      aria-label='Log out'
                    >
                      <LogOut size={16} />
                      <span>Log out</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className={styles.auth}>
              <Button
                onClick={handleLogin}
                variant='outline'
                size='sm'
                className={styles.loginButton}
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
