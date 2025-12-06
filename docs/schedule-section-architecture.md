# ScheduleSection Component Architecture

**Component:** Practice Schedule Configuration
**Phase:** 3 (Schedule Configuration)
**Location:** `src/components/practice/ScheduleSection/`
**Last Updated:** December 2025

---

## Overview

The ScheduleSection component provides a comprehensive interface for users to configure their weekly practice schedule. It supports two scheduling modes:

- **Flexible Mode**: Different time periods for each selected day
- **Fixed Mode**: Single time period applied to all selected days

---

## Architecture

### Component Structure

```
ScheduleSection/
├── index.tsx              # Main container component
├── DayPicker.tsx          # Day selection with circular buttons
├── FlexibleMode.tsx       # Per-day time period configuration
├── FixedMode.tsx          # Single time period for all days
├── TimePeriodInput.tsx    # Reusable time input with validation
└── ScheduleSection.test.tsx # Unit tests
```

### Design Patterns

1. **Compound Component Pattern**: Main component orchestrates sub-components
2. **Controlled Components**: All state managed by React Hook Form
3. **Conditional Rendering**: UI changes based on selected mode
4. **Composition over Inheritance**: Reusable TimePeriodInput component

---

## Component Details

### ScheduleSection (Main Container)

**Purpose**: Orchestrates the entire schedule configuration interface

**Props:**

```typescript
interface ScheduleSectionProps {
  form: UseFormReturn<PracticeFormData>;
}
```

**Responsibilities:**

- Manage mode toggle (flexible/fixed)
- Watch form state changes
- Render appropriate mode component
- Integrate with React Hook Form validation

**Key Features:**

- Mode persistence via form.watch()
- Responsive layout with CSS Grid
- Form validation integration
- Accessibility support with ARIA labels

### DayPicker

**Purpose**: Visual day selection with circular button interface

**Props:**

```typescript
interface DayPickerProps {
  selectedDays: string[];
  onChange: (days: string[]) => void;
  disabled?: boolean;
}
```

**Design Features:**

- Circular buttons for each day (T2, T3, T4, T5, T6, T7, CN)
- Gradient background for selected state
- Hover effects with border changes
- Keyboard navigation support
- Screen reader compatible with ARIA labels

**Implementation:**

- Maps dayOptions to button elements
- Toggle logic for selection/deselection
- Visual feedback with CSS transitions
- Disabled state support

### FlexibleMode

**Purpose**: Configure different time periods for each selected day

**Props:**

```typescript
interface FlexibleModeProps {
  selectedDays: string[];
  periods: Record<string, TimePeriod[]>;
  onPeriodsChange: (periods: Record<string, TimePeriod[]>) => void;
}
```

**Features:**

- Dynamic period management per day
- Add/remove time periods
- Real-time duration calculation
- Empty state handling
- Sorted day display (Monday to Sunday)

**Logic:**

- Groups periods by day in state object
- Allows multiple periods per day
- Validates time ranges
- Provides add/remove functionality

### FixedMode

**Purpose**: Single time period for all selected days

**Props:**

```typescript
interface FixedModeProps {
  selectedDays: string[];
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}
```

**Features:**

- Single TimePeriodInput for all days
- Helper text explaining multi-day application
- Simplified UI without add/remove buttons
- Same validation as flexible mode

### TimePeriodInput

**Purpose**: Reusable time input with validation and duration calculation

**Props:**

```typescript
interface TimePeriodInputProps {
  startTime: string;
  endTime: string;
  onChange: (start: string, end: string) => void;
  onRemove?: () => void;
  showRemove?: boolean;
  index?: number;
}
```

**Validation Features:**

- Ensures endTime > startTime
- Auto-clears invalid end times
- Real-time duration calculation
- Visual validation states (red border for errors)
- Duration display with smart formatting

**Accessibility:**

- ARIA labels for screen readers
- Keyboard navigation support
- Clear visual feedback
- Semantic HTML structure

---

## Data Model

### TypeScript Types

```typescript
// Time period with start and end times
interface TimePeriod {
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

// Complete schedule configuration
interface PracticeSchedule {
  mode: 'flexible' | 'fixed';
  selectedDays: string[];
  flexiblePeriods?: Record<string, TimePeriod[]>;
  fixedPeriod?: TimePeriod;
}
```

### Data Structure Examples

**Flexible Mode Data:**

```json
{
  "mode": "flexible",
  "selectedDays": ["monday", "wednesday", "friday"],
  "flexiblePeriods": {
    "monday": [
      { "startTime": "08:00", "endTime": "09:30" },
      { "startTime": "18:00", "endTime": "19:00" }
    ],
    "wednesday": [{ "startTime": "07:00", "endTime": "08:00" }],
    "friday": [{ "startTime": "19:00", "endTime": "20:30" }]
  }
}
```

**Fixed Mode Data:**

```json
{
  "mode": "fixed",
  "selectedDays": ["monday", "wednesday", "friday"],
  "fixedPeriod": {
    "startTime": "18:00",
    "endTime": "19:30"
  }
}
```

---

## Validation Rules

### Client-Side Validation (Zod Schema)

