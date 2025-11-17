import React, { useState } from 'react';
import { DietPlan, DailyMealPlan, MealItem } from '@/types/prediction';
import { Utensils, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DietPlanSectionProps {
  dietPlan: DietPlan;
}

const DietPlanSection: React.FC<DietPlanSectionProps> = ({ dietPlan }) => {
  const [selectedDay, setSelectedDay] = useState(1);

  const currentDayPlan = dietPlan.weeklyPlans.find((plan) => plan.day === selectedDay);

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

      {/* Current Day Label */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Ngày {selectedDay} - Tổng: {currentDayPlan?.totalCalories || 0} kcal
        </h3>
      </div>

      {/* Meal Plan Grid */}
      {currentDayPlan && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Breakfast */}
          <MealColumn
            title="Bữa sáng"
            icon={<Utensils className="w-5 h-5" />}
            meals={currentDayPlan.breakfast}
            color="#FCD34D"
          />

          {/* Lunch */}
          <MealColumn
            title="Bữa trưa"
            icon={<Utensils className="w-5 h-5" />}
            meals={currentDayPlan.lunch}
            color="#FB923C"
          />

          {/* Dinner */}
          <MealColumn
            title="Bữa tối"
            icon={<Utensils className="w-5 h-5" />}
            meals={currentDayPlan.dinner}
            color="#A78BFA"
          />
        </div>
      )}

      {/* Recommended Foods */}
      {dietPlan.recommendedFoods.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-sm font-semibold text-green-900 mb-2">
            Thực phẩm nên ăn
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {dietPlan.recommendedFoods.map((food, index) => (
              <li key={index} className="text-sm text-green-800">
                {food}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Foods to Limit */}
      {dietPlan.foodsToLimit.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-sm font-semibold text-red-900 mb-2">
            Thực phẩm nên hạn chế
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {dietPlan.foodsToLimit.map((food, index) => (
              <li key={index} className="text-sm text-red-800">
                {food}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <span className="font-medium">* Lưu ý:</span> {dietPlan.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

// Meal Column Component
interface MealColumnProps {
  title: string;
  icon: React.ReactNode;
  meals: MealItem[];
  color: string;
}

const MealColumn: React.FC<MealColumnProps> = ({ title, icon, meals, color }) => {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}40` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-xs text-gray-600">{totalCalories} kcal</p>
        </div>
      </div>

      {/* Meal Items */}
      <div className="space-y-3">
        {meals.map((meal, index) => (
          <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex justify-between items-start mb-1">
              <h5 className="text-sm font-medium text-gray-900">{meal.name}</h5>
              <span className="text-xs font-semibold text-[#4FD1C5]">
                {meal.calories} kcal
              </span>
            </div>
            {meal.description && (
              <p className="text-xs text-gray-600">{meal.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietPlanSection;

