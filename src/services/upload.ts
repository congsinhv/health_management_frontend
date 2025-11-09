/**
 * Upload service
 * Handles file uploads (images)
 */

import apiClient from './api';
import type { UploadImageResponse } from '@/types/upload';
import { tokenStorage } from '@/lib/storage';
import {
  AVATAR_CONFIG,
  VALIDATION,
  ERROR_MESSAGES,
  API_CONSTANTS,
} from '@/lib/constants';

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
    const validImageTypes = AVATAR_CONFIG.VALID_IMAGE_TYPES;
    if (
      !validImageTypes.includes(file.type as (typeof validImageTypes)[number])
    ) {
      throw new Error(ERROR_MESSAGES.INVALID_FILE_TYPE);
    }

    // Validate file size - use DOCUMENT max size (10MB) for general uploads
    const maxSize = VALIDATION.FILE_SIZE.MAX_DOCUMENT;
    if (file.size > maxSize) {
      throw new Error(ERROR_MESSAGES.FILE_TOO_LARGE);
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
      API_CONSTANTS.ENDPOINTS.UPLOAD.IMAGE,
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
