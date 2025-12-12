/**
 * Mock data for Profile Page development
 * Remove or conditionally load in production
 */

import type {
  PredictionHistoryItem,
  LatestPrediction,
  TrainingReminder,
} from '@/types/profile';
import type { Device } from '@/types/device';

// Latest Prediction Mock
export const mockLatestPrediction: LatestPrediction = {
  id: 'pred-001',
  level: 'Normal_Weight',
  confidence: 80,
  status: 'Cân nặng bình thường',
  timestamp: new Date().toISOString(),
};

// Prediction History Mock
export const mockPredictionHistory: PredictionHistoryItem[] = [
  {
    id: 'pred-001',
    title: 'Dự đoán BMI',
    description: 'Kết quả dự đoán chỉ số BMI dựa trên dữ liệu sức khỏe',
    level: 'Normal_Weight',
    confidence: 80,
    timestamp: new Date().toISOString(),
    type: 'prediction',
  },
  {
    id: 'pred-002',
    title: 'Hỏi đáp về chế độ ăn',
    description: 'Tư vấn chế độ dinh dưỡng phù hợp với mục tiêu giảm cân',
    level: 'Overweight_Level_I',
    confidence: 75,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    type: 'qa',
  },
  {
    id: 'pred-003',
    title: 'Dự đoán nguy cơ béo phì',
    description: 'Phân tích nguy cơ béo phì dựa trên thói quen sinh hoạt',
    level: 'Normal_Weight',
    confidence: 85,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    type: 'prediction',
  },
  {
    id: 'pred-004',
    title: 'Tư vấn luyện tập',
    description: 'Gợi ý bài tập phù hợp với thể trạng hiện tại',
    level: 'Overweight_Level_I',
    confidence: 78,
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    type: 'qa',
  },
];

// Training Reminders Mock
export const mockTrainingReminders: TrainingReminder[] = [
  {
    id: 1,
    name: 'Nhắc nhở tập luyện',
    description:
      'Tập toàn thân (Full Body Workout) vào lúc 16:00 AM 15/12/2025',
    scheduledTime: '06:00',
    days: ['monday', 'wednesday', 'friday'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Nhắc nhở tập luyện',
    description: 'Tập nhảy dây vào lúc 18:00 AM ngày 16/12/2025',
    scheduledTime: '06:00',
    days: ['tuesday', 'thursday', 'saturday'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Devices Mock (extend existing type)
export const mockDevices: Device[] = [
  {
    id: 1,
    device_type: 'ios',
    device_name: 'iPhone/iPad',
    is_active: true,
    last_used_at: new Date().toISOString(),
  },
];
