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

// Map từ tiếng Việt sang tiếng Anh
const DAY_MAP: Record<string, string> = {
  'T 2': 'monday',
  'T 3': 'tuesday',
  'T 4': 'wednesday',
  'T 5': 'thursday',
  'T 6': 'friday',
  'T 7': 'saturday',
  CN: 'sunday',
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
      // Chuyển đổi selected_days
      const selectedDays = schedules.map(ds => DAY_MAP[ds.day]);

      let schedulePayload: SchedulePayload;

      if (scheduleType === 'fixed') {
        // Lịch cố định - thời gian workout 5 phút
        const endTime = addMinutes(fixedTime || '08:00', 5);
        schedulePayload = {
          schedule_mode: 'fixed',
          selected_days: selectedDays,
          fixed_period: {
            start_time: `${fixedTime}:00`,
            end_time: `${endTime}:00`, // +5 phút
          },
        };
      } else {
        // Lịch linh hoạt - mỗi slot có thời gian workout 5 phút
        const timePeriods: Record<string, TimePeriod[]> = {};

        schedules.forEach(daySchedule => {
          const dayKey = DAY_MAP[daySchedule.day];
          timePeriods[dayKey] = daySchedule.timeSlots.map((slot: any) => {
            const endTime = addMinutes(slot.startTime, 5);
            return {
              start_time: `${slot.startTime}:00`,
              end_time: `${endTime}:00`, // +5 phút
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
