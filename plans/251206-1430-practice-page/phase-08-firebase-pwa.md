# Phase 3: Firebase + PWA Setup

> **Parent Plan:** [plan.md](./plan.md)
> **Dependencies:** None (can run parallel to Phase 6-7)
> **Status:** Blocked 🚨
> **Blocker:** Service worker Firebase config injection (Critical)
> **Date:** 2025-12-08
> **Priority:** High
> **Estimated Effort:** 2-3 hours (base) + 2-3 hours (fixes)
> **Code Review:** [code-reviewer-251208-phase07-08-review.md](./reports/code-reviewer-251208-phase07-08-review.md)

---

## Overview

Configure Firebase Cloud Messaging (FCM) client and Progressive Web App (PWA) support using `next-pwa`. This enables push notification registration across all platforms.

## Key Insights

1. Firebase SDK v9+ uses modular imports (tree-shakeable)
2. `next-pwa` handles service worker generation
3. FCM requires service worker for background notifications
4. Environment variables for Firebase config (security)
5. PWA manifest needed for iOS "Add to Home Screen"

## Requirements

### Functional

- [ ] Initialize Firebase app with config
- [ ] Create FCM messaging instance
- [ ] Request notification permission
- [ ] Get FCM token on permission grant
- [ ] Register service worker for PWA

### Non-Functional

- [ ] Keep Firebase credentials in environment variables
- [ ] Service worker must handle FCM messages
- [ ] PWA manifest with proper icons

## Related Code Files

| File                              | Action        | Purpose                 |
| --------------------------------- | ------------- | ----------------------- |
| `src/lib/firebase.ts`             | CREATE        | Firebase initialization |
| `public/firebase-messaging-sw.js` | CREATE        | FCM service worker      |
| `public/manifest.json`            | CREATE/UPDATE | PWA manifest            |
| `next.config.ts`                  | UPDATE        | Add next-pwa config     |
| `.env.local`                      | UPDATE        | Firebase credentials    |
| `.env.example`                    | UPDATE        | Document env vars       |

## Implementation Steps

### Step 1: Install Dependencies

```bash
bun add firebase next-pwa
bun add -D @types/node
```

### Step 2: Add Environment Variables

**File:** `.env.local`

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

**File:** `.env.example` (append)

```env
# Firebase Configuration (for FCM notifications)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
```

### Step 3: Create Firebase Initialization

**File:** `src/lib/firebase.ts`

```typescript
/**
 * Firebase initialization for FCM notifications
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  Messaging,
  isSupported,
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp | undefined;
let messaging: Messaging | undefined;

export const initializeFirebase = (): FirebaseApp | undefined => {
  if (typeof window === 'undefined') return undefined;

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  return app;
};

/**
 * Get Firebase Messaging instance
 * Returns null if not supported (SSR, Safari iOS < 16.4)
 */
export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined') return null;

  const supported = await isSupported();
  if (!supported) {
    console.warn('FCM not supported in this browser');
    return null;
  }

  const firebaseApp = initializeFirebase();
  if (!firebaseApp) return null;

  if (!messaging) {
    messaging = getMessaging(firebaseApp);
  }
  return messaging;
};

/**
 * Request notification permission and get FCM token
 * @returns FCM token or null if permission denied
 */
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    const messagingInstance = await getFirebaseMessaging();
    if (!messagingInstance) return null;

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error('VAPID key not configured');
      return null;
    }

    const token = await getToken(messagingInstance, { vapidKey });
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Check if notifications are supported and permission status
 */
export const getNotificationStatus = (): {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
} => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { supported: false, permission: 'unsupported' };
  }
  return { supported: true, permission: Notification.permission };
};
```

### Step 4: Create FCM Service Worker

**File:** `public/firebase-messaging-sw.js`

```javascript
// Firebase Cloud Messaging Service Worker
// This file must be in public/ for proper scope

importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

// Initialize Firebase (config injected at build time or fetched)
firebase.initializeApp({
  apiKey: 'FIREBASE_API_KEY',
  authDomain: 'FIREBASE_AUTH_DOMAIN',
  projectId: 'FIREBASE_PROJECT_ID',
  storageBucket: 'FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
  appId: 'FIREBASE_APP_ID',
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(payload => {
  console.log('[SW] Background message:', payload);

  const notificationTitle = payload.notification?.title || 'VHealth';
  const notificationOptions = {
    body: payload.notification?.body || 'Bạn có thông báo mới',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/practice';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(urlToOpen);
      })
  );
});
```

### Step 5: Create/Update PWA Manifest

**File:** `public/manifest.json`

```json
{
  "name": "VHealth - Quản lý sức khỏe",
  "short_name": "VHealth",
  "description": "Ứng dụng quản lý sức khỏe cá nhân",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#00bc7d",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

### Step 6: Update Next.js Config

**File:** `next.config.ts`

```typescript
import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Don't precache firebase-messaging-sw.js (it's separate)
  buildExcludes: [/firebase-messaging-sw\.js$/],
});

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            ext: 'tsx',
          },
        },
      ],
    });

    return config;
  },
};

