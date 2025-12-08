## Code Review Summary

### Scope

- **Files reviewed**:
  - `src/components/profile/ScheduleSection/*` (5 files)
  - `src/hooks/useSchedules.ts`
  - `src/services/schedule.ts`
  - `src/types/schedule.ts`
- **Review focus**: Feature implementation, UI/UX consistency, type safety, and best practices.
- **Updated plans**: `plans/251208-1538-profile-schedule-section/plan.md`

### Overall Assessment

The implementation is solid, following the project's architecture (Feature folder structure, React Query, shadcn/ui, Tailwind). The code is readable, modular, and handles edge cases like loading, error, and empty states well.

### Critical Issues

None found.

### High Priority Findings

None found.

### Medium Priority Improvements

1. **Type Safety in `DayExerciseCard`**:
   - `statusConfig` uses `any` for the `icon` property.
   - **Fix**: Import `LucideIcon` from `lucide-react` and use it as the type.

2. **Client-side Filtering**:
   - `getSchedules` in `scheduleService.ts` filters `superseded` schedules after fetching.
   - **Recommendation**: While acceptable for now, consider moving this filter to the backend API query parameters (`?status_ne=superseded` or similar) to save bandwidth if the history grows large.

### Low Priority Suggestions

1. **Date Formatting**:
   - `new Date(schedule.created_at).toLocaleDateString('vi-VN')` relies on browser locale implementation. Consider using a utility function or `date-fns` for consistent formatting if strict control is needed, though `vi-VN` is generally safe.
2. **Prop Drilling**:
   - `handleToggleStatus` is passed down. The current depth is shallow (1 level), so it's fine, but keep an eye on it if complexity grows.

### Positive Observations

- **Component Decomposition**: Good separation of concerns between `ScheduleSection` (container/logic), `ScheduleCard` (item), and `DayExerciseCard` (detail).
- **UI/UX**: Comprehensive handling of loading (Skeleton), Error, and Empty states. Dark mode support is consistently applied.
- **Accessibilty**: Usage of `aria-label` on interactive elements.
- **Responsive Design**: Grid adapts nicely from 2 columns on mobile to 7 columns on desktop.

### Recommended Actions

1.  **Refine Types**: Update `DayExerciseCard.tsx` to replace `any` with `LucideIcon`.
2.  **Verify Backend API**: Check if backend supports status filtering to optimize `getSchedules`.
3.  **Integration**: Proceed with Phase 3 to import and use `ScheduleSection` in `src/app/profile/page.tsx`.

### Metrics

- **Type Coverage**: High (Types defined in central file)
- **Linting Issues**: 0 (Visual check)
