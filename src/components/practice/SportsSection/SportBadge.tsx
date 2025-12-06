'use client';

import { cn } from '@/lib/utils';

interface SportBadgeProps {
  label: string;
  value: string;
  selected: boolean;
  onToggle: (value: string) => void;
}

export const SportBadge = ({
  label,
  value,
  selected,
  onToggle,
}: SportBadgeProps) => {
  return (
    <button
      type='button'
      onClick={() => onToggle(value)}
      aria-pressed={selected}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-all',
        'focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'hover:border-primary border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
      )}
    >
      {label}
    </button>
  );
};
