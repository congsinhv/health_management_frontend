import { PredictFormData, FormErrors } from './formHelper';

/**
 * Validates the entire form and returns errors
 */
export const validateForm = (formData: PredictFormData): FormErrors => {
  const errors: FormErrors = {};

  // Demographics validation
  if (!formData.name?.trim()) {
    errors.name = 'Vui lòng nhập tên';
  }

  if (!formData.gender) {
    errors.gender = 'Vui lòng chọn giới tính';
  }

  if (!formData.age) {
    errors.age = 'Vui lòng nhập tuổi';
  } else {
    const age = parseInt(formData.age.toString());
    if (isNaN(age) || age < 1 || age > 120) {
      errors.age = 'Tuổi không hợp lệ (1-120)';
    }
  }

  if (!formData.height) {
    errors.height = 'Vui lòng nhập chiều cao';
  } else {
    const height = parseFloat(formData.height.toString());
    if (isNaN(height) || height < 50 || height > 250) {
      errors.height = 'Chiều cao không hợp lệ (50-250 cm)';
    }
  }

  if (!formData.weight) {
    errors.weight = 'Vui lòng nhập cân nặng';
  } else {
    const weight = parseFloat(formData.weight.toString());
    if (isNaN(weight) || weight < 20 || weight > 300) {
      errors.weight = 'Cân nặng không hợp lệ (20-300 kg)';
    }
  }

  if (!formData.family_history_with_overweight) {
    errors.family_history_with_overweight = 'Vui lòng chọn tiền sử gia đình';
  }

  // Eating habits validation
  if (!formData.FAVC) {
    errors.FAVC = 'Vui lòng chọn';
  }

  if (!formData.SCC) {
    errors.SCC = 'Vui lòng chọn';
  }

  if (!formData.FCVC) {
    errors.FCVC = 'Vui lòng chọn';
  }

  if (!formData.CH2O) {
    errors.CH2O = 'Vui lòng chọn';
  }

  if (!formData.NCP) {
    errors.NCP = 'Vui lòng nhập số bữa ăn';
  } else {
    const meals = parseInt(formData.NCP.toString());
    if (isNaN(meals) || meals < 1 || meals > 10) {
      errors.NCP = 'Số bữa ăn không hợp lệ (1-10)';
    }
  }

  if (!formData.CAEC) {
    errors.CAEC = 'Vui lòng chọn';
  }

  // Activity habits validation
  if (!formData.FAF) {
    errors.FAF = 'Vui lòng chọn';
  }

  if (!formData.TUE) {
    errors.TUE = 'Vui lòng chọn';
  }

  if (!formData.MTRANS) {
    errors.MTRANS = 'Vui lòng chọn';
  }

  // Other habits validation
  if (!formData.SMOKE) {
    errors.SMOKE = 'Vui lòng chọn';
  }

  if (!formData.CALC) {
    errors.CALC = 'Vui lòng chọn';
  }

  return errors;
};

/**
 * Checks if the form has any errors
 */
export const hasErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

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
