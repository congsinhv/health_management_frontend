# Brainstorm: Scheduled Plans Display in Profile Page

> Date: 2025-12-08
> Status: Complete
> Topic: Implement scheduled workout plans section in profile page

---

## 1. Problem Statement

**Request**: Add a new section to the Profile page to display user's scheduled workout plans retrieved from `/api/v1/schedules/` endpoint.

**API Response Structure** (`GET /api/v1/schedules/` returns `Schedule[]`):

```json
{
  "id": 3,
  "user_id": 6,
  "goal": "gain",
  "schedule_mode": "fixed",
  "selected_days": ["tuesday"],
  "timezone": "Asia/Ho_Chi_Minh",
  "weekly_plan": {
    "tuesday": {
      "exercise": "Gym - Tập luyện Toàn Thân",
      "duration_minutes": 60,
      "estimated_calories": 400,
      "description": "Thực hiện các bài tập như Squat, Deadlift, Bench Press, Pull-ups, và Plank. Mỗi bài tập nên được thực hiện 3 hiệp, mỗi hiệp từ 8-12 lần.",
      "status": "pending",
      "error_message": null
    }
  },
  "status": "active",
  "created_at": "2025-12-08T07:38:09.785930Z",
  "updated_at": "2025-12-08T07:38:12.774975Z"
}
```

**Current State**:

- Profile page exists at `src/app/profile/page.tsx`
- Has sections: Avatar, Personal Info, Registered Devices
- Schedule types partially defined in `src/types/practice.ts`
- Schedule service exists in `src/services/practice.ts` (POST only)

---

## 2. Requirements Analysis

### Functional Requirements

1. Display user's active scheduled plans in profile page
2. Show weekly plan with exercise details per day
3. Allow user to navigate to edit existing schedule
4. Handle empty state (no schedules)
5. Handle loading and error states

### Data Requirements

- Fetch from `GET /api/v1/schedules/`
- Map `weekly_plan` object to UI display
- Display: goal, schedule_mode, selected_days, weekly exercises

### UX Requirements

- Consistent with existing profile sections (rounded card, white bg)
- Clear visual hierarchy for schedule data
- Day-based exercise cards or list
- Action button to edit/create schedule

---

## 3. Evaluated Approaches

### Approach A: Inline Schedule Cards (Recommended)

**Description**: Add a new section below "Registered Devices" with collapsible/expandable day cards showing workout details.

**Pros**:

- Simple, fits existing profile layout pattern
- Low complexity, fast to implement
- Reuses existing UI components (Card, Badge)
- Mobile-friendly

**Cons**:

- May get lengthy with many days

**Suggested Skill/Agent**: `frontend-development` skill for React/TypeScript patterns

---

### Approach B: Tabbed Weekly View

**Description**: Full-width section with horizontal day tabs, each showing exercise details.

**Pros**:

- Cleaner for dense data
- Better scan-ability for weekly overview

**Cons**:

- More complex implementation
- May feel disconnected from profile "form" pattern

**Suggested Skill/Agent**: `ui-ux-designer` agent for tab layout design

---

### Approach C: Summary Card + Modal Detail

**Description**: Compact summary card in profile with modal for full schedule view.

**Pros**:

- Keeps profile page clean
- Modal can have rich editing UI

**Cons**:

- Extra interaction step
- Modal patterns not used elsewhere in profile

**Not recommended** - over-engineering for read-only display.

---

## 4. Final Recommendation

### Selected: Approach A - Inline Schedule Cards

**Rationale**:

1. Follows KISS principle - simple, predictable
2. Matches existing profile section patterns (DeviceList, Avatar)
3. Uses existing VHealth design guidelines
4. Minimal new components needed

### Implementation Structure

```
src/
├── types/
│   └── schedule.ts           # NEW: Schedule API response types
├── services/
│   └── schedule.ts           # NEW: Schedule GET service
├── components/
│   └── profile/
│       └── ScheduleSection/  # NEW: Schedule display component
│           ├── index.tsx
│           ├── DayCard.tsx
│           └── EmptyState.tsx
└── app/
    └── profile/
        └── page.tsx          # UPDATE: Add ScheduleSection
```

