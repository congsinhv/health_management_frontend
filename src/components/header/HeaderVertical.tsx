'use client';

import Image from 'next/image';
import { useState } from 'react';
import AddIcon from '../icons/add';
import HistoryIcon from '../icons/history';
import HomeIcon from '../icons/home';
import LogoIcon from '../icons/logo';
import TabIcon from '../icons/tab';
import styles from './HeaderVertical.module.scss';
import SettingIcon from '../icons/setting';
import { useRouter } from 'next/navigation';

interface HeaderVerticalProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  className?: string;
}

const mockUser = {
  id: '1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  avatar:
    'https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

const HeaderVertical = ({
  isOpen,
  className,
  setIsOpen,
}: HeaderVerticalProps) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [user, setUser] = useState(mockUser);
  const router = useRouter();

  const toggleHeader = () => {
    setIsExpanded(!isExpanded);
    setIsOpen?.(!isExpanded);
  };
  const handleComeHome = () => {
    router.push('/');
  };

  return (
    <div
      className={`${styles.header_vertical} ${isExpanded ? styles.expanded : styles.collapsed} ${className}`}
    >
      <div className={styles.header_vertical_top}>
        <div
          className={styles.header_vertical_logo}
          onMouseEnter={() => !isExpanded && setIsLogoHovered(true)}
          onMouseLeave={() => !isExpanded && setIsLogoHovered(false)}
        >
          {isExpanded ? (
            <Image
              src='/Healthcare_logo.svg'
              alt='logo'
              width={100}
              height={100}
              onClick={handleComeHome}
            />
          ) : (
            <div className={styles.logo_container} onClick={toggleHeader}>
              {isLogoHovered ? (
                <div
                  className={`${styles.header_vertical_icon} ${styles.tab_icon} `}
                >
                  <TabIcon />
                </div>
              ) : (
                <LogoIcon />
              )}
            </div>
          )}
          {isExpanded && (
            <div
              className={`${styles.header_vertical_icon} ${styles.tab_icon} ${styles.right}`}
              onClick={toggleHeader}
            >
              <TabIcon />
            </div>
          )}
        </div>
        <div className={styles.header_vertical_list}>
          <div className={styles.header_vertical_content}>
            <AddIcon />
            {isExpanded && <p>Tạo đoạn chat mới</p>}
          </div>
          <div className={styles.header_vertical_content}>
            <div className={styles.header_vertical_icon}>
              <HomeIcon />
            </div>
            {isExpanded && <p>Trang chủ</p>}
          </div>
          <div className={styles.header_vertical_content}>
            <div className={styles.header_vertical_icon}>
              <HistoryIcon />
            </div>
            {isExpanded && <p>Lịch sử chat</p>}
          </div>
        </div>
      </div>
      <div className={styles.header_vertical_bottom}>
        <div className={styles.header_vertical_content}>
          <div className={styles.header_vertical_icon}>
            <SettingIcon />
          </div>
          {isExpanded && <p>Cài đặt</p>}
        </div>
        <div className={styles.header_vertical_avatar}>
          <div className={styles.header_vertical_img}>
            <Image src={user.avatar} alt='avatar' width={42} height={42} />
          </div>
          {isExpanded && (
            <div className={styles.header_vertical_account}>
              <h4>{user.name}</h4>
              <p>{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderVertical;
