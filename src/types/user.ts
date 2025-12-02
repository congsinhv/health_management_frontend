/**
 * User-related types
 */

export interface UserProfile {
  id?: number;
  user_id?: number;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  date_of_birth?: string;
  family_medical_history?: string;
  goal?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserData {
  id?: number;
  email?: string;
  phone_number?: string;
  email_verified?: boolean;
  is_active?: boolean;
  provider?: string;
  created_at?: string;
  updated_at?: string;
  profile?: UserProfile | null;
  [key: string]: unknown;
}

export interface UpdateUserProfileData {
  email?: string;
  is_active?: boolean;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  date_of_birth?: string; // YYYY-MM-DD format
  family_medical_history?: string;
  goal?: string;
}
