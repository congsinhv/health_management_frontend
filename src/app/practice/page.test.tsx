import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth';
import PracticePage from './page';
import { deviceService } from '@/services/device';
import { userService } from '@/services/user';
import { isMobileDevice } from '@/lib/utils/platform';
import { requestNotificationPermission } from '@/lib/firebase';

// Mock all external dependencies
vi.mock('@/services/device');
vi.mock('@/services/user');
vi.mock('@/lib/utils/platform');
vi.mock('@/lib/firebase');
vi.mock('@/services/practice', () => ({
  savePracticeSchedule: vi.fn(),
}));

// Mock Next.js router
const mockSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: vi.fn((key: string) => mockSearchParams.get(key)),
  }),
}));

// Mock the form sections
vi.mock('@/components/practice', () => ({
  BasicInfoSection: ({ form }: any) => (
    <div data-testid='basic-info-section'>
      <input
        data-testid='height-input'
        {...form.register('basicInfo.height')}
        type='number'
        placeholder='Chiều cao'
      />
      <input
        data-testid='weight-input'
        {...form.register('basicInfo.weight')}
        type='number'
        placeholder='Cân nặng'
      />
      <input
        data-testid='target-weight-input'
        {...form.register('basicInfo.targetWeight')}
        type='number'
        placeholder='Cân nặng mục tiêu'
      />
      <select data-testid='goal-select' {...form.register('basicInfo.goal')}>
        <option value='gain'>Tăng cân</option>
        <option value='lose'>Giảm cân</option>
        <option value='maintain'>Giữ cân</option>
      </select>
    </div>
  ),
  ScheduleSection: ({ form }: any) => (
    <div data-testid='schedule-section'>
      <input data-testid='schedule-input' {...form.register('schedule.mode')} />
    </div>
  ),
  SportsSection: ({ form }: any) => (
    <div data-testid='sports-section'>
      <input
        data-testid='sports-input'
        {...form.register('sports.predefined')}
      />
    </div>
  ),
  NotesSection: ({ form }: any) => (
    <div data-testid='notes-section'>
      <textarea
        data-testid='personal-notes-input'
        {...form.register('notes.personal')}
        placeholder='Ghi chú cá nhân'
      />
      <textarea
        data-testid='health-warnings-input'
        {...form.register('notes.healthWarnings')}
        placeholder='Cảnh báo sức khỏe'
      />
    </div>
  ),
  NotificationSetupModal: ({ open, onOpenChange, onSuccess }: any) =>
    open ? (
      <div data-testid='notification-modal'>
        <h2>Đăng ký thiết bị</h2>
        <button
          data-testid='cancel-notification'
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </button>
        <button data-testid='confirm-notification' onClick={onSuccess}>
          Confirm
        </button>
      </div>
    ) : null,
}));

// Mock LoadingOverlay
vi.mock('@/components/shared/LoadingOverlay', () => ({
  LoadingOverlay: ({ isVisible, message }: any) =>
    isVisible ? (
      <div data-testid='loading-overlay'>
        <span>{message}</span>
      </div>
    ) : null,
}));

