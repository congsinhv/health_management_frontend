/**
 * Mock data for prediction result page
 * This file contains sample data that matches the structure shown in the UI
 */

import { PredictionResultData } from '@/types/prediction';

export const mockPredictionResultData: PredictionResultData = {
  id: 'prediction_20250118_001',
  timestamp: '2025-01-18T10:30:00Z',

  userInput: {
    // Demographics
    name: 'Nguyễn Văn A',
    gender: 'Nam',
    age: 28,
    height: 175,
    weight: 85,
    familyHistory: 'Có',

    // Eating habits
    highCalorieFood: 'Thường xuyên',
    vegetableFrequency: 'Hàng ngày',
    waterIntake: '> 2L',
    mainMeals: 3,
    snackFrequency: 'Thỉnh thoảng',

    // Activity habits
    physicalActivity: 'Ít vận động',
    screenTime: '> 4 giờ',
    transportation: 'Ô tô/Xe máy',

    // Other habits
    smoking: 'Không',
    alcohol: 'Thỉnh thoảng',
  },

  prediction: {
    level: 'Overweight_Level_I',
    confidence: 87,
    bmi: 27.8,
    status: 'Thừa Cân Độ I',
    reliability: 'high',
  },

  healthMetrics: {
    weight: {
      label: 'Cân nặng',
      value: 85,
      unit: 'kg',
      icon: 'weight',
    },
    bmi: {
      label: 'BMI',
      value: 27.8,
      unit: '',
      icon: 'bmi',
    },
    height: {
      label: 'Chiều cao',
      value: 175,
      unit: 'cm',
      icon: 'height',
    },
  },

  healthAnalysis: {
    paragraphs: [
      'Chỉ số BMI của bạn là 27.8, thuộc nhóm "Thừa cân độ I". Đây là mức độ thừa cân nhẹ, cho thấy cân nặng của bạn cao hơn so với mức cân nặng lý tưởng cho chiều cao hiện tại.',
      'Tình trạng thừa cân có thể làm tăng nguy cơ mắc các bệnh lý như tiểu đường type 2, bệnh tim mạch, huyết áp cao và một số loại ung thư. Việc giảm cân cân trọng có thể giúp cải thiện sức khỏe tổng thể và giảm nguy cơ các bệnh liên quan.',
      'Dựa trên thông tin về thói quen sinh hoạt của bạn, việc ít vận động và thời gian ngồi nhiều (> 4 tiếng/ngày) có thể là một trong những nguyên nhân chính dẫn đến tình trạng thừa cân hiện tại.',
    ],
  },

  dietPlan: {
    weeklyPlans: [
      {
        day: 1,
        breakfast: [
          { name: 'Bánh mì đen', calories: 120, count: 2, unit: 'lát' },
          { name: 'Trứng luộc', calories: 90, count: 2, unit: 'quả' },
          { name: 'Sữa chua không đường', calories: 60, count: 1, unit: 'hộp' },
        ],
        lunch: [
          { name: 'Cơm gạo lứt', calories: 150, count: 1, unit: 'bát' },
          { name: 'Ức gà luộc', calories: 120, count: 100, unit: 'g' },
          { name: 'Rau luộc', calories: 50, count: 200, unit: 'g' },
        ],
        dinner: [
          { name: 'Salad cá ngừ', calories: 200, count: 1, unit: 'đĩa' },
          { name: 'Canh bí đao', calories: 40, count: 1, unit: 'bát' },
        ],
        recommendedFoods:
          'Danh sách thực phẩm khuyến nghị bao gồm rau xanh tươi, trái cây ít ngọt, các nguồn protein nạc, ngũ cốc nguyên hạt, cùng với các loại hạt và hạt giống.',
        foodsToLimit:
          'Danh sách thực phẩm cần hạn chế bao gồm thực phẩm chế biến sẵn, đồ ngọt và nước có gas, thực phẩm nhiều dầu mỡ, rượu bia và thực phẩm nhanh.',
      },
      // Add more days as needed...
    ],
  },

  workoutPlan: {
    weeklyPlans: [
      {
        day: 1,
        name: 'Tập toàn thân (Full Body Workout)',
        exercises: [
          {
            name: 'Đi bộ nhanh',
            duration: 30,
            unit: 'phút',
            description: 'Tốc độ trung bình',
            sets: 3,
            reps: 10,
          },
          {
            name: 'Hít đất',
            sets: 3,
            reps: 10,
            description: 'Thực hiện đúng kỹ thuật',
          },
          { name: 'Squat', sets: 3, reps: 15, description: 'Giữ lưng thẳng' },
        ],
      },
      // Add more days as needed...
    ],
  },
};

// Additional mock data for different prediction levels
export const mockNormalWeightData: PredictionResultData = {
  ...mockPredictionResultData,
  prediction: {
    level: 'Normal_Weight',
    confidence: 92,
    bmi: 22.5,
    status: 'Bình Thường',
    reliability: 'high',
  },
  userInput: {
    ...mockPredictionResultData.userInput,
    weight: 69,
  },
  healthMetrics: {
    ...mockPredictionResultData.healthMetrics,
    weight: {
      label: 'Cân nặng',
      value: 69,
      unit: 'kg',
      icon: 'weight',
    },
    bmi: {
      label: 'BMI',
      value: 22.5,
      unit: '',
      icon: 'bmi',
    },
  },
};

export const mockObesityData: PredictionResultData = {
  ...mockPredictionResultData,
  prediction: {
    level: 'Obesity_Type_II',
    confidence: 78,
    bmi: 35.2,
    status: 'Béo Phì Loại II',
    reliability: 'medium',
  },
  userInput: {
    ...mockPredictionResultData.userInput,
    weight: 108,
  },
  healthMetrics: {
    ...mockPredictionResultData.healthMetrics,
    weight: {
      label: 'Cân nặng',
      value: 108,
      unit: 'kg',
      icon: 'weight',
    },
    bmi: {
      label: 'BMI',
      value: 35.2,
      unit: '',
      icon: 'bmi',
    },
  },
};
