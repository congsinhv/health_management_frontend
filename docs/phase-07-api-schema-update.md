# Phase 07 - API Schema Update & Practice Schedule Integration

**Project:** VHealth (health_management_frontend)
**Phase:** 07 - API Schema Update
**Status:** Implemented
**Last Updated:** December 2025

---

## Overview

Phase 07 introduces API schema updates to support practice schedule persistence. This phase bridges the frontend form data with backend API endpoints, introducing new request/response types for schedule operations.

**Key Goals:**

- Define new API types for schedule operations
- Create service functions for schedule API calls
- Integrate form submission with backend API
- Ensure type safety across API boundary

---

## Changes Summary

### 1. New Type Definitions

**File:** `src/types/practice.ts`

Added two new API types for schedule endpoint:

```typescript
// Schedule API request (POST /api/v1/schedules/)
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
  created_at: string;
  updated_at: string;
}
```

**Type Mapping:**

| Frontend Field           | API Field         | Type     | Notes                          |
| ------------------------ | ----------------- | -------- | ------------------------------ |
| basicInfo.height         | height_cm         | number   | Optional                       |
| basicInfo.weight         | weight_kg         | number   | Optional                       |
| basicInfo.targetWeight   | target_weight_kg  | number   | Required                       |
| basicInfo.goal           | goal              | string   | 'gain' \| 'lose' \| 'maintain' |
| schedule.mode            | schedule_mode     | string   | 'flexible' \| 'fixed'          |
| schedule.selectedDays    | schedule_days     | string[] | ISO day names                  |
| schedule.flexiblePeriods | time_periods      | Record   | Keyed by day name              |
| sports.predefined        | sports_predefined | string[] | Sport IDs                      |
| sports.custom            | sports_custom     | string[] | Custom sport names             |
| notes.personal           | notes_personal    | string   | Allow null                     |
| notes.healthWarnings     | notes_health      | string   | Allow null                     |

### 2. Service Layer Functions

**File:** `src/services/practice.ts`

Added new functions for schedule persistence:

```typescript
/**
 * Save practice schedule to backend
 */
export const savePracticeSchedule = async (
  data: ScheduleApiRequest
): Promise<ScheduleApiResponse> => {
  const response = await api.post<ScheduleApiResponse>(
    '/api/v1/schedules/',
    data
  );
  return response.data;
};

/**
 * Format form data for schedule API
 */
export const formatForScheduleAPI = (
  formData: PracticeFormData
): ScheduleApiRequest => {
  return {
    height_cm: formData.basicInfo.height,
    weight_kg: formData.basicInfo.weight,
    target_weight_kg: formData.basicInfo.targetWeight,
    goal: formData.basicInfo.goal,
    schedule_mode: formData.schedule.mode,
    schedule_days: formData.schedule.selectedDays,
    time_periods: formData.schedule.flexiblePeriods || {},
    sports_predefined: formData.sports.predefined,
    sports_custom: formData.sports.custom,
    notes_personal: formData.notes.personal || null,
    notes_health: formData.notes.healthWarnings || null,
  };
};

/**
 * Register FCM service worker
 */
export const registerFcmServiceWorker = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
    });
  } catch (error) {
    console.error('Failed to register FCM service worker:', error);
  }
};
```

### 3. Page Integration

**File:** `src/app/practice/page.tsx`

Updated form submission to use API:

