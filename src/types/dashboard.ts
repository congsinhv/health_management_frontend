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

export interface DailyActivity {
  date: string; // "2025-12-06"
  exercise_minutes: number; // 62
  calories: number; // 480
}

export interface WeeklyActivity {
  day: string;
  total_minutes: number;
}

export interface MonthlyActivity {
  month: string; // "Tháng 12"
  avg_exercise: string; // "41.4285714285714286"
}

export interface HealthSummary {
  summary: string;
}

export interface DashboardOverview {
  user_info: {
    user_id: number;
    name: string;
    age: number;
    goal: string;
  };
  health_score: {
    overall: number;
    status: string;
    color: string;
  };
  key_metrics: {
    bmi: {
      value: number;
      category: string;
      status: string;
      message: string;
    };
    exercise: {
      daily: number;
      percentage: number;
      status: string;
      message: string;
    };
    water: {
      intake: number;
      percentage: number;
      ideal: number;
      status: string;
      message: string;
    };
    sleep: {
      hours: number;
      status: string;
      comment: string;
      message: string;
    };
    heart_rate: {
      bpm: number;
      status: string;
      comment: string;
      message: string;
    };
  };
  activity_summary: {
    daily: {
      count: number;
      last_date: string;
    };
    weekly: {
      total_minutes: number;
      days_active: number;
    };
    monthly: {
      avg_exercise: string;
      month: string;
    };
  };
  ai_summary: string;
  quick_tips: string[];
}
