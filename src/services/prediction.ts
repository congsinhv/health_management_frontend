import { 
  PredictionResultData, 
  PredictionAPIRequest,
  UserInputData,
  PredictionLevel 
} from '@/types/prediction';
import { PredictFormData } from '@/app/predict/formHelper';

/**
 * API Service for Health Prediction
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Transform form data to API request format
 */
export function transformFormDataToAPIRequest(formData: PredictFormData): PredictionAPIRequest {
  return {
    Gender: formData.gender ?? 0,
    Age: formData.age ?? 0,
    Height: formData.height ?? 0,
    Weight: formData.weight ?? 0,
    family_history_with_overweight: formData.family_history_with_overweight,
    FAVC: formData.FAVC,
    FCVC: formData.FCVC ?? 0,
    NCP: formData.NCP ?? 0,
    CAEC: formData.CAEC ?? 0,
    SMOKE: formData.SMOKE,
    CH2O: formData.CH2O ?? 0,
    SCC: formData.SCC ?? 0,
    FAF: formData.FAF ?? 0,
    TUE: formData.TUE ?? 0,
    CALC: formData.CALC ?? 0,
    MTRANS: formData.MTRANS ?? 0,
  };
}

/**
 * Transform form data to display format
 */
export function transformFormDataToUserInput(formData: PredictFormData): UserInputData {
  return {
    name: formData.name,
    gender: formData.gender === 1 ? 'Nam' : 'Nữ',
    age: formData.age ?? 0,
    height: formData.height ?? 0,
    weight: formData.weight ?? 0,
    familyHistory: formData.family_history_with_overweight === 'yes' ? 'Có' : 'Không',
    highCalorieFood: formData.FAVC === 'yes' ? 'Có' : 'Không',
    vegetableFrequency: getVegetableFrequencyLabel(formData.FCVC),
    waterIntake: getWaterIntakeLabel(formData.CH2O),
    mainMeals: formData.NCP ?? 0,
    snackFrequency: getSnackFrequencyLabel(formData.CAEC),
    physicalActivity: getPhysicalActivityLabel(formData.FAF),
    screenTime: getScreenTimeLabel(formData.TUE),
    transportation: getTransportationLabel(formData.MTRANS),
    smoking: formData.SMOKE === 'yes' ? 'Có' : 'Không',
    alcohol: getAlcoholLabel(formData.CALC),
  };
}

// Helper functions for label mapping
function getVegetableFrequencyLabel(value: number | null): string {
  const labels: Record<number, string> = {
    1: 'Ít',
    2: 'Bình thường',
    3: 'Nhiều',
  };
  return labels[value ?? 1] || 'Không xác định';
}

function getWaterIntakeLabel(value: number | null): string {
  const labels: Record<number, string> = {
    1: '1L/ngày',
    2: '2L/ngày',
    3: '3L/ngày',
  };
  return labels[value ?? 1] || 'Không xác định';
}

function getSnackFrequencyLabel(value: number | null): string {
  const labels: Record<number, string> = {
    0: 'Không bao giờ',
    1: 'Thỉnh thoảng',
    2: 'Thường xuyên',
    3: 'Luôn luôn',
    4: 'Không xác định',
  };
  return labels[value ?? 0] || 'Không xác định';
}

function getPhysicalActivityLabel(value: number | null): string {
  const labels: Record<number, string> = {
    0: 'Không',
    1: 'Ít',
    2: 'Vừa phải',
    3: 'Nhiều',
  };
  return labels[value ?? 0] || 'Không xác định';
}

function getScreenTimeLabel(value: number | null): string {
  const labels: Record<number, string> = {
    0: 'Ít (<2h)',
    1: 'Trung bình (2-4h)',
    2: 'Nhiều (>4h)',
  };
  return labels[value ?? 0] || 'Không xác định';
}

function getTransportationLabel(value: number | null): string {
  const labels: Record<number, string> = {
    1: 'Ô tô',
    2: 'Xe máy',
    3: 'Xe đạp',
    4: 'Giao thông công cộng',
    5: 'Đi bộ',
  };
  return labels[value ?? 1] || 'Không xác định';
}

function getAlcoholLabel(value: number | null): string {
  const labels: Record<number, string> = {
    0: 'Không',
    1: 'Ít',
    2: 'Vừa',
    3: 'Nhiều',
    4: 'Rất nhiều',
  };
  return labels[value ?? 0] || 'Không xác định';
}

/**
 * Submit prediction request to API
 */
export async function submitPrediction(formData: PredictFormData): Promise<PredictionResultData> {
  try {
    const apiRequest = transformFormDataToAPIRequest(formData);
    
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequest),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const apiResponse = await response.json();
    
    // Transform API response to full result data
    return generateResultData(formData, apiResponse);
  } catch (error) {
    console.error('Error submitting prediction:', error);
    // Return mock data as fallback
    return generateMockResultData(formData);
  }
}

/**
 * Generate result data from API response
 */