```typescript
const scheduleSchema = z.object({
  mode: z.enum(['flexible', 'fixed']),
  selectedDays: z.array(z.string()).min(1, 'Chọn ít nhất một ngày'),
  flexiblePeriods: z.record(z.array(timePeriodSchema)).optional(),
  fixedPeriod: timePeriodSchema.optional(),
});

const timePeriodSchema = z
  .object({
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })
  .refine(data => data.endTime > data.startTime, {
    message: 'Giờ kết thúc phải sau giờ bắt đầu',
    path: ['endTime'],
  });
```

### Business Rules

1. **Day Selection**: At least one day must be selected
2. **Time Validation**: End time must be after start time
3. **Period Overlap**: No overlapping periods within the same day (future enhancement)
4. **Duration Minimum**: Minimum 30-minute periods (future enhancement)
5. **Mode Consistency**: Only one mode active at a time

---

## Integration with Practice Page

### Form Integration

```typescript
// PracticePage.tsx
const form = useForm<PracticeFormData>({
  resolver: zodResolver(practiceFormSchema),
  defaultValues: {
    schedule: {
      mode: 'flexible',
      selectedDays: [],
      flexiblePeriods: {},
      fixedPeriod: { startTime: '', endTime: '' }
    }
  }
});

// In render
<ScheduleSection form={form} />
```

### State Management

- **React Hook Form**: Manages all form state
- **Form.watch()**: Tracks real-time changes
- **Form.setValue()**: Updates specific fields
- **Form validation**: Integrated with Zod schemas

### Event Flow

1. User interacts with component
2. Component calls onChange callback
3. Callback updates form state via React Hook Form
4. Form validation runs automatically
5. Validation errors displayed via FormMessage
6. Parent component re-renders with updated state

---

## Accessibility Features

### ARIA Implementation

- **DayPicker**: `aria-pressed`, `aria-label` for each day
- **TimePeriodInput**: `aria-live="polite"` for duration updates
- **Mode Toggle**: `role="tablist"`, `aria-label` for tabs
- **Form Fields**: Proper labeling and descriptions

### Keyboard Navigation

- **Tab Order**: Logical flow through inputs
- **Day Selection**: Space/Enter to toggle days
- **Time Inputs**: Standard HTML5 time picker
- **Remove Buttons**: Accessible via keyboard

### Screen Reader Support

- Vietnamese labels with clear descriptions
- Dynamic content announcements
- Error message associations
- Contextual help text

---

## Performance Considerations

### Optimization Strategies

1. **React.memo**: Prevents unnecessary re-renders
2. **useMemo**: Caches computed values (selectedDays sort)
3. **useCallback**: Stabilizes function references
4. **Form.watch()**: Only watches necessary fields

### Bundle Size

- Minimal dependencies (only React Hook Form integration)
- Tree-shakeable exports
- No external date/time libraries
- Lightweight validation logic

---

## Testing Strategy

### Unit Tests (ScheduleSection.test.tsx)

```typescript
describe('ScheduleSection', () => {
  test('renders with default flexible mode');
  test('switches between flexible and fixed modes');
  test('selects and deselects days');
  test('adds and removes time periods in flexible mode');
  test('validates time inputs');
  test('calculates duration correctly');
  test('handles empty state (no days selected)');
  test('integrates with React Hook Form');
});
```

### Integration Tests

- Form submission with schedule data
- Validation error display
- Mode persistence
- Accessibility compliance

---

## Future Enhancements

### Phase 4+ Features

1. **Drag & Drop**: Reorder time periods
2. **Copy/Paste**: Copy schedule between days
3. **Templates**: Save and reuse common schedules
4. **Conflict Detection**: Prevent overlapping periods
5. **Duration Limits**: Minimum/maximum session times
6. **Recurring Patterns**: Weekly/monthly patterns
7. **Calendar Integration**: Sync with external calendars

### Technical Improvements

1. **Virtual Scrolling**: For large numbers of periods
2. **Time Zone Support**: Multi-timezone scheduling
3. **Offline Support**: PWA capabilities
4. **Performance**: Web Workers for heavy calculations
5. **Analytics**: Track most used time slots

---

## Usage Examples

### Basic Implementation

```typescript
import { ScheduleSection } from '@/components/practice';
import { useForm } from 'react-hook-form';

function PracticePage() {
  const form = useForm({
    defaultValues: {
      schedule: {
        mode: 'flexible',
        selectedDays: [],
        flexiblePeriods: {},
        fixedPeriod: { startTime: '', endTime: '' }
      }
    }
  });

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <ScheduleSection form={form} />
      <button type="submit">Save Schedule</button>
    </form>
  );
}
```

### With Validation

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { practiceFormSchema } from './validation';

const form = useForm({
  resolver: zodResolver(practiceFormSchema),
  mode: 'onChange', // Real-time validation
});
```

---

## Conclusion

The ScheduleSection component provides a robust, accessible, and user-friendly interface for configuring practice schedules. Its modular architecture allows for easy extension and maintenance, while the compound component pattern ensures clean separation of concerns. The integration with React Hook Form provides seamless form management and validation, making it a solid foundation for the VHealth practice plan feature.
