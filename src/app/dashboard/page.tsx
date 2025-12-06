'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Header from '@/components/layout/Header';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Moon,
  Clock,
  Brain,
  TrendingUp,
  Flame,
  Battery,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';
import { useAuth } from '@/contexts/auth';

const convertProfile = p => ({
  id: p.id,
  userId: p.user_id,
  firstName: p.first_name,
  lastName: p.last_name,
  avatarUrl: p.avatar_url,
  gender: p.gender,
  heightCm: Number(p.height_cm),
  weightKg: Number(p.weight_kg),
  dateOfBirth: p.date_of_birth,
  familyMedicalHistory: p.family_medical_history,
  goal: p.goal,
  heartRate: p.heart_rate,
  exerciseMinutes: p.exercise_minutes,
  age: p.age,
  sleepHours: p.sleep_hours,
  waterIntake: p.water_intake,
});

// Dữ liệu người dùng mẫu từ database
const mockUser = {
  id: 1,
  email: 'nichols@example.com',
  firstName: 'Nichols',
  lastName: 'Anderson',
  avatarUrl: null,
  gender: 'male',
  heightCm: 175,
  weightKg: 70,
  dateOfBirth: '1990-05-15',
  familyMedicalHistory: 'Không có tiền sử đáng kể',
  goal: 'Duy trì lối sống lành mạnh và cải thiện thể lực',
  heartRate: 72,
  exerciseMinutes: 40,
  age: 35,
  sleepHours: 7.5,
  waterIntake: 2.2,
};

// Dữ liệu sức khỏe mẫu dựa trên hồ sơ người dùng
const generateHealthData = profile => {
  if (!profile) return null;

  const bmi = (profile.weightKg / Math.pow(profile.heightCm / 100, 2)).toFixed(
    1
  );

  return {
    exerciseMinutes: profile.exerciseMinutes,
    exerciseGoal: 60, // Mục tiêu 60 phút/ngày
    heartRate: profile.heartRate || 72,
    sleepHours: profile.sleepHours || 7.5,
    waterIntake: profile.waterIntake || 2.2,
    waterGoal: 2.5,
    height: profile.heightCm,
    weight: profile.weightKg,
    bmi,
    age: profile.age,
    calories: 2340,
    caloriesGoal: 2500,
  };
};

