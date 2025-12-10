import apiClient from './api';
import type {
  Schedule,
  UpdateScheduleStatusRequest,
  UpdateScheduleStatusResponse,
} from '@/types/schedule';

/**
 * Get all schedules for current user
 * Filters out superseded schedules on frontend
 */
export const getSchedules = async (): Promise<Schedule[]> => {
  const response = await apiClient.get<Schedule[]>('/api/v1/schedules/');
  // Filter out superseded schedules
  console.log('response.data', response.data);
  return response.data.filter(s => s.status !== 'superseded');
};

/**
 * Update schedule status (active ↔ paused)
 */
export const updateScheduleStatus = async (
  scheduleId: number,
  status: 'active' | 'paused'
): Promise<UpdateScheduleStatusResponse> => {
  const response = await apiClient.patch<UpdateScheduleStatusResponse>(
    `/api/v1/schedules/${scheduleId}/`,
    { is_active: status === 'active' } as UpdateScheduleStatusRequest
  );
  return response.data;
};

export const scheduleService = {
  getSchedules,
  updateScheduleStatus,
};
