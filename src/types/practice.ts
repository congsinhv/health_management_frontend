// TimePeriod for schedule
export interface TimePeriod {
  startTime: string; // HH:mm format
  endTime: string;
}

// Basic info section
export interface PracticeBasicInfo {
  height?: number;
  weight?: number;
  targetWeight: number;
  goal?: 'gain' | 'lose' | 'maintain';
}

// Schedule section
export interface PracticeSchedule {
  mode: 'flexible' | 'fixed';
  selectedDays: string[];
  flexiblePeriods?: Record<string, TimePeriod[]>;
  fixedPeriod?: TimePeriod;
}

// Sports section
export interface PracticeSports {
  predefined: string[];
  custom: string[];
}

// Notes section
export interface PracticeNotes {
  personal?: string;
  healthWarnings?: string;
}

// Full form data
export interface PracticeFormData {
  basicInfo: PracticeBasicInfo;
  schedule: PracticeSchedule;
  sports: PracticeSports;
  notes: PracticeNotes;
}

// API response for pre-fill data (basic profile)
export interface UserPracticeProfile {
  height_cm?: number;
  weight_kg?: number;
  goal?: string;
}

// Full practice profile API response
export interface PracticeProfileResponse {
  id: string;
  user_id: string;
  height_cm?: number;
  weight_kg?: number;
  target_weight_kg?: number;
  goal?: string;
  schedule?: {
    mode: 'flexible' | 'fixed';
    selected_days: string[];
    periods: Record<string, TimePeriod[]>;
  };
  sports?: {
    predefined: string[];
    custom: string[];
  };
  notes?: {
    personal?: string;
    health_warnings?: string;
  };
  created_at: string;
  updated_at: string;
}

// Schedule API request schema (new /schedules/ endpoint)
export interface ScheduleApiRequest {
  basic_info: {
    height_cm?: number;
    weight_kg?: number;
    target_weight_kg: number;
    goal?: 'gain' | 'lose' | 'maintain';
  };
  schedule: {
    schedule_mode: 'flexible' | 'fixed';
    selected_days: string[];
    // For flexible mode: time periods per day
    time_periods?: Record<
      string,
      Array<{ start_time: string; end_time: string }>
    >;
    // For fixed mode: single time period applied to all selected days
    fixed_period?: { start_time: string; end_time: string };
  };
  sports: {
    sports_predefined: string[];
    sports_custom: string[];
  };
  notes?: {
    notes_personal?: string | null;
    notes_health?: string | null;
  };
}

// Schedule API response
export interface ScheduleApiResponse {
  id: string;
  user_id: string;
  height_cm?: number;
  weight_kg?: number;
  target_weight_kg: number;
  goal?: 'gain' | 'lose' | 'maintain';
  schedule_mode: 'flexible' | 'fixed';
  schedule_days: string[];
  time_periods: Record<string, Array<{ start_time: string; end_time: string }>>;
  sports_predefined: string[];
  sports_custom: string[];
  notes_personal?: string | null;
  notes_health?: string | null;
  created_at: string;
  updated_at: string;
}
