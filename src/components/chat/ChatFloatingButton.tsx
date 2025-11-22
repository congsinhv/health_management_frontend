'use client';

import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import type { LottieComponentProps } from 'lottie-react';

const ChatFloatingButton = () => {
  const [LottieComponent, setLottieComponent] =
    useState<React.ComponentType<LottieComponentProps> | null>(null);
  const [animationData, setAnimationData] = useState<unknown>(null);

  useEffect(() => {
    // Dynamically import Lottie and animation data only on client side
    const loadLottie = async () => {
      try {
        const [lottieModule, animData] = await Promise.all([
          import('lottie-react'),
          import('../../../public/AI_logo.json'),
        ]);
        setLottieComponent(() => lottieModule.default);
        setAnimationData(animData.default);
      } catch (error) {
        logger.warn('Failed to load Lottie animation', {
          errorMessage:
            error instanceof Error ? error.message : 'Unknown Lottie error',
        });
      }
    };

    loadLottie();
  }, []);

  const handleClick = () => {
    // TODO: Open chat modal/drawer when chat feature is implemented
    logger.debug('Chat button clicked');
  };

  return (
    <button
      className='fixed right-6 bottom-6 z-1000 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-none bg-white p-0 shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] focus:shadow-[0_6px_20px_rgba(0,0,0,0.2),0_0_0_3px_rgba(59,130,246,0.3)] focus:outline-none active:scale-95 md:right-5 md:bottom-5 md:h-14 md:w-14'
      onClick={handleClick}
      aria-label='Open AI chat assistant'
    >
      {LottieComponent && animationData ? (
        <LottieComponent
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: 60, height: 60 }}
        />
      ) : (
        <div className='flex h-15 w-15 items-center justify-center rounded-full bg-[#f0f0f0] text-lg font-semibold text-[#1e1e1e] md:h-12 md:w-12 md:text-base'>
          AI
        </div>
      )}
    </button>
  );
};

export default ChatFloatingButton;
