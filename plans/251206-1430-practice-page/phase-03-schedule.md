# Phase 3: Schedule Components

> **Parent Plan:** [plan.md](./plan.md)
> **Dependencies:** Phase 1, Phase 2
> **Status:** Pending
> **Priority:** High

---

## Overview

Implement the Weekly Training Schedule section with Flexible/Fixed mode toggle, day picker, and time period inputs. Most complex section requiring multiple custom components.

## Requirements

- Toggle between Flexible and Fixed modes
- Day picker with multi-select (T2-CN buttons)
- Time period inputs with auto-calculated duration
- Flexible mode: Multiple periods per day, add/remove capability
- Fixed mode: Single period applied to all selected days

## Architecture

```
ScheduleSection
├── Tabs (Flexible | Fixed mode toggle)
├── DayPicker (shared by both modes)
└── Content
    ├── FlexibleMode
    │   └── Per-day TimePeriodInput[] with add/remove
    └── FixedMode
        └── Single TimePeriodInput
```

## Related Code Files

- `src/components/ui/tabs.tsx` - Tabs component
- `src/components/ui/checkbox.tsx` - For day selection
- `src/app/practice/formHelper.ts` - Day options, duration calc

## Implementation Steps

### 1. Create DayPicker Component

**File:** `src/components/practice/ScheduleSection/DayPicker.tsx`

```typescript
'use client';

import { cn } from '@/lib/utils';
import { dayOptions } from '@/app/practice/formHelper';

interface DayPickerProps {
  selectedDays: string[];
  onChange: (days: string[]) => void;
  disabled?: boolean;
}

export const DayPicker = ({
  selectedDays,
  onChange,
  disabled = false,
}: DayPickerProps) => {
  const toggleDay = (dayValue: string) => {
    if (disabled) return;

    const newDays = selectedDays.includes(dayValue)
      ? selectedDays.filter((d) => d !== dayValue)
      : [...selectedDays, dayValue];
    onChange(newDays);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {dayOptions.map((day) => {
        const isSelected = selectedDays.includes(day.value);
        return (
          <button
            key={day.value}
            type="button"
            onClick={() => toggleDay(day.value)}
            disabled={disabled}
            aria-label={`${day.fullName}, ${isSelected ? 'đã chọn' : 'chưa chọn'}`}
            aria-pressed={isSelected}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full text-sm font-medium transition-all',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              isSelected
                ? 'bg-gradient-to-r from-[#00bba7] to-[#00bc7d] text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-gray-50',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {day.label}
          </button>
        );
      })}
    </div>
  );
};
```

### 2. Create TimePeriodInput Component

**File:** `src/components/practice/ScheduleSection/TimePeriodInput.tsx`

```typescript
'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { calculateDuration } from '@/app/practice/formHelper';
import { cn } from '@/lib/utils';

interface TimePeriodInputProps {
  startTime: string;
  endTime: string;
  onChange: (start: string, end: string) => void;
  onRemove?: () => void;
  showRemove?: boolean;
  index?: number;
}

export const TimePeriodInput = ({
  startTime,
  endTime,
  onChange,
  onRemove,
  showRemove = false,
  index = 0,
}: TimePeriodInputProps) => {
  const duration = startTime && endTime ? calculateDuration(startTime, endTime) : '';

  return (
    <div
      role="group"
      aria-label={`Khung giờ ${index + 1}`}
      className="flex items-center gap-3"
    >
      {/* Start Time */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Bắt đầu</label>
        <Input
          type="time"
          value={startTime}
          onChange={(e) => onChange(e.target.value, endTime)}
          className="w-32 rounded-[4px] bg-white"
        />
      </div>

      <span className="mt-5 text-gray-400">-</span>

      {/* End Time */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Kết thúc</label>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => onChange(startTime, e.target.value)}
          className="w-32 rounded-[4px] bg-white"
        />
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Thời lượng</label>
        <div
          className={cn(
            'flex h-10 w-20 items-center justify-center rounded-[4px] bg-gray-100 text-sm font-medium',
            duration ? 'text-primary' : 'text-gray-400'
          )}
          aria-live="polite"
        >
          {duration || '--'}
        </div>
      </div>

      {/* Remove button */}
      {showRemove && onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="mt-5 h-8 w-8 text-gray-400 hover:text-destructive"
          aria-label="Xóa khung giờ"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
```

