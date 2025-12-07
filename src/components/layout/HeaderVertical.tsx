'use client';

import { ConversationList } from '@/components/chat/ConversationList';
import { useAuth } from '@/contexts/auth';
import { useConversation } from '@/contexts/conversation';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import AddIcon from '../icons/add';
import LogoIcon from '../icons/logo';
import TabIcon from '../icons/tab';

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
        className={`flex h-full w-max flex-col items-start justify-between bg-white p-8 transition-all duration-300 ${isExpanded ? '' : 'w-fit px-4'} ${className}`}
      >
        <div className='flex w-full flex-col items-start gap-4'>
          <div
            className={`flex w-full items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}
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
                className='cursor-pointer'
              />
            ) : (
              <div
                className='flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 hover:scale-110'
                onClick={toggleHeader}
              >
                {isLogoHovered ? (
                  <div className='flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 hover:scale-120'>
                    <div className='h-[14px] w-5'>
                      <TabIcon />
                    </div>
                  </div>
                ) : (
                  <div className='h-[28px] w-[26px]'>
                    <LogoIcon />
                  </div>
                )}
              </div>
            )}
            {isExpanded && (
              <div
                className='flex h-10 w-10 cursor-pointer items-center justify-end transition-all duration-300 hover:scale-120'
                onClick={toggleHeader}
              >
                <div className='h-[14px] w-5'>
                  <TabIcon />
                </div>
              </div>
            )}
          </div>
          <div className='flex w-full flex-col gap-2'>
            <div
              className={`flex w-full cursor-pointer items-center gap-2 hover:bg-gray-50 ${isExpanded ? 'justify-start' : 'justify-center'}`}
              onClick={handleNewConversation}
            >
              <AddIcon />
              <p
                className={`text-[0.85rem] font-medium transition-all duration-500 ${isExpanded ? 'translate-x-0 opacity-100' : 'pointer-events-none hidden opacity-0'}`}
              >
                Tạo đoạn chat mới
              </p>
            </div>
            <ConversationList isExpanded={!!isExpanded} />
          </div>
        </div>
        <div className='flex w-full flex-col items-start gap-3'>
          <div
            className={`flex w-full flex-row items-center gap-2 ${isExpanded ? 'justify-start' : 'justify-center'}`}
          >
            <div className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-full'>
              <Image
                src={user?.profilePicture || '/avatar.png'}
                alt='avatar'
                width={42}
                height={42}
                className='h-full w-full object-cover'
              />
            </div>
            {isExpanded && (
              <div
                className={`flex flex-col items-start transition-all duration-500 ${isExpanded ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2.5 opacity-0'}`}
              >
                <h4 className='text-[0.85rem] font-medium'>
                  {user?.firstName + ' ' + user?.lastName}
                </h4>
                <p className='text-xs font-normal text-gray-600'>
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderVertical;
