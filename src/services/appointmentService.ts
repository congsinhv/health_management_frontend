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
  'Thứ 2': 'monday',
  'Thứ 3': 'tuesday',
  'Thứ 4': 'wednesday',
  'Thứ 5': 'thursday',
  'Thứ 6': 'friday',
  'Thứ 7': 'saturday',
  CN: 'sunday',
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
        // Lịch cố định - thời gian bắt đầu = thời gian kết thúc (notification)
        schedulePayload = {
          schedule_mode: 'fixed',
          selected_days: selectedDays,
          fixed_period: {
            start_time: `${fixedTime}:00`,
            end_time: `${fixedTime}:00`, // Bằng nhau để thông báo
          },
        };
      } else {
        // Lịch linh hoạt - có khoảng thời gian
        const timePeriods: Record<string, TimePeriod[]> = {};

        schedules.forEach(daySchedule => {
          const dayKey = DAY_MAP[daySchedule.day];
          timePeriods[dayKey] = daySchedule.timeSlots.map((slot: any) => ({
            start_time: `${slot.startTime}:00`,
            end_time: `${slot.endTime}:00`,
          }));
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

      console.log('🚀 Sending request:', JSON.stringify(requestData, null, 2));

      const response = await axios.post<RegenerateWeeklyPlanResponse>(
        `${API_BASE_URL}/predict/regenerate_weekly_plan`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ Error regenerating weekly plan:', error);
      throw new Error(
        error.response?.data?.message ||
          'Không thể tạo lịch hẹn. Vui lòng thử lại.'
      );
    }
  },
};
