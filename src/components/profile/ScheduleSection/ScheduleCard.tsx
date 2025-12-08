import { Schedule, DayOfWeek } from '@/types/schedule';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Dumbbell, Trophy, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import { DayExerciseCard } from './DayExerciseCard';
import { cn } from '@/lib/utils';

const days: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const goalLabels: Record<string, string> = {
  gain: 'Tăng cơ',
  lose: 'Giảm mỡ',
  maintain: 'Duy trì',
};

const modeLabels: Record<string, string> = {
  fixed: 'Cố định',
  flexible: 'Linh hoạt',
};

interface ScheduleCardProps {
  schedule: Schedule;
  onToggleStatus: (id: number, checked: boolean) => void;
  isToggling: boolean;
}

export const ScheduleCard = ({
  schedule,
  onToggleStatus,
  isToggling,
}: ScheduleCardProps) => {
  const isActive = schedule.status === 'active';

  return (
    <div
      className={cn(
        'space-y-4 rounded-lg border p-4 transition-all duration-300',
        isActive
          ? 'border-primary/80 shadow-sm'
          : 'border-gray-200 bg-gray-50/50 opacity-80'
      )}
    >
      {/* Header */}
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='space-y-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100'>
              Lịch tập{' '}
              {modeLabels[schedule.schedule_mode] || schedule.schedule_mode}
            </h3>
            <Badge
              variant={isActive ? 'default' : 'secondary'}
              className='text-xs'
            >
              {isActive ? 'Đang hoạt động' : 'Đã tạm dừng'}
            </Badge>
          </div>
          <div className='flex items-center gap-2 text-xs text-gray-500'>
            <div className='flex items-center gap-1'>
              <Trophy className='h-3 w-3' />
              {goalLabels[schedule.goal] || schedule.goal}
            </div>
            <span>•</span>
            <div className='flex items-center gap-1'>
              <CalendarClock className='h-3 w-3' />
              {new Date(schedule.created_at).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between gap-4 sm:justify-end'>
          <div className='flex items-center gap-2'>
            <Switch
              checked={isActive}
              onCheckedChange={checked => onToggleStatus(schedule.id, checked)}
              disabled={isToggling}
              className='hover:border-primary/20'
              aria-label='Chuyển trạng thái lịch tập'
            />
          </div>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7'>
        {days.map(day => (
          <DayExerciseCard
            key={day}
            day={day}
            exercise={schedule.weekly_plan?.[day]}
            isActiveSchedule={isActive}
          />
        ))}
      </div>
    </div>
  );
};
