import { z } from 'zod';

/**
 * Zod schema for form validation
 */
export const predictFormSchema = z.object({
  // Demographics
  name: z.string({ error: 'Vui lòng nhập tên' }).min(1, 'Vui lòng nhập tên'),
  gender: z.coerce
    .number({ error: 'Vui lòng chọn giới tính' })
    .refine(val => val === 0 || val === 1, 'Vui lòng chọn giới tính'),
  age: z.coerce
    .number({ error: 'Tuổi không hợp lệ (1-120)' })
    .min(1, 'Tuổi không hợp lệ (1-120)')
    .max(120, 'Tuổi không hợp lệ (1-120)'),
  height: z.coerce
    .number({ error: 'Chiều cao không hợp lệ (0.5-2.5 m)' })
    .min(0.5, 'Chiều cao không hợp lệ (0.5-2.5 m)')
    .max(2.5, 'Chiều cao không hợp lệ (0.5-2.5 m)'),
  weight: z.coerce
    .number({ error: 'Cân nặng không hợp lệ (20-300 kg)' })
    .min(20, 'Cân nặng không hợp lệ (20-300 kg)')
    .max(300, 'Cân nặng không hợp lệ (20-300 kg)'),
  family_history_with_overweight: z
    .enum(['', 'yes', 'no'], { error: 'Vui lòng chọn tiền sử gia đình' })
    .refine(val => val !== '', {
      message: 'Vui lòng chọn tiền sử gia đình',
    }),

  // Eating habits
  FAVC: z
    .enum(['', 'yes', 'no'], { error: 'Vui lòng chọn thói quen ăn uống' })
    .refine(val => val !== '', { message: 'Vui lòng chọn thói quen ăn uống' }),
  SCC: z.coerce
    .number({ error: 'Vui lòng chọn số lần theo dõi calo' })
    .refine(val => val >= 1 && val <= 3, 'Vui lòng chọn số lần theo dõi calo'),
  FCVC: z.coerce
    .number({ error: 'Vui lòng chọn số lần ăn rau củ' })
    .refine(val => val >= 1 && val <= 3, 'Vui lòng chọn số lần ăn rau củ'),
  CH2O: z.coerce
    .number({ error: 'Vui lòng chọn số lần uống nước' })
    .refine(val => val >= 1 && val <= 3, 'Vui lòng chọn số lần uống nước'),
  NCP: z.coerce
    .number({ error: 'Số bữa ăn không hợp lệ (1-10)' })
    .min(1, 'Số bữa ăn không hợp lệ (1-10)')
    .max(10, 'Số bữa ăn không hợp lệ (1-10)'),
  CAEC: z.coerce
    .number({ error: 'Vui lòng chọn số lần ăn vặt' })
    .refine(val => val >= 0 && val <= 4, 'Vui lòng chọn số lần ăn vặt'),

  // Activity habits
  FAF: z.coerce
    .number({ error: 'Vui lòng chọn số lần tập thể dục' })
    .refine(val => val >= 0 && val <= 3, 'Vui lòng chọn số lần tập thể dục'),
  TUE: z.coerce
    .number({ error: 'Vui lòng chọn số lần sử dụng thiết bị điện tử' })
    .refine(
      val => val >= 0 && val <= 2,
      'Vui lòng chọn số lần sử dụng thiết bị điện tử'
    ),
  MTRANS: z.coerce
    .number({ error: 'Vui lòng chọn phương tiện di chuyển' })
    .refine(val => val >= 1 && val <= 5, 'Vui lòng chọn phương tiện di chuyển'),

  // Other habits
  SMOKE: z
    .enum(['', 'yes', 'no'], { error: 'Vui lòng chọn hút thuốc' })
    .refine(val => val !== '', { message: 'Vui lòng chọn hút thuốc' }),
  CALC: z.coerce
    .number({ error: 'Vui lòng chọn sử dụng thức uống có cồn' })
    .refine(
      val => val >= 0 && val <= 4,
      'Vui lòng chọn sử dụng thức uống có cồn'
    ),
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
export const formatFormDataForAPI = (formData: PredictFormSchema) => {
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
      snacking: formData.CAEC, // CAEC is numeric (0-4), not yes/no
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
