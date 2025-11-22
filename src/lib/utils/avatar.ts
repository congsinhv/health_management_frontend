import { AVATAR_CONFIG } from '@/lib/constants';

interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates an image file for use as an avatar.
 * Checks file type and size according to AVATAR_CONFIG.
 *
 * @param file - The file to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateAvatarImage(file: File): ImageValidationResult {
  // Validate file type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!AVATAR_CONFIG.VALID_IMAGE_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: 'Vui lòng chọn file ảnh hợp lệ (JPEG, PNG, WebP, GIF)',
    };
  }

  // Validate file size
  if (file.size > AVATAR_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'Kích thước file không được vượt quá 5MB',
    };
  }

  return { isValid: true };
}
