# Phase 3: Integration & Testing

## Context

- **Plan**: [plan.md](./plan.md)
- **Brainstorm**: [brainstorm-251208-scheduled-plans-profile.md](./reports/brainstorm-251208-scheduled-plans-profile.md)
- **Depends on**: Phase 1 (Types), Phase 2 (Components)

---

## Overview

| Field       | Value                                                        |
| ----------- | ------------------------------------------------------------ |
| Date        | 2025-12-08                                                   |
| Description | Integrate ScheduleSection into profile page, test all states |
| Priority    | High                                                         |
| Status      | pending                                                      |

---

## Requirements

1. Add ScheduleSection to profile page
2. Update profile/index.ts barrel export
3. Test all states: loading, error, empty, data
4. Test toggle functionality
5. Verify responsive design

---

## Related Code Files

- `src/app/profile/page.tsx` - Integration point
- `src/components/profile/index.ts` - Barrel export
- `src/components/profile/ScheduleSection/` - New components

---

## Implementation Steps

### Step 1: Update Profile Barrel Export

Update `src/components/profile/index.ts`:

```typescript
export { DeviceList } from './DeviceList';
export { ScheduleSection } from './ScheduleSection';
```

### Step 2: Integrate into Profile Page

Update `src/app/profile/page.tsx`:

Add import:

```typescript
import { DeviceList, ScheduleSection } from '@/components/profile';
```

Add section after Personal Information form (before Registered Devices):

```tsx
{
  /* Schedule Plans Section */
}
<div className='rounded-lg bg-white p-6 dark:bg-gray-800'>
  <h2 className='mb-6 text-base font-medium text-[#1e1e1e] dark:text-white'>
    Ke hoach tap luyen
  </h2>
  <ScheduleSection />
</div>;
```

### Step 3: Manual Testing Checklist

Test scenarios:

1. **Loading state**
   - [ ] Skeleton displays during API call
   - [ ] No layout shift when data loads

2. **Empty state**
   - [ ] Shows empty message when no schedules
   - [ ] CTA button navigates to /practice

3. **Data display**
   - [ ] Active schedules highlighted with primary border
   - [ ] Paused schedules muted/grayed
   - [ ] Weekly exercises display in grid
   - [ ] Status badges show correct labels

4. **Toggle functionality**
   - [ ] Switch toggles between active/paused
   - [ ] Toast shows success message
   - [ ] UI updates optimistically
   - [ ] Rollback on error

5. **Edit navigation**
   - [ ] Edit button visible
   - [ ] Navigates to /practice?edit={id}

6. **Error handling**
   - [ ] Error message displays on API failure
   - [ ] Toggle error shows toast

7. **Responsive design**
   - [ ] Mobile: 2 column grid for day cards
   - [ ] Desktop: 4 column grid for day cards
   - [ ] Cards stack vertically on small screens

### Step 4: TypeScript Verification

```bash
bun run type-check
```

Ensure no type errors from new files.

### Step 5: Lint Check

```bash
bun run lint
bun run format:check
```

Fix any linting issues.

---

## Todo List

- [ ] Update `src/components/profile/index.ts` barrel export
- [ ] Add ScheduleSection to `src/app/profile/page.tsx`
- [ ] Run type-check, fix errors
- [ ] Run lint, fix issues
- [ ] Manual test: loading state
- [ ] Manual test: empty state
- [ ] Manual test: data display
- [ ] Manual test: toggle functionality
- [ ] Manual test: edit navigation
- [ ] Manual test: error handling
- [ ] Manual test: responsive design

---

## Success Criteria

1. ScheduleSection renders in profile page
2. All test scenarios pass
3. No TypeScript errors
4. No lint errors
5. Responsive on mobile and desktop
6. Toggle updates work with backend

---

## Risk Assessment

| Risk                                    | Likelihood | Impact | Mitigation                             |
| --------------------------------------- | ---------- | ------ | -------------------------------------- |
| Profile page layout breaks              | Low        | High   | Test thoroughly before merge           |
| Backend PATCH returns different format  | Medium     | Medium | Adapt mutation handler                 |
| Toggle causes multiple active schedules | Low        | High   | Backend handles deactivation of others |

---

## Post-Integration Tasks

After successful integration:

1. Update `docs/codebase-summary.md` with new components
2. Add ScheduleSection to component documentation
3. Consider adding unit tests for ScheduleCard
