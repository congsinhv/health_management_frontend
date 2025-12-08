/**
 * Device service
 * Handles device registration for FCM notifications
 */

import apiClient from './api';
import type {
  Device,
  DeviceListResponse,
  RegisterDeviceInput,
} from '@/types/device';

/**
 * Get all registered devices for current user
 */
export const getDevices = async (): Promise<DeviceListResponse> => {
  const response = await apiClient.get<DeviceListResponse>('/api/v1/devices/');
  return response.data;
};

/**
 * Register a new device with FCM token
 */
export const registerDevice = async (
  data: RegisterDeviceInput
): Promise<Device> => {
  const response = await apiClient.post<Device>('/api/v1/devices/', data);
  return response.data;
};

/**
 * Remove a registered device
 */
export const deleteDevice = async (deviceId: string): Promise<void> => {
  await apiClient.delete(`/api/v1/devices/${deviceId}`);
};

/**
 * Check if user has any mobile devices registered
 */
export const hasMobileDevice = (devices: Device[]): boolean => {
  return devices.some(d => d.platform === 'ios' || d.platform === 'android');
};

export const deviceService = {
  getDevices,
  registerDevice,
  deleteDevice,
  hasMobileDevice,
};