// Format date từ YYYY-MM-DD sang DD/MM
const formatDateToShort = dateString => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}/${month}`;
};

function DashboardContent() {
  const { user } = useAuth();
  const [timeView, setTimeView] = useState('daily');
  const [currentMonth, setCurrentMonth] = useState(11);
  const [currentYear, setCurrentYear] = useState(2025);

  // Fetch dữ liệu user từ API
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ['dashboardUserInfo', user?.id],
    queryFn: () => dashboardService.getDashboard_userInfo(Number(user?.id)),
    enabled: !!user?.id,
  });

  // Fetch dữ liệu hoạt động hàng ngày từ API
  const {
    data: dailyActivityData,
    isLoading: dailyLoading,
    error: dailyError,
  } = useQuery({
    queryKey: ['dashboardDailyActivity', user?.id],
    queryFn: () => dashboardService.getDashboard_Daily(Number(user?.id)),
    enabled: !!user?.id,
  });

  // Fetch dữ liệu hoạt động hàng tuần từ API
  const {
    data: weeklyActivityData,
    isLoading: weeklyLoading,
    error: weeklyError,
  } = useQuery({
    queryKey: ['dashboardWeeklyActivity', user?.id],
    queryFn: () => dashboardService.getDashboard_weekly(Number(user?.id)),
    enabled: !!user?.id,
  });

  // Fetch dữ liệu hoạt động hàng tháng từ API
  const {
    data: monthlyActivityData,
    isLoading: monthlyLoading,
    error: monthlyError,
  } = useQuery({
    queryKey: ['dashboardMonthlyActivity', user?.id],
    queryFn: () => dashboardService.getDashboard_monthly(Number(user?.id)),
    enabled: !!user?.id,
  });

  // Fetch dữ liệu health summary từ API
  const {
    data: healthSummaryData,
    isLoading: healthSummaryLoading,
    error: healthSummaryError,
  } = useQuery({
    queryKey: ['dashboardHealthSummary', user?.id],
    queryFn: () =>
      dashboardService.getDashboard_healthSummary(Number(user?.id)),
    enabled: !!user?.id,
  });

  // Fetch dữ liệu dashboard overview từ API
  const {
    data: dashboardOverviewData,
    isLoading: dashboardOverviewLoading,
    error: dashboardOverviewError,
  } = useQuery({
    queryKey: ['dashboardOverview', user?.id],
    queryFn: () => dashboardService.getDashboard_overview(Number(user?.id)),
    enabled: !!user?.id,
  });

  // Sử dụng userData từ API, nếu không có thì dùng mock
  const userProfile = useMemo(() => {
    if (userData) return convertProfile(userData);
    return mockUser; // Fallback to mock data
  }, [userData]);

  const healthData = useMemo(() => {
    if (!userProfile) return null;
    return generateHealthData(userProfile);
  }, [userProfile]);

  // Format dữ liệu daily activity từ API
  const formattedDailyActivity = useMemo(() => {
    if (!dailyActivityData || !Array.isArray(dailyActivityData)) {
      return [];
    }

    // Sắp xếp theo ngày tăng dần
    const sortedData = [...dailyActivityData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Chuyển đổi dữ liệu từ API sang format cho biểu đồ
    return sortedData.map(item => ({
      date: formatDateToShort(item.date),
      fullDate: item.date,
      exerciseMinutes: item.exercise_minutes || 0,
      calories: item.calories || 0,
    }));
  }, [dailyActivityData]);

  // Format dữ liệu weekly activity từ API
  const formattedWeeklyActivity = useMemo(() => {
    if (!weeklyActivityData || !Array.isArray(weeklyActivityData)) {
      return [];
    }

    // Định nghĩa thứ tự các ngày trong tuần
    const dayOrder = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    // Sắp xếp theo thứ tự ngày trong tuần
    const sortedData = [...weeklyActivityData].sort((a, b) => {
      return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    });

    // Chuyển đổi dữ liệu từ API sang format cho biểu đồ
    return sortedData.map(item => ({
      day: item.day,
      value: item.total_minutes || 0,
    }));
  }, [weeklyActivityData]);

  // Format dữ liệu monthly activity từ API
  const formattedMonthlyActivity = useMemo(() => {
    if (!monthlyActivityData || !Array.isArray(monthlyActivityData)) {
      return [];
    }

    // Định nghĩa thứ tự các tháng
    const monthOrder = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];

    // Sắp xếp theo thứ tự tháng
    const sortedData = [...monthlyActivityData].sort((a, b) => {
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    // Chuyển đổi dữ liệu từ API sang format cho biểu đồ
    return sortedData.map(item => ({
      month: item.month,
      avgExercise: parseFloat(item.avg_exercise) || 0,
    }));
  }, [monthlyActivityData]);

  // Lấy exercise minutes và calories hôm nay từ daily activity
  const todayData = useMemo(() => {
    if (!formattedDailyActivity || formattedDailyActivity.length === 0) {
      return {
        exerciseMinutes: healthData?.exerciseMinutes || 40,
        calories: healthData?.calories || 2340,
      };
    }

    // Lấy ngày hôm nay
    const today = new Date().toISOString().split('T')[0];
    const todayData = formattedDailyActivity.find(item => {
      // So sánh fullDate (YYYY-MM-DD) với ngày hôm nay
      const itemDate = new Date(item.fullDate).toISOString().split('T')[0];
      return itemDate === today;
    });

    return {
      exerciseMinutes:
        todayData?.exerciseMinutes || healthData?.exerciseMinutes || 40,
      calories: todayData?.calories || healthData?.calories || 2340,
    };
  }, [formattedDailyActivity, healthData]);

  // Loading state
  if (
    userLoading ||
    dailyLoading ||
    weeklyLoading ||
    monthlyLoading ||
    healthSummaryLoading ||
    dashboardOverviewLoading
  ) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <Header className='sticky top-0 left-0 z-50 w-full' />
        <main className='container mx-auto p-4'>
          <div className='flex items-center justify-center py-12'>
            <p className='text-gray-600 dark:text-gray-300'>
              Đang tải dữ liệu...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (
    userError ||
    dailyError ||
    weeklyError ||
    monthlyError ||
    healthSummaryError ||
    dashboardOverviewError
  ) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <Header className='sticky top-0 left-0 z-50 w-full' />
        <main className='container mx-auto p-4'>
          <div className='flex items-center justify-center py-12'>
            <p className='text-red-600 dark:text-red-400'>
              Không thể tải dữ liệu từ API
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Đề xuất AI dựa trên dữ liệu từ API
  const generateAISuggestions = () => {
    const suggestions = [];

    // Sử dụng data từ dashboard overview
    if (dashboardOverviewData) {
      // Sử dụng quick tips từ API
      if (
        dashboardOverviewData.quick_tips &&
        dashboardOverviewData.quick_tips.length > 0
      ) {
        dashboardOverviewData.quick_tips.forEach((tip, index) => {
          suggestions.push({
            type: 'info',
            title: '💡 Mẹo hữu ích',
            message: tip,
          });
        });
      }

      // Phân tích dựa trên key metrics
      const metrics = dashboardOverviewData.key_metrics;

      if (metrics.exercise && metrics.exercise.percentage < 80) {
        suggestions.push({
          type: 'warning',
          title: '🏃 Cần tập thêm',
          message:
            metrics.exercise.message ||
            `Bạn đã tập ${metrics.exercise.daily} phút hôm nay.`,
        });
      }

      if (metrics.water && metrics.water.percentage < 80) {
        suggestions.push({
          type: 'info',
          title: '💧 Nhắc nhở uống nước',
          message:
            metrics.water.message ||
            `Bạn đã uống ${metrics.water.intake}L nước.`,
        });
      }

      if (metrics.bmi) {
        suggestions.push({
          type: metrics.bmi.status === 'bình thường' ? 'success' : 'warning',
          title: '⚖️ Chỉ số BMI',
          message:
            metrics.bmi.message || `BMI của bạn là ${metrics.bmi.value}.`,
        });
      }

      if (metrics.sleep && metrics.sleep.status !== 'tốt') {
        suggestions.push({
          type: 'warning',
          title: '😴 Chất lượng giấc ngủ',
          message:
            metrics.sleep.message || `Bạn đã ngủ ${metrics.sleep.hours} giờ.`,
        });
      }

      if (metrics.heart_rate && metrics.heart_rate.status !== 'bình thường') {
        suggestions.push({
          type: 'warning',
          title: '❤️ Nhịp tim',
          message:
            metrics.heart_rate.message ||
            `Nhịp tim của bạn là ${metrics.heart_rate.bpm} BPM.`,
        });
      }
    }

    // Fallback nếu không có data từ API
    if (suggestions.length === 0 && healthData) {
      // Giữ nguyên logic cũ như fallback
      const exercisePercentage = (
        (todayData.exerciseMinutes / healthData.exerciseGoal) *
        100
      ).toFixed(0);
      if (exercisePercentage >= 80) {
        suggestions.push({
          type: 'success',
          title: '🎯 Tập luyện tuyệt vời!',
          message: `Bạn đã đạt ${exercisePercentage}% mục tiêu tập luyện hôm nay. Tiếp tục duy trì!`,
        });
      } else {
        suggestions.push({
          type: 'warning',
          title: '🏃 Cần tập thêm',
          message: `Bạn còn ${healthData.exerciseGoal - todayData.exerciseMinutes} phút để đạt mục tiêu. Hãy cố gắng thêm!`,
        });
      }

      // Lượng nước uống
      const waterPercentage = (
        (healthData.waterIntake / healthData.waterGoal) *
        100
      ).toFixed(0);
      if (waterPercentage < 80) {
        suggestions.push({
          type: 'info',
          title: '💧 Nhắc nhở uống nước',
          message: `Bạn cần uống thêm ${(healthData.waterGoal - healthData.waterIntake).toFixed(1)}L nước để đạt mục tiêu hôm nay.`,
        });
      }

      // Phân tích BMI
      const bmi = parseFloat(healthData.bmi);
      if (bmi >= 18.5 && bmi < 25) {
        suggestions.push({
          type: 'success',
          title: '⚖️ BMI lý tưởng',
          message: `BMI của bạn là ${bmi}, nằm trong khoảng cân nặng khỏe mạnh. Tuyệt vời!`,
        });
      } else if (bmi >= 25) {
        suggestions.push({
          type: 'warning',
          title: '⚖️ Kiểm soát cân nặng',
          message: `BMI của bạn là ${bmi}. Hãy tăng cường tập luyện và ăn uống lành mạnh.`,
        });
      }
    }

    return suggestions;
  };

  const aiSuggestions = generateAISuggestions();

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const prevMonthDays = getDaysInMonth(currentMonth - 1, currentYear);

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          className='py-2 text-center text-sm text-gray-400 dark:text-gray-600'
        >
          {prevMonthDays - i}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === 26;
      days.push(
        <div
          key={day}
          className={`cursor-pointer rounded-lg py-2 text-center text-sm transition-all ${
            isToday
              ? 'bg-blue-500 font-bold text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const getChartData = () => {
    if (timeView === 'weekly') return formattedWeeklyActivity;
    if (timeView === 'monthly') return formattedMonthlyActivity;
    return formattedDailyActivity;
  };

  const getDataKey = () => {
    if (timeView === 'weekly') return 'value';
    if (timeView === 'monthly') return 'avgExercise';
    return 'exerciseMinutes';
  };

  const getXAxisKey = () => {
    if (timeView === 'monthly') return 'month';
    if (timeView === 'weekly') return 'day';
    return 'date';
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <Header className='sticky top-0 left-0 z-50 w-full' />

      {/* Nội dung chính */}
      <main className='container mx-auto p-4'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Bảng điều khiển Sức khỏe
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Đây là tổng quan sức khỏe của bạn hôm nay -{' '}
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Thống kê nhanh */}
        <div className='mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <Clock className='h-5 w-5 text-blue-500' />
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    (dashboardOverviewData?.key_metrics?.exercise?.percentage ||
                      0) >= 80
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}
                >
                  {dashboardOverviewData?.key_metrics?.exercise?.percentage ||
                    0}
                  %
                </span>
              </div>
              <CardDescription>Thời gian tập thể dục</CardDescription>
              <CardTitle className='text-2xl'>
                {dashboardOverviewData?.key_metrics?.exercise?.daily || 0} phút
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Trạng thái:{' '}
                {dashboardOverviewData?.key_metrics?.exercise?.status ||
                  'Không có dữ liệu'}
              </p>
              <p className='mt-1 text-xs text-gray-500 dark:text-gray-500'>
                {dashboardOverviewData?.key_metrics?.exercise?.message || ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <Heart className='h-5 w-5 text-red-500' />
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    dashboardOverviewData?.key_metrics?.heart_rate?.status ===
                    'bình thường'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : dashboardOverviewData?.key_metrics?.heart_rate
                            ?.status === 'cao'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  }`}
                >
                  {dashboardOverviewData?.key_metrics?.heart_rate?.status ||
                    'Bình thường'}
                </span>
              </div>
              <CardDescription>Nhịp tim</CardDescription>
              <CardTitle className='text-2xl'>
                {dashboardOverviewData?.key_metrics?.heart_rate?.bpm || 0} BPM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {dashboardOverviewData?.key_metrics?.heart_rate?.comment ||
                  'Nhịp tim nghỉ ngơi'}
              </p>
              <p className='mt-1 text-xs text-gray-500 dark:text-gray-500'>
                {dashboardOverviewData?.key_metrics?.heart_rate?.message || ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <Moon className='h-5 w-5 text-purple-500' />
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    dashboardOverviewData?.key_metrics?.sleep?.status === 'tốt'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : dashboardOverviewData?.key_metrics?.sleep?.status ===
                          'trung bình'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  {dashboardOverviewData?.key_metrics?.sleep?.status || 'Tốt'}
                </span>
              </div>
              <CardDescription>Giấc ngủ</CardDescription>
              <CardTitle className='text-2xl'>
                {dashboardOverviewData?.key_metrics?.sleep?.hours || 0}h
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-sm ${
                  dashboardOverviewData?.key_metrics?.sleep?.status === 'tốt'
                    ? 'text-green-600 dark:text-green-400'
                    : dashboardOverviewData?.key_metrics?.sleep?.status ===
                        'trung bình'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                }`}
              >
                {dashboardOverviewData?.key_metrics?.sleep?.comment ||
                  'Giấc ngủ chất lượng tốt'}
              </p>
              <p className='mt-1 text-xs text-gray-500 dark:text-gray-500'>
                {dashboardOverviewData?.key_metrics?.sleep?.message || ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <Droplets className='h-5 w-5 text-cyan-500' />
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    (dashboardOverviewData?.key_metrics?.water?.percentage ||
                      0) >= 80
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : (dashboardOverviewData?.key_metrics?.water
                            ?.percentage || 0) >= 50
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  {dashboardOverviewData?.key_metrics?.water?.percentage || 0}%
                </span>
              </div>
              <CardDescription>Lượng nước uống</CardDescription>
              <CardTitle className='text-2xl'>
                {dashboardOverviewData?.key_metrics?.water?.intake || 0}L
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-sm ${
                  (dashboardOverviewData?.key_metrics?.water?.percentage ||
                    0) >= 80
                    ? 'text-green-600 dark:text-green-400'
                    : (dashboardOverviewData?.key_metrics?.water?.percentage ||
                          0) >= 50
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                }`}
              >
                Mục tiêu:{' '}
                {dashboardOverviewData?.key_metrics?.water?.ideal || 0}L
              </p>
              <p className='mt-1 text-xs text-gray-500 dark:text-gray-500'>
                {dashboardOverviewData?.key_metrics?.water?.message || ''}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tóm tắt hồ sơ người dùng */}
        <div className='mb-8'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Tóm tắt Hồ sơ</CardTitle>
                <div className='flex items-center space-x-2'>
                  <Battery className='h-5 w-5 text-green-500' />
                  <span
                    className={`text-lg font-bold ${
                      dashboardOverviewData?.health_score?.color === 'green'
                        ? 'text-green-600 dark:text-green-400'
                        : dashboardOverviewData?.health_score?.color ===
                            'yellow'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {dashboardOverviewData?.health_score?.overall || 0}/100
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Tuổi
                  </p>
                  <p className='text-lg font-semibold'>
                    {dashboardOverviewData?.user_info?.age ||
                      userProfile?.age ||
                      0}{' '}
                    tuổi
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    BMI
                  </p>
                  <p className='text-lg font-semibold'>
                    {dashboardOverviewData?.key_metrics?.bmi?.value ||
                      healthData?.bmi ||
                      0}
                  </p>
                  <p
                    className={`text-xs ${
                      dashboardOverviewData?.key_metrics?.bmi?.status ===
                      'bình thường'
                        ? 'text-green-600 dark:text-green-400'
                        : dashboardOverviewData?.key_metrics?.bmi?.status ===
                            'thừa cân'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {dashboardOverviewData?.key_metrics?.bmi?.category || ''}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Hoạt động hôm nay
                  </p>
                  <p className='text-lg font-semibold'>
                    {dashboardOverviewData?.activity_summary?.daily?.count || 0}{' '}
                    bài tập
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-500'>
                    {dashboardOverviewData?.activity_summary?.daily?.last_date
                      ? `Cập nhật: ${dashboardOverviewData.activity_summary.daily.last_date}`
                      : ''}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Mục tiêu
                  </p>
                  <p className='truncate text-lg font-semibold'>
                    {dashboardOverviewData?.user_info?.goal ||
                      userProfile?.goal ||
                      'Không có'}
                  </p>
                </div>
              </div>

              {/* Hiển thị tóm tắt từ health summary */}
              {healthSummaryData?.summary && (
                <div className='mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-950'>
                  <div className='mb-1 flex items-center'>
                    <Brain className='mr-2 h-4 w-4 text-blue-500' />
                    <p className='text-sm font-medium text-blue-900 dark:text-blue-100'>
                      Tóm tắt sức khỏe
                    </p>
                  </div>
                  <p className='text-sm text-blue-700 dark:text-blue-300'>
                    {healthSummaryData.summary}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lưới chính */}
        <div className='mb-6 grid gap-6 lg:grid-cols-3'>
          {/* Biểu đồ hoạt động */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Thời gian tập thể dục</CardTitle>
                  <CardDescription>
                    Theo dõi tiến độ thời gian tập luyện hàng ngày (phút)
                  </CardDescription>
                </div>
                <div className='flex gap-2'>
                  <Button
                    onClick={() => setTimeView('daily')}
                    variant={timeView === 'daily' ? 'default' : 'outline'}
                    size='sm'
                  >
                    Hàng ngày
                  </Button>
                  <Button
                    onClick={() => setTimeView('weekly')}
                    variant={timeView === 'weekly' ? 'default' : 'outline'}
                    size='sm'
                  >
                    Hàng tuần
                  </Button>
                  <Button
                    onClick={() => setTimeView('monthly')}
                    variant={timeView === 'monthly' ? 'default' : 'outline'}
                    size='sm'
                  >
                    Hàng tháng
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={280}>
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#3B82F6' stopOpacity={0.3} />
                      <stop offset='95%' stopColor='#3B82F6' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis
                    dataKey={getXAxisKey()}
                    stroke='#888'
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke='#888'
                    style={{ fontSize: '12px' }}
                    label={{
                      value: 'Phút',
                      angle: -90,
                      position: 'insideLeft',
                      offset: -10,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value, name) => {
                      if (
                        name === 'exerciseMinutes' ||
                        name === 'value' ||
                        name === 'avgExercise'
                      ) {
                        return [`${value} phút`, 'Thời gian tập'];
                      }
                      return [value, name];
                    }}
                    labelFormatter={label => {
                      if (timeView === 'daily') {
                        return `Ngày: ${label}`;
                      } else if (timeView === 'weekly') {
                        return `Thứ: ${label}`;
                      } else {
                        return `Tháng: ${label}`;
                      }
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey={getDataKey()}
                    stroke='#3B82F6'
                    strokeWidth={3}
                    fill='url(#colorValue)'
                    name='Thời gian tập'
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Hiển thị thông tin activity summary từ API */}
              {timeView === 'weekly' &&
                dashboardOverviewData?.activity_summary?.weekly && (
                  <div className='mt-4 text-sm text-gray-600 dark:text-gray-400'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='font-medium'>Tổng thời gian tập:</p>
                        <p className='text-lg font-bold text-blue-600 dark:text-blue-400'>
                          {
                            dashboardOverviewData.activity_summary.weekly
                              .total_minutes
                          }{' '}
                          phút
                        </p>
                      </div>
                      <div>
                        <p className='font-medium'>Số ngày hoạt động:</p>
                        <p className='text-lg font-bold text-green-600 dark:text-green-400'>
                          {
                            dashboardOverviewData.activity_summary.weekly
                              .days_active
                          }{' '}
                          ngày
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {timeView === 'monthly' &&
                dashboardOverviewData?.activity_summary?.monthly && (
                  <div className='mt-4 text-sm text-gray-600 dark:text-gray-400'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='font-medium'>Trung bình tháng:</p>
                        <p className='text-lg font-bold text-purple-600 dark:text-purple-400'>
                          {
                            dashboardOverviewData.activity_summary.monthly
                              .avg_exercise
                          }{' '}
                          phút/ngày
                        </p>
                      </div>
                      <div>
                        <p className='font-medium'>Tháng:</p>
                        <p className='text-lg font-bold text-gray-700 dark:text-gray-300'>
                          {dashboardOverviewData.activity_summary.monthly.month}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Lịch */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() =>
                    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1))
                  }
                >
                  <ChevronLeft className='h-5 w-5' />
                </Button>
                <CardTitle className='text-base'>
                  {monthNames[currentMonth]} {currentYear}
                </CardTitle>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() =>
                    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1))
                  }
                >
                  <ChevronRight className='h-5 w-5' />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='mb-2 grid grid-cols-7 gap-1'>
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                  <div
                    key={day}
                    className='py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400'
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className='grid grid-cols-7 gap-1'>{renderCalendar()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Phần dưới */}
        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Cột trái */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Biểu đồ calo */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>Biểu đồ Calories</CardTitle>
                    <CardDescription>
                      Lượng calories đốt cháy hàng ngày
                    </CardDescription>
                  </div>
                  <Flame className='h-6 w-6 text-orange-500' />
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={250}>
                  <LineChart data={formattedDailyActivity}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis
                      dataKey='date'
                      stroke='#888'
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke='#888'
                      style={{ fontSize: '12px' }}
                      label={{
                        value: 'Calories',
                        angle: -90,
                        position: 'insideLeft',
                        offset: -10,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                      formatter={(value, name) => {
                        if (name === 'calories') {
                          return [`${value} cal`, 'Calories'];
                        }
                        if (name === 'exerciseMinutes') {
                          return [`${value} phút`, 'Thời gian tập'];
                        }
                        return [value, name];
                      }}
                      labelFormatter={label => `Ngày: ${label}`}
                    />
                    <Line
                      type='monotone'
                      dataKey='calories'
                      stroke='#F59E0B'
                      strokeWidth={2}
                      dot={{ fill: '#F59E0B', r: 4 }}
                      name='Calories'
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className='mt-4 flex items-center justify-between rounded-lg bg-orange-50 p-3 dark:bg-orange-950'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Hôm nay
                    </p>
                    <p className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
                      {todayData.calories} cal
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Mục tiêu
                    </p>
                    <p className='text-lg font-semibold text-gray-700 dark:text-gray-300'>
                      {healthData?.caloriesGoal || 2500} cal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Đề xuất AI */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>Thông tin chi tiết</CardTitle>
                    <CardDescription>
                      Đề xuất cá nhân hóa dựa trên dữ liệu của bạn
                    </CardDescription>
                  </div>
                  <Brain className='h-6 w-6 text-purple-500' />
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                {aiSuggestions.length > 0 ? (
                  aiSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border-l-4 p-4 ${
                        suggestion.type === 'success'
                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                          : suggestion.type === 'warning'
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950'
                            : 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      }`}
                    >
                      <h4 className='mb-1 text-sm font-semibold text-gray-900 dark:text-white'>
                        {suggestion.title}
                      </h4>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {suggestion.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Không có đề xuất nào vào lúc này.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cột phải */}
          <div className='space-y-6'>
            {/* Sức khỏe tổng quan */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle>Tổng quan sức khỏe</CardTitle>
                  <TrendingUp className='h-5 w-5 text-green-500' />
                </div>
                <CardDescription>
                  Đánh giá tổng quan về sức khỏe của bạn dựa trên AI
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-4 dark:from-blue-950 dark:to-cyan-950'>
                  <div className='mb-3 flex items-center justify-between'>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      Điểm sức khỏe tổng thể
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        dashboardOverviewData?.health_score?.color === 'green'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : dashboardOverviewData?.health_score?.color ===
                              'yellow'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {dashboardOverviewData?.health_score?.overall || 0}/100
                    </span>
                  </div>
                  <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                    {dashboardOverviewData?.health_score?.status
                      ? `Sức khỏe của bạn đang ở mức "${dashboardOverviewData.health_score.status}".`
                      : 'Không có đủ dữ liệu để đánh giá.'}
                  </p>
                </div>

                {/* Hiển thị AI summary từ dashboard overview */}
                {dashboardOverviewData?.ai_summary && (
                  <div className='rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4 dark:from-purple-950 dark:to-pink-950'>
                    <div className='mb-2 flex items-center'>
                      <Brain className='mr-2 h-4 w-4 text-purple-500' />
                      <p className='text-sm font-medium text-purple-900 dark:text-purple-100'>
                        📊 Tổng kết AI
                      </p>
                    </div>
                    <p className='text-sm text-purple-700 dark:text-purple-300'>
                      {dashboardOverviewData.ai_summary}
                    </p>
                  </div>
                )}

                {/* Hiển thị Quick Tips */}
                {dashboardOverviewData?.quick_tips &&
                  dashboardOverviewData.quick_tips.length > 0 && (
                    <div className='rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:from-green-950 dark:to-emerald-950'>
                      <p className='mb-2 text-sm font-medium text-green-900 dark:text-green-100'>
                        💡 Mẹo nhanh cho bạn
                      </p>
                      <ul className='space-y-2 text-sm text-green-700 dark:text-green-300'>
                        {dashboardOverviewData.quick_tips
                          .slice(0, 3)
                          .map((tip, index) => (
                            <li key={index} className='flex items-start'>
                              <span className='mt-1 mr-2'>•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Hành động nhanh */}
            <Card>
              <CardHeader>
                <CardTitle>Hành động nhanh</CardTitle>
                <CardDescription>
                  Theo dõi dữ liệu sức khỏe của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button className='w-full justify-start' variant='outline'>
                  <span className='mr-2'>🩺</span>
                  Ghi nhận triệu chứng
                </Button>
                <Button className='w-full justify-start' variant='outline'>
                  <span className='mr-2'>💊</span>
                  Ghi nhận thuốc
                </Button>
                <Button className='w-full justify-start' variant='outline'>
                  <span className='mr-2'>🏃</span>
                  Theo dõi tập luyện
                </Button>
                <Button className='w-full justify-start' variant='outline'>
                  <span className='mr-2'>🥗</span>
                  Ghi nhận bữa ăn
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
