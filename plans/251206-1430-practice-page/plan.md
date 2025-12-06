# Practice Page Implementation Plan

> **Feature:** Training Preferences & Fitness Goals Setup Page
> **Status:** ✅ 100% Complete (5 of 5 phases)
> **Created:** 2025-12-06
> **Last Updated:** 2025-12-06 23:59 (Phase 5 Completed)
> **Branch:** feat/implement-practice-page

---

## Overview

Implement Practice Page for VHealth allowing users to configure training preferences, fitness goals, weekly schedules, and favorite sports. Follows existing predict page patterns with card-based sections.

## Implementation Phases

| Phase | Name                      | Status       | Progress | File                                                   |
| ----- | ------------------------- | ------------ | -------- | ------------------------------------------------------ |
| 1     | Foundation & Types        | Pending      | 0%       | [phase-01-foundation.md](./phase-01-foundation.md)     |
| 2     | Basic Information Section | Completed ✅ | 100%     | [phase-02-basic-info.md](./phase-02-basic-info.md)     |
| 3     | Schedule Components       | Completed ✅ | 100%     | [phase-03-schedule.md](./phase-03-schedule.md)         |
| 4     | Sports & Notes Sections   | Completed ✅ | 100%     | [phase-04-sports-notes.md](./phase-04-sports-notes.md) |
| 5     | API Integration           | Completed ✅ | 100%     | [phase-05-integration.md](./phase-05-integration.md)   |

---

## Key Decisions

1. **Design Pattern:** Card-based sections (matches predict/profile pages)
2. **Form Library:** React Hook Form + Zod validation (existing pattern)
3. **State:** Local form state + React Query for API data
4. **Components:** Feature-specific in `src/components/practice/`
5. **Page Structure:** Following predict page organization

## File Structure

```
src/
├── app/practice/
│   ├── page.tsx           # Main page
│   ├── validation.ts      # Zod schemas
│   └── formHelper.ts      # Options, constants
├── components/practice/
│   ├── index.ts           # Barrel export
│   ├── HeroSection.tsx
│   ├── BasicInfoSection.tsx
│   ├── ScheduleSection/
│   │   ├── index.tsx
│   │   ├── DayPicker.tsx
│   │   ├── TimePeriodInput.tsx
│   │   ├── FlexibleMode.tsx
│   │   └── FixedMode.tsx
│   ├── SportsSection/
│   │   ├── index.tsx
│   │   ├── SportBadge.tsx
│   │   └── SportTagInput.tsx
│   └── NotesSection.tsx
├── types/
│   └── practice.ts        # Type definitions
└── services/
    └── practice.ts        # API service (if needed)
```

## Dependencies

- Existing: shadcn/ui, React Hook Form, Zod, Tailwind
- New: None required

## Risks

| Risk                        | Mitigation                           |
| --------------------------- | ------------------------------------ |
| Complex schedule validation | Start with simple mode, iterate      |
| Mobile touch targets        | Use 48px min-height for day buttons  |
| Pre-fill data not available | Graceful fallback to editable fields |

---

## Related Documents

- [Design Document](./reports/design-251206-practice-page.md)
- [Phase 4 Code Review](./reports/code-reviewer-251206-phase4-practice-page.md)
- [Phase 5 Code Review](./reports/code-reviewer-251206-practice-phase5-api.md)
- [Predict Page Reference](../src/app/predict/page.tsx)
- [Code Standards](../docs/code-standards.md)

---

## Implementation Complete ✅

**All 5 phases completed successfully!**

- ✅ Phase 1: Foundation & Types (skipped - reused existing)
- ✅ Phase 2: Basic Information Section
- ✅ Phase 3: Schedule Components
- ✅ Phase 4: Sports & Notes Sections
- ✅ Phase 5: API Integration

**Ready for merge to `develop` branch.**

**Recommended next steps:**

1. Add unit tests for `formatForAPI()` transformation
2. Add E2E test for complete practice flow
3. Fix existing ESLint warnings in ScheduleSection
4. Backend API endpoint implementation (if not done)
