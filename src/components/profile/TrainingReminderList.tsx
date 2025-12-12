'use client';

import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Schedule } from '@/types/schedule';
import dayjs from 'dayjs';

interface TrainingReminderListProps {
  reminders: Schedule | null;
  total?: number;
  isLoading?: boolean;
  className?: string;
}

const ReminderSkeleton = () => (
  <div className='flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800'>
    <Skeleton className='h-8 w-8 rounded-lg' />
    <div className='flex-1 space-y-1'>
      <Skeleton className='h-4 w-32' />
      <Skeleton className='h-3 w-48' />
      <Skeleton className='h-3 w-40' />
    </div>
  </div>
);

export const TrainingReminderList = ({
  reminders,
  total,
  isLoading = false,
  className,
}: TrainingReminderListProps) => {
  const displayTotal =
    total ?? Object.values(reminders?.weekly_plan || {}).length;

  if (isLoading) {
    return (
      <div className={cn('space-y-3 pt-6', className)}>
        <div className='flex items-center justify-between'>
          <h4 className='text-sm font-medium text-[#B3B8C3]'>
            Danh sách đã tạo
          </h4>
          <Skeleton className='h-4 w-12' />
        </div>
        <ReminderSkeleton />
        <ReminderSkeleton />
      </div>
    );
  }

  if (Object.values(reminders?.weekly_plan || {}).length === 0) {
    return (
      <div className={cn('space-y-3 pt-6', className)}>
        <div className='flex items-center justify-between'>
          <h4 className='text-sm font-medium text-[#B3B8C3]'>
            Danh sách đã tạo
          </h4>
          <span className='text-xs text-gray-400'>Tổng: 0</span>
        </div>
        <div className='rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-600 dark:bg-gray-700/50'>
          <Bell className='mx-auto mb-2 h-8 w-8 text-gray-300' />
          <p className='text-xs text-gray-500'>Chưa có nhắc nhở tập luyện</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3 pt-6', className)}>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-medium text-[#B3B8C3]'>Danh sách đã tạo</h4>
        <span className='text-xs text-gray-400'>Tổng: {displayTotal}</span>
      </div>
      <div className='space-y-2'>
        {Object.values(reminders?.weekly_plan || {}).map(reminder => (
          <div
            key={reminder.exercise}
            className={cn(
              'flex items-start gap-3 rounded-lg border border-gray-100 bg-[#F9F9FC] p-3 dark:border-gray-700 dark:bg-gray-800',
              !reminder.status && 'opacity-60'
            )}
          >
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EFEFEF] bg-white'>
              <Bell className='h-4 w-4 text-gray-600 dark:text-gray-400' />
            </div>
            <div className='min-w-0 flex-1'>
              <div className='mb-1 flex items-center gap-2'>
                <span className='bg-primary h-2 w-2 rounded-full' />
                <p className='text-sm font-medium text-gray-900 dark:text-white'>
                  Nhắc nhở tập luyện
                </p>
              </div>
              <div className='mb-1 flex items-center gap-1 text-xs text-gray-500'>
                <span>
                  Tạo lúc {dayjs(reminders?.created_at).format('HH:mm:ss')} ngày{' '}
                  {dayjs(reminders?.created_at).format('DD/MM/YYYY')}
                </span>
              </div>
              {reminder.description && (
                <p className='text-xs text-gray-500'>
                  {reminder.description} vào lúc {reminder.workout_start_time}{' '}
                  ngày {dayjs(reminder.workout_date).format('DD/MM/YYYY')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
