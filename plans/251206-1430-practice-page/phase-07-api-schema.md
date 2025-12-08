# Phase 2: API Schema Update

> **Parent Plan:** [plan.md](./plan.md)
> **Dependencies:** Phase 6 (device types for reference)
> **Status:** Completed ✓
> **Completed Date:** 2025-12-08
> **Priority:** High
> **Estimated Effort:** 1 hour
> **Code Review:** [code-reviewer-251208-phase07-08-review.md](./reports/code-reviewer-251208-phase07-08-review.md)

---

## Overview

Update the practice service to use the new `/schedules/` endpoint instead of `/practice-preferences`. Modify `formatForAPI()` to match the new backend schema.

## Key Insights

1. New endpoint: `POST /api/v1/schedules/`
2. Schema changes primarily in field naming and structure
3. `formatForAPI()` needs restructuring for new schema
4. Backward compatibility not required (clean migration)

## Requirements

### Functional

- [ ] Update `savePracticePreferences` to call `/schedules/`
- [ ] Modify `formatForAPI()` for new schema structure
- [ ] Ensure all form fields map correctly to API

### Non-Functional

- [ ] Maintain existing error handling
- [ ] Keep function signatures compatible with existing page

## Related Code Files

| File                       | Action | Purpose                          |
| -------------------------- | ------ | -------------------------------- |
| `src/services/practice.ts` | UPDATE | New endpoint + schema            |
| `src/types/practice.ts`    | UPDATE | Add schedule API types if needed |

## Current vs New Schema

### Current Schema (practice-preferences)

```json
{
  "basic_info": {
    "height_cm": 170,
    "weight_kg": 65,
    "target_weight_kg": 60,
    "goal": "lose"
  },
  "schedule": {
    "mode": "flexible",
    "selected_days": ["monday", "wednesday"],
    "periods": {
      "monday": [{ "startTime": "06:00", "endTime": "07:00" }]
    }
  },
  "sports": {
    "predefined": ["running"],
    "custom": ["yoga"]
  },
  "notes": {
    "personal": "...",
    "health_warnings": "..."
  }
}
```

### New Schema (schedules)

```json
{
  "height_cm": 170,
  "weight_kg": 65,
  "target_weight_kg": 60,
  "goal": "lose",
  "schedule_mode": "flexible",
  "schedule_days": ["monday", "wednesday"],
  "time_periods": {
    "monday": [{ "start_time": "06:00", "end_time": "07:00" }]
  },
  "sports_predefined": ["running"],
  "sports_custom": ["yoga"],
  "notes_personal": "...",
  "notes_health": "..."
}
```

## Implementation Steps

### Step 1: Add Schedule API Types

**File:** `src/types/practice.ts` (append)

```typescript
// Schedule API request schema (new endpoint)
export interface ScheduleApiRequest {
  height_cm?: number;
  weight_kg?: number;
  target_weight_kg: number;
  goal?: 'gain' | 'lose' | 'maintain';
  schedule_mode: 'flexible' | 'fixed';
  schedule_days: string[];
  time_periods: Record<string, Array<{ start_time: string; end_time: string }>>;
  sports_predefined: string[];
  sports_custom: string[];
  notes_personal?: string | null;
  notes_health?: string | null;
}

// Schedule API response
export interface ScheduleApiResponse {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  // ... same fields as request
}
```

### Step 2: Update Practice Service

**File:** `src/services/practice.ts`

