/**
 * Application-wide constants
 */

export const DEFAULT_AVATAR_PATH = '/images/account_icon.png';

export const AVATAR_CONFIG = {
  HEADER_SIZE: 44,
  PROFILE_SIZE: 128,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  VALID_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ] as const,
} as const;

export const AVATAR_IMAGE_ACCEPT = AVATAR_CONFIG.VALID_IMAGE_TYPES.join(',');
