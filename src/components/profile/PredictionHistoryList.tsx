'use client';

import { cn } from '@/lib/utils';
import { PredictionHistoryItem } from './PredictionHistoryItem';
import { Skeleton } from '@/components/ui/skeleton';
import { TrackingItem } from '@/types/tracking';

interface PredictionHistoryListProps {
  items: TrackingItem[];
  total: number;
  isLoading?: boolean;
  onItemClick?: (item: TrackingItem) => void;
  className?: string;
}

const HistoryItemSkeleton = () => (
  <div className='flex items-start gap-4 rounded-lg border border-gray-100 bg-white p-4'>
    <Skeleton className='h-10 w-10 rounded-lg' />
    <div className='flex-1 space-y-2'>
      <Skeleton className='h-4 w-3/4' />
      <Skeleton className='h-3 w-1/2' />
      <Skeleton className='h-3 w-16' />
    </div>
    <Skeleton className='h-3 w-20' />
  </div>
);

export const PredictionHistoryList = ({
  items,
  total,
  isLoading = false,
  onItemClick,
  className,
}: PredictionHistoryListProps) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          'rounded-2xl border-2 border-[#EFEFEF] bg-white p-6 dark:bg-gray-800',
          className
        )}
      >
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-base font-semibold text-gray-900 dark:text-white'>
            Lịch sử dự đoán và hỏi đáp
          </h3>
          <Skeleton className='h-4 w-16' />
        </div>
        <div className='space-y-3'>
          <HistoryItemSkeleton />
          <HistoryItemSkeleton />
          <HistoryItemSkeleton />
        </div>
      </div>
    );
  }

  if (items?.length === 0) {
    return (
      <div
        className={cn(
          'rounded-2xl border-2 border-[#EFEFEF] bg-white p-6 dark:bg-gray-800',
          className
        )}
      >
        <h3 className='mb-4 text-base font-semibold text-gray-900 dark:text-white'>
          Lịch sử dự đoán và hỏi đáp
        </h3>
        <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 dark:border-gray-600 dark:bg-gray-700/50'>
          <p className='text-sm text-gray-500'>Chưa có lịch sử</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-[#EFEFEF] bg-white p-6 dark:bg-gray-800',
        className
      )}
    >
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-base font-semibold text-gray-900 dark:text-white'>
          Lịch sử dự đoán và hỏi đáp
        </h3>
        <span className='text-sm text-gray-500'>Tổng: {total}</span>
      </div>
      <div className='space-y-3'>
        {items?.map(item => (
          <PredictionHistoryItem
            key={item.id}
            item={item}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    </div>
  );
};
