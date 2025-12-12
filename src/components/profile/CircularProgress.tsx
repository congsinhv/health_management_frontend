'use client';

import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number; // 0-100
  size?: number; // diameter in px
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  labelSuffix?: string;
  trackColor?: string;
  progressColor?: string;
}

export const CircularProgress = ({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  showLabel = true,
  labelSuffix = '%',
  trackColor = 'stroke-gray-200',
  progressColor = 'stroke-green-500',
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative inline-flex', className)}>
      <svg width={size} height={size} className='-rotate-90'>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          strokeWidth={strokeWidth}
          className={trackColor}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          className={cn(progressColor, 'transition-all duration-500 ease-out')}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      {showLabel && (
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-2xl font-bold text-gray-900 dark:text-white'>
            {Math.round(value)}
            {labelSuffix}
          </span>
          <span className='text-xs text-gray-500'>Độ tin cậy</span>
        </div>
      )}
    </div>
  );
};
