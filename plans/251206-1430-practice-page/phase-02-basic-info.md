# Phase 2: Basic Information Section

> **Parent Plan:** [plan.md](./plan.md)
> **Dependencies:** Phase 1 (Foundation)
> **Status:** Completed (2025-12-06 14:30)
> **Priority:** High

---

## Overview

Implement the Basic Information section with 4 fields: height, weight, target weight, and overall goal. Includes pre-fill logic from API and dynamic validation for target weight.

## Requirements

- Pre-fill height, weight, goal from user profile API
- Disable pre-filled fields with visual indicator
- Target weight remains editable with dynamic validation
- Real-time validation feedback based on goal type

## Related Code Files

- `src/app/predict/page.tsx` - Card layout reference
- `src/components/form/TextField.tsx` - Input wrapper pattern
- `src/services/user.ts` - User profile API

## Architecture

```
BasicInfoSection
├── Props: form (UseFormReturn), userProfile (prefill data)
├── State: none (uses form state)
└── Children
    ├── FormField (height) - disabled if prefilled
    ├── FormField (weight) - disabled if prefilled
    ├── FormField (targetWeight) - always editable
    └── FormField (goal) - disabled if prefilled
```

## Implementation Steps

### 1. Create BasicInfoSection Component

**File:** `src/components/practice/BasicInfoSection.tsx`

```typescript
'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { goalOptions } from '@/app/practice/formHelper';
import { validateTargetWeight } from '@/app/practice/validation';
import { Lock } from 'lucide-react';
import type { PracticeFormData, UserPracticeProfile } from '@/types/practice';

interface BasicInfoSectionProps {
  form: UseFormReturn<PracticeFormData>;
  userProfile?: UserPracticeProfile;
}

export const BasicInfoSection = ({
  form,
  userProfile,
}: BasicInfoSectionProps) => {
  const hasHeight = !!userProfile?.height_cm;
  const hasWeight = !!userProfile?.weight_kg;
  const hasGoal = !!userProfile?.goal;

  // Watch for dynamic validation
  const currentWeight = form.watch('weight') || userProfile?.weight_kg;
  const currentGoal = form.watch('goal') || userProfile?.goal;

  return (
    <Card className="mx-auto w-[82.5%] border-none bg-transparent pt-13.5 shadow-none">
      <CardHeader className="border-b border-[#B3B8C3] px-0 pb-5.5">
        <CardTitle className="font-medium">
          Thông tin cơ bản
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-17 px-0">
        {/* Left description */}
        <div className="w-[23%]">
          <h5 className="text-xl font-medium">Mục tiêu sức khỏe</h5>
          <p className="text-sm text-gray-600">
            Thiết lập mục tiêu cân nặng dựa trên tình trạng hiện tại của bạn.
          </p>
        </div>

        {/* Form fields */}
        <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
          {/* Height */}
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem className="min-h-[88px]">
                <FormLabel className="flex items-center gap-1.5 text-xs font-medium text-[#6A7282]">
                  Chiều cao (cm)
                  {hasHeight && <Lock className="h-3 w-3" />}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="VD: 170"
                    disabled={hasHeight}
                    className={cn(
                      'rounded-[4px] bg-white',
                      hasHeight && 'bg-gray-100 opacity-60'
                    )}
                    {...field}
                    value={field.value ?? userProfile?.height_cm ?? ''}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || undefined)
                    }
                  />
                </FormControl>
                {hasHeight && (
                  <p className="text-xs text-gray-500">Từ hồ sơ của bạn</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Weight */}
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="min-h-[88px]">
                <FormLabel className="flex items-center gap-1.5 text-xs font-medium text-[#6A7282]">
                  Cân nặng (kg)
                  {hasWeight && <Lock className="h-3 w-3" />}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="VD: 60"
                    disabled={hasWeight}
                    className={cn(
                      'rounded-[4px] bg-white',
                      hasWeight && 'bg-gray-100 opacity-60'
                    )}
                    {...field}
                    value={field.value ?? userProfile?.weight_kg ?? ''}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || undefined)
                    }
                  />
                </FormControl>
                {hasWeight && (
                  <p className="text-xs text-gray-500">Từ hồ sơ của bạn</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Target Weight - Always editable */}
          <FormField
            control={form.control}
            name="targetWeight"
            render={({ field }) => {
              const validationResult =
                currentWeight && currentGoal
                  ? validateTargetWeight(
                      field.value || 0,
                      currentWeight,
                      currentGoal
                    )
                  : true;

              return (
                <FormItem className="min-h-[88px]">
                  <FormLabel className="text-xs font-medium text-[#6A7282]">
                    Mục tiêu cân nặng (kg)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="VD: 55"
                      className={cn(
                        'rounded-[4px] bg-white',
                        validationResult !== true && 'border-destructive'
                      )}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  {validationResult !== true && (
                    <p className="text-xs text-destructive">{validationResult}</p>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Overall Goal */}
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem className="min-h-[88px]">
                <FormLabel className="flex items-center gap-1.5 text-xs font-medium text-[#6A7282]">
                  Mục tiêu tổng thể
                  {hasGoal && <Lock className="h-3 w-3" />}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || userProfile?.goal}
                  disabled={hasGoal}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        'rounded-[4px] bg-white',
                        hasGoal && 'bg-gray-100 opacity-60'
                      )}
                    >
                      <SelectValue placeholder="Chọn mục tiêu" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {goalOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasGoal && (
                  <p className="text-xs text-gray-500">Từ hồ sơ của bạn</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
```

