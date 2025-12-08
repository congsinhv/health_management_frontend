# Phase 5: API Integration

> **Parent Plan:** [plan.md](./plan.md)
> **Dependencies:** Phase 6-9
> **Status:** ✅ Completed
> **Priority:** Medium
> **Completed:** 2025-12-06 23:59

---

## Overview

Integrate the Practice page with backend API for data fetching (pre-fill) and form submission. Add loading states, error handling, and success feedback.

## Requirements

- Fetch user profile for pre-fill data
- Submit practice preferences to API
- Handle loading and error states
- Toast notifications for feedback
- Optional: Navigate to confirmation/dashboard on success

## Architecture

```
PracticePage
├── useQuery (fetch user profile)
├── useMutation (submit preferences)
├── Form state (React Hook Form)
└── UI states (loading, error, success)
```

## Related Code Files

- `src/services/user.ts` - User service (may need extension)
- `src/services/api.ts` - Axios client
- `src/lib/react-query.tsx` - Query client config

## Implementation Steps

### 1. Create Practice Service

**File:** `src/services/practice.ts`

```typescript
import { api } from './api';
import type { PracticeFormData, UserPracticeProfile } from '@/types/practice';

/**
 * Get user's practice profile (for pre-fill)
 */
export const getPracticeProfile = async (): Promise<UserPracticeProfile> => {
  const response = await api.get('/users/practice-profile');
  return response.data;
};

/**
 * Save practice preferences
 */
export const savePracticePreferences = async (
  data: PracticeFormData
): Promise<void> => {
  await api.post('/users/practice-preferences', formatForAPI(data));
};

/**
 * Format form data for API submission
 */
const formatForAPI = (data: PracticeFormData) => {
  return {
    basic_info: {
      height_cm: data.height,
      weight_kg: data.weight,
      target_weight_kg: data.targetWeight,
      goal: data.goal,
    },
    schedule: {
      mode: data.scheduleMode,
      selected_days: data.selectedDays,
      periods:
        data.scheduleMode === 'flexible'
          ? data.flexiblePeriods
          : {
              // Expand fixed period to all selected days
              ...Object.fromEntries(
                data.selectedDays.map(day => [day, [data.fixedPeriod]])
              ),
            },
    },
    sports: {
      predefined: data.predefinedSports,
      custom: data.customSports,
    },
    notes: {
      personal: data.personalNotes || null,
      health_warnings: data.healthWarnings || null,
    },
  };
};
```

### 2. Update Types for API Response

**File:** `src/types/practice.ts` (add)

```typescript
// API response types
export interface PracticeProfileResponse {
  id: string;
  user_id: string;
  height_cm?: number;
  weight_kg?: number;
  goal?: string;
  schedule?: {
    mode: 'flexible' | 'fixed';
    selected_days: string[];
    periods: Record<string, TimePeriod[]>;
  };
  sports?: {
    predefined: string[];
    custom: string[];
  };
  notes?: {
    personal?: string;
    health_warnings?: string;
  };
  created_at: string;
  updated_at: string;
}
```

### 3. Update Page with API Integration

**File:** `src/app/practice/page.tsx` (full update)

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { LoadingOverlay } from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  BasicInfoSection,
  ScheduleSection,
  SportsSection,
  NotesSection,
} from '@/components/practice';
import { getPracticeProfile, savePracticePreferences } from '@/services/practice';
import { practiceFormSchema } from './validation';
import type { PracticeFormData } from '@/types/practice';

const PracticePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch existing practice profile
  const {
    data: existingProfile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ['practiceProfile'],
    queryFn: getPracticeProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Don't retry excessively if no profile exists
  });

  // Form setup
  const form = useForm<PracticeFormData>({
    resolver: zodResolver(practiceFormSchema),
    mode: 'onChange',
    defaultValues: {
      scheduleMode: 'flexible',
      selectedDays: [],
      flexiblePeriods: {},
      fixedPeriod: { startTime: '', endTime: '' },
      predefinedSports: [],
      customSports: [],
      personalNotes: '',
      healthWarnings: '',
    },
  });

  // Pre-fill form when profile loads
  useEffect(() => {
    if (existingProfile) {
      // Basic info
      if (existingProfile.height_cm) {
        form.setValue('height', existingProfile.height_cm);
      }
      if (existingProfile.weight_kg) {
        form.setValue('weight', existingProfile.weight_kg);
      }
      if (existingProfile.goal) {
        form.setValue('goal', existingProfile.goal as 'gain' | 'lose' | 'maintain');
      }

      // Schedule
      if (existingProfile.schedule) {
        form.setValue('scheduleMode', existingProfile.schedule.mode);
        form.setValue('selectedDays', existingProfile.schedule.selected_days);
        if (existingProfile.schedule.mode === 'flexible') {
          form.setValue('flexiblePeriods', existingProfile.schedule.periods);
        } else {
          // Extract first period from any day for fixed mode
          const firstDay = existingProfile.schedule.selected_days[0];
          const period = existingProfile.schedule.periods[firstDay]?.[0];
          if (period) {
            form.setValue('fixedPeriod', period);
          }
        }
      }

      // Sports
      if (existingProfile.sports) {
        form.setValue('predefinedSports', existingProfile.sports.predefined);
        form.setValue('customSports', existingProfile.sports.custom);
      }

      // Notes
      if (existingProfile.notes) {
        form.setValue('personalNotes', existingProfile.notes.personal || '');
        form.setValue('healthWarnings', existingProfile.notes.health_warnings || '');
      }
    }
  }, [existingProfile, form]);

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: savePracticePreferences,
    onSuccess: () => {
      toast.success('Đã lưu thiết lập tập luyện!');
      queryClient.invalidateQueries({ queryKey: ['practiceProfile'] });
      // Optionally navigate to dashboard
      // router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Submit error:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    },
  });

  // Form submission handler
  const onSubmit = async (data: PracticeFormData) => {
    // Validate all fields before submit
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    submitMutation.mutate(data);
  };

  // Loading state
  if (isLoadingProfile) {
    return (
      <>
        <Header className="sticky top-0 left-0 z-50 w-full" />
        <LoadingOverlay isVisible />
      </>
    );
  }

  // Error state (profile fetch failed - still allow form entry)
  if (profileError) {
    console.warn('Could not load existing profile:', profileError);
  }

  return (
    <>
      <Header className="sticky top-0 left-0 z-50 w-full" />
      <div className="min-h-screen pt-24">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-5xl font-semibold text-gray-900">
            Thiết lập kế hoạch tập luyện
          </h2>
          <p className="mx-auto max-w-3xl text-sm text-gray-600">
            Cá nhân hóa lịch tập luyện và mục tiêu sức khỏe của bạn để nhận được
            đề xuất phù hợp nhất.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10 bg-[#F5F4FA] pb-22.25"
          >
            <BasicInfoSection form={form} userProfile={existingProfile} />
            <ScheduleSection form={form} />
            <SportsSection form={form} />
            <NotesSection form={form} />

            {/* Submit Button */}
            <div className="mx-auto flex w-[82.5%] items-end justify-end gap-5">
              <div className="h-px w-full bg-[#B3B8C3]" />
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full rounded-none bg-black px-17 py-3.25 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
              >
                {submitMutation.isPending ? 'Đang lưu...' : 'Lưu thiết lập'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Footer />
      <LoadingOverlay isVisible={submitMutation.isPending} />
    </>
  );
};

export default PracticePage;
```

### 4. Add Service Export

**File:** `src/services/index.ts` (if exists, add export)

```typescript
export * from './practice';
```

### 5. Handle Protected Route

**File:** `src/app/practice/page.tsx` (wrap with protection)

If route protection is needed, wrap the page component:

```typescript
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

// Wrap return in:
<ProtectedRoute>
  {/* existing content */}
</ProtectedRoute>
```

---

## API Contract (Proposed)

### GET /users/practice-profile

**Response:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "height_cm": 170,
  "weight_kg": 65,
  "goal": "lose",
  "schedule": {
    "mode": "flexible",
    "selected_days": ["monday", "wednesday", "friday"],
    "periods": {
      "monday": [{ "startTime": "06:00", "endTime": "07:30" }],
      "wednesday": [{ "startTime": "18:00", "endTime": "19:00" }],
      "friday": [{ "startTime": "06:00", "endTime": "07:00" }]
    }
  },
  "sports": {
    "predefined": ["running", "gym"],
    "custom": ["Pilates"]
  },
  "notes": {
    "personal": "Prefer morning workouts",
    "health_warnings": "Knee pain"
  },
  "created_at": "2025-12-06T...",
  "updated_at": "2025-12-06T..."
}
```

### POST /users/practice-preferences

**Request:**

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
      "monday": [{ "startTime": "06:00", "endTime": "07:30" }],
      "wednesday": [{ "startTime": "18:00", "endTime": "19:00" }]
    }
  },
  "sports": {
    "predefined": ["running", "gym"],
    "custom": ["Pilates"]
  },
  "notes": {
    "personal": "Morning person",
    "health_warnings": "Bad knees"
  }
}
```

**Response:** 201 Created or 200 OK (if updating)

---

## Todo List

- [x] Create `src/services/practice.ts`
- [x] Update `src/types/practice.ts` with API types
- [x] Update page with useQuery for profile fetch
- [x] Update page with useMutation for submit
- [x] Add loading overlay during submit
- [x] Add toast notifications
- [x] Handle error states gracefully
- [x] Code review completed

## Success Criteria

- [x] Page shows loading state while fetching profile
- [x] Existing profile data pre-fills form
- [x] Submit shows loading overlay
- [x] Success toast on successful save
- [x] Error toast on failed save
- [x] Form still works if profile fetch fails

## Implementation Summary

**Files Created:**

- ✅ `src/services/practice.ts` - Practice service with GET/POST endpoints

**Files Modified:**

- ✅ `src/types/practice.ts` - Added `PracticeProfileResponse` type
- ✅ `src/app/practice/page.tsx` - Added useMutation, toast, LoadingOverlay
- ✅ `src/components/shared/LoadingOverlay.tsx` - Added optional message prop

**Code Review:**

- ✅ Zero critical issues found
- ✅ Security: XSS protected, auth handled by apiClient
- ✅ Performance: Query caching, no memory leaks
- ✅ Architecture: Follows existing patterns
- ✅ YAGNI/KISS/DRY: Lean, simple, minimal duplication
- ✅ Type safety: Zero TypeScript errors
- ✅ Full review: [code-reviewer-251206-practice-phase5-api.md](./reports/code-reviewer-251206-practice-phase5-api.md)

## Risk Assessment

- **Medium risk:** API endpoints may not exist yet
- **Mitigation:** Service functions can be mocked initially
- **Fallback:** Form works without pre-fill if API unavailable

## Security Considerations

- All API calls use authenticated Axios client
- Server validates all submitted data
- Sensitive health info transmitted over HTTPS

## Next Steps

After Phase 5:

1. Unit tests for components
2. Integration tests for form flow
3. Accessibility audit
4. Mobile responsiveness QA
5. Performance optimization (lazy load notes section)
