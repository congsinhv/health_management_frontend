# Phase 2: UI Components

## Context

- **Plan**: [plan.md](./plan.md)
- **Brainstorm**: [brainstorm-251208-scheduled-plans-profile.md](./reports/brainstorm-251208-scheduled-plans-profile.md)
- **Depends on**: Phase 1 (Types & Service)

---

## Overview

| Field       | Value                               |
| ----------- | ----------------------------------- |
| Date        | 2025-12-08                          |
| Description | Build ScheduleSection UI components |
| Priority    | High                                |
| Status      | completed (25-12-08 15:45)          |

---

## Requirements

1. Create `src/components/profile/ScheduleSection/` folder
2. Components: index.tsx, ScheduleCard.tsx, DayExerciseCard.tsx, EmptyState.tsx
3. Follow VHealth design guidelines
4. Match existing profile section patterns (DeviceList)

---

## Related Code Files

- `src/components/profile/DeviceList.tsx` - Pattern reference
- `src/components/ui/badge.tsx` - Badge component
- `src/components/ui/switch.tsx` - Toggle switch
- `src/components/ui/skeleton.tsx` - Loading skeleton
- `src/components/ui/button.tsx` - Button component

---

## Implementation Steps

### Step 1: Create ScheduleSection Container

Create `src/components/profile/ScheduleSection/index.tsx`:

- Fetch schedules using useSchedules hook
- Handle loading, error, empty states
- Map schedules to ScheduleCard components
- Wrapper container with section title

### Step 2: Create ScheduleCard Component

Create `src/components/profile/ScheduleSection/ScheduleCard.tsx`:

- Display single schedule with active/paused visual state
- Show badges: status, goal
- Switch component for status toggle
- Grid of DayExerciseCard for weekly_plan
- Edit button linking to /practice?edit={id}

Key styling (from brainstorm):

```tsx
// Active schedule - highlighted border
<div className={cn(
  "border rounded-lg p-4 space-y-3",
  isActive
    ? "border-primary bg-primary/5"
    : "border-gray-200 bg-gray-50 opacity-70"
)}>
```

### Step 3: Create DayExerciseCard Component

Create `src/components/profile/ScheduleSection/DayExerciseCard.tsx`:

- Compact card showing single day exercise
- Display: day name, duration, exercise name, calories
- Status indicator (pending/completed/skipped/in_progress)
- Icon + color based on status

Status visual mapping:
| Status | Color | Icon |
|--------|-------|------|
| pending | amber | clock |
| completed | emerald | checkmark |
| skipped | gray | skip |
| in_progress | blue | play |

### Step 4: Create EmptyState Component

Create `src/components/profile/ScheduleSection/EmptyState.tsx`:

- Centered text: "Chua co ke hoach tap luyen"
- CTA button: "Tao ke hoach" linking to /practice
- Match DeviceList EmptyState pattern

### Step 5: Create Loading Skeleton

Create `src/components/profile/ScheduleSection/ScheduleSkeleton.tsx`:

- Skeleton matching ScheduleCard layout
- Show 1-2 skeleton cards during loading

---

## Component Hierarchy

```
ScheduleSection (index.tsx)
  ├── Loading: ScheduleSkeleton
  ├── Empty: EmptyState
  ├── Error: Error message div
  └── Content:
      └── ScheduleCard (for each schedule)
          ├── Header (status badge, goal badge, switch)
          ├── DayExerciseCard grid
          └── Edit button
```

---

## Todo List

- [ ] Create folder `src/components/profile/ScheduleSection/`
- [ ] Create `index.tsx` - main container
- [ ] Create `ScheduleCard.tsx` - individual schedule card
- [ ] Create `DayExerciseCard.tsx` - day exercise display
- [ ] Create `EmptyState.tsx` - empty state UI
- [ ] Create `ScheduleSkeleton.tsx` - loading skeleton
- [ ] Test all visual states (active, paused, loading, empty, error)

---

## Success Criteria

1. ScheduleSection renders schedule list
2. Active/paused schedules visually distinct
3. Toggle switch updates status via mutation
4. Day cards display exercise info correctly
5. Status colors match design spec
6. Responsive grid: 2 cols mobile, 4 cols desktop
7. Empty state shows CTA
8. Loading skeleton during fetch
9. Error state displays message

---

## Risk Assessment

| Risk                   | Likelihood | Impact | Mitigation                          |
| ---------------------- | ---------- | ------ | ----------------------------------- |
| Toggle race condition  | Medium     | Medium | Optimistic update + rollback        |
| Large weekly_plan data | Low        | Low    | Compact cards, truncate description |
| Missing lucide icons   | Low        | Low    | Use available alternatives          |
