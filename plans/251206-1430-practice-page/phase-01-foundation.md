# Phase 1: Foundation & Types

> **Parent Plan:** [plan.md](./plan.md)
> **Status:** Pending
> **Priority:** High

---

## Overview

Set up foundational files: types, validation schemas, form helpers, and page skeleton.

## Requirements

- Define TypeScript interfaces for practice form data
- Create Zod validation schemas with dynamic target weight validation
- Set up form helper options (goal types, predefined sports)
- Create basic page structure with Header/Footer

## Architecture

```
PracticeFormData
├── basicInfo
│   ├── height?: number (from API)
│   ├── weight?: number (from API)
│   ├── targetWeight: number
│   └── goal?: 'gain' | 'lose' | 'maintain' (from API)
├── schedule
│   ├── mode: 'flexible' | 'fixed'
│   ├── selectedDays: string[]
│   ├── flexiblePeriods: Record<string, TimePeriod[]>
│   └── fixedPeriod: TimePeriod
├── sports
│   ├── predefined: string[]
│   └── custom: string[]
└── notes
    ├── personal?: string
    └── healthWarnings?: string
```

## Related Code Files

- `src/app/predict/validation.ts` - Reference for Zod patterns
- `src/app/predict/formHelper.ts` - Reference for options pattern
- `src/types/` - Type definitions location

## Implementation Steps

### 1. Create Type Definitions

**File:** `src/types/practice.ts`

```typescript
// TimePeriod for schedule
export interface TimePeriod {
  startTime: string; // HH:mm format
  endTime: string;
}

// Basic info section
export interface PracticeBasicInfo {
  height?: number;
  weight?: number;
  targetWeight: number;
  goal?: 'gain' | 'lose' | 'maintain';
}

// Schedule section
export interface PracticeSchedule {
  mode: 'flexible' | 'fixed';
  selectedDays: string[];
  flexiblePeriods: Record<string, TimePeriod[]>;
  fixedPeriod: TimePeriod;
}

// Sports section
export interface PracticeSports {
  predefined: string[];
  custom: string[];
}

// Notes section
export interface PracticeNotes {
  personal?: string;
  healthWarnings?: string;
}

// Full form data
export interface PracticeFormData {
  basicInfo: PracticeBasicInfo;
  schedule: PracticeSchedule;
  sports: PracticeSports;
  notes: PracticeNotes;
}

// API response for pre-fill data
export interface UserPracticeProfile {
  height_cm?: number;
  weight_kg?: number;
  goal?: string;
}
```

### 2. Create Validation Schema

**File:** `src/app/practice/validation.ts`

```typescript
import { z } from 'zod';

const timePeriodSchema = z.object({
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time'),
});

export const practiceFormSchema = z.object({
  // Basic Info
  height: z.number().optional(),
  weight: z.number().optional(),
  targetWeight: z.coerce
    .number({ error: 'Vui lòng nhập cân nặng mục tiêu' })
    .min(30, 'Cân nặng tối thiểu 30kg')
    .max(200, 'Cân nặng tối đa 200kg'),
  goal: z.enum(['gain', 'lose', 'maintain']).optional(),

  // Schedule
  scheduleMode: z.enum(['flexible', 'fixed']),
  selectedDays: z.array(z.string()).min(1, 'Chọn ít nhất 1 ngày'),
  flexiblePeriods: z.record(z.array(timePeriodSchema)).optional(),
  fixedPeriod: timePeriodSchema.optional(),

  // Sports
  predefinedSports: z.array(z.string()),
  customSports: z.array(z.string()),

  // Notes
  personalNotes: z.string().max(500).optional(),
  healthWarnings: z.string().max(500).optional(),
});

// Dynamic validation for target weight based on goal
export const validateTargetWeight = (
  target: number,
  current: number,
  goal: string
): string | true => {
  switch (goal) {
    case 'gain':
      return target > current
        ? true
        : 'Mục tiêu tăng cân: cân nặng mục tiêu phải lớn hơn cân nặng hiện tại';
    case 'lose':
      return target < current
        ? true
        : 'Mục tiêu giảm cân: cân nặng mục tiêu phải nhỏ hơn cân nặng hiện tại';
    case 'maintain':
      return Math.abs(target - current) <= 1
        ? true
        : 'Mục tiêu giữ cân: cân nặng mục tiêu phải xấp xỉ cân nặng hiện tại (±1kg)';
    default:
      return true;
  }
};
```

