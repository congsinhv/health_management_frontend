'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimePicker } from '@/components/ui/time-picker';
import { Bell, Clock, Info } from 'lucide-react';
import { appointmentService } from '@/services/appointmentService';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TimeSlot {
  id: number;
  startTime: string;
}

interface DaySchedule {
  day: string;
  dayValue: string;
  timeSlots: TimeSlot[];
}

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (schedules: DaySchedule[], type: 'flexible' | 'fixed') => void;
  predictionId?: string;
}

type ScheduleType = 'flexible' | 'fixed';

// Day options matching practice page format
const dayOptions = [
  { label: 'Thứ 2', value: 'monday', fullName: 'Thứ 2' },
  { label: 'Thứ 3', value: 'tuesday', fullName: 'Thứ 3' },
  { label: 'Thứ 4', value: 'wednesday', fullName: 'Thứ 4' },
  { label: 'Thứ 5', value: 'thursday', fullName: 'Thứ 5' },
  { label: 'Thứ 6', value: 'friday', fullName: 'Thứ 6' },
  { label: 'Thứ 7', value: 'saturday', fullName: 'Thứ 7' },
  { label: 'Chủ nhật', value: 'sunday', fullName: 'Chủ nhật' },
];

export default function AppointmentModal({
  open,
  onOpenChange,
  onSave,
  predictionId: propPredictionId,
}: AppointmentModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>([]);
  const [scheduleType, setScheduleType] = useState<ScheduleType>('flexible');
  const [fixedTime, setFixedTime] = useState<string>('07:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDay = (dayValue: string, dayLabel: string) => {
    setDaySchedules(prev => {
      const existingSchedule = prev.find(ds => ds.dayValue === dayValue);

      if (existingSchedule) {
        return prev.filter(ds => ds.dayValue !== dayValue);
      } else {
        return [
          ...prev,
          {
            day: dayLabel,
            dayValue,
            timeSlots: [
              {
                id: Date.now(),
                startTime: scheduleType === 'fixed' ? fixedTime : '07:00',
              },
            ],
          },
        ];
      }
    });
  };

  const updateTimeSlot = (dayValue: string, value: string) => {
    setDaySchedules(prev =>
      prev.map(ds =>
        ds.dayValue === dayValue
          ? {
              ...ds,
              timeSlots: [{ ...ds.timeSlots[0], startTime: value }],
            }
          : ds
      )
    );
  };

  const updateFixedTime = (time: string) => {
    setFixedTime(time);
    setDaySchedules(prev =>
      prev.map(ds => ({
        ...ds,
        timeSlots: ds.timeSlots.map(slot => ({
          ...slot,
          startTime: time,
        })),
      }))
    );
  };

  const handleScheduleTypeChange = (type: string) => {
    setScheduleType(type as ScheduleType);
    setDaySchedules([]);
    if (type === 'fixed') {
      setFixedTime('07:00');
    }
  };

  const handleSave = async () => {
    try {
      if (daySchedules.length === 0) {
        toast.error('Vui lòng chọn ít nhất một ngày');
        return;
      }

      if (scheduleType === 'fixed' && !fixedTime) {
        toast.error('Vui lòng nhập thời gian cố định');
        return;
      }

      if (scheduleType === 'flexible') {
        for (const schedule of daySchedules) {
          for (const slot of schedule.timeSlots) {
            if (!slot.startTime || slot.startTime.trim() === '') {
              toast.error(
                `Vui lòng nhập thời gian thông báo cho ${schedule.day}`
              );
              return;
            }
          }
        }
      }

      setIsSubmitting(true);

      const predictionId =
        propPredictionId || localStorage.getItem('prediction_id') || '';
      const userId = user?.id ? parseInt(user.id) : 0;

      if (!predictionId) {
        toast.error('Không tìm thấy prediction_id. Vui lòng thử lại.');
        setIsSubmitting(false);
        return;
      }

      if (!userId || !user) {
        toast.error('Vui lòng đăng nhập để tiếp tục.');
        setIsSubmitting(false);
        return;
      }

      await appointmentService.regenerateWeeklyPlan(
        predictionId,
        userId,
        daySchedules,
        scheduleType,
        scheduleType === 'fixed' ? fixedTime : undefined
      );

      toast.success('Đã tạo lịch thông báo thành công!');

      if (onSave) {
        onSave(daySchedules, scheduleType);
      }

      handleReset();
      onOpenChange(false);

      // Redirect to profile page
      router.push('/profile');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Không thể tạo lịch thông báo';
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setDaySchedules([]);
    setFixedTime('07:00');
    setScheduleType('flexible');
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  // Sort selected days by week order
  const sortedDaySchedules = [...daySchedules].sort(
    (a, b) =>
      dayOptions.findIndex(d => d.value === a.dayValue) -
      dayOptions.findIndex(d => d.value === b.dayValue)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] w-full max-w-5xl! overflow-y-auto rounded-2xl p-4'>
        {/* Header with gradient accent */}
        <div className='border-b border-gray-100 px-6 pt-6 pb-4'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-3 text-xl font-semibold text-gray-900'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#00bba7] to-[#00bc7d]'>
                <Bell className='h-5 w-5 text-white' />
              </div>
              Tạo lịch thông báo
            </DialogTitle>
            <DialogDescription className='mt-1 text-sm text-gray-500'>
              Thiết lập thời gian nhận thông báo nhắc nhở tập luyện
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='space-y-6 px-6 py-5'>
          {/* Info banner */}
          <div className='flex items-start gap-3 rounded-lg border border-[#00bba7]/20 bg-gradient-to-r from-[#00bba7]/5 to-[#00bc7d]/5 p-4'>
            <Info className='mt-0.5 h-4 w-4 flex-shrink-0 text-[#00bba7]' />
            <p className='text-sm text-gray-600'>
              Đây là lịch{' '}
              <span className='font-medium'>thông báo nhắc nhở</span>, không
              phải lịch tập luyện. Bạn sẽ nhận thông báo vào các thời điểm đã
              chọn.
            </p>
          </div>

          {/* Schedule Type Tabs */}
          <div className='space-y-3'>
            <label className='block text-sm font-medium text-gray-700'>
              Loại lịch thông báo
            </label>
            <Tabs
              value={scheduleType}
              onValueChange={handleScheduleTypeChange}
              className='w-full'
            >
              <TabsList className='grid h-12 w-full max-w-[300px] grid-cols-2 rounded-lg border border-gray-200 bg-gray-50 p-1'>
                <TabsTrigger
                  value='flexible'
                  disabled={isSubmitting}
                  className='data-[state=active]:bg-white data-[state=active]:text-[#00bba7] data-[state=active]:shadow-sm'
                >
                  Linh hoạt
                </TabsTrigger>
                <TabsTrigger
                  value='fixed'
                  disabled={isSubmitting}
                  className='data-[state=active]:bg-white data-[state=active]:text-[#00bba7] data-[state=active]:shadow-sm'
                >
                  Cố định
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className='text-xs text-gray-500'>
              {scheduleType === 'flexible'
                ? 'Có thể đặt nhiều thời điểm thông báo khác nhau trong ngày'
                : 'Một thời điểm cố định cho tất cả các ngày đã chọn'}
            </p>
          </div>

          {/* Fixed Time Input */}
          {scheduleType === 'fixed' && (
            <div className='space-y-3'>
              <label className='block text-sm font-medium text-gray-700'>
                Thời gian thông báo
              </label>
              <div className='rounded-lg border border-gray-200 bg-white p-4'>
                <div className='flex flex-col gap-1'>
                  <label className='flex items-center gap-1.5 text-xs text-gray-500'>
                    <Clock className='h-3 w-3' />
                    Chọn giờ
                  </label>
                  <TimePicker
                    value={fixedTime}
                    onChange={updateFixedTime}
                    disabled={isSubmitting}
                    className='w-32'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Day Picker */}
          <div className='space-y-3'>
            <label className='block text-sm font-medium text-gray-700'>
              Chọn ngày nhận thông báo
            </label>
            <div className='flex flex-wrap gap-2'>
              {dayOptions.map(day => {
                const isSelected = daySchedules.some(
                  ds => ds.dayValue === day.value
                );
                return (
                  <button
                    key={day.value}
                    type='button'
                    onClick={() => toggleDay(day.value, day.fullName)}
                    disabled={isSubmitting}
                    aria-label={`${day.fullName}, ${isSelected ? 'đã chọn' : 'chưa chọn'}`}
                    aria-pressed={isSelected}
                    className={cn(
                      'flex h-11 w-24 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bba7] focus-visible:ring-offset-2',
                      isSelected
                        ? 'bg-gradient-to-r from-[#00bba7] to-[#00bc7d] text-white shadow-md'
                        : 'border border-gray-200 bg-white text-gray-700 hover:border-[#00bba7] hover:bg-gray-50',
                      isSubmitting && 'cursor-not-allowed opacity-50'
                    )}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Days Schedule */}
          {sortedDaySchedules.length > 0 ? (
            <div className='space-y-4'>
              {scheduleType === 'fixed' ? (
                // Fixed mode summary
                <div className='rounded-lg border border-gray-200 bg-white p-4'>
                  <h4 className='mb-3 font-medium text-gray-900'>
                    Tóm tắt lịch thông báo
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {sortedDaySchedules.map(ds => (
                      <span
                        key={ds.dayValue}
                        className='rounded-full bg-gradient-to-r from-[#00bba7]/10 to-[#00bc7d]/10 px-3 py-1.5 text-sm font-medium text-[#00bba7]'
                      >
                        {ds.day}
                      </span>
                    ))}
                  </div>
                  <div className='mt-4 flex items-center gap-2 rounded-lg bg-gray-50 p-3'>
                    <Clock className='h-4 w-4 text-[#00bba7]' />
                    <span className='text-sm text-gray-700'>
                      Thời gian thông báo:{' '}
                      <span className='font-semibold text-gray-900'>
                        {fixedTime}
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                // Flexible mode - per day schedule (single time per day)
                <div className='rounded-lg border border-gray-200 bg-white p-4'>
                  <h4 className='mb-4 font-medium text-gray-900'>
                    Thời gian thông báo theo ngày
                  </h4>
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    {sortedDaySchedules.map(ds => (
                      <div
                        key={ds.dayValue}
                        className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                      >
                        <span className='text-sm font-medium text-gray-700'>
                          {ds.day}
                        </span>
                        <div className='flex items-center gap-2'>
                          <Clock className='h-3.5 w-3.5 text-gray-400' />
                          <TimePicker
                            value={ds.timeSlots[0]?.startTime || '07:00'}
                            onChange={value =>
                              updateTimeSlot(ds.dayValue, value)
                            }
                            disabled={isSubmitting}
                            className='w-28'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Empty state
            <div className='rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center'>
              <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
                <Bell className='h-6 w-6 text-gray-400' />
              </div>
              <p className='text-sm text-gray-500'>
                Chọn các ngày trong tuần để thiết lập lịch thông báo
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className='border-t border-gray-100 px-6 py-4'>
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            disabled={isSubmitting}
            className='border-gray-200 text-gray-700 hover:bg-gray-50'
          >
            Hủy
          </Button>
          <Button
            type='button'
            onClick={handleSave}
            disabled={daySchedules.length === 0 || isSubmitting}
            className='bg-gradient-to-r from-[#00bba7] to-[#00bc7d] text-white shadow-md hover:from-[#00a99a] hover:to-[#00ab71] disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu lịch thông báo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
