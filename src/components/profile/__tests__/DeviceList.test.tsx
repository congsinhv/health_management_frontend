import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DeviceList } from '../DeviceList';
import * as useDevicesHook from '@/hooks/useDevices'; // Import the hook module

// Mock the useDevices and useDeleteDevice hooks
jest.mock('@/hooks/useDevices', () => ({
  useDevices: jest.fn(),
  useDeleteDevice: jest.fn(() => ({
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

describe('DeviceList', () => {
  beforeEach(() => {
    // Default mock for useDevices - no data, not loading, no error
    (useDevicesHook.useDevices as jest.Mock).mockReturnValue({
      data: { devices: [] }, // Ensure data is an object with a devices array
      isLoading: false,
      isError: false,
    });
  });

  it('renders "Chưa có thiết bị nào được đăng ký" when there are no devices', () => {
    render(<DeviceList />, { wrapper: AllTheProviders });
    expect(
      screen.getByText('Chưa có thiết bị nào được đăng ký')
    ).toBeInTheDocument();
  });

  it('renders device items when devices are available', async () => {
    (useDevicesHook.useDevices as jest.Mock).mockReturnValueOnce({
      // Use mockReturnValueOnce for this specific test
      data: {
        devices: [
          // Ensure data is an object with a devices array
          {
            id: '1',
            name: 'Smartwatch',
            device_name: 'Smartwatch',
            type: 'wearable',
            status: 'connected',
            battery: 80,
            platform: 'web',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Smart Scale',
            device_name: 'Smart Scale',
            type: 'scale',
            status: 'disconnected',
            battery: 50,
            platform: 'web',
            created_at: new Date().toISOString(),
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    render(<DeviceList />, { wrapper: AllTheProviders });

    expect(await screen.findByText('Smartwatch')).toBeInTheDocument();
    expect(await screen.findByText('Smart Scale')).toBeInTheDocument();
    expect(
      screen.queryByText('Chưa có thiết bị nào được đăng ký')
    ).not.toBeInTheDocument();
  });

  it('renders loading state when data is loading', () => {
    (useDevicesHook.useDevices as jest.Mock).mockReturnValueOnce({
      // Use mockReturnValueOnce for this specific test
      data: { devices: [] },
      isLoading: true,
      isError: false,
    });

    render(<DeviceList />, { wrapper: AllTheProviders });

    expect(screen.getAllByTestId('device-skeleton')).toHaveLength(2);
    expect(
      screen.queryByText('Chưa có thiết bị nào được đăng ký')
    ).not.toBeInTheDocument();
  });
});
