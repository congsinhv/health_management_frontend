import { ExerciseItem, WorkoutPlan } from '@/types/prediction';
import { Clock } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface WorkoutPlanSectionProps {
  workoutPlan: WorkoutPlan;
}

const WorkoutPlanSection: React.FC<WorkoutPlanSectionProps> = ({
  workoutPlan,
}) => {
  const [selectedDay, setSelectedDay] = useState(1);

  const currentDayPlan = workoutPlan.weeklyPlans.find(
    plan => plan.day === selectedDay
  );

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
    <div className='space-y-6'>
      <Tabs defaultValue='DAY_1'>
        <div className='flex justify-between'>
          <h2 className='mb-6 flex flex-col pb-4 font-semibold'>
            Kế hoạch tập luyện 7 ngày
            <span className='text-xs font-normal text-[#1E1E1E]'>
              * Thông tin chỉ mang tính tham khảo
            </span>
          </h2>
          <TabsList className='h-auto gap-4 bg-transparent'>
            <TabsTrigger
              value='DAY_1'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>1</span>
            </TabsTrigger>
            <TabsTrigger
              value='DAY_2'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>2</span>
            </TabsTrigger>
            <TabsTrigger
              value='DAY_3'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>3</span>
            </TabsTrigger>
            <TabsTrigger
              value='DAY_4'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>4</span>
            </TabsTrigger>
            <TabsTrigger
              value='DAY_5'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>5</span>
            </TabsTrigger>
            <TabsTrigger
              value='DAY_6'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>6</span>
            </TabsTrigger>
            <TabsTrigger
              value='DAY_7'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>7</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Current Day Info */}
        {[1, 2, 3, 4, 5, 6, 7].map(day => (
          <TabsContent key={day} value={`DAY_${day}`}>
            {currentDayPlan && (
              <div className='space-y-1 rounded-xl border-2 border-[#EFEFEF] p-4'>
                <Badge variant='secondary' className='mb-4 text-sm font-bold'>
                  Tập toàn thân (Full Body Workout) {day}
                </Badge>
                {currentDayPlan.exercises.map((exercise, index) => (
                  <ExerciseCard key={index} exercise={exercise} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Exercise Card Component
interface ExerciseCardProps {
  exercise: ExerciseItem;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  return (
    <p className='text-sm leading-relaxed text-[#1E1E1E] before:mr-2 before:text-[#1E1E1E] before:content-["•"]'>
      {exercise.name}: {exercise.duration} phút ( {exercise.description}{' '}
      {exercise.sets ? `${exercise.sets} sets` : ''}{' '}
      {exercise.reps ? `${exercise.reps} reps` : ''} )
    </p>
  );
};

export default WorkoutPlanSection;
