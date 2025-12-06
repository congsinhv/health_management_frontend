# Phase 4: Sports & Notes Sections

> **Parent Plan:** [plan.md](./plan.md)
> **Dependencies:** Phase 1, Phase 2, Phase 3
> **Status:** Pending
> **Priority:** Medium

---

## Overview

Implement Favorite Sports section with predefined badges and custom tag input, plus optional Notes section with collapsible textareas.

## Requirements

**Sports Section:**

- Grid of predefined sports as selectable badges
- Custom sport input with tag management
- Remove any custom-added sport

**Notes Section:**

- Two optional textareas (personal notes, health warnings)
- Collapsible by default (progressive disclosure)
- Max 500 characters each

## Architecture

```
SportsSection
├── SportBadge[] (predefined grid)
└── SportTagInput (custom sports)

NotesSection
├── Collapsible wrapper
├── Textarea (personal notes)
└── Textarea (health warnings)
```

## Related Code Files

- `src/components/ui/badge.tsx` - Badge component
- `src/components/ui/textarea.tsx` - Textarea component
- `src/components/ui/collapsible.tsx` - Collapsible component

## Implementation Steps

### 1. Create SportBadge Component

**File:** `src/components/practice/SportsSection/SportBadge.tsx`

```typescript
'use client';

import { cn } from '@/lib/utils';

interface SportBadgeProps {
  label: string;
  value: string;
  selected: boolean;
  onToggle: (value: string) => void;
}

export const SportBadge = ({
  label,
  value,
  selected,
  onToggle,
}: SportBadgeProps) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(value)}
      aria-pressed={selected}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-gray-50'
      )}
    >
      {label}
    </button>
  );
};
```

### 2. Create SportTagInput Component

**File:** `src/components/practice/SportsSection/SportTagInput.tsx`

```typescript
'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SportTagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
}

export const SportTagInput = ({
  tags,
  onAdd,
  onRemove,
  placeholder = 'Nhập môn thể thao khác...',
}: SportTagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed.length < 2) return;
    if (tags.includes(trimmed)) return;

    onAdd(trimmed);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (tag: string) => {
    onRemove(tag);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-3">
      {/* Input row */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-[4px] bg-white"
          aria-label="Thêm môn thể thao"
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={inputValue.trim().length < 2}
          variant="outline"
          className="px-3"
          aria-label="Thêm"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Tags display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'inline-flex items-center gap-1 rounded-full',
                'bg-gray-100 px-3 py-1 text-sm text-gray-700'
              )}
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemove(tag)}
                className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                aria-label={`Xóa ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
              <span className="sr-only" aria-live="polite">
                Đã xóa {tag}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
```

### 3. Create SportsSection Main Component

**File:** `src/components/practice/SportsSection/index.tsx`

```typescript
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { SportBadge } from './SportBadge';
import { SportTagInput } from './SportTagInput';
import { predefinedSports } from '@/app/practice/formHelper';
import type { PracticeFormData } from '@/types/practice';

interface SportsSectionProps {
  form: UseFormReturn<PracticeFormData>;
}

