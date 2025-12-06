'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { calculateDuration } from '@/app/practice/formHelper';
import { cn } from '@/lib/utils';

interface TimePeriodInputProps {
  startTime: string;
  endTime: string;
  onChange: (start: string, end: string) => void;
  onRemove?: () => void;
  showRemove?: boolean;
  index?: number;
}

export const TimePeriodInput = ({
  startTime,
  endTime,
  onChange,
  onRemove,
  showRemove = false,
  index = 0,
}: TimePeriodInputProps) => {
  const duration =
    startTime && endTime ? calculateDuration(startTime, endTime) : '';

  // Validate that end time is after start time
  const isValidTime = !startTime || !endTime || startTime < endTime;

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    // If end time is before new start time, clear end time
    if (endTime && newStart >= endTime) {
      onChange(newStart, '');
    } else {
      onChange(newStart, endTime);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    // Only update if end time is after start time
    if (!startTime || newEnd > startTime) {
      onChange(startTime, newEnd);
    }
  };

  return (
    <div
      role='group'
      aria-label={`Khung giờ ${index + 1}`}
      className='flex items-center gap-3'
    >
      {/* Start Time */}
      <div className='flex flex-col gap-1'>
        <label className='text-xs text-gray-500'>Bắt đầu</label>
        <Input
          type='time'
          value={startTime}
          onChange={handleStartChange}
          className={cn(
            'w-32 rounded-[4px] bg-white',
            !isValidTime && startTime && endTime && 'border-destructive'
          )}
        />
      </div>

      <span className='mt-5 text-gray-400'>-</span>

      {/* End Time */}
      <div className='flex flex-col gap-1'>
        <label className='text-xs text-gray-500'>Kết thúc</label>
        <Input
          type='time'
          value={endTime}
          onChange={handleEndChange}
          className={cn(
            'w-32 rounded-[4px] bg-white',
            !isValidTime && startTime && endTime && 'border-destructive'
          )}
        />
      </div>

      {/* Duration */}
      <div className='flex flex-col gap-1'>
        <label className='text-xs text-gray-500'>Thờ lượng</label>
        <div
          className={cn(
            'flex h-10 w-20 items-center justify-center rounded-[4px] bg-gray-100 text-sm font-medium',
            duration ? 'text-primary' : 'text-gray-400',
            !isValidTime &&
              startTime &&
              endTime &&
              'bg-destructive/10 text-destructive'
          )}
          aria-live='polite'
        >
          {duration || '--'}
        </div>
      </div>

      {/* Remove button */}
      {showRemove && onRemove && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={onRemove}
          className='hover:text-destructive mt-5 h-8 w-8 text-gray-400'
          aria-label='Xóa khung giờ'
        >
          <X className='h-4 w-4' />
        </Button>
      )}
    </div>
  );
};
