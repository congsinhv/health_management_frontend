// ===============================
// Predict Form Data Types (Updated)
// ===============================

export interface PredictFormData {
  // Demographics
  name: string;
  gender: 1 | 0 | null; // 1: male, 0: female
  age: number | null;
  height: number | null; // meters
  weight: number | null; // kg
  family_history_with_overweight: 'yes' | 'no' | '';

  // Eating habits
  FAVC: 'yes' | 'no' | ''; //Có thường xuyên ăn thức ăn nhiều calo không
  FCVC: 1 | 2 | 3 | null; // Frequency of vegetables
  NCP: 1 | 2 | 3 | null; // Main meals per day
  CAEC: 0 | 1 | 2 | 3 | 4 | null; // Eating between meals

  // Other habits
  SMOKE: 'yes' | 'no' | '';
  CH2O: 1 | 2 | 3 | null; // Water consumption
  SCC: 1 | 2 | 3 | null; // Calorie monitoring

  // Activity habits
  FAF: 0 | 1 | 2 | 3 | null; // Physical activity frequency
  TUE: 0 | 1 | 2 | null; // Technology usage
  CALC: 0 | 1 | 2 | 3 | 4 | null; // Alcohol consumption
  MTRANS: 1 | 2 | 3 | 4 | 5 | null; // Transportation
}

export const initialFormData: PredictFormData = {
  // Demographics
  name: '',
  gender: null,
  age: null,
  height: null,
  weight: null,
  family_history_with_overweight: '',

  FAVC: '',
  FCVC: null,
  NCP: null,
  CAEC: null,

  SMOKE: '',
  CH2O: null,
  SCC: null,

  FAF: null,
  TUE: null,
  CALC: null,
  MTRANS: null,
};

// ===============================
// Selection Options
// ===============================

export const genderOptions = [
  { label: 'Nam', value: '1' },
  { label: 'Nữ', value: '0' },
];

export const yesNoOptions = [
  { label: 'Có', value: 'yes' },
  { label: 'Không', value: 'no' },
];

export const vegetableOptions = [
  { label: 'Ít', value: '1' },
  { label: 'Bình thường', value: '2' },
  { label: 'Nhiều', value: '3' },
];

export const mainMealsOptions = [
  { label: '1 bữa', value: '1' },
  { label: '2 bữa', value: '2' },
  { label: '3 bữa', value: '3' },
];

export const snackOptions = [
  { label: 'Không bao giờ', value: '0' },
  { label: 'Thỉnh thoảng', value: '1' },
  { label: 'Thường xuyên', value: '2' },
  { label: 'Luôn luôn', value: '3' },
  { label: '—', value: '4' },
];

export const waterIntakeOptions = [
  { label: '1L', value: '1' },
  { label: '2L', value: '2' },
  { label: '3L', value: '3' },
];

export const calorieMonitorOptions = [
  { label: 'Ít', value: '1' },
  { label: 'Bình thường', value: '2' },
  { label: 'Nhiều', value: '3' },
];

export const physicalActivityOptions = [
  { label: 'Không', value: '0' },
  { label: 'Ít', value: '1' },
  { label: 'Vừa phải', value: '2' },
  { label: 'Nhiều', value: '3' },
];

export const screenTimeOptions = [
  { label: 'Ít (<2h)', value: '0' },
  { label: 'Trung bình (2–4h)', value: '1' },
  { label: 'Nhiều (>4h)', value: '2' },
];

export const alcoholOptions = [
  { label: 'Không', value: '0' },
  { label: 'Ít', value: '1' },
  { label: 'Vừa', value: '2' },
  { label: 'Nhiều', value: '3' },
  { label: 'Rất nhiều', value: '4' },
];

export const transportationOptions = [
  { label: 'Ô tô', value: '1' },
  { label: 'Xe máy', value: '2' },
  { label: 'Xe đạp', value: '3' },
  { label: 'Giao thông công cộng', value: '4' },
  { label: 'Đi bộ', value: '5' },
];

// ===============================
// Predict Form Errors Type
// ===============================

export interface FormErrors {
  [key: string]: string;
}
