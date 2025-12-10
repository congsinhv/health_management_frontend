'use client';

import { useEffect } from 'react';
import { TimePeriodInput } from './TimePeriodInput';
import type { TimePeriod } from '@/types/practice';

const DEFAULT_PERIOD: TimePeriod = { startTime: '07:00', endTime: '08:00' };

interface FixedModeProps {
  selectedDays: string[];
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

export const FixedMode = ({
  selectedDays,
  period,
  onPeriodChange,
}: FixedModeProps) => {
  // Initialize default period if empty
  useEffect(() => {
    if (!period.startTime || !period.endTime) {
      onPeriodChange({ ...DEFAULT_PERIOD });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  if (selectedDays.length === 0) {
    return (
      <p className='py-4 text-sm text-gray-500'>
        Vui lòng chọn ít nhất một ngày để thiết lập khung giờ
      </p>
    );
  }

  // Use actual period values (will be initialized by useEffect if empty)
  const startTime = period.startTime || DEFAULT_PERIOD.startTime;
  const endTime = period.endTime || DEFAULT_PERIOD.endTime;

  return (
    <div className='space-y-4'>
      <p className='text-sm text-gray-600'>
        Khung giờ này sẽ được áp dụng cho tất cả {selectedDays.length} ngày đã
        chọn
      </p>

      <div className='rounded-lg border border-gray-200 bg-white p-4'>
        <h4 className='mb-3 font-medium text-gray-900'>Giờ tập cố định</h4>
        <TimePeriodInput
          startTime={startTime}
          endTime={endTime}
          onChange={(start, end) =>
            onPeriodChange({ startTime: start, endTime: end })
          }
        />
      </div>
    </div>
  );
};
