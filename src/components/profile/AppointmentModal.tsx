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
import { Calendar, Clock, Plus, Trash2, Save } from 'lucide-react';

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
  onSave: (schedules: DaySchedule[], type: 'flexible' | 'fixed') => void;
}

type ScheduleType = 'flexible' | 'fixed';

export default function AppointmentModal({
  open,
  onOpenChange,
  onSave,
}: AppointmentModalProps) {
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>([]);
  const [scheduleType, setScheduleType] = useState<ScheduleType>('flexible');
  const [fixedTime, setFixedTime] = useState<string>('08:00'); // Thời gian cố định cho tất cả các ngày

  const daysOfWeek = [
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
    'CN',
  ];

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
                endTime: scheduleType === 'fixed' ? '' : '09:00',
                availableHours: scheduleType === 'fixed' ? '' : '1',
              },
            ],
          },
        ];
      }
    });
  };

  const addTimeSlot = (day: string) => {
    if (scheduleType === 'fixed') return; // Không cho phép thêm slot với lịch cố định

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
    if (scheduleType === 'fixed') return; // Không cho phép xóa với lịch cố định

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

  // Cập nhật thời gian cố định cho tất cả các ngày
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

  const handleScheduleTypeChange = (type: ScheduleType) => {
    setScheduleType(type);
    // Reset schedules khi đổi type
    setDaySchedules([]);
    if (type === 'fixed') {
      setFixedTime('08:00');
    }
  };

  const handleSave = () => {
    if (daySchedules.length === 0) {
      alert('Vui lòng chọn ít nhất một ngày');
      return;
    }

    if (scheduleType === 'fixed' && !fixedTime) {
      alert('Vui lòng nhập thời gian');
      return;
    }

    if (scheduleType === 'flexible') {
      for (const schedule of daySchedules) {
        for (const slot of schedule.timeSlots) {
          if (!slot.startTime || !slot.endTime) {
            alert('Vui lòng nhập đầy đủ thời gian');
            return;
          }
        }
      }
    }

    onSave(daySchedules, scheduleType);
    setDaySchedules([]);
    setFixedTime('08:00');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setDaySchedules([]);
    setFixedTime('08:00');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl'>
            <Calendar className='h-6 w-6 text-blue-600' />
            Tạo Lịch Hẹn
          </DialogTitle>
          <DialogDescription>
            Chọn loại lịch, ngày và thời gian cho lịch hẹn của bạn
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Tab chọn loại lịch */}
          <div>
            <label className='mb-3 block text-sm font-medium text-gray-700'>
              Loại lịch hẹn <span className='text-red-500'>*</span>
            </label>
            <div className='flex rounded-lg border border-gray-300 bg-gray-100 p-1'>
              <button
                type='button'
                onClick={() => handleScheduleTypeChange('flexible')}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
                  scheduleType === 'flexible'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Linh hoạt
              </button>
              <button
                type='button'
                onClick={() => handleScheduleTypeChange('fixed')}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
                  scheduleType === 'fixed'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Cố định
              </button>
            </div>
            <p className='mt-2 text-xs text-gray-500'>
              {scheduleType === 'flexible'
                ? 'Có thể thêm nhiều khung giờ trong ngày'
                : 'Chỉ một thời gian cố định cho tất cả các ngày'}
            </p>
          </div>

          {/* Thời gian cố định */}
          {scheduleType === 'fixed' && (
            <div>
              <label className='mb-3 block text-sm font-medium text-gray-700'>
                Thời gian cố định <span className='text-red-500'>*</span>
              </label>
              <div className='w-full max-w-xs'>
                <label className='mb-1 block flex items-center gap-1 text-xs font-medium text-gray-700'>
                  <Clock className='h-3 w-3' />
                  Thời gian
                </label>
                <input
                  type='time'
                  value={fixedTime}
                  onChange={e => updateFixedTime(e.target.value)}
                  className='w-full rounded-lg border border-blue-300 px-3 py-2 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
          )}

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
                  className={`rounded-lg px-4 py-2 font-medium transition ${
                    daySchedules.some(ds => ds.day === day)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {daySchedules.length > 0 ? (
            <div className='space-y-4'>
              {scheduleType === 'fixed' ? (
                // Hiển thị danh sách ngày đã chọn cho lịch cố định
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
                    <span className='text-sm font-medium text-gray-700'>
                      Thời gian: {fixedTime}
                    </span>
                  </div>
                </div>
              ) : (
                // Hiển thị chi tiết cho từng ngày với lịch linh hoạt
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
                        className='flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700'
                      >
                        <Plus className='h-4 w-4' />
                        Thêm khung giờ
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
                              Khung giờ {index + 1}
                            </span>
                            {daySchedule.timeSlots.length > 1 && (
                              <button
                                type='button'
                                onClick={() =>
                                  removeTimeSlot(daySchedule.day, slot.id)
                                }
                                className='text-red-600 transition hover:text-red-700'
                              >
                                <Trash2 className='h-4 w-4' />
                              </button>
                            )}
                          </div>
                          <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                            <div>
                              <label className='mb-1 block flex items-center gap-1 text-xs font-medium text-gray-700'>
                                <Clock className='h-3 w-3' />
                                Giờ bắt đầu
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
                                className='w-full rounded-lg border border-blue-300 px-3 py-2 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500'
                              />
                            </div>
                            <div>
                              <label className='mb-1 block flex items-center gap-1 text-xs font-medium text-gray-700'>
                                <Clock className='h-3 w-3' />
                                Giờ kết thúc
                              </label>
                              <input
                                type='time'
                                value={slot.endTime}
                                onChange={e =>
                                  updateTimeSlot(
                                    daySchedule.day,
                                    slot.id,
                                    'endTime',
                                    e.target.value
                                  )
                                }
                                className='w-full rounded-lg border border-blue-300 px-3 py-2 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500'
                              />
                            </div>
                            <div>
                              <label className='mb-1 block text-xs font-medium text-gray-700'>
                                Số giờ khả dụng
                              </label>
                              <input
                                type='number'
                                min='1'
                                value={slot.availableHours}
                                onChange={e =>
                                  updateTimeSlot(
                                    daySchedule.day,
                                    slot.id,
                                    'availableHours',
                                    e.target.value
                                  )
                                }
                                className='w-full rounded-lg border border-blue-300 px-3 py-2 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500'
                              />
                            </div>
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
                Chọn các ngày trong tuần để bắt đầu tạo lịch hẹn
              </p>
            </div>
          )}
        </div>

        <DialogFooter className='gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            className='flex items-center gap-2'
          >
            Hủy
          </Button>
          <Button
            type='button'
            onClick={handleSave}
            disabled={daySchedules.length === 0}
            className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          >
            <Save className='h-4 w-4' />
            Lưu lịch hẹn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
