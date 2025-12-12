import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

interface TimePeriod {
  start_time: string;
  end_time: string;
}

interface FixedPeriod {
  start_time: string;
  end_time: string;
}

interface SchedulePayload {
  schedule_mode: 'fixed' | 'flexible';
  selected_days: string[];
  fixed_period?: FixedPeriod;
  time_periods?: Record<string, TimePeriod[]>;
}

interface RegenerateWeeklyPlanRequest {
  prediction_id: string;
  user_id: number;
  schedule: SchedulePayload;
  timezone: string;
}

interface RegenerateWeeklyPlanResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Map từ tiếng Việt sang tiếng Anh (legacy support)
const DAY_MAP: Record<string, string> = {
  'T 2': 'monday',
  'T 3': 'tuesday',
  'T 4': 'wednesday',
  'T 5': 'thursday',
  'T 6': 'friday',
  'T 7': 'saturday',
  CN: 'sunday',
  // New format support
  'Thứ 2': 'monday',
  'Thứ 3': 'tuesday',
  'Thứ 4': 'wednesday',
  'Thứ 5': 'thursday',
  'Thứ 6': 'friday',
  'Thứ 7': 'saturday',
  'Chủ nhật': 'sunday',
};

// Helper function: Normalize time to HH:mm:ss format
const normalizeTime = (timeStr: string): string => {
  const parts = timeStr.split(':');
  const hours = parts[0] || '00';
  const mins = parts[1] || '00';
  const secs = parts[2] || '00';
  return `${hours}:${mins}:${secs}`;
};

// Helper function: Thêm 5 phút vào thời gian
const addMinutes = (timeStr: string, minutes: number): string => {
  const [hours, mins] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};

export const appointmentService = {
  async regenerateWeeklyPlan(
    predictionId: string,
    userId: number,
    schedules: any[],
    scheduleType: 'flexible' | 'fixed',
    fixedTime?: string
  ): Promise<RegenerateWeeklyPlanResponse> {
    try {
      // Helper to get English day name - use dayValue if available, otherwise map from day label
      const getDayKey = (ds: any): string => ds.dayValue || DAY_MAP[ds.day];

      // Chuyển đổi selected_days
      const selectedDays = schedules.map(getDayKey);

      let schedulePayload: SchedulePayload;

      if (scheduleType === 'fixed') {
        // Lịch cố định - thời gian workout 5 phút
        const endTime = addMinutes(fixedTime || '08:00', 5);
        schedulePayload = {
          schedule_mode: 'fixed',
          selected_days: selectedDays,
          fixed_period: {
            start_time: normalizeTime(fixedTime || '08:00'),
            end_time: normalizeTime(endTime),
          },
        };
      } else {
        // Lịch linh hoạt - mỗi slot có thời gian workout 5 phút
        const timePeriods: Record<string, TimePeriod[]> = {};

        schedules.forEach(daySchedule => {
          const dayKey = getDayKey(daySchedule);
          timePeriods[dayKey] = daySchedule.timeSlots.map((slot: any) => {
            const endTime = addMinutes(slot.startTime, 5);
            return {
              start_time: normalizeTime(slot.startTime),
              end_time: normalizeTime(endTime),
            };
          });
        });

        schedulePayload = {
          schedule_mode: 'flexible',
          selected_days: selectedDays,
          time_periods: timePeriods,
        };
      }

      const requestData: RegenerateWeeklyPlanRequest = {
        prediction_id: predictionId,
        user_id: userId,
        schedule: schedulePayload,
        timezone: 'Asia/Ho_Chi_Minh',
      };

      const fullUrl = `${API_BASE_URL}/api/v1/predict/regenerate_weekly_plan`;

      // Lấy token từ localStorage
      const token = localStorage.getItem('access_token');

      const response = await axios.post<RegenerateWeeklyPlanResponse>(
        fullUrl,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Không thể tạo lịch hẹn. Vui lòng thử lại.';

      throw new Error(errorMessage);
    }
  },
};