### 2. Update Page to Use Section

**File:** `src/app/practice/page.tsx` (update)

```typescript
// Add import
import { BasicInfoSection } from '@/components/practice';

// Inside form, replace placeholder comment:
<BasicInfoSection form={form} userProfile={userProfile} />
```

### 3. Create Barrel Export

**File:** `src/components/practice/index.ts`

```typescript
export { BasicInfoSection } from './BasicInfoSection';
```

### 4. Add Pre-fill Effect

**File:** `src/app/practice/page.tsx` (add to component)

```typescript
// Add after form hook
const { data: userProfile } = useQuery({
  queryKey: ['userProfile'],
  queryFn: () => userService.getProfile(),
  staleTime: 5 * 60 * 1000,
});

// Pre-fill form when data loads
useEffect(() => {
  if (userProfile) {
    if (userProfile.height_cm) {
      form.setValue('height', userProfile.height_cm);
    }
    if (userProfile.weight_kg) {
      form.setValue('weight', userProfile.weight_kg);
    }
    if (userProfile.goal) {
      form.setValue('goal', userProfile.goal as 'gain' | 'lose' | 'maintain');
    }
  }
}, [userProfile, form]);
```

---

## Todo List

- [x] Create `src/components/practice/BasicInfoSection.tsx`
- [x] Create `src/components/practice/index.ts` barrel export
- [x] Update `src/app/practice/page.tsx` to include section
- [x] Add React Query pre-fill logic
- [x] Test disabled state for pre-filled fields
- [x] Test dynamic validation for target weight

## Success Criteria

- [x] Height/weight/goal disabled when API provides values
- [x] Target weight always editable
- [x] Validation message shows when target weight conflicts with goal
- [x] Lock icon appears on disabled fields
- [x] "Từ hồ sơ của bạn" helper text shows for pre-filled fields

## Risk Assessment

- **Medium risk:** API may not have user profile data
- **Mitigation:** Graceful fallback - all fields editable if no API data

## Security Considerations

- Numeric input validation prevents injection
- Server-side validation required on submit

## Next Steps

→ Proceed to [Phase 3: Schedule Components](./phase-03-schedule.md)

---

## Implementation Summary

**Completed on:** 2025-12-06 14:30

### What was implemented:

- Created BasicInfoSection component with 4 fields (height, weight, target weight, goal)
- Implemented pre-fill logic from user profile API
- Added dynamic validation for target weight based on goal (gain/lose/maintain)
- Fixed security issues (input sanitization, removed console.log)
- All tests passing, TypeScript and ESLint validation passed

### Key features delivered:

- Lock icons on pre-filled fields with "From your profile" helper text
- Dynamic validation showing real-time feedback for target weight
- Responsive grid layout with proper spacing
- Form integration with React Hook Form
- TypeScript types properly defined and imported
