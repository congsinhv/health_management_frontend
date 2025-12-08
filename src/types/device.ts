/**
 * Device types for FCM notification management
 */

export type DevicePlatform = 'ios' | 'android' | 'web';

export interface Device {
  id: string;
  user_id: string;
  fcm_token: string;
  platform: DevicePlatform;
  device_name?: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterDeviceInput {
  fcm_token: string;
  platform: DevicePlatform;
  device_name?: string;
}

export interface DeviceListResponse {
  devices: Device[];
  total: number;
}