---

## 5. Implementation Tasks & Suggested Skills/Agents

| Task                | Description                                | Skill/Agent                  |
| ------------------- | ------------------------------------------ | ---------------------------- |
| 1. Define types     | Create `Schedule` type matching API        | `backend-development` skill  |
| 2. Create service   | `getSchedules()`, `updateScheduleStatus()` | `frontend-development` skill |
| 3. Design component | ScheduleSection with active/inactive cards | `ui-ux-designer` agent       |
| 4. Implement UI     | Build React components with toggle         | `fullstack-developer` agent  |
| 5. Status toggle    | Mutation to activate/deactivate schedule   | `frontend-development` skill |
| 6. Handle states    | Loading, error, empty, optimistic updates  | `frontend-development` skill |
| 7. Test             | Unit tests for component                   | `tester` agent               |
| 8. Code review      | Quality check                              | `code-reviewer` agent        |

---

## 6. Type Definitions (Draft)

```typescript
// src/types/schedule.ts

export type ExerciseStatus =
  | 'pending'
  | 'completed'
  | 'skipped'
  | 'in_progress';

export interface WeeklyExercise {
  exercise: string;
  duration_minutes: number;
  estimated_calories: number;
  description: string;
  status: ExerciseStatus;
  error_message: string | null;
}

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

/**
 * Schedule status:
 * - active: Notifications sent according to plan
 * - paused: Temporarily paused, no notifications, can reactivate
 * - superseded: Replaced by newer schedule (soft-deleted, don't display)
 */
export type ScheduleStatus = 'active' | 'paused' | 'superseded';

export interface Schedule {
  id: number;
  user_id: number;
  goal: 'gain' | 'lose' | 'maintain';
  schedule_mode: 'fixed' | 'flexible';
  selected_days: DayOfWeek[];
  timezone: string;
  weekly_plan: Partial<Record<DayOfWeek, WeeklyExercise>>;
  status: ScheduleStatus;
  created_at: string;
  updated_at: string;
}

// API: GET /api/v1/schedules/ returns Schedule[]
// API: PATCH /api/v1/schedules/{id}/ for status toggle

export interface UpdateScheduleStatusRequest {
  status: 'active' | 'inactive';
}
```

---

## 7. UI Design Considerations

Following VHealth Design Guidelines:

### Card Style

```tsx
// Match existing profile section pattern
<div className='rounded-lg bg-white p-6 dark:bg-gray-800'>
  <h2 className='mb-6 text-base font-medium text-[#1e1e1e] dark:text-white'>
    Kế hoạch tập luyện
  </h2>
  {/* Content */}
</div>
```

### Schedule Card Style (Active vs Inactive)

```tsx
// Active schedule - highlighted
<div
  className={cn(
    'space-y-3 rounded-lg border p-4',
    isActive
      ? 'border-primary bg-primary/5'
      : 'border-gray-200 bg-gray-50 opacity-70'
  )}
>
  <div className='flex items-center justify-between'>
    <div className='flex items-center gap-2'>
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'Đang hoạt động' : 'Tạm dừng'}
      </Badge>
      <Badge variant='outline'>{goalLabel}</Badge>
    </div>
    <Switch checked={isActive} onCheckedChange={handleToggle} />
  </div>

  {/* Weekly plan grid */}
  <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
    {selectedDays.map(day => (
      <DayCard key={day} day={day} exercise={weekly_plan[day]} />
    ))}
  </div>

  <div className='flex justify-end'>
    <Button
      variant='ghost'
      size='sm'
      onClick={() => router.push(`/practice?edit=${id}`)}
    >
      Chỉnh sửa
    </Button>
  </div>
</div>
```

### Day Card (inside schedule)

