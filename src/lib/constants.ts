/**
 * Application-wide constants
 * Centralized configuration for routes, validation rules, and magic strings
 */

// ==================== ROUTES ====================

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    GOOGLE_CALLBACK: '/auth/google/callback',
    CALLBACK: '/auth/callback',
  },
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HOME: '/',
} as const;

// ==================== AVATAR ====================

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

// ==================== VALIDATION ====================

export const VALIDATION = {
  // Height validation (in cm)
  HEIGHT: {
    MIN: 50,
    MAX: 300,
    UNIT: 'cm',
  },
  // Weight validation (in kg)
  WEIGHT: {
    MIN: 20,
    MAX: 500,
    UNIT: 'kg',
  },
  // File upload validation
  FILE_SIZE: {
    MAX_AVATAR: 5 * 1024 * 1024, // 5MB - matches AVATAR_CONFIG
    MAX_DOCUMENT: 10 * 1024 * 1024, // 10MB
  },
  // Name validation
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  // Password validation
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
} as const;

// ==================== USER CONSTANTS ====================

export const USER_CONSTANTS = {
  GENDERS: ['male', 'female', 'other'] as const,
  GENDER_LABELS: {
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác',
  } as const,

  GOALS: ['lose-weight', 'gain-weight', 'maintain'] as const,
  GOAL_LABELS: {
    'lose-weight': 'Giảm cân',
    'gain-weight': 'Tăng cân',
    maintain: 'Duy trì',
  } as const,

  PROVIDERS: ['portal', 'google'] as const,

  BLOOD_TYPES: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const,
} as const;

// ==================== API CONSTANTS ====================

export const API_CONSTANTS = {
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REGISTER: '/api/v1/auth/register',
      LOGOUT: '/api/v1/auth/logout',
      LOGOUT_ALL: '/api/v1/auth/logout-all',
      REFRESH: '/api/v1/auth/refresh',
      GOOGLE_LOGIN: '/api/v1/auth/google/login',
      GOOGLE_CALLBACK: '/api/v1/auth/google/callback',
      VERIFY_EMAIL: '/api/v1/auth/verify-email',
      RESEND_VERIFICATION: '/api/v1/auth/resend-verification',
      FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
      RESET_PASSWORD: '/api/v1/auth/reset-password',
    },
    USER: {
      PROFILE: '/api/v1/users/profile',
    },
    UPLOAD: {
      IMAGE: '/api/v1/upload/image',
    },
    QA: {
      ASK: '/api/v1/qa/ask',
      HISTORY: '/api/v1/qa/history',
    },
  },
  TIMEOUT: 30000, // 30 seconds
} as const;

// ==================== LOCAL STORAGE KEYS ====================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập tài nguyên này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  FILE_TOO_LARGE: 'Kích thước file quá lớn.',
  INVALID_FILE_TYPE: 'Định dạng file không được hỗ trợ.',
  UNKNOWN_ERROR: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
} as const;

// ==================== SUCCESS MESSAGES ====================

export const SUCCESS_MESSAGES = {
  LOGIN: 'Đăng nhập thành công!',
  REGISTER: 'Đăng ký thành công!',
  LOGOUT: 'Đăng xuất thành công!',
  PROFILE_UPDATED: 'Cập nhật hồ sơ thành công!',
  PASSWORD_RESET: 'Đặt lại mật khẩu thành công!',
  EMAIL_SENT: 'Email đã được gửi!',
  EMAIL_VERIFIED: 'Xác thực email thành công!',
  UPLOAD_SUCCESS: 'Tải lên thành công!',
} as const;

// ==================== TYPE EXPORTS ====================

// Export types for TypeScript type safety
export type Gender = (typeof USER_CONSTANTS.GENDERS)[number];
export type Goal = (typeof USER_CONSTANTS.GOALS)[number];
export type Provider = (typeof USER_CONSTANTS.PROVIDERS)[number];
export type BloodType = (typeof USER_CONSTANTS.BLOOD_TYPES)[number];
export type Route =
  | (typeof ROUTES)[keyof typeof ROUTES]
  | (typeof ROUTES.AUTH)[keyof typeof ROUTES.AUTH];