### 3. Create FlexibleMode Component

**File:** `src/components/practice/ScheduleSection/FlexibleMode.tsx`

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TimePeriodInput } from './TimePeriodInput';
import { dayOptions } from '@/app/practice/formHelper';
import type { TimePeriod } from '@/types/practice';

interface FlexibleModeProps {
  selectedDays: string[];
  periods: Record<string, TimePeriod[]>;
  onPeriodsChange: (periods: Record<string, TimePeriod[]>) => void;
}

export const FlexibleMode = ({
  selectedDays,
  periods,
  onPeriodsChange,
}: FlexibleModeProps) => {
  const getDayLabel = (dayValue: string) =>
    dayOptions.find((d) => d.value === dayValue)?.fullName || dayValue;

  const addPeriod = (day: string) => {
    const dayPeriods = periods[day] || [];
    onPeriodsChange({
      ...periods,
      [day]: [...dayPeriods, { startTime: '', endTime: '' }],
    });
  };

  const updatePeriod = (
    day: string,
    index: number,
    start: string,
    end: string
  ) => {
    const dayPeriods = [...(periods[day] || [])];
    dayPeriods[index] = { startTime: start, endTime: end };
    onPeriodsChange({ ...periods, [day]: dayPeriods });
  };

  const removePeriod = (day: string, index: number) => {
    const dayPeriods = (periods[day] || []).filter((_, i) => i !== index);
    onPeriodsChange({ ...periods, [day]: dayPeriods });
  };

  if (selectedDays.length === 0) {
    return (
      <p className="py-4 text-sm text-gray-500">
        Vui lòng chọn ít nhất một ngày để thiết lập khung giờ
      </p>
    );
  }

  // Sort selected days by week order
  const sortedDays = selectedDays.sort(
    (a, b) =>
      dayOptions.findIndex((d) => d.value === a) -
      dayOptions.findIndex((d) => d.value === b)
  );

  return (
    <div className="space-y-6">
      {sortedDays.map((day) => {
        const dayPeriods = periods[day] || [{ startTime: '', endTime: '' }];

        return (
          <div
            key={day}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <h4 className="mb-3 font-medium text-gray-900">{getDayLabel(day)}</h4>

            <div className="space-y-3">
              {dayPeriods.map((period, index) => (
                <TimePeriodInput
                  key={index}
                  index={index}
                  startTime={period.startTime}
                  endTime={period.endTime}
                  onChange={(start, end) => updatePeriod(day, index, start, end)}
                  onRemove={() => removePeriod(day, index)}
                  showRemove={dayPeriods.length > 1}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addPeriod(day)}
              className="mt-3 text-primary hover:text-primary"
            >
              <Plus className="mr-1 h-4 w-4" />
              Thêm khung giờ
            </Button>
          </div>
        );
      })}
    </div>
  );
};
```

### 4. Create FixedMode Component

**File:** `src/components/practice/ScheduleSection/FixedMode.tsx`

```typescript
'use client';

import { TimePeriodInput } from './TimePeriodInput';
import type { TimePeriod } from '@/types/practice';

interface FixedModeProps {
  selectedDays: string[];
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

export const FixedMode = ({
  selectedDays,
  period,
  onPeriodChange,
}: FixedModeProps) => {
  if (selectedDays.length === 0) {
    return (
      <p className="py-4 text-sm text-gray-500">
        Vui lòng chọn ít nhất một ngày để thiết lập khung giờ
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Khung giờ này sẽ được áp dụng cho tất cả {selectedDays.length} ngày đã
        chọn
      </p>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h4 className="mb-3 font-medium text-gray-900">Giờ tập cố định</h4>
        <TimePeriodInput
          startTime={period.startTime}
          endTime={period.endTime}
          onChange={(start, end) =>
            onPeriodChange({ startTime: start, endTime: end })
          }
        />
      </div>
    </div>
  );
};
```

### 5. Create ScheduleSection Main Component

**File:** `src/components/practice/ScheduleSection/index.tsx`

```typescript
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { DayPicker } from './DayPicker';
import { FlexibleMode } from './FlexibleMode';
import { FixedMode } from './FixedMode';
import type { PracticeFormData } from '@/types/practice';

interface ScheduleSectionProps {
  form: UseFormReturn<PracticeFormData>;
}

export const ScheduleSection = ({ form }: ScheduleSectionProps) => {
  const scheduleMode = form.watch('scheduleMode');
  const selectedDays = form.watch('selectedDays') || [];
  const flexiblePeriods = form.watch('flexiblePeriods') || {};
  const fixedPeriod = form.watch('fixedPeriod') || { startTime: '', endTime: '' };

  return (
    <Card className="mx-auto w-[82.5%] border-none bg-transparent pt-13.5 shadow-none">
      <CardHeader className="border-b border-[#B3B8C3] px-0 pb-5.5">
        <CardTitle className="font-medium">
          Lịch tập luyện trong tuần
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-17 px-0">
        {/* Left description */}
        <div className="w-[23%]">
          <h5 className="text-xl font-medium">Lịch trình</h5>
          <p className="text-sm text-gray-600">
            Chọn ngày và khung giờ tập luyện phù hợp với lịch trình của bạn.
          </p>
        </div>

        {/* Schedule content */}
        <div className="flex-1 space-y-6">
          {/* Mode Toggle */}
          <FormField
            control={form.control}
            name="scheduleMode"
            render={({ field }) => (
              <FormItem>
                <Tabs
                  value={field.value}
                  onValueChange={field.onChange}
                  className="w-full"
                >
                  <TabsList
                    className="grid w-full max-w-[300px] grid-cols-2"
                    role="tablist"
                    aria-label="Chế độ lịch tập"
                  >
                    <TabsTrigger value="flexible">Linh hoạt</TabsTrigger>
                    <TabsTrigger value="fixed">Cố định</TabsTrigger>
                  </TabsList>
                </Tabs>
              </FormItem>
            )}
          />

          {/* Day Picker */}
          <FormField
            control={form.control}
            name="selectedDays"
            render={({ field }) => (
              <FormItem>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Chọn ngày tập
                </label>
                <DayPicker
                  selectedDays={field.value || []}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mode Content */}
          {scheduleMode === 'flexible' ? (
            <FormField
              control={form.control}
              name="flexiblePeriods"
              render={({ field }) => (
                <FormItem>
                  <FlexibleMode
                    selectedDays={selectedDays}
                    periods={field.value || {}}
                    onPeriodsChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="fixedPeriod"
              render={({ field }) => (
                <FormItem>
                  <FixedMode
                    selectedDays={selectedDays}
                    period={field.value || { startTime: '', endTime: '' }}
                    onPeriodChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Re-export subcomponents for flexibility
export { DayPicker } from './DayPicker';
export { TimePeriodInput } from './TimePeriodInput';
export { FlexibleMode } from './FlexibleMode';
export { FixedMode } from './FixedMode';
```

### 6. Update Barrel Export

**File:** `src/components/practice/index.ts` (update)

```typescript
export { BasicInfoSection } from './BasicInfoSection';
export { ScheduleSection } from './ScheduleSection';
```

### 7. Update Page

**File:** `src/app/practice/page.tsx` (add section)

```typescript
// Add import
import { BasicInfoSection, ScheduleSection } from '@/components/practice';

// In form, after BasicInfoSection:
<ScheduleSection form={form} />
```

---

## Todo List

- [ ] Create `DayPicker.tsx` component
- [ ] Create `TimePeriodInput.tsx` component
- [ ] Create `FlexibleMode.tsx` component
- [ ] Create `FixedMode.tsx` component
- [ ] Create `ScheduleSection/index.tsx` main component
- [ ] Update barrel export
- [ ] Add ScheduleSection to page
- [ ] Test mode switching
- [ ] Test day selection
- [ ] Test time period add/remove (flexible mode)
- [ ] Verify mobile responsiveness

## Success Criteria

- [ ] Toggle switches between Flexible/Fixed modes
- [ ] Day buttons show selected state correctly
- [ ] Time inputs calculate duration automatically
- [ ] Can add/remove time periods in flexible mode
- [ ] Fixed mode shows single time period
- [ ] Touch targets are 48px minimum on mobile
- [ ] Keyboard navigation works (Tab, Enter, Space)

## Risk Assessment

- **High complexity:** Multiple interacting components
- **Mitigation:** Test each component in isolation first

## Security Considerations

- Time inputs validated via Zod schema
- No user-generated content in this section

## Next Steps

→ Proceed to [Phase 4: Sports & Notes Sections](./phase-04-sports-notes.md)
