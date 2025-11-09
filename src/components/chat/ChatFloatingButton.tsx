'use client';

import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import styles from './ChatFloatingButton.module.scss';

const ChatFloatingButton = () => {
  const [LottieComponent, setLottieComponent] = useState<any>(null);
  const [animationData, setAnimationData] = useState<any>(null);

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
      className={styles.chatButton}
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
        <div className={styles.chatButton__placeholder}>AI</div>
      )}
    </button>
  );
};

export default ChatFloatingButton;