// Mock Header and Footer
vi.mock('@/components/layout/Header', () => ({
  default: ({ className }: any) => (
    <header data-testid='header' className={className}>
      Header
    </header>
  ),
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid='footer'>Footer</footer>,
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderPracticePage = (
  queryClient: QueryClient,
  mockUser: any = { id: 1, email: 'test@example.com' }
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        value={{
          user: mockUser,
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn(),
          isLoading: false,
          isAuthenticated: !!mockUser,
          refreshToken: vi.fn(),
        }}
      >
        <PracticePage />
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('Practice Page Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
    mockSearchParams.delete('device');

    // Default mocks
    vi.mocked(deviceService.getDevices).mockResolvedValue({
      success: true,
      data: {
        devices: [],
        total: 0,
        page: 1,
        limit: 10,
      },
    });

    vi.mocked(deviceService.hasMobileDevice).mockReturnValue(false);

    vi.mocked(userService.getProfile).mockResolvedValue({
      success: true,
      data: {
        profile: {
          height_cm: 170,
          weight_kg: 70,
          goal: 'maintain',
        },
      },
    });

    vi.mocked(isMobileDevice).mockReturnValue(false);
    vi.mocked(requestNotificationPermission).mockResolvedValue('mock-token');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Page loads and checks for devices', () => {
    it('should show loading state initially', () => {
      renderPracticePage(queryClient);

      expect(screen.getByText('Đang kiểm tra thiết bị...')).toBeInTheDocument();
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
    });

    it('should load page content after device check completes', async () => {
      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(
          screen.getByText('Thiết lập kế hoạch tập luyện')
        ).toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('basic-info-section')).toBeInTheDocument();
      expect(screen.getByTestId('schedule-section')).toBeInTheDocument();
      expect(screen.getByTestId('sports-section')).toBeInTheDocument();
      expect(screen.getByTestId('notes-section')).toBeInTheDocument();
    });

    it('should pre-fill form with user profile data', async () => {
      renderPracticePage(queryClient);

      await waitFor(() => {
        const heightInput = screen.getByTestId(
          'height-input'
        ) as HTMLInputElement;
        const weightInput = screen.getByTestId(
          'weight-input'
        ) as HTMLInputElement;
        const goalSelect = screen.getByTestId(
          'goal-select'
        ) as HTMLSelectElement;

        expect(heightInput.value).toBe('170');
        expect(weightInput.value).toBe('70');
        expect(goalSelect.value).toBe('maintain');
      });
    });
  });

  describe('2. Modal shows when no mobile device exists', () => {
    it('should show notification modal when no mobile device', async () => {
      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
        expect(screen.getByText('Đăng ký thiết bị')).toBeInTheDocument();
      });
    });

    it('should not show modal when mobile device exists', async () => {
      vi.mocked(deviceService.hasMobileDevice).mockReturnValue(true);
      vi.mocked(deviceService.getDevices).mockResolvedValue({
        success: true,
        data: {
          devices: [
            {
              id: 1,
              device_type: 'ios',
              fcm_token: 'token',
              device_name: 'iPhone',
              is_active: true,
              last_used_at: '2025-01-01T00:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
        },
      });

      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(
          screen.queryByTestId('notification-modal')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('3. Form submission is blocked without mobile device', () => {
    it('should block form submission and show error when no mobile device', async () => {
      const { savePracticeSchedule } = await import('@/services/practice');

      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(
          screen.getByText('Thiết lập kế hoạch tập luyện')
        ).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', {
        name: /đăng ký thiết bị trước/i,
      });

      // Fill required fields
      await userEvent.type(screen.getByTestId('height-input'), '170');
      await userEvent.type(screen.getByTestId('weight-input'), '70');
      await userEvent.type(screen.getByTestId('target-weight-input'), '70');

      // Try to submit
      fireEvent.click(submitButton);

      // Should show error message and modal
      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
      });

      const { toast } = await import('sonner');
      expect(toast.error).toHaveBeenCalledWith(
        'Vui lòng đăng ký thiết bị di động trước khi lưu'
      );

      // Should not call savePracticeSchedule
      expect(savePracticeSchedule).not.toHaveBeenCalled();
    });

    it('should allow submission when mobile device exists', async () => {
      const { savePracticeSchedule } = await import('@/services/practice');
      vi.mocked(savePracticeSchedule).mockResolvedValue({ success: true });

      vi.mocked(deviceService.hasMobileDevice).mockReturnValue(true);
      vi.mocked(deviceService.getDevices).mockResolvedValue({
        success: true,
        data: {
          devices: [
            {
              id: 1,
              device_type: 'ios',
              fcm_token: 'token',
              device_name: 'iPhone',
              is_active: true,
              last_used_at: '2025-01-01T00:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
        },
      });

      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /lưu thiết lập/i })
        ).toBeInTheDocument();
      });

      // Fill required fields
      await userEvent.type(screen.getByTestId('height-input'), '170');
      await userEvent.type(screen.getByTestId('weight-input'), '70');
      await userEvent.type(screen.getByTestId('target-weight-input'), '70');

      // Submit form
      const submitButton = screen.getByRole('button', {
        name: /lưu thiết lập/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(savePracticeSchedule).toHaveBeenCalled();
      });
    });
  });

  describe('4. Submit button shows correct text and disabled state', () => {
    it('should show "Đăng ký thiết bị trước" when no mobile device', async () => {
      renderPracticePage(queryClient);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', {
          name: /đăng ký thiết bị trước/i,
        });
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });

    it('should show "Lưu thiết lập" when mobile device exists', async () => {
      vi.mocked(deviceService.hasMobileDevice).mockReturnValue(true);
      vi.mocked(deviceService.getDevices).mockResolvedValue({
        success: true,
        data: {
          devices: [
            {
              id: 1,
              device_type: 'ios',
              fcm_token: 'token',
              device_name: 'iPhone',
              is_active: true,
              last_used_at: '2025-01-01T00:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
        },
      });

      renderPracticePage(queryClient);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', {
          name: /lưu thiết lập/i,
        });
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should show "Đang lưu..." when submitting', async () => {
      vi.mocked(deviceService.hasMobileDevice).mockReturnValue(true);
      vi.mocked(deviceService.getDevices).mockResolvedValue({
        success: true,
        data: {
          devices: [
            {
              id: 1,
              device_type: 'ios',
              fcm_token: 'token',
              device_name: 'iPhone',
              is_active: true,
              last_used_at: '2025-01-01T00:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
        },
      });

      const { savePracticeSchedule } = await import('@/services/practice');
      let resolvePromise: any;
      vi.mocked(savePracticeSchedule).mockImplementation(
        () =>
          new Promise(resolve => {
            resolvePromise = resolve;
          })
      );

      renderPracticePage(queryClient);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', {
          name: /lưu thiết lập/i,
        });
        expect(submitButton).toBeInTheDocument();
      });

      // Fill form and submit
      await userEvent.type(screen.getByTestId('height-input'), '170');
      await userEvent.type(screen.getByTestId('weight-input'), '70');
      await userEvent.type(screen.getByTestId('target-weight-input'), '70');

      const submitButton = screen.getByRole('button', {
        name: /lưu thiết lập/i,
      });
      fireEvent.click(submitButton);

      // Should show loading state
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /đang lưu/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /đang lưu/i })
        ).toBeDisabled();
      });

      // Resolve the promise
      resolvePromise({ success: true });
    });
  });

  describe('5. Banner appears when no device registered', () => {
    it('should show yellow notification banner when no device', async () => {
      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(
          screen.getByText('Chưa có thiết bị di động')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Đăng ký thiết bị để nhận nhắc nhở tập luyện')
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /đăng ký ngay/i })
        ).toBeInTheDocument();
      });

      // Check banner styling
      const banner = screen
        .getByText('Chưa có thiết bị di động')
        .closest('div');
      expect(banner).toHaveClass('bg-yellow-50', 'border-yellow-200');
    });

    it('should not show banner when device is registered', async () => {
      vi.mocked(deviceService.hasMobileDevice).mockReturnValue(true);
      vi.mocked(deviceService.getDevices).mockResolvedValue({
        success: true,
        data: {
          devices: [
            {
              id: 1,
              device_type: 'ios',
              fcm_token: 'token',
              device_name: 'iPhone',
              is_active: true,
              last_used_at: '2025-01-01T00:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
        },
      });

      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(
          screen.queryByText('Chưa có thiết bị di động')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText('Đăng ký thiết bị để nhận nhắc nhở tập luyện')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: /đăng ký ngay/i })
        ).not.toBeInTheDocument();
      });
    });

    it('should open modal when clicking banner register button', async () => {
      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /đăng ký ngay/i })
        ).toBeInTheDocument();
      });

      const registerButton = screen.getByRole('button', {
        name: /đăng ký ngay/i,
      });
      await userEvent.click(registerButton);

      expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
    });
  });

  describe('6. Auto-registration works on mobile with ?device=register', () => {
    it('should auto-register on mobile with device=register param', async () => {
      // Setup mobile environment
      vi.mocked(isMobileDevice).mockReturnValue(true);
      mockSearchParams.set('device', 'register');

      // Mock successful device registration
      const mockRegister = vi.fn().mockResolvedValue({
        success: true,
        data: { id: 1, device_type: 'ios' },
      });

      const { useRegisterDevice } = await import('@/hooks/useDevices');
      vi.mocked(useRegisterDevice).mockReturnValue({
        mutateAsync: mockRegister,
        isPending: false,
      } as any);

      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          fcm_token: 'mock-token',
          device_type: 'ios',
          device_name: expect.stringContaining('Mozilla'),
        });
      });

      const { toast } = await import('sonner');
      expect(toast.success).toHaveBeenCalledWith(
        'Đã đăng ký thiết bị thành công!'
      );
    });

    it('should not auto-register on desktop', async () => {
      mockSearchParams.set('device', 'register');
      vi.mocked(isMobileDevice).mockReturnValue(false); // Desktop

      const mockRegister = vi.fn();
      const { useRegisterDevice } = await import('@/hooks/useDevices');
      vi.mocked(useRegisterDevice).mockReturnValue({
        mutateAsync: mockRegister,
        isPending: false,
      } as any);

      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(mockRegister).not.toHaveBeenCalled();
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
      });
    });

    it('should show error if notification permission denied', async () => {
      vi.mocked(isMobileDevice).mockReturnValue(true);
      mockSearchParams.set('device', 'register');
      vi.mocked(requestNotificationPermission).mockResolvedValue(null); // Permission denied

      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
      });

      const { toast } = await import('sonner');
      expect(toast.error).toHaveBeenCalledWith(
        'Vui lòng cho phép thông báo để tiếp tục'
      );
    });

    it('should remove URL param after auto-registration', async () => {
      vi.mocked(isMobileDevice).mockReturnValue(true);
      mockSearchParams.set('device', 'register');

      const mockRegister = vi.fn().mockResolvedValue({
        success: true,
        data: { id: 1, device_type: 'ios' },
      });

      const { useRegisterDevice } = await import('@/hooks/useDevices');
      vi.mocked(useRegisterDevice).mockReturnValue({
        mutateAsync: mockRegister,
        isPending: false,
      } as any);

      // Mock window.history.replaceState
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(replaceStateSpy).toHaveBeenCalledWith(
          {},
          '',
          expect.not.stringContaining('device=register')
        );
      });

      replaceStateSpy.mockRestore();
    });
  });

  describe('7. Form validation and error handling', () => {
    it('should show error toast when form has validation errors', async () => {
      vi.mocked(deviceService.hasMobileDevice).mockReturnValue(true);
      vi.mocked(deviceService.getDevices).mockResolvedValue({
        success: true,
        data: {
          devices: [
            {
              id: 1,
              device_type: 'ios',
              fcm_token: 'token',
              device_name: 'iPhone',
              is_active: true,
              last_used_at: '2025-01-01T00:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
        },
      });

      renderPracticePage(queryClient);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', {
          name: /lưu thiết lập/i,
        });
        expect(submitButton).toBeInTheDocument();
      });

      // Submit without filling required fields
      const submitButton = screen.getByRole('button', {
        name: /lưu thiết lập/i,
      });
      fireEvent.click(submitButton);

      const { toast } = await import('sonner');
      expect(toast.error).toHaveBeenCalledWith(
        'Vui lòng kiểm tra lại thông tin'
      );
    });
  });
});
