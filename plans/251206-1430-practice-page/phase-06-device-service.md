# Phase 1: Device Types & Service

> **Parent Plan:** [plan.md](./plan.md)
> **Dependencies:** None (foundational)
> **Status:** Completed (Code Review: APPROVED)
> **Completion Date:** 2025-12-08
> **Priority:** High
> **Estimated Effort:** 1-2 hours

---

## Overview

Create device type definitions and API service for managing user device registrations. This foundational phase enables all subsequent FCM notification functionality.

## Key Insights

1. Device entity tracks FCM tokens per user with platform info
2. API follows existing patterns in `src/services/` (uses apiClient)
3. Types must support iOS, Android, and Web platforms
4. Need both list and CRUD operations

## Requirements

### Functional

- [x] Define Device interface matching backend schema
- [x] Create device service with GET/POST/DELETE methods
- [x] Export types from barrel file (N/A - no barrel file exists)
- [x] Handle API errors consistently

### Non-Functional

- [x] Follow existing type organization in `src/types/`
- [x] Use named exports
- [x] Match existing service patterns

## Related Code Files

| File                     | Action | Purpose                 |
| ------------------------ | ------ | ----------------------- |
| `src/types/device.ts`    | CREATE | Device type definitions |
| `src/types/index.ts`     | UPDATE | Add device exports      |
| `src/services/device.ts` | CREATE | Device CRUD service     |

## Implementation Steps

### Step 1: Create Device Types

**File:** `src/types/device.ts`

```typescript
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
```

### Step 2: Update Types Barrel Export

**File:** `src/types/index.ts` (if exists, else skip)

Add export for device types.

### Step 3: Create Device Service

**File:** `src/services/device.ts`

```typescript
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
```

### Step 4: Create React Query Hook (Optional)

**File:** `src/hooks/useDevices.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceService } from '@/services/device';
import type { RegisterDeviceInput } from '@/types/device';
import { toast } from 'sonner';

export const useDevices = () => {
  return useQuery({
    queryKey: ['devices'],
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
      queryClient.invalidateQueries({ queryKey: ['devices'] });
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
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Đã xóa thiết bị');
    },
    onError: () => {
      toast.error('Không thể xóa thiết bị');
    },
  });
};
```

## Todo List

- [x] Create `src/types/device.ts` with Device, RegisterDeviceInput, DeviceListResponse
- [x] Create `src/services/device.ts` with CRUD operations
- [x] Create `src/hooks/useDevices.ts` with React Query hooks
- [x] Test API integration with backend (if available)

## Success Criteria

1. `Device` type properly defined with platform enum
2. `deviceService.getDevices()` returns list of devices
3. `deviceService.registerDevice()` creates new device
4. `deviceService.deleteDevice()` removes device
5. `hasMobileDevice()` helper correctly identifies mobile devices
6. React Query hooks provide loading/error states

## Risk Assessment

| Risk                       | Mitigation                       |
| -------------------------- | -------------------------------- |
| Backend API not ready      | Use mock data for development    |
| Type mismatch with backend | Coordinate with backend team     |
| Missing error handling     | Follow existing service patterns |

## Notes

- Device list endpoint returns all devices for authenticated user
- FCM token uniqueness handled by backend (upsert on token)
- Platform detection will be handled in Phase 8 (Firebase + PWA Setup)

## Code Review Results

**Review Date:** 2025-12-08
**Status:** APPROVED
**Report:** [code-reviewer-251208-phase06-device-service.md](./reports/code-reviewer-251208-phase06-device-service.md)

### Summary

- Critical Issues: 0
- Warnings: 3 (Medium priority)
- Build Status: PASSING
- Type Check: PASSING
- Overall Grade: A (Excellent)

### Key Findings

1. Code follows project patterns perfectly
2. TypeScript types well-defined (100% coverage)
3. No security vulnerabilities detected
4. Suggested improvements for error handling (optional)

**Recommendation:** Proceed to Phase 07 (API Schema Update)
