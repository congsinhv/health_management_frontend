import { AuthProvider } from '@/contexts/auth';
import { requestNotificationPermission } from '@/lib/firebase';
import { isMobileDevice } from '@/lib/utils/platform';
import { deviceService } from '@/services/device';
import { userService } from '@/services/user';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PracticePage from './page';

// Mock the essential dependencies
vi.mock('@/services/device', () => ({
  deviceService: {
    getDevices: vi.fn(),
    hasMobileDevice: vi.fn(),
  },
}));

vi.mock('@/services/user', () => ({
  userService: {
    getProfile: vi.fn(),
  },
}));

vi.mock('@/services/practice', () => ({
  savePracticeSchedule: vi.fn(),
}));

vi.mock('@/lib/utils/platform', () => ({
  isMobileDevice: vi.fn(),
}));

vi.mock('@/lib/firebase', () => ({
  requestNotificationPermission: vi.fn(),
}));

// Mock Next.js router
const mockSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: vi.fn((key: string) => mockSearchParams.get(key)),
  }),
}));

// Mock all form components to focus on integration testing
vi.mock('@/components/practice', () => ({
  BasicInfoSection: ({ form }: any) => (
    <div data-testid='basic-info-section'>
      <input
        data-testid='height-input'
        {...form.register('basicInfo.height')}
      />
      <input
        data-testid='weight-input'
        {...form.register('basicInfo.weight')}
      />
      <input
        data-testid='target-weight-input'
        {...form.register('basicInfo.targetWeight')}
      />
    </div>
  ),
  ScheduleSection: () => <div data-testid='schedule-section'>Schedule</div>,
  SportsSection: () => <div data-testid='sports-section'>Sports</div>,
  NotesSection: () => <div data-testid='notes-section'>Notes</div>,
  NotificationSetupModal: ({ open, onOpenChange }: any) =>
    open ? (
      <div data-testid='notification-modal'>
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
}));

// Mock other UI components
vi.mock('@/components/shared/LoadingOverlay', () => ({
  LoadingOverlay: ({ isVisible }: any) =>
    isVisible ? <div data-testid='loading'>Loading...</div> : null,
}));

vi.mock('@/components/layout/Header', () => ({
  default: () => <header data-testid='header'>Header</header>,
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid='footer'>Footer</footer>,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Setup fresh mock tokens
localStorageMock.getItem.mockReturnValue('mock-access-token');

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderPracticePage = (queryClient: QueryClient) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        value={{
          user: { id: 1, email: 'test@example.com' },
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn(),
          isLoading: false,
          isAuthenticated: true,
          refreshToken: vi.fn(),
        }}
      >
        <PracticePage />
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('Practice Page Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
    mockSearchParams.delete('device');

    // Default mocks
    vi.mocked(deviceService.getDevices).mockResolvedValue({
      success: true,
      data: { devices: [], total: 0, page: 1, limit: 10 },
    });
    vi.mocked(deviceService.hasMobileDevice).mockReturnValue(false);
    vi.mocked(userService.getProfile).mockResolvedValue({
      success: true,
      data: { profile: { height_cm: 170, weight_kg: 70 } },
    });
    vi.mocked(isMobileDevice).mockReturnValue(false);
    vi.mocked(requestNotificationPermission).mockResolvedValue('mock-token');
  });

  describe('1. Page loads and checks for devices', () => {
    it('should show loading then main content', async () => {
      renderPracticePage(queryClient);

      // Initially shows loading
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Then shows main content
      await waitFor(() => {
        expect(
          screen.getByText('Thiết lập kế hoạch tập luyện')
        ).toBeInTheDocument();
        expect(screen.getByTestId('basic-info-section')).toBeInTheDocument();
      });
    });

    it('should check for devices on load', async () => {
      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(deviceService.getDevices).toHaveBeenCalled();
        expect(deviceService.hasMobileDevice).toHaveBeenCalled();
      });
    });
  });

  describe('2. Modal shows when no mobile device exists', () => {
    it('should show modal when no mobile device', async () => {
      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
      });
    });

    it('should not show modal when mobile device exists', async () => {
      vi.mocked(deviceService.hasMobileDevice).mockReturnValue(true);
      vi.mocked(deviceService.getDevices).mockResolvedValue({
        success: true,
        data: {
          devices: [
            {
              device_type: 'ios',
              id: 1,
              device_name: 'iPhone',
              is_active: true,
              last_used_at: '2025-01-01T00:00:00Z',
            },
          ],
          total: 1,
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

  describe('3. Form submission blocking', () => {
    it('should block submission without mobile device', async () => {
      const { toast } = await import('sonner');
      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /đăng ký thiết bị trước/i })
        ).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', {
        name: /đăng ký thiết bị trước/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Vui lòng đăng ký thiết bị di động trước khi lưu'
        );
      });
    });

    it('should show banner when no device', async () => {
      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(
          screen.getByText('Chưa có thiết bị di động')
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /đăng ký ngay/i })
        ).toBeInTheDocument();
      });
    });
  });

  describe('4. Submit button states', () => {
    it('should show correct button text when no device', async () => {
      renderPracticePage(queryClient);

      await waitFor(() => {
        const button = screen.getByRole('button', {
          name: /đăng ký thiết bị trước/i,
        });
        expect(button).toBeDisabled();
        expect(button).toHaveTextContent('Đăng ký thiết bị trước');
      });
    });

    it('should show correct button text when device exists', async () => {
      vi.mocked(deviceService.hasMobileDevice).mockReturnValue(true);
      vi.mocked(deviceService.getDevices).mockResolvedValue({
        success: true,
        data: {
          devices: [
            {
              device_type: 'ios',
              id: 1,
              device_name: 'iPhone',
              is_active: true,
              last_used_at: '2025-01-01T00:00:00Z',
            },
          ],
          total: 1,
        },
      });

      renderPracticePage(queryClient);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /lưu thiết lập/i });
        expect(button).not.toBeDisabled();
        expect(button).toHaveTextContent('Lưu thiết lập');
      });
    });
  });

  describe('5. Auto-registration', () => {
    it('should auto-register on mobile with ?device=register', async () => {
      vi.mocked(isMobileDevice).mockReturnValue(true);
      mockSearchParams.set('device', 'register');

      // Mock window.history.replaceState
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(requestNotificationPermission).toHaveBeenCalled();
        expect(replaceStateSpy).toHaveBeenCalled();
      });

      replaceStateSpy.mockRestore();
    });

    it('should not auto-register on desktop', async () => {
      vi.mocked(isMobileDevice).mockReturnValue(false);
      mockSearchParams.set('device', 'register');

      renderPracticePage(queryClient);

      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
      });
    });
  });
});
