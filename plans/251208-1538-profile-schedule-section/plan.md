# Plan: Profile Schedule Section

> Created: 2025-12-08
> Status: Planning
> Feature: Display scheduled workout plans in Profile page

---

## Overview

Add a new section to the Profile page displaying user's scheduled workout plans retrieved from `GET /api/v1/schedules/`. Users can view active/paused schedules, toggle status, and navigate to edit.

**Brainstorm Report**: `./reports/brainstorm-251208-scheduled-plans-profile.md`

---

## Phase List

| Phase | Name                  | Status                     | Description                                  |
| ----- | --------------------- | -------------------------- | -------------------------------------------- |
| 1     | Types & Service Layer | completed (25-12-08 15:38) | Create schedule types and API service        |
| 2     | UI Components         | pending                    | Build ScheduleSection components             |
| 3     | Integration & Testing | pending                    | Integrate into profile page, test all states |

---

## Key Decisions

1. **Approach**: Inline Schedule Cards (from brainstorm Approach A)
2. **Location**: `src/components/profile/ScheduleSection/`
3. **Pattern**: Follow existing DeviceList component structure
4. **Filter**: Only show `active` and `paused` schedules (exclude `superseded`)

---

## Success Criteria

1. Schedule array loads from GET /schedules/
2. Active/inactive schedules display with visual distinction
3. Toggle switch changes status (active ↔ paused)
4. Weekly plan days display with exercise info
5. Empty state shows CTA when no schedules
6. Edit button navigates to /practice?edit={id}
7. Loading skeleton during fetch
8. Error toast on API failure
9. Responsive grid (2 cols mobile, 4 cols desktop)

---

## Related Files

- `src/app/profile/page.tsx` - Integration point
- `src/components/profile/DeviceList.tsx` - Reference pattern
- `src/types/device.ts` - Type pattern reference
- `src/services/practice.ts` - Service pattern reference
