'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TimePeriodInput } from './TimePeriodInput';
import { dayOptions } from '@/app/practice/formHelper';
import type { TimePeriod } from '@/types/practice';

interface FlexibleModeProps {
  selectedDays: string[];
  periods: Record<string, TimePeriod[]>;
  onPeriodsChange: (periods: Record<string, TimePeriod[]>) => void;
}

export const FlexibleMode = ({
  selectedDays,
  periods,
  onPeriodsChange,
}: FlexibleModeProps) => {
  const getDayLabel = (dayValue: string) =>
    dayOptions.find(d => d.value === dayValue)?.fullName || dayValue;

  const addPeriod = (day: string) => {
    const dayPeriods = periods[day] || [];
    onPeriodsChange({
      ...periods,
      [day]: [...dayPeriods, { startTime: '', endTime: '' }],
    });
  };

  const updatePeriod = (
    day: string,
    index: number,
    start: string,
    end: string
  ) => {
    const dayPeriods = [...(periods[day] || [])];
    dayPeriods[index] = { startTime: start, endTime: end };
    onPeriodsChange({ ...periods, [day]: dayPeriods });
  };

  const removePeriod = (day: string, index: number) => {
    const dayPeriods = (periods[day] || []).filter((_, i) => i !== index);
    onPeriodsChange({ ...periods, [day]: dayPeriods });
  };

  if (selectedDays.length === 0) {
    return (
      <p className='py-4 text-sm text-gray-500'>
        Vui lòng chọn ít nhất một ngày để thiết lập khung giờ
      </p>
    );
  }

  // Sort selected days by week order
  const sortedDays = selectedDays.sort(
    (a, b) =>
      dayOptions.findIndex(d => d.value === a) -
      dayOptions.findIndex(d => d.value === b)
  );

  return (
    <div className='space-y-6'>
      {sortedDays.map(day => {
        const dayPeriods = periods[day] || [{ startTime: '', endTime: '' }];

        return (
          <div
            key={day}
            className='rounded-lg border border-gray-200 bg-white p-4'
          >
            <h4 className='mb-3 font-medium text-gray-900'>
              {getDayLabel(day)}
            </h4>

            <div className='space-y-3'>
              {dayPeriods.map((period, index) => (
                <TimePeriodInput
                  key={index}
                  index={index}
                  startTime={period.startTime}
                  endTime={period.endTime}
                  onChange={(start, end) =>
                    updatePeriod(day, index, start, end)
                  }
                  onRemove={() => removePeriod(day, index)}
                  showRemove={dayPeriods.length > 1}
                />
              ))}
            </div>

            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => addPeriod(day)}
              className='text-primary hover:text-primary mt-3'
            >
              <Plus className='mr-1 h-4 w-4' />
              Thêm khung giờ
            </Button>
          </div>
        );
      })}
    </div>
  );
};
