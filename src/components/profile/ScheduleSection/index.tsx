'use client';

import { useSchedules, useUpdateScheduleStatus } from '@/hooks/useSchedules';
import { ScheduleCard } from './ScheduleCard';
import { EmptyState } from './EmptyState';
import { ScheduleSkeleton } from './ScheduleSkeleton';
import { AlertCircle } from 'lucide-react';

export const ScheduleSection = () => {
  const { data: schedules, isLoading, error } = useSchedules();
  const updateStatus = useUpdateScheduleStatus();

  const handleToggleStatus = (id: number, checked: boolean) => {
    updateStatus.mutate({
      id,
      status: checked ? 'active' : 'paused',
    });
  };

  if (error) {
    return (
      <div className='flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/10 dark:text-red-400'>
        <AlertCircle className='h-4 w-4' />
        Không thể tải lịch tập luyện. Vui lòng thử lại sau. {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
          Lịch tập luyện
        </h2>
        <ScheduleSkeleton />
      </div>
    );
  }

  if (!schedules || schedules.length === 0) {
    return (
      <div className='space-y-4'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
          Lịch tập luyện
        </h2>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
        Lịch tập luyện
      </h2>
      <div className='space-y-4'>
        {schedules.map(schedule => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            onToggleStatus={handleToggleStatus}
            isToggling={updateStatus.isPending}
          />
        ))}
      </div>
    </div>
  );
};
