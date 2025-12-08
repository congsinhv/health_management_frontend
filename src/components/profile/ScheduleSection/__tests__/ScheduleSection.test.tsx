import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ScheduleSection } from '../index';
import * as useSchedulesHook from '@/hooks/useSchedules';
import { Schedule } from '@/types/schedule';

// Mock the useSchedules and useUpdateScheduleStatus hooks
jest.mock('@/hooks/useSchedules', () => ({
  useSchedules: jest.fn(),
  useUpdateScheduleStatus: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockSchedule: Schedule = {
  id: 1,
  user_id: 1,
  goal: 'maintain',
  schedule_mode: 'flexible',
  selected_days: ['monday', 'wednesday', 'friday'],
  timezone: 'Asia/Ho_Chi_Minh',
  weekly_plan: {
    monday: {
      exercise: 'Chạy bộ',
      duration_minutes: 30,
      estimated_calories: 200,
      description: 'Chạy nhẹ nhàng',
      status: 'pending',
      error_message: null,
    },
  },
  status: 'active',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
};

describe('ScheduleSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useSchedulesHook.useSchedules as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<ScheduleSection />, { wrapper: AllTheProviders });
    expect(screen.getAllByText('Lịch tập luyện')[0]).toBeInTheDocument();
    // Assuming Skeleton is rendered, we can't easily query skeleton content without test-id
    // But we check that EmptyState and ScheduleCard are not there
    expect(
      screen.queryByText('Chưa có kế hoạch tập luyện nào được tạo.')
    ).not.toBeInTheDocument();
  });

  it('renders empty state when no schedules', () => {
    (useSchedulesHook.useSchedules as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<ScheduleSection />, { wrapper: AllTheProviders });
    expect(
      screen.getByText('Chưa có kế hoạch tập luyện nào được tạo.')
    ).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useSchedulesHook.useSchedules as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
    });

    render(<ScheduleSection />, { wrapper: AllTheProviders });
    expect(
      screen.getByText('Không thể tải lịch tập luyện. Vui lòng thử lại sau.')
    ).toBeInTheDocument();
  });

  it('renders schedules list', () => {
    (useSchedulesHook.useSchedules as jest.Mock).mockReturnValue({
      data: [mockSchedule],
      isLoading: false,
      error: null,
    });

    render(<ScheduleSection />, { wrapper: AllTheProviders });
    expect(screen.getByText(/Lịch tập Linh hoạt/)).toBeInTheDocument();
    expect(screen.getByText('Đang hoạt động')).toBeInTheDocument();
    expect(screen.getByText('Duy trì')).toBeInTheDocument();
    expect(screen.getByText('Chạy bộ')).toBeInTheDocument();
  });

  it('calls update status when toggle is clicked', () => {
    const mutateMock = jest.fn();
    (useSchedulesHook.useUpdateScheduleStatus as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });

    (useSchedulesHook.useSchedules as jest.Mock).mockReturnValue({
      data: [mockSchedule],
      isLoading: false,
      error: null,
    });

    render(<ScheduleSection />, { wrapper: AllTheProviders });

    const toggle = screen.getByLabelText('Chuyển trạng thái lịch tập');
    fireEvent.click(toggle);

    expect(mutateMock).toHaveBeenCalledWith({
      id: 1,
      status: 'paused', // Was active, so toggle to paused
    });
  });
});
