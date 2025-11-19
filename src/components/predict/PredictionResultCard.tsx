import { PredictionResult } from '@/types/prediction';
import React from 'react';

interface PredictionResultCardProps {
  result: PredictionResult;
}

const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  result,
}) => {
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

  // Get color based on reliability
  const getReliabilityColor = (reliability: string): string => {
    const colorMap: Record<string, string> = {
      high: '#10B981',
      medium: '#F59E0B',
      low: '#EF4444',
    };
    return colorMap[reliability] || '#10B981';
  };

  // Get color based on prediction level
  const getLevelColor = (level: string): string => {
    if (level.includes('Normal')) return '#10B981';
    if (level.includes('Insufficient')) return '#F59E0B';
    if (level.includes('Overweight') || level.includes('Obesity'))
      return '#EF4444';
    return '#6B7280';
  };

  const radius = 121;
  const circumference = Math.PI * radius; // Half circle circumference
  const strokeDashoffset =
    circumference - (result.confidence / 100) * circumference;

  return (
    <div className='flex flex-col items-center justify-center gap-8 md:flex-row'>
      {/* Half Circle Progress Indicator */}
      <div className='relative flex flex-shrink-0 items-center justify-center'>
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
        <div className='absolute inset-0 flex flex-col items-center justify-center pt-16'>
          <div className='text-2xl text-gray-900'>
            {Math.round(result.confidence)}%
          </div>
          <div className='text-sm text-gray-600'>Dự đoán</div>
          <div className='text-center text-lg font-bold text-gray-900'>
            {getLevelDisplayText(result.level)}
          </div>
        </div>
      </div>

      {/* Result Details - Hidden since design shows only the circle */}
      <div className='hidden'>
        {/* Status Badge */}
        <div>
          <p className='mb-2 text-xs font-medium text-gray-600'>
            Kết quả dự đoán
          </p>
          <div className='inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#32F6B4] to-[#14B6E2] px-4 py-2 text-white'>
            <div className='h-2 w-2 rounded-full bg-white' />
            <span className='text-base font-semibold'>
              {getLevelDisplayText(result.level)}
            </span>
          </div>
        </div>

        {/* BMI */}
        <div>
          <h3 className='mb-2 text-xs font-medium text-gray-600'>Chỉ số BMI</h3>
          <p className='text-2xl font-bold text-gray-900'>
            {result.bmi.toFixed(1)}
          </p>
        </div>

        {/* Reliability */}
        <div>
          <h3 className='mb-2 text-xs font-medium text-gray-600'>Độ tin cậy</h3>
          <div className='flex items-center gap-2'>
            <div
              className='h-2 w-2 rounded-full'
              style={{
                backgroundColor: getReliabilityColor(result.reliability),
              }}
            />
            <span className='text-sm font-medium'>
              {result.reliability === 'high' && 'Cao'}
              {result.reliability === 'medium' && 'Trung bình'}
              {result.reliability === 'low' && 'Thấp'}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className='text-sm leading-relaxed text-gray-700'>
          <p>
            Bạn có kết quả dự đoán là{' '}
            <span className='font-semibold'>
              {getLevelDisplayText(result.level)}
            </span>{' '}
            với độ tin cậy{' '}
            <span className='font-semibold'>
              {Math.round(result.confidence)}%
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionResultCard;
