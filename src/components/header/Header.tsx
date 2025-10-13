'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Header.module.scss';

const Header = () => {
  const router = useRouter();
  const [LottieComponent, setLottieComponent] = useState<any>(null);
  const [animationData, setAnimationData] = useState<any>(null);

  const handleChat = () => {
    router.push('/chatbox');
  };

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
        console.warn('Failed to load Lottie animation:', error);
      }
    };

    loadLottie();
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image
            src='/Healthcare_logo.svg'
            alt='logo'
            width={100}
            height={100}
          />
        </div>
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
          <div className={styles.chat} onClick={handleChat}>
            {LottieComponent && animationData ? (
              <LottieComponent
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ width: 60, height: 60 }}
              />
            ) : (
              <div
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: '#f0f0f0',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                AI
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
