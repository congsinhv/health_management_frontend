/**
 * Utility functions for prediction result data processing and transformations
 */

import {
  PredictionResultData,
  PredictionAPIRequest,
  PredictionAPIResponse,
  PredictionLevel,
  HealthMetric,
} from '@/types/prediction';

// ===============================
// BMI Calculation and Classification
// ===============================

export const calculateBMI = (height: number, weight: number): number => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const getPredictionLevelFromBMI = (bmi: number): PredictionLevel => {
  if (bmi < 18.5) return 'Insufficient_Weight';
  if (bmi < 25) return 'Normal_Weight';
  if (bmi < 27) return 'Overweight_Level_I';
  if (bmi < 30) return 'Overweight_Level_II';
  if (bmi < 35) return 'Obesity_Type_I';
  if (bmi < 40) return 'Obesity_Type_II';
  return 'Obesity_Type_III';
};

export const getStatusText = (level: PredictionLevel): string => {
  const statusMap: Record<PredictionLevel, string> = {
    Insufficient_Weight: 'Thiếu Cân',
    Normal_Weight: 'Bình Thường',
    Overweight_Level_I: 'Thừa Cân Độ I',
    Overweight_Level_II: 'Thừa Cân Độ II',
    Obesity_Type_I: 'Béo Phì Loại I',
    Obesity_Type_II: 'Béo Phì Loại II',
    Obesity_Type_III: 'Béo Phì Loại III',
  };
  return statusMap[level];
};

// ===============================
// Data Transformation Functions
// ===============================

export const transformFormDataToAPI = (formData: any): PredictionAPIRequest => {
  // Transform form data to API format
  // This would need to be adjusted based on your actual form structure
  return {
    name: formData.name || 'User',
    gender: formData.gender === 'Nam' ? 'Male' : 'Female',
    age: formData.age,
    height: formData.height,
    weight: formData.weight,
    family_history: formData.familyHistory === 'Có',
    FAF: mapPhysicalActivity(formData.physicalActivity),
    TUE: mapScreenTime(formData.screenTime),
    NCP: formData.mainMeals,
    FCVC: mapVegetableFrequency(formData.vegetableFrequency),
    CH2O: mapWaterIntake(formData.waterIntake),
    FAVC: formData.highCalorieFood === 'Thường xuyên' ? 1 : 0,
    CALC: mapAlcoholFrequency(formData.alcohol),
    CAEC: mapSnackFrequency(formData.snackFrequency),
    MTRANS_Calorie: mapTransportation(formData.transportation),
  };
};

export const transformAPIToResult = (
  apiResponse: PredictionAPIResponse
): PredictionResultData => {
  return apiResponse;
};

// ===============================
// Mapping Functions
// ===============================

const mapVegetableFrequency = (frequency: string): number => {
  const map: Record<string, number> = {
    'Không bao giờ': 1,
    'Thỉnh thoảng': 2,
    'Hàng ngày': 3,
  };
  return map[frequency] || 2;
};

const mapSnackFrequency = (frequency: string): number => {
  const map: Record<string, number> = {
    'Không bao giờ': 0,
    'Thỉnh thoảng': 1,
    'Thường xuyên': 2,
    'Luôn luôn': 3,
  };
  return map[frequency] || 1;
};

const mapWaterIntake = (intake: string): number => {
  if (intake.includes('< 1L')) return 1;
  if (intake.includes('1-2L')) return 2;
  if (intake.includes('> 2L')) return 3;
  return 2;
};

const mapPhysicalActivity = (activity: string): number => {
  const map: Record<string, number> = {
    Không: 0,
    'Ít vận động': 1,
    'Vận động vừa phải': 2,
    'Vận động nhiều': 3,
    'Rất năng động': 4,
  };
  return map[activity] || 1;
};

const mapScreenTime = (time: string): number => {
  if (time.includes('< 2 giờ')) return 0;
  if (time.includes('2-4 giờ')) return 2;
  if (time.includes('> 4 giờ')) return 3;
  return 2;
};

const mapAlcoholFrequency = (alcohol: string): number => {
  const map: Record<string, number> = {
    Không: 0,
    'Thỉnh thoảng': 1,
    'Thường xuyên': 2,
    'Hàng ngày': 3,
  };
  return map[alcohol] || 1;
};