```tsx
<div className='space-y-1 rounded-lg border border-[#e5e7eb] p-3'>
  <div className='flex items-center justify-between'>
    <span className='text-xs font-medium text-gray-700'>{dayName}</span>
    <span className='text-xs text-gray-500'>{duration_minutes}p</span>
  </div>
  <p className='line-clamp-1 text-sm font-medium'>{exercise}</p>
  <div className='text-primary flex items-center gap-1 text-xs'>
    <Flame className='h-3 w-3' />
    {estimated_calories} calo
  </div>
</div>
```

### Empty State

```tsx
<div className='py-8 text-center'>
  <p className='mb-4 text-gray-500'>Chưa có kế hoạch tập luyện</p>
  <Button variant='outline' onClick={() => router.push('/practice')}>
    Tạo kế hoạch
  </Button>
</div>
```

---

## 8. Success Metrics

1. Schedule array loads successfully from GET /schedules/
2. All schedules displayed with active/inactive visual distinction
3. Toggle switch activates schedule (deactivates others automatically)
4. Optimistic UI update on toggle
5. Displays weekly_plan days with exercise info
6. Empty state shows CTA when no schedules
7. Edit button navigates to /practice?edit={id}
8. Loading skeleton during fetch
9. Error toast on API failure
10. Responsive grid on mobile (2 cols) and desktop (4 cols)

---

## 9. Risks & Mitigations

| Risk                               | Mitigation                                     |
| ---------------------------------- | ---------------------------------------------- |
| Toggle race condition              | Optimistic update + rollback on error          |
| Backend fails to deactivate others | Frontend should NOT handle this; trust backend |
| Large weekly_plan object           | Compact day cards; truncate description        |
| No schedules                       | Prominent CTA to create schedule               |
| PATCH endpoint not ready           | Verify with backend team first                 |
| Timezone complexity                | Display local time based on `timezone` field   |

---

## 10. Next Steps

1. Confirm PATCH /schedules/{id}/ endpoint exists for status toggle
2. Create types in `src/types/schedule.ts`
3. Add services: `getSchedules()`, `updateScheduleStatus()`
4. Use `ui-ux-designer` agent for component design mockup
5. Use `fullstack-developer` agent for implementation
6. Test with `tester` agent
7. Review with `code-reviewer` agent

---

## 11. Clarified Requirements

| Question                   | Answer                              |
| -------------------------- | ----------------------------------- |
| API response format        | Array of schedules                  |
| Show superseded schedules? | No, filter out `status: superseded` |
| Multiple active schedules? | No, only 1 active per user          |

### Schedule Statuses

| Status       | Description                        | Display                     |
| ------------ | ---------------------------------- | --------------------------- |
| `active`     | Notifications sent                 | Highlighted, prominent      |
| `paused`     | Temporarily paused, can reactivate | Muted, with "Resume" action |
| `superseded` | Soft-deleted, replaced by newer    | **Don't display**           |

### Exercise Day Statuses (per day in weekly_plan)

| Status        | Description     | Visual                |
| ------------- | --------------- | --------------------- |
| `pending`     | Not yet done    | Amber bg, clock icon  |
| `completed`   | Done            | Emerald bg, checkmark |
| `skipped`     | Skipped         | Gray bg, skip icon    |
| `in_progress` | Currently doing | Blue bg, play icon    |

Each day in `weekly_plan` has its own `status` field that tracks exercise completion independently.

### Business Rules

- User can have multiple schedules but only **1 active at a time**
- Display only `active` and `paused` schedules (filter out `superseded`)
- Toggle between `active` ↔ `paused` status
- Each day exercise has its own status (pending/completed/skipped/in_progress)

### Updated UI Requirements

1. **Active schedule**: Highlighted card with primary border + notification badge
2. **Paused schedule**: Muted/grey with "Tạm dừng" badge
3. **Toggle switch**: active ↔ paused
4. **Day cards**: Show exercise status (pending/completed/skipped)
5. **Edit button**: Navigate to /practice?edit={id}
