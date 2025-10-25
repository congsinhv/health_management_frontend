"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface MealItem {
  id: number;
  name: string;
  calories: number;
  protein?: number;
  carb?: number;
  fat?: number;
  time: "Sáng" | "Trưa" | "Tối" | "Snack";
}

interface UserGoal {
  targetCalories: number;
  goalType: "Giảm cân" | "Tăng cơ" | "Duy trì";
}

export default function NutritionMain() {
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [newMeal, setNewMeal] = useState<Partial<MealItem>>({
    time: "Sáng",
  });

  const [userGoal, setUserGoal] = useState<UserGoal>({
    targetCalories: 2000,
    goalType: "Duy trì",
  });

  // Tổng calo hiện tại
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  // Thêm món ăn mới
  const addMeal = () => {
    if (!newMeal.name || !newMeal.calories || !newMeal.time) return;
    setMeals([
      ...meals,
      { ...newMeal, id: Date.now() } as MealItem
    ]);
    setNewMeal({ time: "Sáng" });
  };

  const removeMeal = (id: number) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  // Gợi ý thực đơn theo mục tiêu
  const mealSuggestions = () => {
    if (userGoal.goalType === "Giảm cân") {
      return ["Salad rau xanh", "Ức gà nướng", "Trứng luộc", "Súp rau củ"];
    } else if (userGoal.goalType === "Tăng cơ") {
      return ["Ức gà + gạo lứt", "Trứng + bánh mì nguyên cám", "Sữa protein", "Cá hồi"];
    } else {
      return ["Cơm + thịt + rau", "Canh rau + trứng", "Sữa chua", "Trái cây"];
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-2">🥗 Theo dõi Ăn uống</h2>
      <p className="text-gray-600 mb-4">
        Nhập các món ăn bạn đã dùng và theo dõi tổng calo so với mục tiêu.
      </p>

      {/* Form nhập món ăn */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <input
          type="text"
          placeholder="Tên món ăn"
          className="col-span-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={newMeal.name || ""}
          onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Calo"
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={newMeal.calories || ""}
          onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Protein"
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={newMeal.protein || ""}
          onChange={(e) => setNewMeal({ ...newMeal, protein: parseInt(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Carbs"
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={newMeal.carb || ""}
          onChange={(e) => setNewMeal({ ...newMeal, carb: parseInt(e.target.value) })}
        />
        <select
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={newMeal.time || "Sáng"}
          onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value as any })}
        >
          <option>Sáng</option>
          <option>Trưa</option>
          <option>Tối</option>
          <option>Snack</option>
        </select>
        <button
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          onClick={addMeal}
        >
          <Plus className="w-4 h-4 mr-1" />
          Thêm
        </button>
      </div>

      {/* Table liệt kê món ăn */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Món ăn</th>
              <th className="p-2">Calo</th>
              <th className="p-2">Protein</th>
              <th className="p-2">Carbs</th>
              <th className="p-2">Fat</th>
              <th className="p-2">Thời gian</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {meals.map(meal => (
              <tr key={meal.id} className="border-b">
                <td className="p-2">{meal.name}</td>
                <td className="p-2">{meal.calories}</td>
                <td className="p-2">{meal.protein || 0}</td>
                <td className="p-2">{meal.carb || 0}</td>
                <td className="p-2">{meal.fat || 0}</td>
                <td className="p-2">{meal.time}</td>
                <td className="p-2">
                  <button
                    onClick={() => removeMeal(meal.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tổng calo & mục tiêu */}
      <div className="flex justify-between items-center mt-4">
        <p className="font-semibold">Tổng calo: {totalCalories} kcal</p>
        <p
          className={`font-semibold ${
            totalCalories > userGoal.targetCalories ? "text-red-600" : "text-green-600"
          }`}
        >
          Mục tiêu: {userGoal.targetCalories} kcal ({userGoal.goalType})
        </p>
      </div>

      {/* Gợi ý thực đơn */}
      <div className="bg-blue-50 p-4 rounded-xl mt-4">
        <h3 className="font-bold mb-2">Gợi ý thực đơn cho mục tiêu: {userGoal.goalType}</h3>
        <ul className="list-disc list-inside">
          {mealSuggestions().map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
