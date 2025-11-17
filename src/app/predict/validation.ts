import { PredictFormData } from './formHelper';
import { z } from 'zod';

/**
 * Zod schema for form validation
 */
export const predictFormSchema = z.object({
  // Demographics
  name: z.string().min(1, 'Vui lòng nhập tên'),
  gender: z.coerce.number().refine(val => val === 0 || val === 1, 'Vui lòng chọn giới tính'),
  age: z.coerce.number().min(1, 'Tuổi không hợp lệ (1-120)').max(120, 'Tuổi không hợp lệ (1-120)'),
  height: z.coerce.number().min(0.5, 'Chiều cao không hợp lệ (0.5-2.5 m)').max(2.5, 'Chiều cao không hợp lệ (0.5-2.5 m)'),
  weight: z.coerce.number().min(20, 'Cân nặng không hợp lệ (20-300 kg)').max(300, 'Cân nặng không hợp lệ (20-300 kg)'),
  family_history_with_overweight: z.enum(['yes', 'no'], { message: 'Vui lòng chọn tiền sử gia đình' }),

  // Eating habits
  FAVC: z.enum(['yes', 'no'], { message: 'Vui lòng chọn' }),
  SCC: z.coerce.number().refine(val => val >= 1 && val <= 3, 'Vui lòng chọn'),
  FCVC: z.coerce.number().refine(val => val >= 1 && val <= 3, 'Vui lòng chọn'),
  CH2O: z.coerce.number().refine(val => val >= 1 && val <= 3, 'Vui lòng chọn'),
  NCP: z.coerce.number().min(1, 'Số bữa ăn không hợp lệ (1-10)').max(10, 'Số bữa ăn không hợp lệ (1-10)'),
  CAEC: z.coerce.number().refine(val => val >= 0 && val <= 4, 'Vui lòng chọn'),

  // Activity habits
  FAF: z.coerce.number().refine(val => val >= 0 && val <= 3, 'Vui lòng chọn'),
  TUE: z.coerce.number().refine(val => val >= 0 && val <= 2, 'Vui lòng chọn'),
  MTRANS: z.coerce.number().refine(val => val >= 1 && val <= 5, 'Vui lòng chọn'),

  // Other habits
  SMOKE: z.enum(['yes', 'no'], { message: 'Vui lòng chọn' }),
  CALC: z.coerce.number().refine(val => val >= 0 && val <= 4, 'Vui lòng chọn'),
});

export type PredictFormSchema = z.infer<typeof predictFormSchema>;

/**
 * Calculate BMI from height and weight
 */
export const calculateBMI = (height: string, weight: string): number | null => {
  const h = parseFloat(height);
  const w = parseFloat(weight);

  if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
    return null;
  }

  // Convert height from cm to meters
  const heightInMeters = h / 100;
  const bmi = w / (heightInMeters * heightInMeters);

  return Math.round(bmi * 10) / 10;
};

/**
 * Get BMI category
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Thiếu cân';
  if (bmi < 23) return 'Bình thường';
  if (bmi < 25) return 'Thừa cân';
  if (bmi < 30) return 'Béo phì độ I';
  return 'Béo phì độ II';
};

/**
 * Format form data for API submission
 */
export const formatFormDataForAPI = (formData: PredictFormData) => {
  return {
    demographics: {
      name: formData.name,
      gender: formData.gender,
      age: parseInt(formData.age?.toString() || '0'),
      familyHistory: formData.family_history_with_overweight === 'yes',
      height: parseFloat(formData.height?.toString() || '0'),
      weight: parseFloat(formData.weight?.toString() || '0'),
      bmi: calculateBMI(
        formData.height?.toString() || '0',
        formData.weight?.toString() || '0'
      ),
    },
    eatingHabits: {
      highCalorieFood: formData.FAVC === 'yes',
      calorieTracking: formData.SCC === 1,
      vegetableConsumption: formData.FCVC,
      waterIntake: formData.CH2O,
      mainMeals: formData.NCP?.toString() || '0',
      snacking: formData.CAEC?.toString() === 'yes',
    },
    activityHabits: {
      exercise: formData.FAF,
      screenTime: formData.TUE,
      transportation: formData.MTRANS,
    },
    otherHabits: {
      smoking: formData.SMOKE === 'yes',
      alcohol: formData.CALC,
    },
  };
};
