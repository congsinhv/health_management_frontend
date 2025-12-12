import {
  PredictionResultData,
  PredictionAPIRequest,
  UserInputData,
} from '@/types/prediction';
import { PredictFormData } from '@/app/predict/formHelper';
import apiClient from './api';

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
 * Export prediction result as PDF
 * @param predictionId - The prediction ID from PredictionResponse.id
 * @returns Promise with PDF URL
 */
export async function exportPredictionPDF(
  predictionId: string
): Promise<string> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/predict/export/${predictionId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Prediction not found');
      }
      throw new Error(`Failed to export PDF: ${response.statusText}`);
    }

    const data = await response.json();
    return data.pdf_url;
  } catch (error) {
    console.error('Error exporting prediction PDF:', error);
    throw error;
  }
}

/**
 * Submit prediction request to API
 */
export async function submitPrediction(
  formData: PredictFormData
): Promise<PredictionResultData> {
  try {
    const apiRequest = transformFormDataToAPIRequest(formData);
    const response = await apiClient.post<PredictionResultData>(
      '/api/v1/predict/',
      apiRequest
    );

    if (response.status !== 200) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const apiResponse = response.data;

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
    throw error;
  }
}

export async function getPredictionResult(
  predictionId: string
): Promise<PredictionResultData> {
  try {
    const response = await apiClient.get<PredictionResultData>(
      `/api/v1/predict/${predictionId}`
    );
    if (response.status !== 200) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const apiResponse = response.data;
    return apiResponse as PredictionResultData;
  } catch (error) {
    console.error('Error getting prediction result:', error);
    throw error;
  }
}