### 3. Create Form Helper

**File:** `src/app/practice/formHelper.ts`

```typescript
export const goalOptions = [
  { label: 'Tăng cân', value: 'gain' },
  { label: 'Giảm cân', value: 'lose' },
  { label: 'Giữ cân', value: 'maintain' },
];

export const dayOptions = [
  { label: 'T2', value: 'monday', fullName: 'Thứ 2' },
  { label: 'T3', value: 'tuesday', fullName: 'Thứ 3' },
  { label: 'T4', value: 'wednesday', fullName: 'Thứ 4' },
  { label: 'T5', value: 'thursday', fullName: 'Thứ 5' },
  { label: 'T6', value: 'friday', fullName: 'Thứ 6' },
  { label: 'T7', value: 'saturday', fullName: 'Thứ 7' },
  { label: 'CN', value: 'sunday', fullName: 'Chủ nhật' },
];

export const predefinedSports = [
  { label: 'Chạy bộ', value: 'running' },
  { label: 'Bơi lội', value: 'swimming' },
  { label: 'Yoga', value: 'yoga' },
  { label: 'Gym', value: 'gym' },
  { label: 'Đạp xe', value: 'cycling' },
  { label: 'Bóng đá', value: 'football' },
  { label: 'Tennis', value: 'tennis' },
  { label: 'Cầu lông', value: 'badminton' },
];

export const scheduleModeOptions = [
  { label: 'Linh hoạt', value: 'flexible' },
  { label: 'Cố định', value: 'fixed' },
];

// Calculate duration between two times
export const calculateDuration = (start: string, end: string): string => {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  let totalMinutes = endH * 60 + endM - (startH * 60 + startM);
  if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}p`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h${minutes}p`;
};
```

### 4. Create Page Skeleton

**File:** `src/app/practice/page.tsx`

```typescript
'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { practiceFormSchema } from './validation';
import type { PracticeFormData } from '@/types/practice';

const PracticePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PracticeFormData>({
    resolver: zodResolver(practiceFormSchema),
    mode: 'onChange',
    defaultValues: {
      scheduleMode: 'flexible',
      selectedDays: [],
      predefinedSports: [],
      customSports: [],
    },
  });

  const onSubmit = async (data: PracticeFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Submit:', data);
      // TODO: API integration in Phase 5
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Cá nhân hóa lịch tập luyện và mục tiêu sức khỏe của bạn
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10 bg-[#F5F4FA] pb-22.25"
          >
            {/* Sections will be added in subsequent phases */}

            {/* Submit Button */}
            <div className="mx-auto flex w-[82.5%] items-end justify-end gap-5">
              <div className="h-px w-full bg-[#B3B8C3]" />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-none bg-black px-17 py-3.25 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu thiết lập'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Footer />
    </>
  );
};

export default PracticePage;
```

### 5. Update Types Index

**File:** `src/types/index.ts` (add export)

```typescript
export * from './practice';
```

---

## Todo List

- [ ] Create `src/types/practice.ts` with interfaces
- [ ] Create `src/app/practice/validation.ts` with Zod schema
- [ ] Create `src/app/practice/formHelper.ts` with options
- [ ] Create `src/app/practice/page.tsx` skeleton
- [ ] Update `src/types/index.ts` barrel export
- [ ] Verify page renders at `/practice` route

## Success Criteria

- [ ] TypeScript compiles without errors
- [ ] Page renders with Header/Footer
- [ ] Form initializes with default values
- [ ] Submit button triggers console log

## Risk Assessment

- **Low risk:** Following established patterns from predict page
- **Consideration:** Types may need adjustment as API spec is finalized

## Security Considerations

- Input validation via Zod schema
- Sanitize any user-provided text (notes fields)

## Next Steps

→ Proceed to [Phase 2: Basic Information Section](./phase-02-basic-info.md)