const mapTransportation = (transport: string): number => {
  const map: Record<string, number> = {
    'Đi bộ': 0,
    'Xe đạp': 1,
    'Công cộng': 2,
    'Ô tô/Xe máy': 3,
    Khác: 4,
  };
  return map[transport] || 3;
};

// ===============================
// Data Generation Functions
// ===============================

export const generateHealthMetrics = (
  height: number,
  weight: number,
  bmi: number
) => ({
  weight: {
    label: 'Cân nặng',
    value: weight,
    unit: 'kg',
    icon: 'weight',
  } as HealthMetric,
  bmi: {
    label: 'BMI',
    value: bmi,
    unit: '',
    icon: 'bmi',
  } as HealthMetric,
  height: {
    label: 'Chiều cao',
    value: height,
    unit: 'cm',
    icon: 'height',
  } as HealthMetric,
});

export const generateHealthAnalysis = (level: PredictionLevel) => {
  const analyses: Record<PredictionLevel, any> = {
    Insufficient_Weight: {
      paragraphs: [
        'Chỉ số BMI của bạn thấp hơn mức cân nặng lý tưởng. Tình trạng thiếu cân có thể ảnh hưởng đến sức khỏe và hệ miễn dịch.',
        'Bạn nên tập trung vào việc tăng cân một cách lành mạnh thông qua chế độ ăn uống giàu dinh dưỡng và tập luyện phù hợp.',
      ],
      disclaimer:
        'Phân tích này chỉ mang tính tham khảo và không thể thay thế cho chẩn đoán y tế chuyên nghiệp.',
    },
    Normal_Weight: {
      paragraphs: [
        'Chúc mừng! Chỉ số BMI của bạn nằm trong khoảng lý tưởng. Đây là dấu hiệu tốt cho sức khỏe tổng thể.',
        'Hãy duy trì chế độ ăn uống cân bằng và thói quen vận động đều đặn để giữ vững cân nặng hiện tại.',
      ],
      disclaimer:
        'Phân tích này chỉ mang tính tham khảo và không thể thay thế cho chẩn đoán y tế chuyên nghiệp.',
    },
    Overweight_Level_I: {
      paragraphs: [
        'Chỉ số BMI của bạn thuộc nhóm "Thừa cân độ I". Đây là mức độ thừa cân nhẹ, cần có những thay đổi nhỏ trong lối sống.',
        'Việc giảm cân nhẹ nhàng (5-10% cân nặng hiện tại) có thể mang lại nhiều lợi ích cho sức khỏe.',
      ],
      disclaimer:
        'Phân tích này chỉ mang tính tham khảo và không thể thay thế cho chẩn đoán y tế chuyên nghiệp.',
    },
    Overweight_Level_II: {
      paragraphs: [
        'Chỉ số BMI của bạn thuộc nhóm "Thừa cân độ II". Bạn nên xem xét thay đổi chế độ ăn uống và tăng cường vận động.',
        'Việc giảm cân có thể giúp giảm nguy cơ mắc các bệnh liên quan đến thừa cân.',
      ],
      disclaimer:
        'Phân tích này chỉ mang tính tham khảo và không thể thay thế cho chẩn đoán y tế chuyên nghiệp.',
    },
    Obesity_Type_I: {
      paragraphs: [
        'Chỉ số BMI của bạn thuộc nhóm "Béo phì loại I". Đây là tình trạng cần quan tâm và có biện pháp can thiệp sớm.',
        'Việc giảm cân dưới sự giám sát y tế có thể cải thiện đáng kể sức khỏe của bạn.',
      ],
      disclaimer:
        'Phân tích này chỉ mang tính tham khảo. Bạn nên tham khảo ý kiến bác sĩ để có hướng dẫn phù hợp.',
    },
    Obesity_Type_II: {
      paragraphs: [
        'Chỉ số BMI của bạn thuộc nhóm "Béo phì loại II". Tình trạng này có thể làm tăng nguy cơ các bệnh mạn tính.',
        'Cần có kế hoạch giảm cân toàn diện dưới sự giám sát y tế chuyên nghiệp.',
      ],
      disclaimer:
        'Phân tích này chỉ mang tính tham khảo. Bạn nên tham khảo ý kiến bác sĩ để có hướng dẫn phù hợp.',
    },
    Obesity_Type_III: {
      paragraphs: [
        'Chỉ số BMI của bạn thuộc nhóm "Béo phì loại III". Đây là tình trạng béo phì nghiêm trọng cần can thiệp y tế chuyên sâu.',
        'Việc giảm cân cần được thực hiện dưới sự giám sát chặt chẽ của đội ngũ y tế chuyên nghiệp.',
      ],
      disclaimer:
        'Phân tích này chỉ mang tính tham khảo. Bạn cần tham khảo ý kiến bác sĩ ngay lập tức.',
    },
  };

  return analyses[level];
};