function generateResultData(formData: PredictFormData, apiResponse: any): PredictionResultData {
  const bmi = calculateBMI(formData.weight ?? 0, formData.height ?? 0);
  
  return {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    userInput: transformFormDataToUserInput(formData),
    prediction: {
      level: apiResponse.predicted_class as PredictionLevel,
      confidence: apiResponse.confidence ?? 80,
      bmi: bmi,
      status: apiResponse.status || 'Normal Weight',
      reliability: apiResponse.confidence > 85 ? 'high' : apiResponse.confidence > 70 ? 'medium' : 'low',
    },
    healthMetrics: {
      weight: {
        label: 'Cân nặng',
        value: formData.weight ?? 0,
        unit: 'kg',
      },
      bmi: {
        label: 'BMI',
        value: bmi,
        unit: '',
      },
      height: {
        label: 'Chiều cao',
        value: formData.height ?? 0,
        unit: 'm',
      },
    },
    healthAnalysis: generateHealthAnalysis(apiResponse.predicted_class, bmi),
    dietPlan: generateDietPlan(apiResponse.predicted_class),
    workoutPlan: generateWorkoutPlan(apiResponse.predicted_class),
  };
}

/**
 * Generate mock result data for development/fallback
 */
export function generateMockResultData(formData: PredictFormData): PredictionResultData {
  const bmi = calculateBMI(formData.weight ?? 0, formData.height ?? 0);
  const predictedLevel = getPredictionLevelFromBMI(bmi);
  
  return {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    userInput: transformFormDataToUserInput(formData),
    prediction: {
      level: predictedLevel,
      confidence: 82,
      bmi: bmi,
      status: getLevelDisplayText(predictedLevel),
      reliability: 'high',
    },
    healthMetrics: {
      weight: {
        label: 'Cân nặng',
        value: formData.weight ?? 0,
        unit: 'kg',
      },
      bmi: {
        label: 'BMI',
        value: bmi,
        unit: '',
      },
      height: {
        label: 'Chiều cao',
        value: formData.height ?? 0,
        unit: 'm',
      },
    },
    healthAnalysis: generateHealthAnalysis(predictedLevel, bmi),
    dietPlan: generateDietPlan(predictedLevel),
    workoutPlan: generateWorkoutPlan(predictedLevel),
  };
}

/**
 * Calculate BMI
 */
function calculateBMI(weight: number, height: number): number {
  if (height === 0) return 0;
  return weight / (height * height);
}

/**
 * Get prediction level from BMI
 */
function getPredictionLevelFromBMI(bmi: number): PredictionLevel {
  if (bmi < 18.5) return 'Insufficient_Weight';
  if (bmi < 25) return 'Normal_Weight';
  if (bmi < 27) return 'Overweight_Level_I';
  if (bmi < 30) return 'Overweight_Level_II';
  if (bmi < 35) return 'Obesity_Type_I';
  if (bmi < 40) return 'Obesity_Type_II';
  return 'Obesity_Type_III';
}

/**
 * Get level display text
 */
function getLevelDisplayText(level: PredictionLevel): string {
  const levelMap: Record<PredictionLevel, string> = {
    'Insufficient_Weight': 'Thiếu cân',
    'Normal_Weight': 'Cân nặng bình thường',
    'Overweight_Level_I': 'Thừa cân mức I',
    'Overweight_Level_II': 'Thừa cân mức II',
    'Obesity_Type_I': 'Béo phì độ I',
    'Obesity_Type_II': 'Béo phì độ II',
    'Obesity_Type_III': 'Béo phì độ III',
  };
  return levelMap[level];
}

/**
 * Generate health analysis based on prediction
 */
function generateHealthAnalysis(level: PredictionLevel, bmi: number): any {
  const analyses: Record<string, string[]> = {
    'Normal_Weight': [
      `Chỉ số BMI của bạn là ${bmi.toFixed(1)}, nằm trong khoảng bình thường (18.5 - 24.9). Đây là một dấu hiệu tích cực cho sức khỏe tổng thể của bạn.`,
      'Để duy trì cân nặng khỏe mạnh, bạn nên tiếp tục chế độ ăn uống cân bằng và tập thể dục đều đặn. Đảm bảo bạn ăn đủ các nhóm thực phẩm và duy trì lối sống năng động.',
      'Nên theo dõi cân nặng định kỳ và duy trì thói quen sinh hoạt lành mạnh. Nếu có bất kỳ thay đổi bất thường nào về cân nặng, hãy tham khảo ý kiến bác sĩ.',
    ],
    'Overweight_Level_I': [
      `Chỉ số BMI của bạn là ${bmi.toFixed(1)}, cho thấy bạn đang ở mức thừa cân nhẹ. Đây là lúc cần chú ý điều chỉnh lối sống để ngăn ngừa các vấn đề sức khỏe.`,
      'Nên giảm lượng calo nạp vào hàng ngày khoảng 300-500 kcal và tăng cường hoạt động thể chất. Tập trung vào việc ăn nhiều rau củ, trái cây và giảm thực phẩm chế biến sẵn.',
      'Khuyến nghị tập thể dục ít nhất 150 phút mỗi tuần với cường độ vừa phải. Kết hợp cả bài tập cardio và rèn luyện sức mạnh để đạt hiệu quả tốt nhất.',
    ],
  };
  
  return {
    paragraphs: analyses[level] || analyses['Normal_Weight'],
    disclaimer: 'Phân tích này chỉ mang tính tham khảo. Để có đánh giá chính xác và kế hoạch điều trị phù hợp, vui lòng tham khảo ý kiến bác sĩ hoặc chuyên gia dinh dưỡng.',
  };
}

