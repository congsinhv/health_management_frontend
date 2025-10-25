'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface MealItem {
  id: number;
  name: string;
  calories: number;
  protein?: number;
  carb?: number;
  fat?: number;
  time: 'Sáng' | 'Trưa' | 'Tối' | 'Snack';
}

interface UserGoal {
  targetCalories: number;
  goalType: 'Giảm cân' | 'Tăng cơ' | 'Duy trì';
}

export default function NutritionMain() {
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [newMeal, setNewMeal] = useState<Partial<MealItem>>({
    time: 'Sáng',
  });

  const [userGoal, setUserGoal] = useState<UserGoal>({
    targetCalories: 2000,
    goalType: 'Duy trì',
  });

  // Tổng calo hiện tại
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  // Thêm món ăn mới
  const addMeal = () => {
    if (!newMeal.name || !newMeal.calories || !newMeal.time) return;
    setMeals([...meals, { ...newMeal, id: Date.now() } as MealItem]);
    setNewMeal({ time: 'Sáng' });
  };

  const removeMeal = (id: number) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  // Gợi ý thực đơn theo mục tiêu
  const mealSuggestions = () => {
    if (userGoal.goalType === 'Giảm cân') {
      return ['Salad rau xanh', 'Ức gà nướng', 'Trứng luộc', 'Súp rau củ'];
    } else if (userGoal.goalType === 'Tăng cơ') {
      return [
        'Ức gà + gạo lứt',
        'Trứng + bánh mì nguyên cám',
        'Sữa protein',
        'Cá hồi',
      ];
    } else {
      return ['Cơm + thịt + rau', 'Canh rau + trứng', 'Sữa chua', 'Trái cây'];
    }
  };

  return (
    <div className='space-y-6 rounded-2xl bg-white p-6 shadow-lg'>
      <h2 className='mb-2 text-2xl font-bold'>🥗 Theo dõi Ăn uống</h2>
      <p className='mb-4 text-gray-600'>
        Nhập các món ăn bạn đã dùng và theo dõi tổng calo so với mục tiêu.
      </p>

      {/* Form nhập món ăn */}
      <div className='grid grid-cols-1 items-end gap-3 md:grid-cols-6'>
        <input
          type='text'
          placeholder='Tên món ăn'
          className='col-span-2 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
          value={newMeal.name || ''}
          onChange={e => setNewMeal({ ...newMeal, name: e.target.value })}
        />
        <input
          type='number'
          placeholder='Calo'
          className='rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
          value={newMeal.calories || ''}
          onChange={e =>
            setNewMeal({ ...newMeal, calories: parseInt(e.target.value) })
          }
        />
        <input
          type='number'
          placeholder='Protein'
          className='rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
          value={newMeal.protein || ''}
          onChange={e =>
            setNewMeal({ ...newMeal, protein: parseInt(e.target.value) })
          }
        />
        <input
          type='number'
          placeholder='Carbs'
          className='rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
          value={newMeal.carb || ''}
          onChange={e =>
            setNewMeal({ ...newMeal, carb: parseInt(e.target.value) })
          }
        />
        <select
          className='rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
          value={newMeal.time || 'Sáng'}
          onChange={e =>
            setNewMeal({ ...newMeal, time: e.target.value as any })
          }
        >
          <option>Sáng</option>
          <option>Trưa</option>
          <option>Tối</option>
          <option>Snack</option>
        </select>
        <button
          className='flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
          onClick={addMeal}
        >
          <Plus className='mr-1 h-4 w-4' />
          Thêm
        </button>
      </div>

      {/* Table liệt kê món ăn */}
      <div className='overflow-x-auto'>
        <table className='w-full border text-left'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='p-2'>Món ăn</th>
              <th className='p-2'>Calo</th>
              <th className='p-2'>Protein</th>
              <th className='p-2'>Carbs</th>
              <th className='p-2'>Fat</th>
              <th className='p-2'>Thời gian</th>
              <th className='p-2'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {meals.map(meal => (
              <tr key={meal.id} className='border-b'>
                <td className='p-2'>{meal.name}</td>
                <td className='p-2'>{meal.calories}</td>
                <td className='p-2'>{meal.protein || 0}</td>
                <td className='p-2'>{meal.carb || 0}</td>
                <td className='p-2'>{meal.fat || 0}</td>
                <td className='p-2'>{meal.time}</td>
                <td className='p-2'>
                  <button
                    onClick={() => removeMeal(meal.id)}
                    className='text-red-600 hover:text-red-800'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tổng calo & mục tiêu */}
      <div className='mt-4 flex items-center justify-between'>
        <p className='font-semibold'>Tổng calo: {totalCalories} kcal</p>
        <p
          className={`font-semibold ${
            totalCalories > userGoal.targetCalories
              ? 'text-red-600'
              : 'text-green-600'
          }`}
        >
          Mục tiêu: {userGoal.targetCalories} kcal ({userGoal.goalType})
        </p>
      </div>

      {/* Gợi ý thực đơn */}
      <div className='mt-4 rounded-xl bg-blue-50 p-4'>
        <h3 className='mb-2 font-bold'>
          Gợi ý thực đơn cho mục tiêu: {userGoal.goalType}
        </h3>
        <ul className='list-inside list-disc'>
          {mealSuggestions().map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
