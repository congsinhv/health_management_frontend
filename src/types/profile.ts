/**
 * Profile Page Types
 */

import type { PredictionLevel } from './prediction';
import type { Device } from './device';

// ===============================
// Prediction History Types
// ===============================

export interface PredictionHistoryItem {
  id: string;
  title: string;
  description: string;
  level: PredictionLevel;
  confidence: number;
  timestamp: string; // ISO string
  type: 'prediction' | 'qa';
}

export interface PredictionHistoryResponse {
  items: PredictionHistoryItem[];
  total: number;
  page: number;
  pageSize: number;
}

// ===============================
// Latest Prediction Types
// ===============================

export interface LatestPrediction {
  id: string;
  level: PredictionLevel;
  confidence: number;
  status: string; // Display text like "Normal Weight"
  timestamp: string;
}

// ===============================
// Training Reminder Types
// ===============================

export interface TrainingReminder {
  id: number;
  name: string;
  description?: string;
  scheduledTime: string; // HH:mm format
  days: string[]; // ['monday', 'wednesday', 'friday']
  isActive: boolean;
  createdAt: string;
}

// ===============================
// Notification Section Types
// ===============================

export interface NotificationData {
  reminders: TrainingReminder[];
  devices: Device[];
}

// ===============================
// Status Label Mapping
// ===============================

export const PREDICTION_STATUS_LABELS: Record<PredictionLevel, string> = {
  Insufficient_Weight: 'Thiếu cân',
  Normal_Weight: 'Cân nặng bình thường',
  Overweight_Level_I: 'Thừa cân độ I',
  Overweight_Level_II: 'Thừa cân độ II',
  Obesity_Type_I: 'Béo phì độ I',
  Obesity_Type_II: 'Béo phì độ II',
  Obesity_Type_III: 'Béo phì độ III',
};

export const PREDICTION_STATUS_COLORS: Record<PredictionLevel, string> = {
  Insufficient_Weight: 'text-yellow-600 bg-yellow-100',
  Normal_Weight: 'text-green-600 bg-green-100',
  Overweight_Level_I: 'text-orange-500 bg-orange-100',
  Overweight_Level_II: 'text-orange-600 bg-orange-100',
  Obesity_Type_I: 'text-red-500 bg-red-100',
  Obesity_Type_II: 'text-red-600 bg-red-100',
  Obesity_Type_III: 'text-red-700 bg-red-100',
};
