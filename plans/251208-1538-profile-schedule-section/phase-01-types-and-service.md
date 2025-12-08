# Phase 1: Types & Service Layer

## Context

- **Plan**: [plan.md](./plan.md)
- **Brainstorm**: [brainstorm-251208-scheduled-plans-profile.md](./reports/brainstorm-251208-scheduled-plans-profile.md)

---

## Overview

| Field       | Value                                                 |
| ----------- | ----------------------------------------------------- |
| Date        | 2025-12-08                                            |
| Description | Create TypeScript types and API service for schedules |
| Priority    | High                                                  |
| Status      | pending                                               |

---

## Requirements

1. Create `src/types/schedule.ts` with Schedule, WeeklyExercise, status types
2. Create `src/services/schedule.ts` with getSchedules(), updateScheduleStatus()
3. Follow existing patterns from practice.ts and device.ts

---

## Related Code Files

- `src/types/practice.ts` - Pattern reference for types
- `src/types/device.ts` - Pattern reference for types
- `src/services/practice.ts` - Pattern reference for service
- `src/services/device.ts` - Pattern reference for service

---

## Implementation Steps

### Step 1: Create Schedule Types

Create `src/types/schedule.ts`:

```typescript
// Status types
export type ExerciseStatus =
  | 'pending'
  | 'completed'
  | 'skipped'
  | 'in_progress';
export type ScheduleStatus = 'active' | 'paused' | 'superseded';
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
export type HealthGoal = 'gain' | 'lose' | 'maintain';
export type ScheduleMode = 'fixed' | 'flexible';

// Weekly exercise structure (per day)
export interface WeeklyExercise {
  exercise: string;
  duration_minutes: number;
  estimated_calories: number;
  description: string;
  status: ExerciseStatus;
  error_message: string | null;
}

// Full schedule object
export interface Schedule {
  id: number;
  user_id: number;
  goal: HealthGoal;
  schedule_mode: ScheduleMode;
  selected_days: DayOfWeek[];
  timezone: string;
  weekly_plan: Partial<Record<DayOfWeek, WeeklyExercise>>;
  status: ScheduleStatus;
  created_at: string;
  updated_at: string;
}

// API response types
export interface ScheduleListResponse {
  schedules: Schedule[];
}

export interface UpdateScheduleStatusRequest {
  status: 'active' | 'paused';
}

export interface UpdateScheduleStatusResponse {
  id: number;
  status: ScheduleStatus;
  updated_at: string;
}
```

### Step 2: Create Schedule Service

Create `src/services/schedule.ts`:

```typescript
import apiClient from './api';
import type {
  Schedule,
  ScheduleListResponse,
  UpdateScheduleStatusRequest,
  UpdateScheduleStatusResponse,
} from '@/types/schedule';

/**
 * Get all schedules for current user
 * Filters out superseded schedules on frontend
 */
export const getSchedules = async (): Promise<Schedule[]> => {
  const response = await apiClient.get<Schedule[]>('/api/v1/schedules/');
  // Filter out superseded schedules
  return response.data.filter(s => s.status !== 'superseded');
};

/**
 * Update schedule status (active ↔ paused)
 */
export const updateScheduleStatus = async (
  scheduleId: number,
  status: 'active' | 'paused'
): Promise<UpdateScheduleStatusResponse> => {
  const response = await apiClient.patch<UpdateScheduleStatusResponse>(
    `/api/v1/schedules/${scheduleId}/`,
    { status } as UpdateScheduleStatusRequest
  );
  return response.data;
};

export const scheduleService = {
  getSchedules,
  updateScheduleStatus,
};
```

### Step 3: Create React Query Hooks

Create `src/hooks/useSchedules.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '@/services/schedule';
import { toast } from 'sonner';

export const SCHEDULES_QUERY_KEY = ['schedules'];

export const useSchedules = () => {
  return useQuery({
    queryKey: SCHEDULES_QUERY_KEY,
    queryFn: scheduleService.getSchedules,
  });
};

export const useUpdateScheduleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'paused' }) =>
      scheduleService.updateScheduleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULES_QUERY_KEY });
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: () => {
      toast.error('Không thể cập nhật trạng thái');
    },
  });
};
```

### Step 4: Export from types index

Update `src/types/index.ts` to include schedule types export.

---

## Todo List

- [ ] Create `src/types/schedule.ts` with all type definitions
- [ ] Create `src/services/schedule.ts` with API functions
- [ ] Create `src/hooks/useSchedules.ts` with React Query hooks
- [ ] Update `src/types/index.ts` barrel export

---

## Success Criteria

1. Types compile without errors
2. Service functions work with API
3. Hooks integrate with React Query
4. No TypeScript errors in codebase

---

## Risk Assessment

| Risk                                     | Likelihood | Impact | Mitigation                           |
| ---------------------------------------- | ---------- | ------ | ------------------------------------ |
| PATCH endpoint not ready                 | Medium     | High   | Verify with backend team first       |
| API response format differs              | Low        | Medium | Adapt types to match actual response |
| Type conflicts with existing practice.ts | Low        | Low    | Keep schedule.ts separate            |
