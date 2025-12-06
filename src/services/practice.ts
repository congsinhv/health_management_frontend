/**
 * Practice service
 * Handles practice preferences CRUD operations
 */

import apiClient from './api';
import type {
  PracticeFormData,
  PracticeProfileResponse,
} from '@/types/practice';

/**
 * Get user's practice profile (for pre-fill)
 */
export const getPracticeProfile =
  async (): Promise<PracticeProfileResponse> => {
    const response = await apiClient.get<PracticeProfileResponse>(
      '/api/v1/users/practice-profile'
    );
    return response.data;
  };

/**
 * Save practice preferences
 */
export const savePracticePreferences = async (
  data: PracticeFormData
): Promise<void> => {
  await apiClient.post(
    '/api/v1/users/practice-preferences',
    formatForAPI(data)
  );
};

/**
 * Format form data for API submission
 */
const formatForAPI = (data: PracticeFormData) => {
  return {
    basic_info: {
      height_cm: data.basicInfo.height,
      weight_kg: data.basicInfo.weight,
      target_weight_kg: data.basicInfo.targetWeight,
      goal: data.basicInfo.goal,
    },
    schedule: {
      mode: data.schedule.mode,
      selected_days: data.schedule.selectedDays,
      periods:
        data.schedule.mode === 'flexible'
          ? data.schedule.flexiblePeriods
          : {
              // Expand fixed period to all selected days
              ...Object.fromEntries(
                data.schedule.selectedDays.map(day => [
                  day,
                  [data.schedule.fixedPeriod],
                ])
              ),
            },
    },
    sports: {
      predefined: data.sports.predefined,
      custom: data.sports.custom,
    },
    notes: {
      personal: data.notes.personal || null,
      health_warnings: data.notes.healthWarnings || null,
    },
  };
};

export const practiceService = {
  getPracticeProfile,
  savePracticePreferences,
};
