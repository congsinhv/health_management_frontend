export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  phoneNumber?: string;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface GoogleAuthResponse {
  authorization_url: string;
  state: string;
}

export interface GoogleCallbackRequest {
  code: string;
  state?: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshAuth: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  updateUserInContext: (userData: Partial<User>) => void;
}

export interface HealthProfile {
  userId: string;
  height?: number; // in cm
  weight?: number; // in kg
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  allergies?: string[];
  medicalConditions?: string[];
  currentMedications?: Medication[];
  emergencyContact?: EmergencyContact;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr' | 'de';
  timezone: string;
  units: 'metric' | 'imperial';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareDataForResearch: boolean;
    analytics: boolean;
  };
}
