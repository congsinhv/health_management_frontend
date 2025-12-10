/**
 * Device hooks for FCM notification management
 * Uses React Query for server state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceService } from '@/services/device';
import type { RegisterDeviceInput } from '@/types/device';
import { toast } from 'sonner';

export const DEVICES_QUERY_KEY = ['devices'] as const;

export const useDevices = () => {
  return useQuery({
    queryKey: DEVICES_QUERY_KEY,
    queryFn: deviceService.getDevices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRegisterDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDeviceInput) =>
      deviceService.registerDevice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY });
      toast.success('Thiết bị đã được đăng ký!');
    },
    onError: () => {
      toast.error('Không thể đăng ký thiết bị');
    },
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deviceService.deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY });
      toast.success('Đã xóa thiết bị');
    },
    onError: () => {
      toast.error('Không thể xóa thiết bị');
    },
  });
};