export const generateDietPlan = (level: PredictionLevel) => {
  // Generate diet plan based on prediction level
  // This is a simplified version - you would expand this with real meal plans
  return {
    weeklyPlans: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      breakfast: [
        { name: 'Bánh mì đen', calories: 120, count: 2, unit: 'lát' },
        { name: 'Trứng luộc', calories: 90, count: 2, unit: 'quả' },
      ],
      lunch: [
        { name: 'Cơm gạo lứt', calories: 150, count: 1, unit: 'bát' },
        { name: 'Ức gà luộc', calories: 120, count: 100, unit: 'g' },
      ],
      dinner: [
        { name: 'Salad rau xanh', calories: 100, count: 1, unit: 'đĩa lớn' },
      ],
      totalCalories:
        580 +
        (level.includes('Overweight')
          ? -100
          : level.includes('Obesity')
            ? -200
            : 0),
    })),
    recommendedFoods:
      'Danh sách thực phẩm khuyến nghị bao gồm rau xanh tươi, trái cây ít ngọt, các nguồn protein nạc, ngũ cốc nguyên hạt, cùng với các loại hạt và hạt giống.',
    foodsToLimit:
      'Danh sách thực phẩm cần hạn chế bao gồm thực phẩm chế biến sẵn, đồ ngọt và nước có gas, thực phẩm nhiều dầu mỡ, rượu bia và thực phẩm nhanh.',
    disclaimer:
      'Chế độ ăn uống chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến chuyên gia dinh dưỡng.',
  };
};

export const generateWorkoutPlan = (level: PredictionLevel) => {
  // Generate workout plan based on prediction level
  return {
    weeklyPlans: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      name: 'Tập toàn thân (Full Body Workout)',
      exercises: [
        {
          name: 'Đi bộ nhanh',
          duration: 30,
          unit: 'phút',
          description: 'Tốc độ trung bình',
        },
        {
          name: 'Hít đất',
          sets: 3,
          reps: 10,
          description: 'Thực hiện đúng kỹ thuật',
        },
      ],
      totalDuration: '45 phút',
      difficulty: level === 'Normal_Weight' ? 'medium' : 'easy',
    })),
    disclaimer:
      'Lời khuyên tập luyện chỉ mang tính tham khảo. Vui lòng tham khảo ý kiến chuyên gia thể hình.',
  };
};

// ===============================
// Validation and Helper Functions
// ===============================

export const validateInputData = (data: any): boolean => {
  return (
    data.age > 0 &&
    data.age <= 120 &&
    data.height > 0 &&
    data.height <= 250 &&
    data.weight > 0 &&
    data.weight <= 300
  );
};

export const formatConfidencePercentage = (confidence: number): string => {
  return `${confidence}%`;
};

export const getStatusColor = (level: PredictionLevel): string => {
  const colorMap: Record<PredictionLevel, string> = {
    Insufficient_Weight: '#F59E0B', // Orange
    Normal_Weight: '#10B981', // Green
    Overweight_Level_I: '#F59E0B', // Orange
    Overweight_Level_II: '#F59E0B', // Orange
    Obesity_Type_I: '#EF4444', // Red
    Obesity_Type_II: '#EF4444', // Red
    Obesity_Type_III: '#EF4444', // Red
  };
  return colorMap[level];
};
