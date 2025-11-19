import {
  PredictionResultData,
  PredictionAPIRequest,
  UserInputData,
} from '@/types/prediction';
import { PredictFormData } from '@/app/predict/formHelper';

/**
 * API Service for Health Prediction
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8080';

/**
 * Transform form data to API request format
 */
export function transformFormDataToAPIRequest(
  formData: PredictFormData
): PredictionAPIRequest {
  return {
    name: formData.name,
    gender: formData.gender === 1 ? 'Male' : 'Female',
    age: formData.age ?? 0,
    height: formData.height ?? 0,
    weight: formData.weight ?? 0,
    family_history: formData.family_history_with_overweight === 'yes',
    FAF: formData.FAF ?? 0,
    TUE: formData.TUE ?? 0,
    NCP: formData.NCP ?? 0,
    FCVC: formData.FCVC ?? 0,
    CH2O: formData.CH2O ?? 0,
    FAVC: formData.FAVC === 'yes' ? 1 : 0,
    CALC: formData.CALC ?? 0,
    CAEC: formData.CAEC ?? 0,
    MTRANS_Calorie: formData.MTRANS ?? 0,
  };
}

/**
 * Transform form data to display format
 */
export function transformFormDataToUserInput(
  formData: PredictFormData
): UserInputData {
  return {
    name: formData.name,
    gender: formData.gender === 1 ? 'Nam' : 'Nữ',
    age: formData.age ?? 0,
    height: formData.height ?? 0,
    weight: formData.weight ?? 0,
    familyHistory:
      formData.family_history_with_overweight === 'yes' ? 'Có' : 'Không',
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
export async function submitPrediction(
  formData: PredictFormData
): Promise<PredictionResultData> {
  try {
    const apiRequest = transformFormDataToAPIRequest(formData);

    const response = await fetch(`${API_BASE_URL}predict/`, {
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

    // The API now returns the full result data, so we can return it directly
    const result = apiResponse as PredictionResultData;

    // Ensure consistency between user input and health metrics
    if (result.healthMetrics) {
      if (result.healthMetrics.height) {
        result.healthMetrics.height.value =
          formData.height ?? result.healthMetrics.height.value;
      }
      if (result.healthMetrics.weight) {
        result.healthMetrics.weight.value =
          formData.weight ?? result.healthMetrics.weight.value;
      }
    }

    return result;
  } catch (error) {
    console.error('Error submitting prediction:', error);
    // Return mock data as fallback
    return {} as PredictionResultData;
  }
}
