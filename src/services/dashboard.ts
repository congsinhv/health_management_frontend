import apiClient from './api';
import type {
  UserInfo_Dashboard,
  DailyActivity,
  WeeklyActivity,
  MonthlyActivity,
  HealthSummary,
  DashboardOverview,
} from '@/types/dashboard';

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

  /**
   * Lấy dữ liệu hoạt động hằng ngày theo user ID
   * @param id - User ID
   * @returns Danh sách daily activity
   */
  getDashboard_Daily: async (id: number): Promise<DailyActivity[]> => {
    const response = await apiClient.get<DailyActivity[]>(
      `/api/v1/dashboard/daily-activity/${id}`
    );
    return response.data;
  },

  /**
   * Lấy dữ liệu hoạt động theo tuần của user
   * @param id - User ID
   * @returns Danh sách weekly activity
   */
  getDashboard_weekly: async (id: number): Promise<WeeklyActivity[]> => {
    const response = await apiClient.get<WeeklyActivity[]>(
      `/api/v1/dashboard/weekly-activity/${id}`
    );
    return response.data;
  },
  /**
   * Lấy dữ liệu hoạt động trung bình theo tháng của user
   * @param id - User ID
   * @returns Danh sách monthly activity
   */
  getDashboard_monthly: async (id: number): Promise<MonthlyActivity[]> => {
    const response = await apiClient.get<MonthlyActivity[]>(
      `/api/v1/dashboard/monthly-activity/${id}`
    );
    return response.data;
  },

  /**
   * Lấy thông tin tóm tắt sức khỏe của user theo ID
   * @param id - User ID
   * @returns Thông tin user dạng health summary
   */
  getDashboard_healthSummary: async (id: number): Promise<HealthSummary> => {
    const response = await apiClient.get<HealthSummary>(
      `/api/v1/dashboard/health-summary/${id}`
    );
    return response.data;
  },

  /**
   * Lấy thông tin tổng quan sức khỏe của user theo ID
   * @param id - User ID
   * @returns Thông tin user dạng overview
   */
  getDashboard_overview: async (id: number): Promise<DashboardOverview> => {
    const response = await apiClient.get<DashboardOverview>(
      `/api/v1/dashboard/overview/${id}`
    );
    return response.data;
  },
};
