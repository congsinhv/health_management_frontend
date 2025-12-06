'use client';

import { TimePeriodInput } from './TimePeriodInput';
import type { TimePeriod } from '@/types/practice';

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
  if (selectedDays.length === 0) {
    return (
      <p className='py-4 text-sm text-gray-500'>
        Vui lòng chọn ít nhất một ngày để thiết lập khung giờ
      </p>
    );
  }

  return (
    <div className='space-y-4'>
      <p className='text-sm text-gray-600'>
        Khung giờ này sẽ được áp dụng cho tất cả {selectedDays.length} ngày đã
        chọn
      </p>

      <div className='rounded-lg border border-gray-200 bg-white p-4'>
        <h4 className='mb-3 font-medium text-gray-900'>Giờ tập cố định</h4>
        <TimePeriodInput
          startTime={period.startTime}
          endTime={period.endTime}
          onChange={(start, end) =>
            onPeriodChange({ startTime: start, endTime: end })
          }
        />
      </div>
    </div>
  );
};
