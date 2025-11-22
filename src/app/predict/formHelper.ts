// ===============================
// Predict Form Data Types (Updated)
// ===============================

// Import the schema type from validation - this ensures type safety
import type { PredictFormSchema } from './validation';

// Use the Zod-inferred type as the source of truth
export type PredictFormData = PredictFormSchema;

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
