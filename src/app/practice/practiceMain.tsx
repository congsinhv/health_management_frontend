'use client';
import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Dumbbell,
  AlertCircle,
  Save,
  X,
  Plus,
  Trash2,
  ArrowRight,
  CheckCircle,
  Edit,
} from 'lucide-react';

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

interface Exercise {
  id: number;
  type: string;
  duration: number;
  level: string;
}

interface FormData {
  height: string;
  weight: string;
  goalWeight: string;
  goal: string;
  daySchedules: DaySchedule[];
  selectedSports: string[];
  exercises: Exercise[];
  notes: string;
  healthConstraints: string;
}

export default function WorkoutPlanForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    height: '170',
    weight: '70',
    goalWeight: '65',
    goal: 'Giảm cân',
    daySchedules: [
      {
        day: 'Thứ 2',
        timeSlots: [
          {
            id: 1,
            startTime: '06:00',
            endTime: '07:30',
            availableHours: '1.5',
          },
        ],
      },
    ],
    selectedSports: ['Cardio', 'Tạ'],
    exercises: [],
    notes: '',
    healthConstraints: '',
  });

  const daysOfWeek = [
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
    'CN',
  ];
  const exerciseTypes = [
    'Cardio',
    'Yoga',
    'Tạ',
    'Bơi',
    'Chạy bộ',
    'Đạp xe',
    'Aerobic',
    'HIIT',
  ];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const goals = ['Giảm cân', 'Tăng cơ', 'Duy trì'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => {
      const existingSchedule = prev.daySchedules.find(ds => ds.day === day);

      if (existingSchedule) {
        // Remove day
        return {
          ...prev,
          daySchedules: prev.daySchedules.filter(ds => ds.day !== day),
        };
      } else {
        // Add day with default time slot
        return {
          ...prev,
          daySchedules: [
            ...prev.daySchedules,
            {
              day,
              timeSlots: [
                {
                  id: Date.now(),
                  startTime: '06:00',
                  endTime: '07:30',
                  availableHours: '1.5',
                },
              ],
            },
          ],
        };
      }
    });
  };

  const addTimeSlot = (day: string) => {
    setFormData(prev => ({
      ...prev,
      daySchedules: prev.daySchedules.map(ds =>
        ds.day === day
          ? {
              ...ds,
              timeSlots: [
                ...ds.timeSlots,
                {
                  id: Date.now(),
                  startTime: '18:00',
                  endTime: '19:30',
                  availableHours: '1.5',
                },
              ],
            }
          : ds
      ),
    }));
  };

  const removeTimeSlot = (day: string, slotId: number) => {
    setFormData(prev => ({
      ...prev,
      daySchedules: prev.daySchedules.map(ds =>
        ds.day === day
          ? {
              ...ds,
              timeSlots: ds.timeSlots.filter(slot => slot.id !== slotId),
            }
          : ds
      ),
    }));
  };

  const updateTimeSlot = (
    day: string,
    slotId: number,
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      daySchedules: prev.daySchedules.map(ds =>
        ds.day === day
          ? {
              ...ds,
              timeSlots: ds.timeSlots.map(slot =>
                slot.id === slotId ? { ...slot, [field]: value } : slot
              ),
            }
          : ds
      ),
    }));
  };

  const toggleSport = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSports: prev.selectedSports.includes(sport)
        ? prev.selectedSports.filter(s => s !== sport)
        : [...prev.selectedSports, sport],
    }));
  };

  const handleSubmitInfo = () => {
    setIsLoading(true);

    // Simulate loading and generate workout plan
    setTimeout(() => {
      const generatedExercises: Exercise[] = [
        { id: 1, type: 'Cardio', duration: 30, level: 'Intermediate' },
        { id: 2, type: 'Tạ', duration: 45, level: 'Beginner' },
        { id: 3, type: 'Yoga', duration: 20, level: 'Beginner' },
      ];

      setFormData(prev => ({
        ...prev,
        exercises: generatedExercises,
        notes: prev.notes || 'Tập nhẹ vào buổi sáng',
        healthConstraints:
          prev.healthConstraints || 'Không có vấn đề sức khỏe đặc biệt',
      }));

      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleConfirm = () => {
    setStep(3);
  };

  const handleBackToEdit = () => {
    setStep(1);
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now(),
      type: 'Cardio',
      duration: 30,
      level: 'Beginner',
    };
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const removeExercise = (id: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== id),
    }));
  };

  const updateExercise = (id: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === id ? { ...ex, [field]: value } : ex
      ),
    }));
  };

  const handleFinalSave = () => {
    console.log('Lưu kế hoạch cuối cùng:', formData);
    alert('Kế hoạch tập luyện đã được lưu thành công! ✅');
  };

  const calculateBMI = () => {
    if (!formData.height || !formData.weight) return '0.0';
    const heightInMeters = parseFloat(formData.height) / 100;
    return (
      parseFloat(formData.weight) /
      (heightInMeters * heightInMeters)
    ).toFixed(1);
  };

  const getTotalTrainingDays = () => {
    return formData.daySchedules.length;
  };

  const getTotalTimeSlots = () => {
    return formData.daySchedules.reduce(
      (total, ds) => total + ds.timeSlots.length,
      0
    );
  };

  // Step 1: Nhập thông tin
  if (step === 1) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8'>
        <div className='mx-auto max-w-4xl'>
          <div className='mb-6 rounded-2xl bg-white p-8 shadow-xl'>
            <h1 className='mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent'>
              Tạo Kế Hoạch Tập Luyện
            </h1>
            <p className='text-gray-600'>
              Bước 1: Nhập thông tin cơ bản của bạn
            </p>
          </div>

          <div className='space-y-6'>
            {/* Thông tin cơ bản */}
            <div className='rounded-2xl bg-white p-6 shadow-lg'>
              <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-gray-800'>
                <Dumbbell className='h-5 w-5 text-purple-600' />
                Thông tin cơ bản
              </h2>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Chiều cao (cm) <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    value={formData.height}
                    onChange={e => handleInputChange('height', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:border-transparent focus:ring-2 focus:ring-purple-500'
                    placeholder='170'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Cân nặng hiện tại (kg){' '}
                    <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    value={formData.weight}
                    onChange={e => handleInputChange('weight', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:border-transparent focus:ring-2 focus:ring-purple-500'
                    placeholder='70'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Mục tiêu cân nặng (kg){' '}
                    <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    value={formData.goalWeight}
                    onChange={e =>
                      handleInputChange('goalWeight', e.target.value)
                    }
                    className='w-full rounded-lg border border-purple-300 bg-purple-50 px-4 py-3 transition focus:border-transparent focus:ring-2 focus:ring-purple-500'
                    placeholder='65'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Mục tiêu tổng thể <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={formData.goal}
                    onChange={e => handleInputChange('goal', e.target.value)}
                    className='w-full rounded-lg border border-purple-300 bg-purple-50 px-4 py-3 transition focus:border-transparent focus:ring-2 focus:ring-purple-500'
                  >
                    {goals.map(goal => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Thời gian tập luyện */}
            <div className='rounded-2xl bg-white p-6 shadow-lg'>
              <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-gray-800'>
                <Calendar className='h-5 w-5 text-blue-600' />
                Lịch tập luyện trong tuần
              </h2>

              <div className='mb-4'>
                <label className='mb-3 block text-sm font-medium text-gray-700'>
                  Chọn ngày tập <span className='text-red-500'>*</span>
                </label>
                <div className='flex flex-wrap gap-2'>
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      type='button'
                      onClick={() => toggleDay(day)}
                      className={`rounded-lg px-4 py-2 font-medium transition ${
                        formData.daySchedules.some(ds => ds.day === day)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots for each selected day */}
              <div className='space-y-4'>
                {formData.daySchedules.map(daySchedule => (
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
                        className='flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-700'
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
                                Bắt đầu
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
                                Kết thúc
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
                                Thời gian (giờ)
                              </label>
                              <input
                                type='number'
                                step='0.5'
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
                                placeholder='1.5'
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {formData.daySchedules.length === 0 && (
                <div className='rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
                  <Calendar className='mx-auto mb-2 h-12 w-12 text-gray-400' />
                  <p className='text-gray-600'>
                    Chọn các ngày trong tuần để bắt đầu lập lịch tập
                  </p>
                </div>
              )}
            </div>

            {/* Môn thể thao */}
            <div className='rounded-2xl bg-white p-6 shadow-lg'>
              <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-gray-800'>
                <Dumbbell className='h-5 w-5 text-green-600' />
                Môn thể thao yêu thích
              </h2>

              <div className='mb-2'>
                <label className='mb-3 block text-sm font-medium text-gray-700'>
                  Chọn các môn bạn muốn tập{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <div className='flex flex-wrap gap-2'>
                  {exerciseTypes.map(sport => (
                    <button
                      key={sport}
                      type='button'
                      onClick={() => toggleSport(sport)}
                      className={`rounded-lg px-4 py-2 font-medium transition ${
                        formData.selectedSports.includes(sport)
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            <div className='rounded-2xl bg-white p-6 shadow-lg'>
              <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-gray-800'>
                <AlertCircle className='h-5 w-5 text-yellow-600' />
                Ghi chú & Cảnh báo sức khỏe (Tùy chọn)
              </h2>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Ghi chú riêng
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e => handleInputChange('notes', e.target.value)}
                    rows={4}
                    className='w-full rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 transition focus:border-transparent focus:ring-2 focus:ring-yellow-500'
                    placeholder='Ví dụ: Tập nhẹ vào buổi sáng...'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Cảnh báo sức khỏe
                  </label>
                  <textarea
                    value={formData.healthConstraints}
                    onChange={e =>
                      handleInputChange('healthConstraints', e.target.value)
                    }
                    rows={4}
                    className='w-full rounded-lg border border-red-300 bg-red-50 px-4 py-3 transition focus:border-transparent focus:ring-2 focus:ring-red-500'
                    placeholder='Ví dụ: Đau khớp gối, huyết áp cao...'
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end'>
              <button
                type='button'
                onClick={handleSubmitInfo}
                disabled={isLoading || formData.daySchedules.length === 0}
                className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-medium text-white shadow-lg transition hover:from-blue-700 hover:to-purple-700 disabled:opacity-50'
              >
                {isLoading ? (
                  <>
                    <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                    Đang tạo kế hoạch...
                  </>
                ) : (
                  <>
                    Tạo kế hoạch
                    <ArrowRight className='h-5 w-5' />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Xác nhận
  if (step === 2) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8'>
        <div className='mx-auto max-w-4xl'>
          <div className='mb-6 rounded-2xl bg-white p-8 shadow-xl'>
            <h1 className='mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent'>
              Xác Nhận Kế Hoạch
            </h1>
            <p className='text-gray-600'>
              Bước 2: Kiểm tra và chỉnh sửa thông tin trước khi tiếp tục
            </p>
          </div>

          <div className='space-y-6'>
            {/* Thông tin đã nhập */}
            <div className='rounded-2xl bg-white p-6 shadow-lg'>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='flex items-center gap-2 text-xl font-bold text-gray-800'>
                  <CheckCircle className='h-5 w-5 text-green-600' />
                  Thông tin của bạn
                </h2>
                <button
                  type='button'
                  onClick={handleBackToEdit}
                  className='flex items-center gap-2 rounded-lg px-4 py-2 text-blue-600 transition hover:bg-blue-50'
                >
                  <Edit className='h-4 w-4' />
                  Chỉnh sửa
                </button>
              </div>

              <div className='mb-4 grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='rounded-lg bg-purple-50 p-4'>
                  <p className='text-sm text-gray-600'>Chiều cao</p>
                  <p className='text-xl font-bold text-purple-600'>
                    {formData.height} cm
                  </p>
                </div>
                <div className='rounded-lg bg-purple-50 p-4'>
                  <p className='text-sm text-gray-600'>Cân nặng</p>
                  <p className='text-xl font-bold text-purple-600'>
                    {formData.weight} kg
                  </p>
                </div>
                <div className='rounded-lg bg-purple-50 p-4'>
                  <p className='text-sm text-gray-600'>Mục tiêu</p>
                  <p className='text-xl font-bold text-purple-600'>
                    {formData.goalWeight} kg
                  </p>
                </div>
                <div className='rounded-lg bg-green-50 p-4'>
                  <p className='text-sm text-gray-600'>BMI</p>
                  <p className='text-xl font-bold text-green-600'>
                    {calculateBMI()}
                  </p>
                </div>
              </div>

              <div className='mb-4 rounded-lg bg-blue-50 p-4'>
                <p className='mb-3 text-sm font-medium text-gray-700'>
                  Lịch tập trong tuần ({getTotalTrainingDays()} ngày,{' '}
                  {getTotalTimeSlots()} khung giờ)
                </p>
                <div className='space-y-3'>
                  {formData.daySchedules.map(daySchedule => (
                    <div
                      key={daySchedule.day}
                      className='rounded-lg border border-blue-200 bg-white p-3'
                    >
                      <p className='mb-2 font-semibold text-blue-600'>
                        {daySchedule.day}
                      </p>
                      <div className='space-y-1'>
                        {daySchedule.timeSlots.map((slot, index) => (
                          <div
                            key={slot.id}
                            className='flex items-center gap-2 text-sm text-gray-600'
                          >
                            <Clock className='h-4 w-4 text-blue-500' />
                            <span>
                              Khung {index + 1}: {slot.startTime} -{' '}
                              {slot.endTime} ({slot.availableHours}h)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='mb-4 rounded-lg bg-green-50 p-4'>
                <p className='mb-2 text-sm text-gray-600'>Môn thể thao</p>
                <div className='mb-3 flex flex-wrap gap-2'>
                  {formData.selectedSports.map(sport => (
                    <span
                      key={sport}
                      className='rounded-full bg-green-600 px-3 py-1 text-sm font-medium text-white'
                    >
                      {sport}
                    </span>
                  ))}
                </div>
                <div className='flex flex-wrap gap-2'>
                  <p className='mb-1 w-full text-xs text-gray-500'>
                    Thêm/bỏ môn:
                  </p>
                  {exerciseTypes.map(sport => (
                    <button
                      key={sport}
                      type='button'
                      onClick={() => toggleSport(sport)}
                      className={`rounded-lg px-3 py-1 text-sm font-medium transition ${
                        formData.selectedSports.includes(sport)
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Kế hoạch được gợi ý */}
            <div className='rounded-2xl bg-white p-6 shadow-lg'>
              <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-gray-800'>
                <Dumbbell className='h-5 w-5 text-green-600' />
                Kế hoạch tập luyện được gợi ý
              </h2>

              <div className='mb-6 space-y-3'>
                {formData.exercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className='flex items-center justify-between rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-4'
                  >
                    <div className='flex items-center gap-4'>
                      <span className='flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white'>
                        {index + 1}
                      </span>
                      <div>
                        <h3 className='font-semibold text-gray-800'>
                          {exercise.type}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {exercise.duration} phút • {exercise.level}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formData.notes && (
                <div className='mb-4 rounded-lg bg-yellow-50 p-4'>
                  <p className='mb-1 text-sm font-medium text-gray-700'>
                    Ghi chú:
                  </p>
                  <p className='text-gray-600'>{formData.notes}</p>
                </div>
              )}

              {formData.healthConstraints && (
                <div className='rounded-lg bg-red-50 p-4'>
                  <p className='mb-1 text-sm font-medium text-gray-700'>
                    Cảnh báo sức khỏe:
                  </p>
                  <p className='text-gray-600'>{formData.healthConstraints}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex justify-between gap-4'>
              <button
                type='button'
                onClick={handleBackToEdit}
                className='flex items-center gap-2 rounded-xl bg-gray-200 px-6 py-3 font-medium text-gray-700 shadow-md transition hover:bg-gray-300'
              >
                <X className='h-5 w-5' />
                Quay lại chỉnh sửa
              </button>
              <button
                type='button'
                onClick={handleConfirm}
                className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-8 py-3 font-medium text-white shadow-lg transition hover:from-green-700 hover:to-blue-700'
              >
                <CheckCircle className='h-5 w-5' />
                Xác nhận & Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Lịch chi tiết
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-6 rounded-2xl bg-white p-8 shadow-xl'>
          <h1 className='mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent'>
            Lịch Tập Chi Tiết
          </h1>
          <p className='text-gray-600'>
            Bước 3: Tùy chỉnh lịch tập theo ý muốn
          </p>
        </div>

        <div className='space-y-6'>
          {/* Summary Card */}
          <div className='rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-xl'>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
              <div>
                <p className='text-sm text-blue-100'>Mục tiêu</p>
                <p className='text-xl font-bold'>{formData.goal}</p>
              </div>
              <div>
                <p className='text-sm text-blue-100'>BMI</p>
                <p className='text-xl font-bold'>{calculateBMI()}</p>
              </div>
              <div>
                <p className='text-sm text-blue-100'>Ngày tập</p>
                <p className='text-xl font-bold'>
                  {getTotalTrainingDays()} ngày/tuần
                </p>
              </div>
              <div>
                <p className='text-sm text-blue-100'>Khung giờ</p>
                <p className='text-xl font-bold'>{getTotalTimeSlots()} khung</p>
              </div>
              <div>
                <p className='text-sm text-blue-100'>Bài tập</p>
                <p className='text-xl font-bold'>
                  {formData.exercises.length} bài
                </p>
              </div>
            </div>
          </div>

          {/* Lịch theo ngày */}
          <div className='rounded-2xl bg-white p-6 shadow-lg'>
            <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-gray-800'>
              <Calendar className='h-5 w-5 text-blue-600' />
              Lịch tập theo ngày
            </h2>

            <div className='space-y-4'>
              {formData.daySchedules.map(daySchedule => (
                <div
                  key={daySchedule.day}
                  className='rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4'
                >
                  <h3 className='mb-3 text-lg font-bold text-blue-600'>
                    {daySchedule.day}
                  </h3>
                  <div className='space-y-2'>
                    {daySchedule.timeSlots.map((slot, index) => (
                      <div
                        key={slot.id}
                        className='rounded-lg border border-blue-300 bg-white p-3'
                      >
                        <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                          <Clock className='h-4 w-4 text-blue-500' />
                          Khung {index + 1}: {slot.startTime} - {slot.endTime} (
                          {slot.availableHours}h)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lịch tập chi tiết */}
          <div className='rounded-2xl bg-white p-6 shadow-lg'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='flex items-center gap-2 text-xl font-bold text-gray-800'>
                <Dumbbell className='h-5 w-5 text-green-600' />
                Danh sách bài tập
              </h2>
              <button
                type='button'
                onClick={addExercise}
                className='flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-md transition hover:bg-green-700'
              >
                <Plus className='h-4 w-4' />
                Thêm bài tập
              </button>
            </div>

            <div className='space-y-4'>
              {formData.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className='rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-4'
                >
                  <div className='mb-3 flex items-center gap-4'>
                    <span className='flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white'>
                      {index + 1}
                    </span>
                    <h3 className='font-semibold text-gray-800'>
                      Bài tập {index + 1}
                    </h3>
                    {formData.exercises.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeExercise(exercise.id)}
                        className='ml-auto text-red-600 transition hover:text-red-700'
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    )}
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-700'>
                        Môn thể thao
                      </label>
                      <select
                        value={exercise.type}
                        onChange={e =>
                          updateExercise(exercise.id, 'type', e.target.value)
                        }
                        className='w-full rounded-lg border border-green-300 px-4 py-3 transition focus:border-transparent focus:ring-2 focus:ring-green-500'
                      >
                        {exerciseTypes.map(type => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-700'>
                        Thời gian (phút)
                      </label>
                      <input
                        type='number'
                        value={exercise.duration}
                        onChange={e =>
                          updateExercise(
                            exercise.id,
                            'duration',
                            parseInt(e.target.value)
                          )
                        }
                        className='w-full rounded-lg border border-green-300 px-4 py-3 transition focus:border-transparent focus:ring-2 focus:ring-green-500'
                      />
                    </div>
                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-700'>
                        Cường độ
                      </label>
                      <select
                        value={exercise.level}
                        onChange={e =>
                          updateExercise(exercise.id, 'level', e.target.value)
                        }
                        className='w-full rounded-lg border border-green-300 px-4 py-3 transition focus:border-transparent focus:ring-2 focus:ring-green-500'
                      >
                        {levels.map(level => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className='rounded-2xl bg-white p-6 shadow-lg'>
            <h2 className='mb-4 text-xl font-bold text-gray-800'>Ghi chú</h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='rounded-lg bg-yellow-50 p-4'>
                <p className='mb-1 text-sm font-medium text-gray-700'>
                  Ghi chú cá nhân:
                </p>
                <p className='text-gray-600'>{formData.notes || 'Không có'}</p>
              </div>
              <div className='rounded-lg bg-red-50 p-4'>
                <p className='mb-1 text-sm font-medium text-gray-700'>
                  Cảnh báo sức khỏe:
                </p>
                <p className='text-gray-600'>
                  {formData.healthConstraints || 'Không có'}
                </p>
              </div>
            </div>
          </div>

          {/* Final Save */}
          <div className='flex justify-end gap-4'>
            <button
              type='button'
              onClick={() => setStep(2)}
              className='flex items-center gap-2 rounded-xl bg-gray-200 px-6 py-3 font-medium text-gray-700 shadow-md transition hover:bg-gray-300'
            >
              <X className='h-5 w-5' />
              Quay lại
            </button>
            <button
              type='button'
              onClick={handleFinalSave}
              className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-medium text-white shadow-lg transition hover:from-blue-700 hover:to-purple-700'
            >
              <Save className='h-5 w-5' />
              Lưu kế hoạch
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className='mt-6 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white shadow-xl'>
          <h3 className='mb-2 text-lg font-bold'>💡 Lời khuyên</h3>
          <p className='text-green-100'>
            Hãy điều chỉnh kế hoạch phù hợp với thể trạng và lịch trình cá nhân.
            Đảm bảo nghỉ ngơi đủ giữa các buổi tập và duy trì chế độ ăn uống
            khoa học.
          </p>
        </div>
      </div>
    </div>
  );
}
