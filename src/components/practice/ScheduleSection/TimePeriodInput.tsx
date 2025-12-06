'use client';

import { TimePicker } from '@/components/ui/time-picker';
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
        <TimePicker
          value={startTime}
          onChange={value =>
            handleStartChange({
              target: { value },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          className={cn(
            !isValidTime && startTime && endTime && 'border-destructive'
          )}
        />
      </div>

      <span className='mt-5 text-gray-400'>-</span>

      {/* End Time */}
      <div className='flex flex-col gap-1'>
        <label className='text-xs text-gray-500'>Kết thúc</label>
        <TimePicker
          value={endTime}
          onChange={value =>
            handleEndChange({
              target: { value },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          className={cn(
            !isValidTime && startTime && endTime && 'border-destructive'
          )}
        />
      </div>

      {/* Duration */}
      <div className='flex flex-col gap-1'>
        <label className='text-xs text-gray-500'>Thời lượng</label>
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
          className='hover:text-destructive/90 hover:bg-destructive/5 mt-5 h-8 w-8 text-gray-400'
          aria-label='Xóa khung giờ'
        >
          <X className='size-4' />
        </Button>
      )}
    </div>
  );
};