```typescript
/**
 * Practice service
 * Handles practice schedule CRUD operations
 */

import apiClient from './api';
import type {
  PracticeFormData,
  PracticeProfileResponse,
  ScheduleApiRequest,
  ScheduleApiResponse,
} from '@/types/practice';

/**
 * Get user's practice profile (for pre-fill)
 */
export const getPracticeProfile =
  async (): Promise<PracticeProfileResponse> => {
    const response = await apiClient.get<PracticeProfileResponse>(
      '/api/v1/users/practice-profile'
    );
    return response.data;
  };

/**
 * Save practice schedule (NEW ENDPOINT)
 */
export const savePracticeSchedule = async (
  data: PracticeFormData
): Promise<ScheduleApiResponse> => {
  const response = await apiClient.post<ScheduleApiResponse>(
    '/api/v1/schedules/',
    formatForScheduleAPI(data)
  );
  return response.data;
};

/**
 * Format form data for new schedule API
 */
const formatForScheduleAPI = (data: PracticeFormData): ScheduleApiRequest => {
  // Build time periods with snake_case keys
  const timePeriods: Record<
    string,
    Array<{ start_time: string; end_time: string }>
  > = {};

  if (data.schedule.mode === 'flexible' && data.schedule.flexiblePeriods) {
    Object.entries(data.schedule.flexiblePeriods).forEach(([day, periods]) => {
      timePeriods[day] = periods.map(p => ({
        start_time: p.startTime,
        end_time: p.endTime,
      }));
    });
  } else if (data.schedule.mode === 'fixed' && data.schedule.fixedPeriod) {
    // Expand fixed period to all selected days
    data.schedule.selectedDays.forEach(day => {
      timePeriods[day] = [
        {
          start_time: data.schedule.fixedPeriod!.startTime,
          end_time: data.schedule.fixedPeriod!.endTime,
        },
      ];
    });
  }

  return {
    height_cm: data.basicInfo.height,
    weight_kg: data.basicInfo.weight,
    target_weight_kg: data.basicInfo.targetWeight,
    goal: data.basicInfo.goal,
    schedule_mode: data.schedule.mode,
    schedule_days: data.schedule.selectedDays,
    time_periods: timePeriods,
    sports_predefined: data.sports.predefined,
    sports_custom: data.sports.custom,
    notes_personal: data.notes.personal || null,
    notes_health: data.notes.healthWarnings || null,
  };
};

/**
 * @deprecated Use savePracticeSchedule instead
 */
export const savePracticePreferences = async (
  data: PracticeFormData
): Promise<void> => {
  await savePracticeSchedule(data);
};

export const practiceService = {
  getPracticeProfile,
  savePracticeSchedule,
  savePracticePreferences, // deprecated alias
};
```

### Step 3: Update Practice Page Import

**File:** `src/app/practice/page.tsx`

Change import from `savePracticePreferences` to `savePracticeSchedule` (or keep using the deprecated alias for now).

```diff
- import { savePracticePreferences } from '@/services/practice';
+ import { savePracticeSchedule } from '@/services/practice';

// In mutation:
const submitMutation = useMutation({
-   mutationFn: savePracticePreferences,
+   mutationFn: savePracticeSchedule,
    ...
});
```

## Todo List

- [x] Add `ScheduleApiRequest` and `ScheduleApiResponse` types to `src/types/practice.ts`
- [x] Create `formatForScheduleAPI()` function with new schema
- [x] Update `savePracticeSchedule()` to call `/api/v1/schedules/`
- [x] Keep `savePracticePreferences()` as deprecated alias
- [x] Update practice page to use new function

## Implementation Notes (2025-12-08)

- API schema migration successful with clean type definitions
- Backward compatibility maintained via deprecated `savePracticePreferences` alias
- Type safety enforced with explicit `ScheduleApiRequest`/`ScheduleApiResponse` interfaces
- Practice page updated to use `savePracticeSchedule` function
- Build and TypeScript checks passing
- `formatForScheduleAPI` correctly transforms camelCase → snake_case
- Fixed period expansion to all selected days working correctly
- No breaking changes to existing form validation

**Code Review Findings:**

- No critical issues for Phase 07
- Medium priority: Verify backend accepts null/undefined for optional fields (`goal`, `height_cm`, `weight_kg`)
- See full review: `reports/code-reviewer-251208-phase07-08-review.md`

## Success Criteria

1. `formatForScheduleAPI()` produces correct snake_case structure
2. Time periods correctly expand for fixed mode
3. API call goes to `/api/v1/schedules/`
4. Existing form validation still works
5. Error handling maintained

## Risk Assessment

| Risk                    | Mitigation                      |
| ----------------------- | ------------------------------- |
| Backend schema mismatch | Verify schema with backend team |
| Breaking existing form  | Keep deprecated alias           |
| Time format issues      | Validate HH:mm format preserved |

## Notes

- Old endpoint `/practice-preferences` will be deprecated
- No migration needed for existing data (backend handles)
- Form data structure (`PracticeFormData`) remains unchanged
