'use client';

import React from 'react';
import Image from 'next/image';
import styles from './Header.module.scss';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/avatar/Avatar';
import { AVATAR_CONFIG } from '@/lib/constants';

const Header = () => {
  const { user } = useAuth();

  return (
    <div className={styles.header}>
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
            <Link href='/'>Dự đoán sức khỏe</Link>
          </div>
          <div className={styles.nav__item}>
            <Link href='/'>Liên hệ</Link>
          </div>
          <div className={styles.profile}>
            <Link href='/profile' className={styles.profile__link}>
              <Avatar
                src={user?.profilePicture}
                alt='Profile'
                size={AVATAR_CONFIG.HEADER_SIZE}
                className={styles.profile__avatar}
                userId={user?.id}
                priority
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
