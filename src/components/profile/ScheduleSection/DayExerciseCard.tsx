import { WeeklyExercise, DayOfWeek, ExerciseStatus } from '@/types/schedule';
import { cn } from '@/lib/utils';
import {
  Check,
  Clock,
  Play,
  SkipForward,
  Moon,
  LucideIcon,
} from 'lucide-react';

const dayLabels: Record<DayOfWeek, string> = {
  monday: 'T2',
  tuesday: 'T3',
  wednesday: 'T4',
  thursday: 'T5',
  friday: 'T6',
  saturday: 'T7',
  sunday: 'CN',
};

const statusConfig: Record<
  ExerciseStatus,
  { color: string; icon: LucideIcon; bg: string }
> = {
  pending: {
    color: 'text-amber-600',
    icon: Clock,
    bg: 'bg-white',
  },
  completed: {
    color: 'text-emerald-600',
    icon: Check,
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  skipped: {
    color: 'text-gray-500',
    icon: SkipForward,
    bg: 'bg-gray-100 dark:bg-gray-800',
  },
  in_progress: {
    color: 'text-blue-600',
    icon: Play,
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
};

interface DayExerciseCardProps {
  day: DayOfWeek;
  exercise?: WeeklyExercise;
  isActiveSchedule?: boolean;
}

export const DayExerciseCard = ({
  day,
  exercise,
  isActiveSchedule = true,
}: DayExerciseCardProps) => {
  const isRestDay = !exercise;

  if (isRestDay) {
    return (
      <div
        className={cn(
          'flex h-[85px] flex-col rounded-md border p-2 transition-colors',
          isActiveSchedule
            ? 'border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/20'
            : 'bg-gray-50 opacity-50'
        )}
      >
        <div className='mb-1 flex items-center justify-between'>
          <span className='text-xs font-semibold text-gray-500'>
            {dayLabels[day]}
          </span>
          <Moon className='h-3 w-3 text-gray-300' />
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <span className='text-[10px] text-gray-400'>Nghỉ</span>
        </div>
      </div>
    );
  }

  const status = exercise.status || 'pending';
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'relative flex h-[85px] flex-col overflow-hidden rounded-md border p-2 transition-all',
        isActiveSchedule
          ? 'border-primary/30 cursor-pointer bg-white dark:bg-gray-900'
          : 'bg-gray-50 opacity-60',
        config.bg,
        'hover:border-primary/80'
      )}
    >
      <div className='mb-1 flex items-start justify-between'>
        <span className={cn('text-xs font-bold', config.color)}>
          {dayLabels[day]}
        </span>
        <Icon className={cn('h-3 w-3', config.color)} />
      </div>

      <div className='flex h-full flex-col justify-between'>
        <p
          className='line-clamp-2 text-[11px] leading-tight font-medium'
          title={exercise.exercise}
        >
          {exercise.exercise}
        </p>
        <div className='mt-1 flex items-center gap-1'>
          <span className='text-[10px] whitespace-nowrap text-gray-500'>
            {exercise.duration_minutes}p
          </span>
          <span className='text-[10px] text-gray-400'>•</span>
          <span className='text-[10px] whitespace-nowrap text-gray-500'>
            {exercise.estimated_calories}kcal
          </span>
        </div>
      </div>
    </div>
  );
};
