import { DietPlan, MealItem } from '@/types/prediction';
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface DietPlanSectionProps {
  dietPlan: DietPlan;
}

const DietPlanSection: React.FC<DietPlanSectionProps> = ({ dietPlan }) => {
  const [selectedDay, setSelectedDay] = useState(1);

  const currentDayPlan = dietPlan.weeklyPlans.find(
    plan => plan.day === selectedDay
  );

  return (
    <div className='space-y-4'>
      <Tabs
        defaultValue='DAY_1'
        onValueChange={value => setSelectedDay(parseInt(value.split('_')[1]))}
      >
        <div className='flex justify-between'>
          <h2 className='mb-6 flex flex-col pb-4 font-semibold'>
            Chế độ ăn uống đề xuất cho bạn
            <span className='text-xs font-normal text-[#1E1E1E]'>
              * Thông tin chỉ mang tính tham khảo
            </span>
          </h2>
          <TabsList className='h-auto gap-4 bg-transparent'>
            <TabsTrigger
              value='DAY_1'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 transition duration-300 ease-in-out hover:border-[#1E1E1E] data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>1</span>
            </TabsTrigger>
            <TabsTrigger
              value='DAY_2'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 transition duration-300 ease-in-out hover:border-[#1E1E1E] data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>2</span>
            </TabsTrigger>
            <TabsTrigger
              value='DAY_3'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 transition duration-300 ease-in-out hover:border-[#1E1E1E] data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>3</span>
            </TabsTrigger>
            <TabsTrigger
              value='DAY_4'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 transition duration-300 ease-in-out hover:border-[#1E1E1E] data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>4</span>
            </TabsTrigger>
            <TabsTrigger
              value='DAY_5'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 transition duration-300 ease-in-out hover:border-[#1E1E1E] data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>5</span>
            </TabsTrigger>
            <TabsTrigger
              value='DAY_6'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 transition duration-300 ease-in-out hover:border-[#1E1E1E] data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>6</span>
            </TabsTrigger>
            <TabsTrigger
              value='DAY_7'
              className='flex flex-col items-center gap-2 rounded-full border border-[#EFEFEF] bg-transparent px-2 py-4 transition duration-300 ease-in-out hover:border-[#1E1E1E] data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white'
            >
              <span className='text-xs'>Ngày</span>
              <span className='text-sm'>7</span>
            </TabsTrigger>
          </TabsList>
        </div>
        {[1, 2, 3, 4, 5, 6, 7].map(day => (
          <TabsContent key={day} value={`DAY_${day}`}>
            {currentDayPlan && (
              <div className='grid grid-cols-3 gap-4'>
                <MealColumn
                  title='Buổi sáng'
                  meals={currentDayPlan.breakfast}
                />
                <MealColumn title='Buổi Trưa' meals={currentDayPlan.lunch} />
                <MealColumn title='Buổi tối' meals={currentDayPlan.dinner} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Recommended Foods */}
      {currentDayPlan?.recommendedFoods && (
        <div className='bg-[#F9FAFA] p-4'>
          <h4 className='mb-2 text-sm font-semibold text-[#1E1E1E]'>
            Loại thực phẩm nên ăn
          </h4>
          <p className='text-sm text-[#1E1E1E]'>
            {currentDayPlan.recommendedFoods}
          </p>
        </div>
      )}

      {/* Foods to Limit */}
      {currentDayPlan?.foodsToLimit && (
        <div className='rounded-b-2xl bg-[#F9FAFA] p-4'>
          <h4 className='mb-2 text-sm font-semibold text-[#1E1E1E]'>
            Loại thực phẩm cần hạn chế
          </h4>
          <p className='text-sm text-[#1E1E1E]'>
            {currentDayPlan.foodsToLimit}
          </p>
        </div>
      )}
    </div>
  );
};

// Meal Column Component
interface MealColumnProps {
  title: string;
  meals: MealItem[];
}

const MealColumn: React.FC<MealColumnProps> = ({ title, meals }) => {
  return (
    <div className='rounded-2xl border-2 border-[#EFEFEF] bg-white p-4'>
      {/* Column Header */}
      <div className='mb-2 flex items-center gap-2'>
        <div className='flex-1'>
          <Badge variant='secondary'>{title}</Badge>
        </div>
      </div>

      {/* Meal Items */}
      <ul className='text-sm text-[#1E1E1E]'>
        {meals.map((meal, index) => (
          <li
            key={index}
            className='ml-2 leading-relaxed before:mr-2 before:text-[#1E1E1E] before:content-["•"]'
          >
            {meal.count} {meal.unit} {meal.name} ({meal.calories} kcal)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DietPlanSection;
