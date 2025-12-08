/**
 * Device types for FCM notification management
 */

export type DeviceType = 'ios' | 'android' | 'web';

export interface Device {
  id: number;
  device_type: DeviceType | null;
  device_name: string | null;
  is_active: boolean;
  last_used_at: string;
  fcm_token?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterDeviceInput {
  fcm_token: string;
  device_type: DeviceType;
  device_name?: string;
}

export interface DeviceListResponse {
  devices: Device[];
  total: number;
}
