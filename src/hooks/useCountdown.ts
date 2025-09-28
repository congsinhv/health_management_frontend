import { useState, useEffect, useRef } from 'react';

interface UseCountdownReturn {
  timeLeft: number;
  isExpired: boolean;
  formattedTime: string;
  restart: () => void;
}

export function useCountdown(initialMinutes: number = 60): UseCountdownReturn {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // Convert to seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const restart = () => {
    setTimeLeft(initialMinutes * 60);
  };

  return {
    timeLeft,
    isExpired: timeLeft <= 0,
    formattedTime: formatTime(timeLeft),
    restart,
  };
}
