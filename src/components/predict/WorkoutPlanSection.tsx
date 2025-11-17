import React, { useState } from 'react';
import { WorkoutPlan, DailyWorkoutPlan, ExerciseItem } from '@/types/prediction';
import { Dumbbell, Clock, AlertCircle } from 'lucide-react';

interface WorkoutPlanSectionProps {
  workoutPlan: WorkoutPlan;
}

const WorkoutPlanSection: React.FC<WorkoutPlanSectionProps> = ({ workoutPlan }) => {
  const [selectedDay, setSelectedDay] = useState(1);

  const currentDayPlan = workoutPlan.weeklyPlans.find((plan) => plan.day === selectedDay);

  // Get difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    const colorMap: Record<string, string> = {
      easy: '#10B981',
      medium: '#F59E0B',
      hard: '#EF4444',
    };
    return colorMap[difficulty] || '#6B7280';
  };

  // Get difficulty label
  const getDifficultyLabel = (difficulty: string): string => {
    const labelMap: Record<string, string> = {
      easy: 'Dễ',
      medium: 'Trung bình',
      hard: 'Khó',
    };
    return labelMap[difficulty] || difficulty;
  };

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`w-12 h-12 rounded-full font-semibold transition-all ${
              selectedDay === day
                ? 'bg-[#4FD1C5] text-white shadow-lg scale-110'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Current Day Info */}
      {currentDayPlan && (
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Ngày {selectedDay}
          </h3>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">{currentDayPlan.totalDuration}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getDifficultyColor(currentDayPlan.difficulty) }}
              />
              <span className="text-gray-700">
                Độ khó: {getDifficultyLabel(currentDayPlan.difficulty)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Exercise List */}
      {currentDayPlan && (
        <div className="space-y-4">
          {currentDayPlan.exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} index={index} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <span className="font-medium">* Lưu ý:</span> {workoutPlan.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

// Exercise Card Component
interface ExerciseCardProps {
  exercise: ExerciseItem;
  index: number;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => {
  return (
    <div className="bg-gradient-to-r from-[#E6F7F5] to-white rounded-lg p-4 border border-[#4FD1C5]/20 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Exercise Number */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#4FD1C5] text-white flex items-center justify-center font-semibold">
            {index + 1}
          </div>
        </div>

        {/* Exercise Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-base font-semibold text-gray-900">{exercise.name}</h4>
            <Dumbbell className="w-5 h-5 text-[#4FD1C5] flex-shrink-0" />
          </div>

          {/* Exercise Metrics */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
            {exercise.sets && exercise.reps && (
              <span className="flex items-center gap-1">
                <span className="font-medium">{exercise.sets} sets</span>
                <span>×</span>
                <span className="font-medium">{exercise.reps} reps</span>
              </span>
            )}
            {exercise.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{exercise.duration}</span>
              </span>
            )}
          </div>

          {/* Exercise Description */}
          {exercise.description && (
            <p className="text-sm text-gray-700">{exercise.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanSection;

