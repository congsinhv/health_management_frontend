"use client";
import React, { useState } from 'react';
import { Calendar, Clock, Dumbbell, AlertCircle, Save, X, Plus, Trash2, ArrowRight, CheckCircle, Edit } from 'lucide-react';

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
  selectedDays: string[];
  selectedSports: string[];
  startTime: string;
  endTime: string;
  availableHours: string;
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
    selectedDays: ['Thứ 2', 'Thứ 4', 'Thứ 6'],
    selectedSports: ['Cardio', 'Tạ'],
    startTime: '06:00',
    endTime: '07:30',
    availableHours: '1.5',
    exercises: [],
    notes: '',
    healthConstraints: ''
  });

  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
  const exerciseTypes = ['Cardio', 'Yoga', 'Tạ', 'Bơi', 'Chạy bộ', 'Đạp xe', 'Aerobic', 'HIIT'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const goals = ['Giảm cân', 'Tăng cơ', 'Duy trì'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  const toggleSport = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSports: prev.selectedSports.includes(sport)
        ? prev.selectedSports.filter(s => s !== sport)
        : [...prev.selectedSports, sport]
    }));
  };

  const handleSubmitInfo = () => {
    setIsLoading(true);
    
    // Simulate loading and generate workout plan
    setTimeout(() => {
      const generatedExercises: Exercise[] = [
        { id: 1, type: 'Cardio', duration: 30, level: 'Intermediate' },
        { id: 2, type: 'Tạ', duration: 45, level: 'Beginner' },
        { id: 3, type: 'Yoga', duration: 20, level: 'Beginner' }
      ];
      
      setFormData(prev => ({ 
        ...prev, 
        exercises: generatedExercises,
        notes: prev.notes || 'Tập nhẹ vào buổi sáng',
        healthConstraints: prev.healthConstraints || 'Không có vấn đề sức khỏe đặc biệt'
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
      level: 'Beginner'
    };
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };

  const removeExercise = (id: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== id)
    }));
  };

  const updateExercise = (id: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const handleFinalSave = () => {
    console.log('Lưu kế hoạch cuối cùng:', formData);
    alert('Kế hoạch tập luyện đã được lưu thành công! ✅');
  };

  const calculateBMI = () => {
    if (!formData.height || !formData.weight) return '0.0';
    const heightInMeters = parseFloat(formData.height) / 100;
    return (parseFloat(formData.weight) / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Step 1: Nhập thông tin
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Tạo Kế Hoạch Tập Luyện
            </h1>
            <p className="text-gray-600">Bước 1: Nhập thông tin cơ bản của bạn</p>
          </div>

          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-purple-600" />
                Thông tin cơ bản
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chiều cao (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="170"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cân nặng hiện tại (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mục tiêu cân nặng (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.goalWeight}
                    onChange={(e) => handleInputChange('goalWeight', e.target.value)}
                    className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-purple-50"
                    placeholder="65"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mục tiêu tổng thể <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                    className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-purple-50"
                  >
                    {goals.map(goal => (
                      <option key={goal} value={goal}>{goal}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Thời gian tập luyện */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Thời gian tập luyện
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ngày tập trong tuần <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        formData.selectedDays.includes(day)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Thời gian bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-blue-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Thời gian kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-blue-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian rảnh (giờ/ngày) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.availableHours}
                    onChange={(e) => handleInputChange('availableHours', e.target.value)}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-blue-50"
                    placeholder="1.5"
                  />
                </div>
              </div>
            </div>

            {/* Môn thể thao */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-green-600" />
                Môn thể thao yêu thích
              </h2>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Chọn các môn bạn muốn tập <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {exerciseTypes.map(sport => (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => toggleSport(sport)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Ghi chú & Cảnh báo sức khỏe (Tùy chọn)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú riêng
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition bg-yellow-50"
                    placeholder="Ví dụ: Tập nhẹ vào buổi sáng..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cảnh báo sức khỏe
                  </label>
                  <textarea
                    value={formData.healthConstraints}
                    onChange={(e) => handleInputChange('healthConstraints', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-red-50"
                    placeholder="Ví dụ: Đau khớp gối, huyết áp cao..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmitInfo}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-medium shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang tạo kế hoạch...
                  </>
                ) : (
                  <>
                    Tạo kế hoạch
                    <ArrowRight className="w-5 h-5" />
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Xác Nhận Kế Hoạch
            </h1>
            <p className="text-gray-600">Bước 2: Kiểm tra và chỉnh sửa thông tin trước khi tiếp tục</p>
          </div>

          <div className="space-y-6">
            {/* Thông tin đã nhập */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Thông tin của bạn
                </h2>
                <button
                  type="button"
                  onClick={handleBackToEdit}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Chiều cao</p>
                  <p className="text-xl font-bold text-purple-600">{formData.height} cm</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Cân nặng</p>
                  <p className="text-xl font-bold text-purple-600">{formData.weight} kg</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Mục tiêu</p>
                  <p className="text-xl font-bold text-purple-600">{formData.goalWeight} kg</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">BMI</p>
                  <p className="text-xl font-bold text-green-600">{calculateBMI()}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">Ngày tập</p>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedDays.map(day => (
                    <span key={day} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                      {day}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Thời gian: {formData.startTime} - {formData.endTime} ({formData.availableHours}h)
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">Môn thể thao</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.selectedSports.map(sport => (
                    <span key={sport} className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                      {sport}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <p className="text-xs text-gray-500 w-full mb-1">Thêm/bỏ môn:</p>
                  {exerciseTypes.map(sport => (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => toggleSport(sport)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-green-600" />
                Kế hoạch tập luyện được gợi ý
              </h2>
              
              <div className="space-y-3 mb-6">
                {formData.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold text-sm">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-800">{exercise.type}</h3>
                        <p className="text-sm text-gray-600">
                          {exercise.duration} phút • {exercise.level}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formData.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Ghi chú:</p>
                  <p className="text-gray-600">{formData.notes}</p>
                </div>
              )}

              {formData.healthConstraints && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Cảnh báo sức khỏe:</p>
                  <p className="text-gray-600">{formData.healthConstraints}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-between">
              <button
                type="button"
                onClick={handleBackToEdit}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium shadow-md"
              >
                <X className="w-5 h-5" />
                Quay lại chỉnh sửa
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition font-medium shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Lịch Tập Chi Tiết
          </h1>
          <p className="text-gray-600">Bước 3: Tùy chỉnh lịch tập theo ý muốn</p>
        </div>

        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-blue-100 text-sm">Mục tiêu</p>
                <p className="text-xl font-bold">{formData.goal}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">BMI</p>
                <p className="text-xl font-bold">{calculateBMI()}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Ngày tập</p>
                <p className="text-xl font-bold">{formData.selectedDays.length} ngày/tuần</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Thời gian</p>
                <p className="text-xl font-bold">{formData.availableHours}h/ngày</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Bài tập</p>
                <p className="text-xl font-bold">{formData.exercises.length} bài</p>
              </div>
            </div>
          </div>

          {/* Lịch tập chi tiết */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-green-600" />
                Danh sách bài tập
              </h2>
              <button
                type="button"
                onClick={addExercise}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
              >
                <Plus className="w-4 h-4" />
                Thêm bài tập
              </button>
            </div>

            <div className="space-y-4">
              {formData.exercises.map((exercise, index) => (
                <div key={exercise.id} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold text-sm">
                      {index + 1}
                    </span>
                    <h3 className="font-semibold text-gray-800">Bài tập {index + 1}</h3>
                    {formData.exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(exercise.id)}
                        className="ml-auto text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Môn thể thao
                      </label>
                      <select
                        value={exercise.type}
                        onChange={(e) => updateExercise(exercise.id, 'type', e.target.value)}
                        className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      >
                        {exerciseTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian (phút)
                      </label>
                      <input
                        type="number"
                        value={exercise.duration}
                        onChange={(e) => updateExercise(exercise.id, 'duration', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cường độ
                      </label>
                      <select
                        value={exercise.level}
                        onChange={(e) => updateExercise(exercise.id, 'level', e.target.value)}
                        className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      >
                        {levels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ghi chú</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Ghi chú cá nhân:</p>
                <p className="text-gray-600">{formData.notes || 'Không có'}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Cảnh báo sức khỏe:</p>
                <p className="text-gray-600">{formData.healthConstraints || 'Không có'}</p>
              </div>
            </div>
          </div>

          {/* Final Save */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium shadow-md"
            >
              <X className="w-5 h-5" />
              Quay lại
            </button>
            <button
              type="button"
              onClick={handleFinalSave}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-medium shadow-lg"
            >
              <Save className="w-5 h-5" />
              Lưu kế hoạch
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">💡 Lời khuyên</h3>
          <p className="text-green-100">
            Hãy điều chỉnh kế hoạch phù hợp với thể trạng và lịch trình cá nhân. Đảm bảo nghỉ ngơi đủ giữa các buổi tập và duy trì chế độ ăn uống khoa học.
          </p>
        </div>
      </div>
    </div>
  );
}