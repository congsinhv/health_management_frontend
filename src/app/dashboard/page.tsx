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
    steps: profile.exerciseMinutes * 100, // Giả sử 100 bước/phút
    stepsGoal: 10000,
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

  // Sử dụng userData từ API, nếu không có thì dùng mock
  const userProfile = useMemo(() => {
    if (userData) return convertProfile(userData);
    return mockUser; // Fallback to mock data
  }, [userData]);

  const healthData = useMemo(() => {
    if (!userProfile) return null;
    return generateHealthData(userProfile);
  }, [userProfile]);

  // Loading state
  if (userLoading) {
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
  if (userError) {
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

  // Dữ liệu biểu đồ theo thời gian
  const dailyActivityData = [
    { date: '16', steps: 7200, heartRate: 68, calories: 2100 },
    { date: '17', steps: 9500, heartRate: 74, calories: 2400 },
    { date: '18', steps: 6800, heartRate: 70, calories: 2000 },
    { date: '19', steps: 10200, heartRate: 76, calories: 2600 },
    { date: '20', steps: 8100, heartRate: 71, calories: 2200 },
    { date: '21', steps: 9800, heartRate: 73, calories: 2450 },
    { date: '22', steps: 12500, heartRate: 78, calories: 2800 },
    { date: '23', steps: 11200, heartRate: 75, calories: 2650 },
    { date: '24', steps: 10800, heartRate: 74, calories: 2500 },
    { date: '25', steps: 8900, heartRate: 72, calories: 2300 },
    { date: '26', steps: 8432, heartRate: 72, calories: 2340 },
  ];

  const weeklyData = [
    { day: 'T2', value: 8500, weight: 70.2 },
    { day: 'T3', value: 9200, weight: 70.1 },
    { day: 'T4', value: 7800, weight: 70.0 },
    { day: 'T5', value: 10200, weight: 69.9 },
    { day: 'T6', value: 8900, weight: 70.0 },
    { day: 'T7', value: 11500, weight: 70.1 },
    { day: 'CN', value: 6500, weight: 70.0 },
  ];

  const monthlyData = [
    { month: 'Th7', avgSteps: 8200, avgWeight: 71.5 },
    { month: 'Th8', avgSteps: 8500, avgWeight: 71.2 },
    { month: 'Th9', avgSteps: 8800, avgWeight: 70.8 },
    { month: 'Th10', avgSteps: 9100, avgWeight: 70.5 },
    { month: 'Th11', avgSteps: 9300, avgWeight: 70.2 },
    { month: 'Th12', avgSteps: 9000, avgWeight: 70.0 },
  ];

  // Đề xuất AI dựa trên dữ liệu người dùng
  const generateAISuggestions = () => {
    const suggestions = [];

    if (!healthData) return suggestions;

    // Phân tích số bước chân
    const stepsPercentage = (
      (healthData.steps / healthData.stepsGoal) *
      100
    ).toFixed(0);
    if (stepsPercentage >= 80) {
      suggestions.push({
        type: 'success',
        title: '🎯 Hoạt động tuyệt vời!',
        message: `Bạn đã đạt ${stepsPercentage}% mục tiêu bước chân hôm nay. Tiếp tục duy trì!`,
      });
    } else {
      suggestions.push({
        type: 'warning',
        title: '🚶 Tăng hoạt động',
        message: `Bạn còn ${healthData.stepsGoal - healthData.steps} bước để đạt mục tiêu. Hãy đi bộ thêm 15 phút!`,
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
    if (timeView === 'weekly') return weeklyData;
    if (timeView === 'monthly') return monthlyData;
    return dailyActivityData;
  };

  const getDataKey = () => {
    if (timeView === 'weekly') return 'value';
    if (timeView === 'monthly') return 'avgSteps';
    return 'steps';
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
                <span className='rounded bg-green-50 px-2 py-1 text-xs font-semibold text-green-600 dark:bg-green-950 dark:text-green-400'>
                  {healthData
                    ? ((healthData.steps / healthData.stepsGoal) * 100).toFixed(
                        0
                      )
                    : 0}
                  %
                </span>
              </div>
              <CardDescription>Thời gian tập thể dục</CardDescription>
              <CardTitle className='text-2xl'>
                {healthData ? healthData.steps.toLocaleString() : 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Mục tiêu:{' '}
                {healthData ? healthData.stepsGoal.toLocaleString() : 0} h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <Heart className='h-5 w-5 text-red-500' />
                <span className='rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400'>
                  Bình thường
                </span>
              </div>
              <CardDescription>Nhịp tim</CardDescription>
              <CardTitle className='text-2xl'>
                {healthData ? healthData.heartRate : 0} BPM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Nhịp tim nghỉ ngơi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <Moon className='h-5 w-5 text-purple-500' />
                <span className='rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-400'>
                  Tốt
                </span>
              </div>
              <CardDescription>Giấc ngủ</CardDescription>
              <CardTitle className='text-2xl'>
                {healthData ? healthData.sleepHours : 0}h
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-blue-600 dark:text-blue-400'>
                Giấc ngủ chất lượng tốt
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <Droplets className='h-5 w-5 text-cyan-500' />
                <span className='rounded bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-950 dark:text-orange-400'>
                  {healthData
                    ? (
                        (healthData.waterIntake / healthData.waterGoal) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </span>
              </div>
              <CardDescription>Lượng nước uống</CardDescription>
              <CardTitle className='text-2xl'>
                {healthData ? healthData.waterIntake : 0}L
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-orange-600 dark:text-orange-400'>
                Mục tiêu: {healthData ? healthData.waterGoal : 0}L
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tóm tắt hồ sơ người dùng */}
        <div className='mb-8'>
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt Hồ sơ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Tuổi
                  </p>
                  <p className='text-lg font-semibold'>
                    {userProfile?.age || 0} tuổi
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Chiều cao
                  </p>
                  <p className='text-lg font-semibold'>
                    {userProfile?.heightCm || 0} cm
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Cân nặng
                  </p>
                  <p className='text-lg font-semibold'>
                    {userProfile?.weightKg || 0} kg
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    BMI
                  </p>
                  <p className='text-lg font-semibold'>
                    {healthData?.bmi || 0}
                  </p>
                </div>
              </div>
              {userProfile?.goal && (
                <div className='mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-950'>
                  <p className='text-sm font-medium text-blue-900 dark:text-blue-100'>
                    Mục tiêu của bạn
                  </p>
                  <p className='text-sm text-blue-700 dark:text-blue-300'>
                    {userProfile.goal}
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
                    Theo dõi tiến độ thời gian tập luyện hàng ngày
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
                  <YAxis stroke='#888' style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey={getDataKey()}
                    stroke='#3B82F6'
                    strokeWidth={3}
                    fill='url(#colorValue)'
                  />
                </AreaChart>
              </ResponsiveContainer>
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
                <CardTitle>Biểu đồ calo</CardTitle>
                <CardDescription>
                  Lượng calo tiêu thụ và đốt cháy hàng ngày
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={250}>
                  <LineChart data={dailyActivityData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis
                      dataKey='date'
                      stroke='#888'
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis stroke='#888' style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='calories'
                      stroke='#F59E0B'
                      strokeWidth={2}
                      dot={{ fill: '#F59E0B', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className='mt-4 flex items-center justify-between rounded-lg bg-orange-50 p-3 dark:bg-orange-950'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Hôm nay
                    </p>
                    <p className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
                      {healthData?.calories || 0}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Mục tiêu
                    </p>
                    <p className='text-lg font-semibold text-gray-700 dark:text-gray-300'>
                      {healthData?.caloriesGoal || 0}
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
                  <CardTitle>Tổng quan</CardTitle>
                  <Button variant='link' size='sm'>
                    Xem tất cả
                  </Button>
                </div>
                <CardDescription>
                  Đánh giá tổng quan về sức khỏe của bạn dựa trên AI
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-800'>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                    Tình trạng sức khỏe tổng thể
                  </p>
                  <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                    {healthData
                      ? `Dựa trên các chỉ số hiện tại, sức khỏe của bạn đang ở mức tốt. Tiếp tục duy trì lối sống lành mạnh.`
                      : `Không có đủ dữ liệu để đánh giá.`}
                  </p>
                </div>
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
