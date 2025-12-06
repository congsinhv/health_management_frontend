'use client';

import { useRef } from 'react';
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
  const idCounterRef = useRef(0);
  const periodIdsRef = useRef<Record<string, string[]>>({});

  const getDayLabel = (dayValue: string) =>
    dayOptions.find(d => d.value === dayValue)?.fullName || dayValue;

  const generateId = () => {
    idCounterRef.current += 1;
    return `period-${Date.now()}-${idCounterRef.current}`;
  };

  // Get or create IDs for periods in a day
  const getPeriodIds = (day: string, count: number): string[] => {
    if (!periodIdsRef.current[day]) {
      periodIdsRef.current[day] = [];
    }
    // Add new IDs if needed
    while (periodIdsRef.current[day].length < count) {
      periodIdsRef.current[day].push(generateId());
    }
    return periodIdsRef.current[day].slice(0, count);
  };

  const addPeriod = (day: string) => {
    // Get existing periods
    const existingPeriods = periods[day] || [];

    // If no periods exist, we need to add the default period first
    // This ensures the visual default becomes part of the actual state
    const periodsToUpdate =
      existingPeriods.length === 0
        ? [{ startTime: '07:00', endTime: '08:00' }]
        : existingPeriods;

    // Add a new ID for the new period
    if (!periodIdsRef.current[day]) {
      periodIdsRef.current[day] = [];
    }
    periodIdsRef.current[day].push(generateId());

    // Add new period with default times (07:00 - 08:00)
    const newPeriod = { startTime: '07:00', endTime: '08:00' };

    onPeriodsChange({
      ...periods,
      [day]: [...periodsToUpdate, newPeriod],
    });
  };

  const updatePeriod = (
    day: string,
    index: number,
    start: string,
    end: string
  ) => {
    // Initialize with default period if no periods exist
    const existingPeriods = periods[day] || [
      { startTime: '07:00', endTime: '08:00' },
    ];
    const dayPeriods = [...existingPeriods];
    dayPeriods[index] = { startTime: start, endTime: end };
    onPeriodsChange({ ...periods, [day]: dayPeriods });
  };

  const removePeriod = (day: string, index: number) => {
    const dayPeriods = (periods[day] || []).filter((_, i) => i !== index);
    // Remove the ID at this index
    if (periodIdsRef.current[day]) {
      periodIdsRef.current[day].splice(index, 1);
    }
    onPeriodsChange({ ...periods, [day]: dayPeriods });
  };

  if (selectedDays.length === 0) {
    return (
      <p className='py-4 text-sm text-gray-500'>
        Vui lòng chọn ít nhất một ngày để thiết lập khung giờ
      </p>
    );
  }

  // Sort selected days by week order (without mutating original array)
  const sortedDays = [...selectedDays].sort(
    (a, b) =>
      dayOptions.findIndex(d => d.value === a) -
      dayOptions.findIndex(d => d.value === b)
  );

  return (
    <div className='space-y-6'>
      {sortedDays.map(day => {
        // Show default period with times if no periods exist
        const dayPeriods =
          periods[day] && periods[day].length > 0
            ? periods[day]
            : [{ startTime: '07:00', endTime: '08:00' }];
        const periodIds = getPeriodIds(day, dayPeriods.length);

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
                  key={periodIds[index]}
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
              onClick={e => {
                e.preventDefault();
                addPeriod(day);
              }}
              className='text-primary hover:bg-primary/10 hover:text-primary focus:text-primary mt-3'
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
