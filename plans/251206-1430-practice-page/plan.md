# Practice Page Implementation Plan

> **Feature:** Training Preferences & Fitness Goals Setup Page
> **Status:** Planning Complete
> **Created:** 2025-12-06
> **Branch:** feat/implement-practice-page

---

## Overview

Implement Practice Page for VHealth allowing users to configure training preferences, fitness goals, weekly schedules, and favorite sports. Follows existing predict page patterns with card-based sections.

## Implementation Phases

| Phase | Name                      | Status       | Progress | File                                                   |
| ----- | ------------------------- | ------------ | -------- | ------------------------------------------------------ |
| 1     | Foundation & Types        | Pending      | 0%       | [phase-01-foundation.md](./phase-01-foundation.md)     |
| 2     | Basic Information Section | Completed ✅ | 100%     | [phase-02-basic-info.md](./phase-02-basic-info.md)     |
| 3     | Schedule Components       | Pending      | 0%       | [phase-03-schedule.md](./phase-03-schedule.md)         |
| 4     | Sports & Notes Sections   | Pending      | 0%       | [phase-04-sports-notes.md](./phase-04-sports-notes.md) |
| 5     | API Integration           | Pending      | 0%       | [phase-05-integration.md](./phase-05-integration.md)   |

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
- [Predict Page Reference](../src/app/predict/page.tsx)
- [Code Standards](../docs/code-standards.md)
