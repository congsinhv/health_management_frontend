'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { appointmentService } from '@/services/appointmentService';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  availableHours: string;
}

interface DaySchedule {
  day: string;
  timeSlots: TimeSlot[];
}

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (schedules: DaySchedule[], type: 'flexible' | 'fixed') => void;
  predictionId?: string;
}

type ScheduleType = 'flexible' | 'fixed';

export default function AppointmentModal({
  open,
  onOpenChange,
  onSave,
  predictionId: propPredictionId,
}: AppointmentModalProps) {
  const { user } = useAuth(); // Lấy user từ Auth Context
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>([]);
  const [scheduleType, setScheduleType] = useState<ScheduleType>('flexible');
  const [fixedTime, setFixedTime] = useState<string>('08:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = ['T 2', 'T 3', 'T 4', 'T 5', 'T 6', 'T 7', 'CN'];

  const toggleDay = (day: string) => {
    setDaySchedules(prev => {
      const existingSchedule = prev.find(ds => ds.day === day);

      if (existingSchedule) {
        return prev.filter(ds => ds.day !== day);
      } else {
        return [
          ...prev,
          {
            day,
            timeSlots: [
              {
                id: Date.now(),
                startTime: scheduleType === 'fixed' ? fixedTime : '08:00',
                endTime: scheduleType === 'fixed' ? fixedTime : '09:00',
                availableHours: '1',
              },
            ],
          },
        ];
      }
    });
  };

  const addTimeSlot = (day: string) => {
    if (scheduleType === 'fixed') return;

    setDaySchedules(prev =>
      prev.map(ds =>
        ds.day === day
          ? {
              ...ds,
              timeSlots: [
                ...ds.timeSlots,
                {
                  id: Date.now(),
                  startTime: '14:00',
                  endTime: '15:00',
                  availableHours: '1',
                },
              ],
            }
          : ds
      )
    );
  };

  const removeTimeSlot = (day: string, slotId: number) => {
    if (scheduleType === 'fixed') return;

    setDaySchedules(prev =>
      prev.map(ds =>
        ds.day === day
          ? {
              ...ds,
              timeSlots: ds.timeSlots.filter(slot => slot.id !== slotId),
            }
          : ds
      )
    );
  };

  const updateTimeSlot = (
    day: string,
    slotId: number,
    field: string,
    value: string
  ) => {
    setDaySchedules(prev =>
      prev.map(ds =>
        ds.day === day
          ? {
              ...ds,
              timeSlots: ds.timeSlots.map(slot =>
                slot.id === slotId ? { ...slot, [field]: value } : slot
              ),
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
          endTime: time,
        })),
      }))
    );
  };

  const handleScheduleTypeChange = (type: ScheduleType) => {
    setScheduleType(type);
    setDaySchedules([]);
    if (type === 'fixed') {
      setFixedTime('08:00');
    }
  };

  const handleSave = async () => {
    try {
      // Validation cơ bản
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

      // Lấy prediction_id từ props hoặc localStorage
      const predictionId =
        propPredictionId || localStorage.getItem('prediction_id') || '';

      // Lấy user_id từ Auth Context
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

      // Gọi service để gửi lên BE
      const response = await appointmentService.regenerateWeeklyPlan(
        predictionId,
        userId,
        daySchedules,
        scheduleType,
        scheduleType === 'fixed' ? fixedTime : undefined
      );

      // Thành công
      toast.success('Đã tạo lịch thông báo thành công!');

      // Callback cho parent component
      if (onSave) {
        onSave(daySchedules, scheduleType);
      }

      // Reset form và đóng modal
      handleReset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể tạo lịch thông báo'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setDaySchedules([]);
    setFixedTime('08:00');
    setScheduleType('flexible');
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] w-full max-w-[100vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl'>
            <Calendar className='h-6 w-6 text-blue-600' />
            Tạo Lịch Thông Báo
          </DialogTitle>
          <DialogDescription>
            Chọn loại lịch, ngày và thời gian nhận thông báo nhắc nhở
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Alert info */}
          <div className='flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3'>
            <AlertCircle className='mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600' />
            <p className='text-xs text-blue-800'>
              Đây là lịch <strong>thông báo nhắc nhở</strong>, không phải lịch
              tập luyện. Bạn sẽ nhận thông báo vào các thời điểm đã chọn.
            </p>
          </div>

          {/* Tab chọn loại lịch */}
          <div>
            <label className='mb-3 block text-sm font-medium text-gray-700'>
              Loại lịch thông báo <span className='text-red-500'>*</span>
            </label>
            <div className='flex rounded-lg border border-gray-300 bg-gray-100 p-1'>
              <button
                type='button'
                onClick={() => handleScheduleTypeChange('flexible')}
                disabled={isSubmitting}
                className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition ${
                  scheduleType === 'flexible'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                Linh hoạt
              </button>
              <button
                type='button'
                onClick={() => handleScheduleTypeChange('fixed')}
                disabled={isSubmitting}
                className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition ${
                  scheduleType === 'fixed'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                Cố định
              </button>
            </div>
            <p className='mt-2 text-xs text-gray-500'>
              {scheduleType === 'flexible'
                ? 'Có thể đặt nhiều thời điểm thông báo khác nhau trong ngày'
                : 'Một thời điểm cố định cho tất cả các ngày đã chọn'}
            </p>
          </div>

          {/* Thời gian cố định */}
          {scheduleType === 'fixed' && (
            <div>
              <label className='mb-3 block text-sm font-medium text-gray-700'>
                Thời gian thông báo <span className='text-red-500'>*</span>
              </label>
              <div className='w-full max-w-xs'>
                <label className='mb-1 block flex items-center gap-1 text-xs font-medium text-gray-700'>
                  <Clock className='h-3 w-3' />
                  Chọn giờ
                </label>
                <input
                  type='time'
                  value={fixedTime}
                  onChange={e => updateFixedTime(e.target.value)}
                  disabled={isSubmitting}
                  className='w-full cursor-pointer rounded-lg border border-blue-300 px-3 py-2 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
                />
              </div>
            </div>
          )}

          {/* Chọn ngày */}
          <div>
            <label className='mb-3 block text-sm font-medium text-gray-700'>
              Chọn ngày <span className='text-red-500'>*</span>
            </label>
            <div className='flex flex-wrap gap-2'>
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  type='button'
                  onClick={() => toggleDay(day)}
                  disabled={isSubmitting}
                  className={`cursor-pointer rounded-lg px-4 py-2 font-medium transition ${
                    daySchedules.some(ds => ds.day === day)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Hiển thị lịch đã chọn */}
          {daySchedules.length > 0 ? (
            <div className='space-y-4'>
              {scheduleType === 'fixed' ? (
                // Fixed mode
                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-800'>
                    Các ngày đã chọn
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {daySchedules.map(daySchedule => (
                      <div
                        key={daySchedule.day}
                        className='rounded-lg border border-blue-300 bg-white px-3 py-2'
                      >
                        <span className='text-sm font-medium text-gray-700'>
                          {daySchedule.day}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className='mt-3 rounded-lg border border-blue-300 bg-white p-3'>
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 text-blue-600' />
                      <span className='text-sm font-medium text-gray-700'>
                        Thời gian thông báo: <strong>{fixedTime}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // Flexible mode
                daySchedules.map(daySchedule => (
                  <div
                    key={daySchedule.day}
                    className='rounded-lg border border-blue-200 bg-blue-50 p-4'
                  >
                    <div className='mb-3 flex items-center justify-between'>
                      <h3 className='font-semibold text-gray-800'>
                        {daySchedule.day}
                      </h3>
                      <button
                        type='button'
                        onClick={() => addTimeSlot(daySchedule.day)}
                        disabled={isSubmitting}
                        className='flex cursor-pointer items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        <Plus className='h-4 w-4' />
                        Thêm giờ
                      </button>
                    </div>

                    <div className='space-y-3'>
                      {daySchedule.timeSlots.map((slot, index) => (
                        <div
                          key={slot.id}
                          className='rounded-lg border border-blue-300 bg-white p-3'
                        >
                          <div className='mb-2 flex items-center justify-between'>
                            <span className='text-sm font-medium text-gray-700'>
                              Thông báo lần {index + 1}
                            </span>
                            {daySchedule.timeSlots.length > 1 && (
                              <button
                                type='button'
                                onClick={() =>
                                  removeTimeSlot(daySchedule.day, slot.id)
                                }
                                disabled={isSubmitting}
                                className='cursor-pointe text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50'
                              >
                                <Trash2 className='h-4 w-4' />
                              </button>
                            )}
                          </div>
                          <div className='w-full max-w-xs'>
                            <label className='mb-1 block flex items-center gap-1 text-xs font-medium text-gray-700'>
                              <Clock className='h-3 w-3' />
                              Thời gian
                            </label>
                            <input
                              type='time'
                              value={slot.startTime}
                              onChange={e =>
                                updateTimeSlot(
                                  daySchedule.day,
                                  slot.id,
                                  'startTime',
                                  e.target.value
                                )
                              }
                              disabled={isSubmitting}
                              className='w-full cursor-pointer rounded-lg border border-blue-300 px-3 py-2 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className='rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
              <Calendar className='mx-auto mb-2 h-12 w-12 text-gray-400' />
              <p className='text-gray-600'>
                Chọn các ngày trong tuần để bắt đầu đặt lịch thông báo
              </p>
            </div>
          )}
        </div>

        <DialogFooter className='gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            disabled={isSubmitting}
            className='flex items-center gap-2'
          >
            Hủy
          </Button>
          <Button
            type='button'
            onClick={handleSave}
            disabled={daySchedules.length === 0 || isSubmitting}
            className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <Save className='h-4 w-4' />
            {isSubmitting ? 'Đang lưu...' : 'Lưu lịch thông báo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
