'use client';

import { cn } from '@/lib/utils';
import { dayOptions } from '@/app/practice/formHelper';

interface DayPickerProps {
  selectedDays: string[];
  onChange: (days: string[]) => void;
  disabled?: boolean;
}

export const DayPicker = ({
  selectedDays,
  onChange,
  disabled = false,
}: DayPickerProps) => {
  const toggleDay = (dayValue: string) => {
    if (disabled) return;

    const newDays = selectedDays.includes(dayValue)
      ? selectedDays.filter(d => d !== dayValue)
      : [...selectedDays, dayValue];
    onChange(newDays);
  };

  return (
    <div className='flex flex-wrap gap-2'>
      {dayOptions.map(day => {
        const isSelected = selectedDays.includes(day.value);
        return (
          <button
            key={day.value}
            type='button'
            onClick={() => toggleDay(day.value)}
            disabled={disabled}
            aria-label={`${day.fullName}, ${isSelected ? 'đã chọn' : 'chưa chọn'}`}
            aria-pressed={isSelected}
            className={cn(
              'flex h-12 w-26 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-all',
              'focus:outline-none',
              isSelected
                ? 'bg-gradient-to-r from-[#00bba7] to-[#00bc7d] text-white'
                : 'hover:border-primary border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {day.label}
          </button>
        );
      })}
    </div>
  );
};