export const SportsSection = ({ form }: SportsSectionProps) => {
  const selectedPredefined = form.watch('predefinedSports') || [];
  const customSports = form.watch('customSports') || [];

  const togglePredefined = (value: string) => {
    const current = selectedPredefined;
    const newSelection = current.includes(value)
      ? current.filter((s) => s !== value)
      : [...current, value];
    form.setValue('predefinedSports', newSelection);
  };

  return (
    <Card className="mx-auto w-[82.5%] border-none bg-transparent pt-13.5 shadow-none">
      <CardHeader className="border-b border-[#B3B8C3] px-0 pb-5.5">
        <CardTitle className="font-medium">
          Môn thể thao yêu thích
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-17 px-0">
        {/* Left description */}
        <div className="w-[23%]">
          <h5 className="text-xl font-medium">Sở thích</h5>
          <p className="text-sm text-gray-600">
            Chọn các môn thể thao bạn yêu thích để cá nhân hóa đề xuất.
          </p>
        </div>

        {/* Sports content */}
        <div className="flex-1 space-y-6">
          {/* Predefined sports grid */}
          <FormField
            control={form.control}
            name="predefinedSports"
            render={() => (
              <FormItem>
                <div
                  role="group"
                  aria-label="Chọn môn thể thao yêu thích"
                  className="flex flex-wrap gap-3"
                >
                  {predefinedSports.map((sport) => (
                    <SportBadge
                      key={sport.value}
                      label={sport.label}
                      value={sport.value}
                      selected={selectedPredefined.includes(sport.value)}
                      onToggle={togglePredefined}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Custom sports input */}
          <FormField
            control={form.control}
            name="customSports"
            render={({ field }) => (
              <FormItem>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Thêm môn thể thao khác
                </label>
                <SportTagInput
                  tags={field.value || []}
                  onAdd={(tag) => field.onChange([...(field.value || []), tag])}
                  onRemove={(tag) =>
                    field.onChange((field.value || []).filter((t) => t !== tag))
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { SportBadge } from './SportBadge';
export { SportTagInput } from './SportTagInput';
```

### 4. Create NotesSection Component

**File:** `src/components/practice/NotesSection.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import type { PracticeFormData } from '@/types/practice';

interface NotesSectionProps {
  form: UseFormReturn<PracticeFormData>;
}

export const NotesSection = ({ form }: NotesSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mx-auto w-[82.5%] border-none bg-transparent pt-13.5 shadow-none">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="border-b border-[#B3B8C3] px-0 pb-5.5">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between"
            >
              <CardTitle className="font-medium">
                Ghi chú & Cảnh báo sức khỏe
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Tùy chọn)
                </span>
              </CardTitle>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="flex gap-17 px-0">
            {/* Left description */}
            <div className="w-[23%]">
              <h5 className="text-xl font-medium">Thông tin thêm</h5>
              <p className="text-sm text-gray-600">
                Thêm ghi chú hoặc cảnh báo sức khỏe để chúng tôi điều chỉnh
                chương trình phù hợp.
              </p>
            </div>

            {/* Notes content */}
            <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
              {/* Personal Notes */}
              <FormField
                control={form.control}
                name="personalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-[#6A7282]">
                      Ghi chú riêng
                    </FormLabel>
                    <Textarea
                      placeholder="VD: Tập nhẹ vào buổi sáng, không tập sau 9h tối..."
                      className="min-h-[100px] resize-none rounded-[4px] bg-white"
                      maxLength={500}
                      {...field}
                    />
                    <div className="flex justify-between">
                      <FormMessage />
                      <span className="text-xs text-gray-400">
                        {(field.value || '').length}/500
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              {/* Health Warnings */}
              <FormField
                control={form.control}
                name="healthWarnings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-[#6A7282]">
                      Cảnh báo sức khỏe
                    </FormLabel>
                    <Textarea
                      placeholder="VD: Đau khớp gối, huyết áp cao, dị ứng..."
                      className={cn(
                        'min-h-[100px] resize-none rounded-[4px] bg-white',
                        field.value && 'border-amber-400'
                      )}
                      maxLength={500}
                      {...field}
                    />
                    <div className="flex justify-between">
                      <FormMessage />
                      <span className="text-xs text-gray-400">
                        {(field.value || '').length}/500
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
```

### 5. Update Barrel Export

**File:** `src/components/practice/index.ts` (update)

```typescript
export { BasicInfoSection } from './BasicInfoSection';
export { ScheduleSection } from './ScheduleSection';
export { SportsSection } from './SportsSection';
export { NotesSection } from './NotesSection';
```

### 6. Update Page

**File:** `src/app/practice/page.tsx` (add sections)

```typescript
// Add imports
import {
  BasicInfoSection,
  ScheduleSection,
  SportsSection,
  NotesSection,
} from '@/components/practice';

// In form, add sections:
<BasicInfoSection form={form} userProfile={userProfile} />
<ScheduleSection form={form} />
<SportsSection form={form} />
<NotesSection form={form} />
```

---

## Todo List

- [ ] Create `SportBadge.tsx` component
- [ ] Create `SportTagInput.tsx` component
- [ ] Create `SportsSection/index.tsx` main component
- [ ] Create `NotesSection.tsx` component
- [ ] Update barrel export
- [ ] Add sections to page
- [ ] Test badge selection toggle
- [ ] Test custom sport add/remove
- [ ] Test notes collapsible behavior
- [ ] Test character count display

## Success Criteria

- [ ] Predefined sports show as selectable badges
- [ ] Badge changes color when selected
- [ ] Can add custom sports via input
- [ ] Custom sports appear as removable tags
- [ ] Notes section collapsed by default
- [ ] Notes section expands on click
- [ ] Character count shows for textareas
- [ ] Max 500 characters enforced

## Risk Assessment

- **Low risk:** Straightforward component composition
- **Consideration:** May need to add sports icons later

## Security Considerations

- Sanitize custom sport input (no HTML)
- Max character limits prevent abuse
- Server validation required for notes content

## Next Steps

→ Proceed to [Phase 5: API Integration](./phase-05-integration.md)
