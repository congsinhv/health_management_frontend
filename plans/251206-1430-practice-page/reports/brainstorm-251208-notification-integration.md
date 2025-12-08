# Practice Page - Notification & API Integration

**Date:** 2025-12-08
**Status:** Confirmed
**Scope:** FCM integration + new API endpoints for `/practice` page

---

## Requirements

1. **Update API integration** - switch to new endpoints:
   - `POST /api/v1/schedules/` - create schedule
   - `POST /api/v1/devices/` - register device
   - `GET /api/v1/devices/` - list user's registered devices
2. **FCM notification setup** - require mobile device registration before form submission
3. **Platform-specific notification flows** - different UX for Desktop/Android/iOS
4. **Profile page enhancement** - display list of registered devices

| Requirement        | Decision                                |
| ------------------ | --------------------------------------- |
| Firebase project   | Credentials in secret manager           |
| QR code URL        | `/practice?device=register`             |
| Skip notification? | No - mandatory                          |
| PWA library        | `next-pwa`                              |
| Gate UX            | Modal with "Check Again" refetch button |
| Gate condition     | ≥1 mobile device (ios/android) required |

---

## API Schema

### Schedule API - POST /api/v1/schedules/

```typescript
{
  basic_info: {
    height: data.basicInfo.height / 100,  // cm → meters
    weight: data.basicInfo.weight,
    target_weight: data.basicInfo.targetWeight,
    goal: data.basicInfo.goal,
  },
  schedule: {
    selected_days: data.schedule.selectedDays,
    mode: data.schedule.mode,
    fixed_period: data.schedule.mode === 'fixed' ? data.schedule.fixedPeriod : undefined,
    flexible_periods: data.schedule.mode === 'flexible' ? data.schedule.flexiblePeriods : undefined,
  },
  sports: {
    predefined: data.sports.predefined,
    custom: data.sports.custom,
  },
  notes: {
    personal: data.notes.personal || null,
    health_warnings: data.notes.healthWarnings || null,
  },
  timezone: "Asia/Ho_Chi_Minh",
}
```

### Device API - POST /api/v1/devices/

```typescript
{
  fcm_token: "...",  // From Firebase
  device_type: "web" | "android" | "ios",
  device_name: navigator.userAgent.slice(0, 100)
}
```

### Device API - GET /api/v1/devices/

```typescript
// Response
[
  {
    id: 'uuid',
    device_type: 'android',
    device_name: 'Samsung Galaxy S24',
    is_active: true,
    last_used: '2025-12-08T10:30:00Z',
  },
];
```

---

## User Flows

### Desktop User

```
/practice → Modal shows QR code
    ↓
User scans QR on phone → /practice?device=register
    ↓
Phone: FCM permission → POST /devices/
    ↓
Desktop: Click "Check Again" → Modal closes
    ↓
Fill form → Submit → POST /schedules/
```

### Android User

```
/practice → Modal shows "Allow Notifications" button
    ↓
Tap → FCM permission → POST /devices/ → Modal auto-closes
    ↓
Fill form → Submit → POST /schedules/
```

### iOS User

```
/practice → Modal shows PWA install instructions
    ↓
Add to Home Screen → Open PWA → FCM permission → POST /devices/
    ↓
Click "Check Again" → Modal closes
    ↓
Fill form → Submit → POST /schedules/
```

---

## Implementation Structure

```
src/
├── app/
│   ├── practice/
│   │   ├── page.tsx
│   │   └── validation.ts
│   └── profile/
│       └── page.tsx (add DeviceList section)
├── components/
│   ├── practice/
│   │   └── NotificationSetupModal/
│   │       ├── index.tsx (modal + refetch logic)
│   │       ├── DesktopFlow.tsx (QR code)
│   │       ├── AndroidFlow.tsx (permission button)
│   │       └── IOSFlow.tsx (PWA instructions)
│   └── profile/
│       └── DeviceList/
│           ├── index.tsx
│           └── DeviceCard.tsx
├── hooks/
│   ├── usePlatformDetection.ts
│   ├── useFCMToken.ts
│   └── useDevices.ts
├── services/
│   ├── practice.ts (update endpoint)
│   └── device.ts (new)
├── types/
│   ├── practice.ts (update schema)
│   └── device.ts (new)
└── lib/
    └── firebase.ts (new)
```

---

## Dependencies

```json
{
  "firebase": "^10.x",
  "qrcode.react": "^4.x",
  "next-pwa": "^5.x"
}
```

---

## Risk Assessment

| Risk                        | Impact | Mitigation                     |
| --------------------------- | ------ | ------------------------------ |
| iOS Safari limitations      | High   | Clear PWA install instructions |
| Firebase bundle size (~1MB) | Medium | Dynamic import, lazy load      |
| QR code scanning issues     | Medium | Show URL text below QR         |
| User abandonment            | High   | Clear value proposition        |

---

## Implementation Phases

### Phase 1: Types & Device Service

- Create `src/types/device.ts`
- Create `src/services/device.ts` (GET/POST/DELETE)
- Create `useDevices` hook

### Phase 2: API Schema Update

- Update `formatForAPI()` in practice.ts
- Convert height cm → meters
- Add timezone field
- Update endpoint to `/schedules/`

### Phase 3: Firebase + PWA Setup

- Add dependencies
- Configure `next-pwa` in `next.config.ts`
- Create `src/lib/firebase.ts`
- Create `public/firebase-messaging-sw.js`
- Add env vars (NEXT*PUBLIC_FIREBASE*\*)
- Create `useFCMToken` hook

### Phase 4: Platform Detection & Notification UI

- Create `usePlatformDetection` hook
- Create `NotificationSetupModal` component:
  - Desktop: QR code → `/practice?device=register`
  - Android: "Allow Notifications" button
  - iOS: PWA install instructions
  - "Check Again" button → refetch → validate

### Phase 5: Practice Page Integration

- Fetch devices on load
- Show modal if no mobile device
- Handle `?device=register` query param
- Submit → POST /schedules/ only

### Phase 6: Profile Page Device List

- Create `DeviceList` + `DeviceCard` components
- Add section to `/profile` page
- Delete with confirmation
- Empty state handling
