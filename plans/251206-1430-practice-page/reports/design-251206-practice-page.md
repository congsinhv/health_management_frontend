# Practice Page UI Design Concepts

> VHealth Fitness/Training Preferences Setup Page
> Date: 2025-12-06

---

## Table of Contents

1. [Design Overview](#1-design-overview)
2. [Design Concepts](#2-design-concepts)
3. [Component Breakdown](#3-component-breakdown)
4. [Interaction Patterns](#4-interaction-patterns)
5. [Visual Hierarchy](#5-visual-hierarchy)
6. [Mobile Responsiveness](#6-mobile-responsiveness)
7. [Accessibility](#7-accessibility)
8. [Implementation Recommendations](#8-implementation-recommendations)

---

## 1. Design Overview

### Page Purpose

Setup training preferences and fitness goals for personalized health recommendations.

### Target Users

Vietnamese-speaking users seeking fitness guidance with varied technical literacy.

### Key Sections

1. Hero Section - Motivational introduction
2. Basic Information (Thong tin co ban) - Height, weight, goals
3. Weekly Schedule (Lich tap luyen trong tuan) - Flexible/Fixed modes
4. Favorite Sports (Mon the thao yeu thich) - Selection + custom tags
5. Notes & Health Warnings (Ghi chu & Canh bao suc khoe) - Optional textareas

---

## 2. Design Concepts

### Concept A: Progressive Stepper

**Layout**: Vertical stepper with numbered sections, one expanded at a time.

```
+------------------------------------------+
|  [Hero: Full-width motivational banner]  |
+------------------------------------------+
|                                          |
|  (1) Thong tin co ban        [Expanded]  |
|      +------------------------------+    |
|      | Form fields visible          |    |
|      +------------------------------+    |
|                                          |
|  (2) Lich tap luyen           [Collapsed]|
|  (3) Mon the thao yeu thich   [Collapsed]|
|  (4) Ghi chu (Optional)       [Collapsed]|
|                                          |
+------------------------------------------+
```

**Pros**:

- Progressive disclosure reduces cognitive load
- Clear linear flow guides users step-by-step
- Familiar wizard-like pattern
- Works well on mobile

**Cons**:

- Users cannot see all sections at once
- Extra clicks to navigate between sections
- May feel slower for power users

**Best For**: First-time users, mobile-first experiences

---

### Concept B: Card-Based Sections (Recommended)

**Layout**: Stacked cards with all sections visible, matching predict/profile page patterns.

```
+------------------------------------------+
|  [Hero Section]                          |
|  Title + Description centered            |
+------------------------------------------+
|  bg-[#f5f4fa]                            |
|  +------------------------------------+  |
|  | Card: Thong tin co ban             |  |
|  | +--------------------------------+ |  |
|  | | Left: Title + Description      | |  |
|  | | Right: 2-column form grid      | |  |
|  | +--------------------------------+ |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | Card: Lich tap luyen trong tuan    |  |
|  | [Tabs: Linh hoat | Co dinh]        |  |
|  | +--------------------------------+ |  |
|  | | Schedule content area          | |  |
|  | +--------------------------------+ |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | Card: Mon the thao yeu thich       |  |
|  | [Badge grid + custom input]        |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | Card: Ghi chu & Canh bao (Optional)|  |
|  | [Two textareas side by side]       |  |
|  +------------------------------------+  |
|                                          |
|  [Submit Button - Right aligned]         |
+------------------------------------------+
```

**Pros**:

- Consistent with existing VHealth pages (predict, profile)
- All sections visible for quick scanning
- Easy to jump to any section
- Familiar pattern for returning users

**Cons**:

- Longer page scroll
- Schedule section complexity may feel heavy

**Best For**: Consistency with VHealth design language

---

### Concept C: Two-Column Dashboard

**Layout**: Sidebar navigation + main content area.

```
+------------------------------------------+
|  [Hero Section - Compact]                |
+------------------------------------------+
|  +--------+  +-------------------------+ |
|  | Nav    |  | Main Content            | |
|  |        |  |                         | |
|  | [1] *  |  | [Selected Section]      | |
|  | [2]    |  |                         | |
|  | [3]    |  |                         | |
|  | [4]    |  |                         | |
|  |        |  |                         | |
|  +--------+  +-------------------------+ |
+------------------------------------------+
```

**Pros**:

- Desktop-optimized with clear navigation
- Section switching without scroll
- Professional dashboard feel

**Cons**:

- Complex responsive handling
- Unfamiliar pattern for VHealth
- More development effort
- Poor mobile experience

**Best For**: Complex admin-style interfaces

---

### Recommendation: Concept B (Card-Based Sections)

Aligns with existing VHealth design patterns from predict and profile pages.

---

## 3. Component Breakdown

### 3.1 shadcn/ui Components Required

| Section    | Components                                            |
| ---------- | ----------------------------------------------------- |
| Hero       | Custom (no shadcn)                                    |
| Basic Info | `Form`, `FormField`, `Input`, `Select`, `RadioGroup`  |
| Schedule   | `Tabs`, `Checkbox`, `Input` (time), custom day picker |
| Sports     | `Badge`, `Checkbox`, `Input`, custom tag input        |
| Notes      | `Textarea`, `Label`                                   |
| Actions    | `Button`                                              |

### 3.2 Custom Components to Build

#### DayPicker Component

```tsx
// Toggleable day buttons
interface DayPickerProps {
  selectedDays: string[];
  onChange: (days: string[]) => void;
  disabled?: boolean;
}

// Visual: Row of circular buttons T2-CN
// States: unselected (outline), selected (primary fill)
```

#### TimePeriodInput Component

```tsx
// Time range input with auto-calculated duration
interface TimePeriodInputProps {
  startTime: string;
  endTime: string;
  onChange: (start: string, end: string) => void;
  onRemove?: () => void;
  showDuration?: boolean;
}

// Visual: [Start] - [End] = Duration [X remove]
```

#### SportTagInput Component

```tsx
// Custom sport input with tag management
interface SportTagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
}

// Visual: Input field + added tags as removable badges
```

#### SportCheckboxGroup Component

```tsx
// Predefined sports as selectable badges
interface SportCheckboxGroupProps {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

// Visual: Grid of selectable badge-style checkboxes
```

### 3.3 Form Schema (Zod)

```typescript
const practiceFormSchema = z.object({
  // Basic Information
  height: z.string().optional(), // Pre-filled, may be disabled
  weight: z.string().optional(), // Pre-filled, may be disabled
  targetWeight: z
    .string()
    .min(1, 'Vui long nhap can nang muc tieu')
    .refine(
      val => !isNaN(Number(val)) && Number(val) > 0,
      'Can nang phai lon hon 0'
    ),
  goal: z.enum(['gain', 'lose', 'maintain']).optional(), // Pre-filled

  // Schedule
  scheduleMode: z.enum(['flexible', 'fixed']),
  flexibleSchedule: z
    .array(
      z.object({
        day: z.string(),
        periods: z.array(
          z.object({
            startTime: z.string(),
            endTime: z.string(),
          })
        ),
      })
    )
    .optional(),
  fixedSchedule: z
    .object({
      days: z.array(z.string()),
      startTime: z.string(),
      endTime: z.string(),
    })
    .optional(),

  // Sports
  favoriteSports: z.array(z.string()),
  customSports: z.array(z.string()),

  // Notes (optional)
  personalNotes: z.string().optional(),
  healthWarnings: z.string().optional(),
});
```

---

## 4. Interaction Patterns

### 4.1 Basic Information Section

**Pre-filled Fields Behavior**:

```
If API provides value:
  - Field shows value
  - Field is disabled (grayed out)
  - Tooltip/hint: "Du lieu tu ho so cua ban"

If no API value:
  - Field is editable
  - Standard validation
```

**Target Weight Dynamic Validation**:

```tsx
// Validation logic based on goal
const validateTargetWeight = (
  target: number,
  current: number,
  goal: string
) => {
  switch (goal) {
    case 'gain':
      return target > current
        ? true
        : 'Can nang muc tieu phai lon hon can nang hien tai';
    case 'lose':
      return target < current
        ? true
        : 'Can nang muc tieu phai nho hon can nang hien tai';
    case 'maintain':
      return Math.abs(target - current) <= 1
        ? true
        : 'Can nang muc tieu nen xap xi can nang hien tai (+-1kg)';
  }
};
```

**Visual Feedback**:

- Real-time validation message below field
- Color: `text-destructive` for errors, `text-green-600` for valid
- Icon indicator next to field

### 4.2 Schedule Section Toggle

**Mode Switch**:

```
[Tabs Component]
+------------------+------------------+
|   Linh hoat  *   |    Co dinh       |
+------------------+------------------+

Active tab: bg-background, shadow
Inactive tab: bg-muted
```

**Flexible Mode UX**:

```
Day Selection:
+--+--+--+--+--+--+--+
|T2|T3|T4|T5|T6|T7|CN|
+--+--+--+--+--+--+--+
(Circular buttons, multi-select)

Per-Day Time Periods:
+--------------------------------+
| Thu 2                          |
| +----------------------------+ |
| | 06:00 - 07:30  = 1h30p [X] | |
| | 18:00 - 19:00  = 1h    [X] | |
| +----------------------------+ |
| [+ Them khung gio]             |
+--------------------------------+

Interaction:
1. Click day -> Day expands with time period inputs
2. Click "+ Them khung gio" -> Add new time period row
3. Time auto-calculates duration on blur
4. Click X -> Remove time period (confirm if last one)
```

**Fixed Mode UX**:

```
Day Selection (same as flexible):
+--+--+--+--+--+--+--+
|T2|T3|T4|T5|T6|T7|CN|
+--+--+--+--+--+--+--+

Single Time Period (applies to all selected days):
+--------------------------------+
| Gio tap co dinh                |
| [06:00] - [07:30] = 1h30p      |
+--------------------------------+

Simpler UX - one time for all days
```

### 4.3 Sports Selection

**Predefined Sports Grid**:

```
+-------+ +-------+ +-------+ +-------+
| Chay  | | Boi   | | Yoga  | | Gym   |
| bo    | | loi   | |       | |       |
+-------+ +-------+ +-------+ +-------+
+-------+ +-------+ +-------+ +-------+
| Dap   | | Bong  | | Tennis| | Cau   |
| xe    | | da    | |       | | long  |
+-------+ +-------+ +-------+ +-------+

States:
- Unselected: border-border, bg-transparent
- Selected: border-primary, bg-health-50, text-primary
- Hover: bg-gray-50
```

**Custom Sport Input**:

```
+------------------------------------+
| [Nhap mon the thao khac...    ] [+]|
+------------------------------------+

| Added custom sports:               |
| [Pickleball X] [Vo thuat X] [...]  |
+------------------------------------+

Interaction:
1. Type sport name
2. Press Enter or click + to add
3. Tag appears below
4. Click X on tag to remove
5. Validation: no duplicates, min 2 chars
```

### 4.4 Notes Section (Optional)

**Collapsed by Default** (Progressive Disclosure):

```
+------------------------------------+
| Ghi chu & Canh bao (Tuy chon)  [v] |
+------------------------------------+

Click to expand:
+------------------------------------+
| Ghi chu & Canh bao (Tuy chon)  [^] |
+------------------------------------+
| +---------------+ +---------------+ |
| | Ghi chu rieng | | Canh bao suc  | |
| | [Textarea]    | | khoe          | |
| |               | | [Textarea]    | |
| |               | |               | |
| | Placeholder:  | | Placeholder:  | |
| | "Tap nhe vao  | | "Dau khop     | |
| | buoi sang..." | | goi, huyet    | |
| |               | | ap cao..."    | |
| +---------------+ +---------------+ |
+------------------------------------+
```

---

## 5. Visual Hierarchy

### 5.1 Page Flow

```
1. HERO (Attention grabber)
   - Large title: text-5xl font-semibold
   - Subtitle: text-sm text-gray-600
   - Optional: Motivational illustration/icon

2. BASIC INFO (Primary - Most Important)
   - Card with clear section header
   - Form fields with proper spacing
   - Visual indicators for pre-filled fields

3. SCHEDULE (Secondary - Complex)
   - Tab toggle prominently placed
   - Clear visual separation between modes
   - Sufficient whitespace for time inputs

4. SPORTS (Tertiary - Engaging)
   - Visual badge grid (more playful)
   - Custom input clearly separated

5. NOTES (Optional - De-emphasized)
   - Collapsible by default
   - Subtle styling when expanded

6. SUBMIT (Final CTA)
   - Right-aligned gradient button
   - Clear action text
```

### 5.2 Typography Hierarchy

| Element             | Style                                  |
| ------------------- | -------------------------------------- |
| Page Title          | `text-5xl font-semibold text-gray-900` |
| Page Subtitle       | `text-sm text-gray-600 max-w-3xl`      |
| Section Title       | `text-xl font-medium text-[#1e1e1e]`   |
| Section Description | `text-sm text-gray-500`                |
| Form Label          | `text-xs font-medium text-[#6A7282]`   |
| Input Text          | `text-sm text-[#1e1e1e]`               |
| Placeholder         | `text-sm text-[#717182]`               |
| Helper Text         | `text-xs text-gray-500`                |
| Error Text          | `text-xs text-destructive`             |
| Badge Text          | `text-xs font-semibold`                |

### 5.3 Color Usage

| Element            | Color                                          |
| ------------------ | ---------------------------------------------- |
| Primary Actions    | `bg-gradient-to-r from-[#00bba7] to-[#00bc7d]` |
| Selected State     | `border-primary bg-health-50`                  |
| Disabled Fields    | `bg-gray-100 text-gray-500 opacity-60`         |
| Section Background | `bg-[#f5f4fa]`                                 |
| Card Background    | `bg-white`                                     |
| Validation Error   | `text-destructive border-destructive`          |
| Validation Success | `text-green-600 border-green-500`              |
| Time Duration      | `text-primary font-medium`                     |

---

## 6. Mobile Responsiveness

### 6.1 Breakpoint Strategy

| Breakpoint                | Layout Changes                     |
| ------------------------- | ---------------------------------- |
| `< 640px` (mobile)        | Single column, stacked elements    |
| `640px - 1024px` (tablet) | 2-column forms, compact spacing    |
| `> 1024px` (desktop)      | Full layout with side descriptions |

### 6.2 Mobile-Specific Adaptations

**Hero Section**:

```
Desktop: text-5xl, centered, max-w-3xl
Mobile: text-3xl, left-aligned, full-width padding
```

**Basic Info Form**:

```
Desktop: 2-column grid with side description
Mobile: Single column, description above form
```

**Schedule Section**:

```
Desktop: Day buttons in single row
Mobile: Day buttons wrap to 2 rows, larger touch targets (min 44px)

Time inputs:
Desktop: Inline [Start] - [End] = Duration
Mobile: Stacked
  [Start Time]
  [End Time]
  Duration: 1h30p
```

**Sports Grid**:

```
Desktop: 4-column grid
Tablet: 3-column grid
Mobile: 2-column grid, larger badges
```

**Notes Section**:

```
Desktop: 2 textareas side by side
Mobile: Stacked textareas
```

### 6.3 Touch Targets

- All interactive elements: min 44x44px
- Day picker buttons: 48x48px on mobile
- Time input fields: full-width on mobile
- Badge selection: larger padding for touch

---

## 7. Accessibility

### 7.1 Keyboard Navigation

```
Tab order:
1. Hero section (skip if no interactive elements)
2. Basic Info fields (height -> weight -> target -> goal)
3. Schedule mode tabs
4. Schedule inputs (days -> time periods)
5. Sports checkboxes -> custom input
6. Notes textareas (if expanded)
7. Submit button
```

### 7.2 ARIA Labels

```tsx
// Day picker
<button
  aria-label={`${dayName}, ${isSelected ? 'da chon' : 'chua chon'}`}
  aria-pressed={isSelected}
>

// Time period
<div role="group" aria-label={`Khung gio ${index + 1}`}>

// Sport selection
<div role="group" aria-label="Chon mon the thao yeu thich">

// Schedule mode
<div role="tablist" aria-label="Che do lich tap">
```

### 7.3 Screen Reader Announcements

```tsx
// Validation feedback
<span role="alert" aria-live="polite">
  {errorMessage}
</span>

// Duration calculation
<span aria-live="polite">
  Thoi gian tap: {duration}
</span>

// Tag added/removed
<span className="sr-only" aria-live="polite">
  {action === 'add' ? `Da them ${sportName}` : `Da xoa ${sportName}`}
</span>
```

### 7.4 Focus Management

```tsx
// After adding time period, focus new start input
useEffect(() => {
  if (newPeriodAdded) {
    newStartInputRef.current?.focus();
  }
}, [periods.length]);

// After removing sport tag, focus input
const handleRemoveTag = (tag: string) => {
  removeTag(tag);
  inputRef.current?.focus();
};
```

---

## 8. Implementation Recommendations

### 8.1 File Structure

```
src/
├── app/
│   └── practice/
│       ├── page.tsx              # Main page component
│       ├── validation.ts         # Zod schemas
│       └── formHelper.ts         # Options, constants
│
├── components/
│   └── practice/
│       ├── HeroSection.tsx
│       ├── BasicInfoSection.tsx
│       ├── ScheduleSection/
│       │   ├── index.tsx
│       │   ├── FlexibleMode.tsx
│       │   ├── FixedMode.tsx
│       │   ├── DayPicker.tsx
│       │   └── TimePeriodInput.tsx
│       ├── SportsSection/
│       │   ├── index.tsx
│       │   ├── SportCheckboxGroup.tsx
│       │   └── SportTagInput.tsx
│       └── NotesSection.tsx
│
└── types/
    └── practice.ts               # TypeScript interfaces
```

### 8.2 State Management

```tsx
// Use React Hook Form for form state
const form = useForm<PracticeFormData>({
  resolver: zodResolver(practiceFormSchema),
  defaultValues: {
    scheduleMode: 'flexible',
    favoriteSports: [],
    customSports: [],
  },
});

// Watch for dynamic validation
const goal = form.watch('goal');
const currentWeight = form.watch('weight');

// Conditional validation in schema
const targetWeightValidation = z
  .string()
  .refine(val => validateTargetWeight(val, currentWeight, goal));
```

### 8.3 API Integration Points

```typescript
// Fetch pre-filled data
const { data: userProfile } = useQuery({
  queryKey: ['userProfile'],
  queryFn: () => userService.getProfile(),
});

// Pre-fill form when data loads
useEffect(() => {
  if (userProfile) {
    form.setValue('height', userProfile.height_cm?.toString() || '');
    form.setValue('weight', userProfile.weight_kg?.toString() || '');
    form.setValue('goal', mapGoalToEnum(userProfile.goal));
  }
}, [userProfile]);

// Submit practice preferences
const submitMutation = useMutation({
  mutationFn: (data: PracticeFormData) => practiceService.savePreferences(data),
  onSuccess: () => {
    toast.success('Luu thiet lap thanh cong!');
    router.push('/dashboard');
  },
});
```

### 8.4 Recommended Implementation Order

1. **Phase 1**: Basic structure
   - Page layout with Hero
   - Basic Info section (simplest)
   - Form setup with Zod

2. **Phase 2**: Schedule section
   - Tab toggle component
   - Day picker component
   - Time period input
   - Flexible/Fixed mode switching

3. **Phase 3**: Sports section
   - Checkbox group for predefined
   - Tag input for custom

4. **Phase 4**: Notes section
   - Collapsible container
   - Two textareas

5. **Phase 5**: Integration
   - API data fetching
   - Pre-fill logic
   - Submit handling
   - Loading states

### 8.5 Performance Considerations

```tsx
// Memoize expensive computations
const duration = useMemo(
  () => calculateDuration(startTime, endTime),
  [startTime, endTime]
);

// Debounce validation for target weight
const debouncedValidation = useDebouncedCallback(
  value => validateTargetWeight(value, currentWeight, goal),
  300
);

// Lazy load notes section
const NotesSection = lazy(() => import('./NotesSection'));
```

---

## Summary

**Recommended Approach**: Concept B (Card-Based Sections)

**Key Design Decisions**:

1. Match existing VHealth page patterns (predict/profile)
2. Tabs for schedule mode toggle (clear state indication)
3. Badge-style sports selection (engaging, visual)
4. Collapsible notes section (optional feels optional)
5. Right-aligned gradient submit button

**Critical UX Points**:

1. Clear visual distinction for disabled/pre-filled fields
2. Real-time validation feedback for target weight
3. Auto-calculated time duration
4. Easy tag management for custom sports
5. Progressive disclosure for optional notes

---

## Unresolved Questions

1. Should the schedule section show a weekly calendar view instead of day buttons?
2. Are there maximum limits for time periods per day or custom sports?
3. Should pre-filled fields show source attribution ("Tu ho so")?
4. Is there a need for schedule templates (e.g., "Lich tap mau")?
5. Should sports have icons, and if so, which icon library?
