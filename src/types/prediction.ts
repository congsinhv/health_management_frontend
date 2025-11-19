/**
 * Prediction Result Types
 * Type definitions for health prediction results page
 */

// ===============================
// Prediction Result Levels
// ===============================

export type PredictionLevel =
  | 'Insufficient_Weight'
  | 'Normal_Weight'
  | 'Overweight_Level_I'
  | 'Overweight_Level_II'
  | 'Obesity_Type_I'
  | 'Obesity_Type_II'
  | 'Obesity_Type_III';

export interface PredictionResult {
  level: PredictionLevel;
  confidence: number; // 0-100 percentage
  bmi: number;
  status: string; // Display text like "Normal Weight"
  reliability: 'high' | 'medium' | 'low';
}

// ===============================
// Health Metrics
// ===============================

export interface HealthMetric {
  label: string;
  value: number;
  unit: string;
  icon?: string;
}

export interface HealthMetrics {
  weight: HealthMetric;
  bmi: HealthMetric;
  height: HealthMetric;
}

// ===============================
// Health Analysis
// ===============================

export interface HealthAnalysis {
  paragraphs: string[];
}

// ===============================
// Diet Plan
// ===============================

export interface MealItem {
  name: string;
  calories: number;
  count: number;
  unit: string;
  description?: string;
}

export interface DailyMealPlan {
  day: number; // 1-7
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  recommendedFoods: string;
  foodsToLimit: string;
}

export interface DietPlan {
  weeklyPlans: DailyMealPlan[];
}

// ===============================
// Workout Plan
// ===============================

export interface ExerciseItem {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  unit?: string;
  description?: string;
}

export interface DailyWorkoutPlan {
  day: number; // 1-7
  name?: string;
  exercises: ExerciseItem[];
}

export interface WorkoutPlan {
  weeklyPlans: DailyWorkoutPlan[];
  disclaimer?: string;
}

// ===============================
// User Input Data (for display)
// ===============================

export interface UserInputData {
  // Demographics
  name: string;
  gender: string; // Display text
  age: number;
  height: number;
  weight: number;
  familyHistory: string;

  // Eating habits
  highCalorieFood: string;
  vegetableFrequency: string;
  waterIntake: string;
  mainMeals: number;
  snackFrequency: string;

  // Activity habits
  physicalActivity: string;
  screenTime: string;
  transportation: string;

  // Other habits
  smoking: string;
  alcohol: string;
}

// ===============================
// Complete Prediction Result Data
// ===============================

export interface PredictionResultData {
  id?: string;
  timestamp?: string;
  userInput: UserInputData;
  prediction: PredictionResult;
  healthMetrics: HealthMetrics;
  healthAnalysis: HealthAnalysis;
  dietPlan: DietPlan;
  workoutPlan: WorkoutPlan;
}

// ===============================
// API Request/Response Types
// ===============================

export interface PredictionAPIRequest {
  name: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  family_history: boolean;
  FAF: number;
  TUE: number;
  NCP: number;
  FCVC: number;
  CH2O: number;
  FAVC: number;
  CALC: number;
  CAEC: number;
  MTRANS_Calorie: number;
}

export interface PredictionAPIResponse extends PredictionResultData {}
