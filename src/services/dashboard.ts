import apiClient from './api';
import type { UserInfo_Dashboard } from '@/types/dashboard';

export const dashboardService = {
  /**
   * Lấy thông tin profile của người dùng theo ID
   * @param id - User ID
   * @returns Thông tin user
   */
  getDashboard_userInfo: async (id: number): Promise<UserInfo_Dashboard> => {
    const response = await apiClient.get<UserInfo_Dashboard>(
      `/api/v1/dashboard/profile/${id}`
    );
    return response.data;
  },
};