```typescript
const onSubmit: SubmitHandler<PracticeFormData> = async data => {
  setIsSubmitting(true);
  try {
    // Transform form data to API format
    const apiData = formatForScheduleAPI(data);

    // Call API
    const response = await savePracticeSchedule(apiData);

    // Show success
    toast.success('Practice schedule saved successfully');

    // Optional: redirect or clear form
    router.push('/dashboard');
  } catch (error) {
    toast.error('Failed to save practice schedule');
    console.error('Schedule save error:', error);
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## API Endpoint Specification

### POST /api/v1/schedules/

**Purpose:** Create or update user's practice schedule

**Request:**

```json
{
  "height_cm": 175,
  "weight_kg": 70,
  "target_weight_kg": 68,
  "goal": "lose",
  "schedule_mode": "flexible",
  "schedule_days": ["Monday", "Wednesday", "Friday"],
  "time_periods": {
    "Monday": [{ "start_time": "06:00", "end_time": "07:00" }],
    "Wednesday": [{ "start_time": "06:00", "end_time": "07:00" }],
    "Friday": [{ "start_time": "06:00", "end_time": "07:00" }]
  },
  "sports_predefined": ["running", "swimming"],
  "sports_custom": ["yoga"],
  "notes_personal": "Prefer morning sessions",
  "notes_health": "No high-impact activities"
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "height_cm": 175,
  "weight_kg": 70,
  "target_weight_kg": 68,
  "goal": "lose",
  "schedule_mode": "flexible",
  "schedule_days": ["Monday", "Wednesday", "Friday"],
  "time_periods": { ... },
  "sports_predefined": ["running", "swimming"],
  "sports_custom": ["yoga"],
  "notes_personal": "Prefer morning sessions",
  "notes_health": "No high-impact activities",
  "created_at": "2025-12-06T10:00:00Z",
  "updated_at": "2025-12-06T10:00:00Z"
}
```

**Error Responses:**

- 400 Bad Request - Invalid data format
- 401 Unauthorized - Not authenticated
- 422 Unprocessable Entity - Validation errors
- 500 Internal Server Error - Backend error

---

## Data Flow

```
PracticePage Component
  ↓
User fills form and submits
  ↓
React Hook Form validates (Zod schema)
  ↓
onSubmit handler called
  ↓
formatForScheduleAPI(formData)
  ├─ Maps frontend field names to API field names
  ├─ Converts snake_case to camelCase
  └─ Ensures correct types (null vs undefined)
  ↓
savePracticeSchedule(apiData)
  ├─ api.post('/api/v1/schedules/', apiData)
  ├─ Request interceptor adds JWT token
  └─ Returns ScheduleApiResponse
  ↓
Success handling
  ├─ Show success toast
  ├─ Optional: redirect to dashboard
  └─ Clear form
  ↓
Error handling
  ├─ Show error toast
  ├─ Log error details
  └─ Keep form intact for retry
```

---

## Field Name Conventions

### Why Different Names?

**Frontend (camelCase):**

- Matches JavaScript naming conventions
- Consistent with React component props
- Easier to work with in TypeScript

**Backend (snake_case):**

- Follows Django/Python conventions
- Consistent across entire backend API
- More readable in database columns

### Conversion Layer

The `formatForScheduleAPI()` function serves as the conversion layer:

```typescript
// Frontend → Backend mapping
{
  height: 175,              // → height_cm
  targetWeight: 68,         // → target_weight_kg
  schedule: {
    mode: 'flexible',       // → schedule_mode
    selectedDays: [...],    // → schedule_days
  },
  notes: {
    healthWarnings: "..."   // → notes_health
  }
}
```

---

## Type Safety Benefits

1. **Frontend Compilation:** TypeScript catches field name errors at compile time
2. **API Contract:** Clear interface between frontend and backend
3. **Backward Compatibility:** Easier to handle API version changes
4. **Documentation:** Type definitions serve as inline documentation

---

## Testing Checklist

- [ ] Form submission with valid data succeeds
- [ ] Error toast shown on API failure
- [ ] Success toast shown on successful save
- [ ] Form state cleared/redirected after save
- [ ] Loading state shown during submission
- [ ] API request includes correct JWT token
- [ ] Request payload matches ScheduleApiRequest schema
- [ ] Response is properly typed as ScheduleApiResponse
- [ ] Validation prevents submission of invalid data
- [ ] Handles network errors gracefully

---

## Related Documentation

- `docs/system-architecture.md` - Overall API integration architecture
- `docs/code-standards.md` - Type definition standards
- Phase 05 documentation - Form integration
- Phase 06 documentation - Device service example
