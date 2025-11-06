/**
 * Upload service
 * Handles file uploads (images)
 */

import apiClient from './api';
import type { UploadImageResponse } from '@/types/upload';
import { tokenStorage } from '@/lib/storage';

export const uploadService = {
  /**
   * Upload an image file to GCS bucket and return public URL
   * @param file - The image file to upload
   * @param folder - Optional folder path in the bucket (e.g., 'avatars', 'profile-pictures')
   * @returns Public URL of the uploaded image
   */
  uploadImage: async (
    file: File,
    folder?: string
  ): Promise<UploadImageResponse> => {
    // Validate file type
    const validImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (!validImageTypes.includes(file.type)) {
      throw new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF)');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Kích thước file không được vượt quá 10MB');
    }

    // Build form data
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    // Get token for authorization
    const token = tokenStorage.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await apiClient.post<UploadImageResponse>(
      '/api/v1/upload/image',
      formData,
      {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },
};
