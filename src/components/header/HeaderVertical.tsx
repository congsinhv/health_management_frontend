'use client';

import { ConversationList } from '@/components/chat/ConversationList';
import { useAuth } from '@/contexts/AuthContext';
import { useConversation } from '@/contexts/ConversationContext';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import AddIcon from '../icons/add';
import HomeIcon from '../icons/home';
import LogoIcon from '../icons/logo';
import SettingIcon from '../icons/setting';
import TabIcon from '../icons/tab';
import styles from './HeaderVertical.module.scss';

interface HeaderVerticalProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  className?: string;
}

const HeaderVertical = ({
  isOpen,
  className,
  setIsOpen,
}: HeaderVerticalProps) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(isOpen);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleHeader = () => {
    setIsExpanded(!isExpanded);
    setIsOpen?.(!isExpanded);
  };
  const { switchConversation } = useConversation();

  const handleComeHome = () => {
    router.push('/');
  };

  // Handle new conversation creation
  const handleNewConversation = async () => {
    // Clear current conversation (deselect from sidebar)
    switchConversation(null);

    // Navigate to chatbox if not already there
    if (pathname !== '/chatbox') {
      router.push('/chatbox');
    }
  };

  return (
    <>
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
            <div
              className={styles.header_vertical_content}
              onClick={handleNewConversation}
            >
              <AddIcon />
              {isExpanded && <p>Tạo đoạn chat mới</p>}
            </div>
            <div className={styles.header_vertical_content}>
              <div className={styles.header_vertical_icon}>
                <HomeIcon />
              </div>
              {isExpanded && <p>Trang chủ</p>}
            </div>
            <ConversationList isExpanded={!!isExpanded} />
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
              <Image
                src={user?.profilePicture || '/avatar.png'}
                alt='avatar'
                width={42}
                height={42}
              />
            </div>
            {isExpanded && (
              <div className={styles.header_vertical_account}>
                <h4>{user?.firstName + ' ' + user?.lastName}</h4>
                <p>{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderVertical;
