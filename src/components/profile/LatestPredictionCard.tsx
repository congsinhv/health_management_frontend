'use client';

import { cn } from '@/lib/utils';
import type { LatestPrediction } from '@/types/profile';

interface LatestPredictionCardProps {
  prediction: LatestPrediction | null;
  isLoading?: boolean;
  className?: string;
}

export const LatestPredictionCard = ({
  prediction,
  isLoading = false,
  className,
}: LatestPredictionCardProps) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          'rounded-2xl border-2 border-[#EFEFEF] bg-white p-6 dark:bg-gray-800',
          className
        )}
      >
        <div className='flex items-center justify-between'>
          <h3 className='text-base font-semibold text-gray-900 dark:text-white'>
            Kết quả dự đoán gần nhất
          </h3>
          <span className='text-xs text-gray-400'>
            <span className='text-[#70DACC]'>●</span> Độ tin cậy
          </span>
        </div>
        <div className='flex items-center justify-center py-8'>
          <div className='h-[120px] w-[120px] animate-pulse rounded-full bg-gray-200' />
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div
        className={cn(
          'rounded-2xl border-2 border-[#EFEFEF] bg-white p-6 dark:bg-gray-800',
          className
        )}
      >
        <div className='flex items-center justify-between'>
          <h3 className='text-base font-semibold text-gray-900 dark:text-white'>
            Kết quả dự đoán gần nhất
          </h3>
          <span className='text-xs text-gray-400'>
            <span className='text-[#70DACC]'>●</span> Độ tin cậy
          </span>
        </div>
        <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
          <p className='text-sm'>Chưa có kết quả dự đoán</p>
          <p className='text-xs text-gray-400'>Thực hiện dự đoán đầu tiên</p>
        </div>
      </div>
    );
  }

  const radius = 121;
  const circumference = Math.PI * radius; // Half circle circumference
  const strokeDashoffset =
    circumference - (prediction.confidence / 100) * circumference;

  // Map prediction levels to display text
  const getLevelDisplayText = (level: string): string => {
    const levelMap: Record<string, string> = {
      Insufficient_Weight: 'Thiếu cân',
      Normal_Weight: 'Cân nặng bình thường',
      Overweight_Level_I: 'Thừa cân mức I',
      Overweight_Level_II: 'Thừa cân mức II',
      Obesity_Type_I: 'Béo phì độ I',
      Obesity_Type_II: 'Béo phì độ II',
      Obesity_Type_III: 'Béo phì độ III',
    };
    return levelMap[level] || level;
  };

  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-[#EFEFEF] bg-white p-6 dark:bg-gray-800',
        className
      )}
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-base font-semibold text-gray-900 dark:text-white'>
          Kết quả dự đoán gần nhất
        </h3>
        <span className='text-xs text-gray-400'>
          <span className='text-[#70DACC]'>●</span> Độ tin cậy
        </span>
      </div>
      <div className='relative flex shrink-0 items-center justify-center'>
        <svg width='330' height='198' viewBox='0 0 330 198'>
          {/* Background half circle */}
          <path
            d='M 44 165 A 121 121 0 0 1 286 165'
            stroke='#E5E7EB'
            strokeWidth='26'
            fill='none'
            strokeLinecap='round'
          />
          {/* Progress half circle - teal gradient */}
          <path
            d='M 44 165 A 121 121 0 0 1 286 165'
            stroke='url(#progressGradient)'
            strokeWidth='26'
            fill='none'
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap='round'
            style={{
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
          <defs>
            <linearGradient
              id='progressGradient'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='0%'
            >
              <stop offset='0%' stopColor='#32F6B4' />
              <stop offset='100%' stopColor='#9DFFEA' />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className='absolute inset-0 flex flex-col items-center justify-center pt-13'>
          <div className='text-2xl text-gray-900'>
            {Math.round(prediction.confidence)}%
          </div>
          <div className='text-sm text-gray-600'>Dự đoán</div>
          <div className='text-center text-base font-semibold text-gray-900'>
            {getLevelDisplayText(prediction.level)}
          </div>
        </div>
      </div>
    </div>
  );
};
