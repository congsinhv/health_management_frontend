'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TimePeriodInput } from './TimePeriodInput';
import { dayOptions } from '@/app/practice/formHelper';
import type { TimePeriod } from '@/types/practice';

// Extended TimePeriod with unique ID for stable React keys
interface TimePeriodWithId extends TimePeriod {
  id: string;
}

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
  // Counter for generating unique IDs
  const idCounterRef = useRef(0);
  // Cache for period IDs to maintain stability across renders
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
    const dayPeriods = periods[day] || [];
    // Add a new ID for the new period
    if (!periodIdsRef.current[day]) {
      periodIdsRef.current[day] = [];
    }
    periodIdsRef.current[day].push(generateId());
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
        const dayPeriods = periods[day] || [{ startTime: '', endTime: '' }];
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
