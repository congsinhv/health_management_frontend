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
  disclaimer: string;
}

// ===============================
// Diet Plan
// ===============================

export interface MealItem {
  name: string;
  calories: number;
  description?: string;
}

export interface DailyMealPlan {
  day: number; // 1-7
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  totalCalories: number;
}

export interface DietPlan {
  weeklyPlans: DailyMealPlan[];
  recommendedFoods: string[];
  foodsToLimit: string[];
  disclaimer: string;
}

// ===============================
// Workout Plan
// ===============================

export interface ExerciseItem {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string; // e.g., "30 minutes"
  description?: string;
}

export interface DailyWorkoutPlan {
  day: number; // 1-7
  exercises: ExerciseItem[];
  totalDuration: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface WorkoutPlan {
  weeklyPlans: DailyWorkoutPlan[];
  disclaimer: string;
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
  Gender: number;
  Age: number;
  Height: number;
  Weight: number;
  family_history_with_overweight: string;
  FAVC: string;
  FCVC: number;
  NCP: number;
  CAEC: number;
  SMOKE: string;
  CH2O: number;
  SCC: number;
  FAF: number;
  TUE: number;
  CALC: number;
  MTRANS: number;
}

export interface PredictionAPIResponse {
  predicted_class: PredictionLevel;
  confidence: number;
  bmi: number;
  // Add other API response fields as they become known
}
