'use client';

import { Activity, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PredictionHistoryItem as PredictionHistoryItemType } from '@/types/profile';
import { PREDICTION_STATUS_LABELS } from '@/types/profile';

interface PredictionHistoryItemProps {
  item: PredictionHistoryItemType;
  onClick?: () => void;
  className?: string;
}

// Helper to format relative time in Vietnamese
const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return '1 ngày trước';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  return `${Math.floor(diffDays / 30)} tháng trước`;
};

export const PredictionHistoryItem = ({
  item,
  onClick,
  className,
}: PredictionHistoryItemProps) => {
  const Icon = item.type === 'prediction' ? Activity : MessageSquare;
  const statusLabel = PREDICTION_STATUS_LABELS[item.level];
  const relativeTime = formatRelativeTime(item.timestamp);

  // Determine indicator color
  const getIndicatorColor = () => {
    if (item.level === 'Normal_Weight') return 'bg-green-500';
    if (item.level.includes('Overweight')) return 'bg-orange-500';
    if (item.level === 'Insufficient_Weight') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-lg border border-gray-100 bg-[#F9F9FC] p-4 transition-colors hover:bg-[#F1F1F7] dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Icon */}
      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EFEFEF] bg-white'>
        <Icon className='h-5 w-5 text-gray-600 dark:text-gray-400' />
      </div>

      {/* Content */}
      <div className='min-w-0 flex-1'>
        <div className='mb-1 flex items-center gap-2'>
          <h4 className='text-sm font-medium text-gray-900 dark:text-white'>
            Bạn đã thực hiện 1 bài dự đoán với kết quả {statusLabel}
          </h4>
        </div>
        <p className='mb-2 text-xs text-gray-500 dark:text-gray-400'>
          {item.description}.{' '}
          <button
            className='text-primary text-xs font-medium hover:underline'
            onClick={e => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Xem chi tiết
          </button>
        </p>
      </div>

      {/* Timestamp */}
      <div className='shrink-0 text-right'>
        <span className='text-xs text-gray-400'>{relativeTime}</span>
      </div>
    </div>
  );
};