export default pwaConfig(nextConfig);
```

### Step 7: Add Manifest Link to Layout

**File:** `src/app/layout.tsx` (in head)

```tsx
// Add to metadata or head
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#00bc7d" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="VHealth" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
```

### Step 8: Create PWA Icons

Generate icons in `public/icons/`:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png
- badge-72x72.png (notification badge)

Use existing favicon or logo as base.

## Todo List

- [x] Install `firebase` and `next-pwa` packages
- [x] Add Firebase env variables to `.env.local` (documented in .env.example)
- [x] Update `.env.example` with Firebase vars
- [x] Create `src/lib/firebase.ts` with FCM utilities
- [x] Create `public/firebase-messaging-sw.js` (⚠️ needs config injection)
- [x] Create/update `public/manifest.json`
- [x] Update `next.config.ts` with PWA config
- [x] Add manifest link to `src/app/layout.tsx`
- [x] Generate PWA icons in `public/icons/` (⚠️ icon-192 dimensions incorrect)
- [ ] **BLOCKED:** Test notification permission flow (needs SW config fix)

## Critical Blockers 🚨

### 1. Service Worker Firebase Credentials (P0 - BLOCKING)

**Issue:** `public/firebase-messaging-sw.js` contains hardcoded placeholder values:

```javascript
firebase.initializeApp({
  apiKey: 'FIREBASE_API_KEY', // ← Placeholder, won't work
  // ...
});
```

**Impact:** FCM notifications completely non-functional at runtime

**Solution Options:**

**Option A: Runtime Fetch** (RECOMMENDED)
Create API endpoint to serve config dynamically:

```typescript
// src/app/api/firebase-config/route.ts
export async function GET() {
  return Response.json({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}
```

Update service worker:

```javascript
// public/firebase-messaging-sw.js
self.addEventListener('install', event => {
  event.waitUntil(
    fetch('/api/firebase-config')
      .then(res => res.json())
      .then(config => {
        firebase.initializeApp(config);
      })
  );
});
```

**Option B: Build-time Injection**
Create build script to replace placeholders (requires custom build step)

**Decision Needed:** Choose and implement one approach

### 2. Missing FCM Service Worker Registration (P0 - BLOCKING)

**Issue:** No utility to register `firebase-messaging-sw.js` separately from PWA service worker

**Solution:** Add to `src/lib/firebase.ts`:

```typescript
export const registerFcmServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js'
    );
    return registration;
  }
  return null;
};
```

Call before requesting FCM token.

## High Priority Issues

### 3. PWA Icon Dimensions Mismatch (P1)

**Issue:** `icon-192x192.png` actual size is 166x192 (not 192x192)

**Fix:** Regenerate icon to exactly 192x192px or update manifest

### 4. Firebase SDK Version Mismatch (P2)

**Issue:** Service worker imports v9.0.0 but package.json has v12.6.0

**Fix:** Update importScripts URLs to match:

```javascript
importScripts(
  'https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging-compat.js'
);
```

## Implementation Notes (2025-12-08)

**Completed:**

- Firebase utilities with proper SSR guards and browser detection
- PWA manifest follows spec with complete icon set
- Service worker template structure correct
- Build succeeds, TypeScript checks pass
- Singleton pattern for Firebase initialization
- Graceful degradation for unsupported browsers

**Strengths:**

- Clean architecture with proper type safety
- All Firebase utilities check for browser environment
- `isSupported()` check prevents Safari issues
- PWA disabled in development (no cache issues)
- Firebase service worker excluded from precaching

**Blockers:**

1. Service worker config injection (CRITICAL)
2. FCM service worker registration utility missing
3. Icon dimensions need correction
4. End-to-end notification testing pending

**Next Steps:**

1. Choose and implement service worker config solution (Option A recommended)
2. Add `registerFcmServiceWorker()` utility
3. Fix icon dimensions to exact 192x192
4. Update Firebase SDK version in service worker
5. Test notification permission flow end-to-end
6. Verify background notifications work
7. Test PWA installation on mobile devices
8. Mark phase as complete after verification

**Estimated Time to Completion:** 2-3 hours

**Full Review:** See `reports/code-reviewer-251208-phase07-08-review.md` for complete findings

## Success Criteria

1. `initializeFirebase()` initializes without errors
2. `requestNotificationPermission()` returns FCM token on grant
3. Service worker registers and handles background messages
4. PWA installable on mobile devices
5. Notifications display correctly on mobile

## Risk Assessment

| Risk                          | Mitigation                          |
| ----------------------------- | ----------------------------------- |
| Firebase config in client JS  | Use NEXT*PUBLIC* prefix, no secrets |
| Safari iOS push limitations   | Document PWA requirement for iOS    |
| Service worker caching issues | Disable in development              |
| Icon generation time          | Use automated tool or placeholder   |

## Notes

- iOS requires PWA installed to home screen for push notifications
- Safari desktop doesn't support FCM (as of 2024)
- Service worker config must be in public/ for proper scope
- Consider using `workbox` for more control if needed
