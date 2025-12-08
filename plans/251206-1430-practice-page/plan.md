# Practice Page - Notification & API Integration Plan

> **Feature:** FCM Notification Setup & API Schema Update
> **Status:** In Progress (4 of 6 new phases completed - 67%)
> **Created:** 2025-12-08
> **Last Updated:** 2025-12-08
> **Branch:** feat/implement-practice-page
> **Parent Plan:** Practice Page Implementation (Phases 1-5 completed)

---

## Overview

Extend the existing Practice Page with:

1. **New API endpoints** - Switch from `/practice-preferences` to `/schedules/` and `/devices/`
2. **FCM notification setup** - Require mobile device registration before form submission
3. **Platform-specific flows** - Desktop (QR), Android (button), iOS (PWA)
4. **Profile device list** - Display registered devices in profile page

## Key Decisions

| Decision               | Choice                      | Rationale                           |
| ---------------------- | --------------------------- | ----------------------------------- |
| Notification mandatory | Yes                         | Core feature requirement            |
| QR code URL            | `/practice?device=register` | Deep-link to registration flow      |
| Mobile device required | At least 1 iOS/Android      | Push notifications target mobile    |
| PWA library            | `next-pwa`                  | Well-maintained, Next.js compatible |
| Firebase config        | Secret manager              | Security best practice              |
| Modal behavior         | "Check Again" refetch       | UX for async device registration    |

## Implementation Phases

### Previous Phases (Completed)

| Phase | Name                | Status    | File                                                   |
| ----- | ------------------- | --------- | ------------------------------------------------------ |
| 1     | Foundation & Types  | Completed | [phase-01-foundation.md](./phase-01-foundation.md)     |
| 2     | Basic Info Section  | Completed | [phase-02-basic-info.md](./phase-02-basic-info.md)     |
| 3     | Schedule Components | Completed | [phase-03-schedule.md](./phase-03-schedule.md)         |
| 4     | Sports & Notes      | Completed | [phase-04-sports-notes.md](./phase-04-sports-notes.md) |
| 5     | API Integration     | Completed | [phase-05-integration.md](./phase-05-integration.md)   |

### New Phases (Notification & API Update)

| Phase | Name                      | Status    | Priority | File                                                                   |
| ----- | ------------------------- | --------- | -------- | ---------------------------------------------------------------------- |
| 6     | Device Types & Service    | Completed | High     | [phase-06-device-service.md](./phase-06-device-service.md)             |
| 7     | API Schema Update         | Completed | High     | [phase-07-api-schema.md](./phase-07-api-schema.md)                     |
| 8     | Firebase + PWA Setup      | Completed | High     | [phase-08-firebase-pwa.md](./phase-08-firebase-pwa.md)                 |
| 9     | Notification UI Modal     | Completed | High     | [phase-09-notification-ui.md](./phase-09-notification-ui.md)           |
| 10    | Practice Page Integration | Completed | High     | [phase-10-practice-integration.md](./phase-10-practice-integration.md) |
| 11    | Profile Device List       | Pending   | Medium   | [phase-11-profile-devices.md](./phase-11-profile-devices.md)           |

## Architecture Changes

```
src/
├── types/
│   └── device.ts              # NEW: Device types
├── services/
│   ├── device.ts              # NEW: Device CRUD service
│   └── practice.ts            # UPDATE: New endpoint + formatForAPI
├── lib/
│   └── firebase.ts            # NEW: Firebase initialization
├── components/
│   ├── practice/
│   │   └── NotificationSetupModal.tsx  # NEW: Platform-specific modal
│   └── profile/
│       └── DeviceList.tsx     # NEW: Registered devices display
├── app/
│   ├── practice/page.tsx      # UPDATE: Gate + ?device=register handling
│   └── profile/page.tsx       # UPDATE: Add DeviceList section
└── public/
    ├── firebase-messaging-sw.js  # NEW: Service worker
    └── manifest.json             # UPDATE: PWA manifest
```

## Dependencies

**New packages:**

- `firebase` - FCM client SDK
- `next-pwa` - Service worker & PWA support
- `qrcode.react` - QR code generation

**Existing (no changes):**

- shadcn/ui Dialog component (need to add if missing)
- React Query for device fetching
- Tailwind CSS for styling

## API Endpoints

| Method | Endpoint               | Purpose                         |
| ------ | ---------------------- | ------------------------------- |
| GET    | `/api/v1/devices/`     | List user's registered devices  |
| POST   | `/api/v1/devices/`     | Register new device (FCM token) |
| DELETE | `/api/v1/devices/{id}` | Remove device                   |
| POST   | `/api/v1/schedules/`   | Create practice schedule (new)  |

## Risk Assessment

| Risk                               | Impact | Probability | Mitigation                    |
| ---------------------------------- | ------ | ----------- | ----------------------------- |
| Firebase config exposure           | High   | Low         | Use env vars, gitignore       |
| PWA service worker caching issues  | Medium | Medium      | Clear cache on version update |
| Cross-platform browser differences | Medium | High        | Test Safari, Chrome, Firefox  |
| User blocks notifications          | Medium | High        | Clear messaging, retry flow   |

## Success Criteria

1. Desktop users see QR code modal on practice page
2. Android users can register device with one-tap button
3. iOS users see PWA installation instructions
4. Form submission blocked until mobile device registered
5. Profile page shows list of registered devices with delete option
6. FCM tokens properly stored and associated with user

## Related Documents

- [Code Standards](../../docs/code-standards.md)
- [Design Guidelines](../../docs/design-guidelines.md)
- [Original Practice Page Plan](./phase-05-integration.md)

---

## Notes

- Existing practice form validation remains unchanged
- Schedule endpoint replaces practice-preferences endpoint
- Device registration is per-user, not per-browser
