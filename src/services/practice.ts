/**
 * Practice service
 * Handles practice schedule CRUD operations
 */

import apiClient from './api';
import type {
  PracticeFormData,
  PracticeProfileResponse,
  ScheduleApiRequest,
  ScheduleApiResponse,
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
 * Save practice schedule (NEW ENDPOINT)
 */
export const savePracticeSchedule = async (
  data: PracticeFormData
): Promise<ScheduleApiResponse> => {
  const response = await apiClient.post<ScheduleApiResponse>(
    '/api/v1/schedules/',
    formatForScheduleAPI(data)
  );
  return response.data;
};

/**
 * Format form data for new schedule API
 */
const formatForScheduleAPI = (data: PracticeFormData): ScheduleApiRequest => {
  // Build time periods with snake_case keys
  const timePeriods: Record<
    string,
    Array<{ start_time: string; end_time: string }>
  > = {};

  if (data.schedule.mode === 'flexible' && data.schedule.flexiblePeriods) {
    Object.entries(data.schedule.flexiblePeriods).forEach(([day, periods]) => {
      timePeriods[day] = periods.map(p => ({
        start_time: p.startTime,
        end_time: p.endTime,
      }));
    });
  } else if (data.schedule.mode === 'fixed' && data.schedule.fixedPeriod) {
    // Expand fixed period to all selected days
    data.schedule.selectedDays.forEach(day => {
      timePeriods[day] = [
        {
          start_time: data.schedule.fixedPeriod!.startTime,
          end_time: data.schedule.fixedPeriod!.endTime,
        },
      ];
    });
  }

  return {
    height_cm: data.basicInfo.height,
    weight_kg: data.basicInfo.weight,
    target_weight_kg: data.basicInfo.targetWeight,
    goal: data.basicInfo.goal,
    schedule_mode: data.schedule.mode,
    schedule_days: data.schedule.selectedDays,
    time_periods: timePeriods,
    sports_predefined: data.sports.predefined,
    sports_custom: data.sports.custom,
    notes_personal: data.notes.personal || null,
    notes_health: data.notes.healthWarnings || null,
  };
};

/**
 * @deprecated Use savePracticeSchedule instead
 */
export const savePracticePreferences = async (
  data: PracticeFormData
): Promise<ScheduleApiResponse> => {
  return savePracticeSchedule(data);
};

export const practiceService = {
  getPracticeProfile,
  savePracticeSchedule,
  savePracticePreferences, // deprecated alias
};
