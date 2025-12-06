export interface UserInfo_Dashboard {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  avatar_url: string;
  gender: 'male' | 'female' | string;
  height_cm: string;
  weight_kg: string;
  date_of_birth: string;
  family_medical_history: string;
  goal: string;
  heart_rate: number;
  exercise_minutes: number;
  age: number;
  sleep_hours: number;
  water_intake: number;
  created_at: string;
  updated_at?: string;
}