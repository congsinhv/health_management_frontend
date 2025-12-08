// Status types
export type ExerciseStatus =
  | 'pending'
  | 'completed'
  | 'skipped'
  | 'in_progress';
export type ScheduleStatus = 'active' | 'paused' | 'superseded';
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
export type HealthGoal = 'gain' | 'lose' | 'maintain';
export type ScheduleMode = 'fixed' | 'flexible';

// Weekly exercise structure (per day)
export interface WeeklyExercise {
  exercise: string;
  duration_minutes: number;
  estimated_calories: number;
  description: string;
  status: ExerciseStatus;
  error_message: string | null;
}

// Full schedule object
export interface Schedule {
  id: number;
  user_id: number;
  goal: HealthGoal;
  schedule_mode: ScheduleMode;
  selected_days: DayOfWeek[];
  timezone: string;
  weekly_plan: Partial<Record<DayOfWeek, WeeklyExercise>>;
  status: ScheduleStatus;
  created_at: string;
  updated_at: string;
}

// API response types
export interface ScheduleListResponse {
  schedules: Schedule[];
}

export interface UpdateScheduleStatusRequest {
  status: 'active' | 'paused';
}

export interface UpdateScheduleStatusResponse {
  id: number;
  status: ScheduleStatus;
  updated_at: string;
}