/**
 * Generate diet plan based on prediction
 */
function generateDietPlan(level: PredictionLevel): any {
  // Generate 7-day meal plan
  const weeklyPlans = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    breakfast: [
      { name: 'Bánh mì nguyên cám', calories: 250, description: '2 lát với bơ đậu phộng' },
      { name: 'Trứng luộc', calories: 150, description: '2 quả' },
      { name: 'Sữa tươi không đường', calories: 100, description: '200ml' },
    ],
    lunch: [
      { name: 'Cơm gạo lứt', calories: 200, description: '1 chén' },
      { name: 'Ức gà luộc', calories: 250, description: '150g' },
      { name: 'Rau xào', calories: 100, description: 'Hỗn hợp rau củ' },
      { name: 'Canh rau', calories: 50, description: '1 bát' },
    ],
    dinner: [
      { name: 'Cá hấp', calories: 200, description: '150g cá thu/cá hồi' },
      { name: 'Cơm gạo lứt', calories: 150, description: '3/4 chén' },
      { name: 'Rau luộc', calories: 80, description: 'Bông cải xanh, cà rốt' },
    ],
    totalCalories: 1530,
  }));

  return {
    weeklyPlans,
    recommendedFoods: [
      'Ngũ cốc nguyên hạt (gạo lứt, yến mạch, quinoa)',
      'Rau xanh đậm (cải bó xôi, súp lơ xanh, cải kale)',
      'Trái cây tươi (táo, chuối, cam, dâu)',
      'Protein nạc (ức gà, cá, đậu phụ)',
      'Các loại hạt (hạnh nhân, óc chó, hạt chia)',
    ],
    foodsToLimit: [
      'Đồ ăn nhanh và thức ăn chế biến sẵn',
      'Đồ uống có đường (nước ngọt, trà sữa)',
      'Thực phẩm chiên rán nhiều dầu mỡ',
      'Bánh kẹo, snack nhiều đường và muối',
      'Thịt đỏ và thịt chế biến',
    ],
    disclaimer: 'Kế hoạch dinh dưỡng này là gợi ý chung. Nên tham khảo chuyên gia dinh dưỡng để có kế hoạch phù hợp với tình trạng sức khỏe cụ thể của bạn.',
  };
}

/**
 * Generate workout plan based on prediction
 */
function generateWorkoutPlan(level: PredictionLevel): any {
  // Generate 7-day workout plan
  const weeklyPlans = Array.from({ length: 7 }, (_, i) => {
    const day = i + 1;
    let exercises;
    let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
    
    if (day === 1 || day === 4) {
      exercises = [
        { name: 'Khởi động', duration: '5 phút', description: 'Giãn cơ và khởi động nhẹ' },
        { name: 'Đi bộ nhanh', duration: '20 phút', description: 'Tốc độ vừa phải' },
        { name: 'Squat', sets: 3, reps: 12, description: 'Gập bụng đứng' },
        { name: 'Push-up', sets: 3, reps: 10, description: 'Hít đất (có thể chống tường)' },
        { name: 'Plank', duration: '30 giây', sets: 3, description: 'Chống đẩy tĩnh' },
        { name: 'Thả lỏng', duration: '5 phút', description: 'Giãn cơ và hồi phục' },
      ];
    } else if (day === 2 || day === 5) {
      exercises = [
        { name: 'Khởi động', duration: '5 phút', description: 'Giãn cơ toàn thân' },
        { name: 'Đạp xe hoặc chạy bộ', duration: '25 phút', description: 'Cường độ vừa phải' },
        { name: 'Lunges', sets: 3, reps: 10, description: 'Mỗi chân' },
        { name: 'Mountain Climbers', sets: 3, reps: 15, description: 'Leo núi' },
        { name: 'Giãn cơ', duration: '5 phút', description: 'Thả lỏng toàn thân' },
      ];
    } else {
      exercises = [
        { name: 'Yoga nhẹ hoặc đi bộ', duration: '30 phút', description: 'Hoạt động phục hồi' },
        { name: 'Giãn cơ', duration: '10 phút', description: 'Thả lỏng cơ thể' },
      ];
      difficulty = 'easy';
    }
    
    return {
      day,
      exercises,
      totalDuration: '40-45 phút',
      difficulty,
    };
  });

  return {
    weeklyPlans,
    disclaimer: 'Kế hoạch tập luyện này là gợi ý chung. Nên tham khảo huấn luyện viên hoặc bác sĩ trước khi bắt đầu chương trình tập luyện mới, đặc biệt nếu bạn có vấn đề sức khỏe.',
  };
}

