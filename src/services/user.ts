/**
 * User service
 * Handles user profile CRUD operations
 */

import apiClient from './api';
import type { UserData, UpdateUserProfileData } from '@/types/user';

export const userService = {
  /**
   * Get user profile by user ID
   * Returns full user data including profile information
   */
  getProfile: async (userId: number): Promise<UserData> => {
    const response = await apiClient.get<UserData>(`/api/v1/users/${userId}`);
    return response.data;
  },

  /**
   * Update user profile
   * Supports partial updates - only fields provided will be updated
   * @param userId - The ID of the user to update
   * @param data - Partial user data to update
   */
  updateProfile: async (
    userId: number,
    data: UpdateUserProfileData
  ): Promise<UserData> => {
    const response = await apiClient.put<UserData>(
      `/api/v1/users/${userId}`,
      data
    );
    return response.data;
  },
};
