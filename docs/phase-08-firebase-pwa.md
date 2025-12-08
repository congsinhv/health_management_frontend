# Phase 08 - Firebase Cloud Messaging & PWA Setup

**Project:** VHealth (health_management_frontend)
**Phase:** 08 - Firebase + PWA Configuration
**Status:** Implemented
**Last Updated:** December 2025

---

## Overview

Phase 08 establishes Firebase Cloud Messaging (FCM) for push notifications and Progressive Web App (PWA) capabilities. This phase enables the application to send and receive device notifications, work offline (partially), and be installable on user devices.

**Key Goals:**

- Initialize Firebase with FCM support
- Register service worker for background message handling
- Configure PWA manifest and icons
- Request notification permissions
- Set up environment variables

---

## Changes Summary

### 1. Firebase Initialization Module

**File:** `src/lib/firebase.ts` (168 lines)

New comprehensive Firebase utility module:

```typescript
/**
 * Firebase initialization and FCM utilities
 */

// Configuration validation
export const isFirebaseConfigured = (): boolean => {
  // Checks NEXT_PUBLIC_FIREBASE_* env vars are set
};

// Initialization
export const initializeFirebase = (): FirebaseApp | undefined => {
  // Singleton pattern initialization
  // Returns undefined if window is undefined (SSR)
};

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  // Get messaging instance
  // Returns null if browser doesn't support FCM
};

// Service Worker registration
export const registerFcmServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  // Register /firebase-messaging-sw.js
  // Pass config to worker via postMessage
};

// Permission and token management
export const requestNotificationPermission = async (): Promise<string | null> => {
  // Request user permission for notifications
  // Register service worker if needed
  // Returns FCM token or null if denied
};

// Status checking
export const getNotificationStatus = (): {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
};

export const checkFcmSupport = async (): Promise<boolean> => {
  // Check if browser supports FCM
};
```

**Key Features:**

1. **Singleton Pattern:** Firebase initialized once, reused across app
2. **SSR Safe:** Checks `typeof window` to avoid server errors
3. **Permission Handling:** Requests notification permission gracefully
4. **Service Worker Integration:** Passes config to worker via messaging
5. **Error Handling:** Returns null instead of throwing for unsupported browsers

### 2. Service Worker Configuration

**File:** `public/firebase-messaging-sw.js` (NEW)

FCM service worker for background message handling:

```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

let firebaseConfig = null;

// Receive Firebase config from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    firebaseConfig = event.data.config;
    firebase.initializeApp(firebaseConfig);
  }
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(payload => {
  console.log('Background notification received:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-192x192.png',
    tag: payload.notification.tag || 'notification',
    data: payload.data,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const urlToOpen = new URL(
    notification.data.link || '/',
    self.location.origin
  );

  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if window already open
        for (let i = 0; i < clientList.length; i++) {
          if (
            clientList[i].url === urlToOpen.href &&
            'focus' in clientList[i]
          ) {
            return clientList[i].focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
```

**Responsibilities:**

- Listen for FCM messages in background (app not open)
- Show notifications with custom UI
- Handle notification clicks
- Open relevant app page when notification clicked

### 3. PWA Manifest Configuration

**File:** `public/manifest.json` (NEW)

Progressive Web App manifest:

```json
{
  "name": "VHealth - Health Management",
  "short_name": "VHealth",
  "description": "Smart health tracking and AI-powered practice planning",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "categories": ["health", "fitness", "lifestyle"],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/maskable-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/screenshot-1.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/screenshot-2.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ]
}
```

**Manifest Properties:**

| Property         | Value                       | Purpose                               |
| ---------------- | --------------------------- | ------------------------------------- |
| name             | VHealth - Health Management | Long app name (for install prompt)    |
| short_name       | VHealth                     | Home screen icon label (max 12 chars) |
| start_url        | /                           | Entry point when app installed        |
| scope            | /                           | Supported URLs for this PWA           |
| display          | standalone                  | Full screen without browser UI        |
| theme_color      | #3B82F6                     | Status bar color on Android           |
| background_color | #ffffff                     | Splash screen background              |
| icons            | Multiple sizes              | Home screen, notification icons       |

### 4. PWA Icons

**Location:** `public/icons/` (9 PNG files)

Generated icon sizes (all provided):

- 72x72 - Legacy Android
- 96x96 - Legacy Android
- 128x128 - Small devices
- 144x144 - Medium devices
- 152x152 - iPad mini
- 192x192 - Android home screen
- 384x384 - Desktop/tablet
- 512x512 - Splash screen
- Maskable icons (adaptive icons for Android 8+)

### 5. Next.js Configuration

**File:** `next.config.ts` (UPDATED)

Added next-pwa configuration:

```typescript
import withPWA from 'next-pwa';

const withPWAConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest.json$/],
});

export default withPWAConfig({
  // ... existing Next.js config
});
```

**PWA Options:**

| Option        | Value    | Purpose                      |
| ------------- | -------- | ---------------------------- |
| dest          | 'public' | Output directory for SW      |
| disable       | dev mode | Only generate in production  |
| register      | true     | Auto-register service worker |
| skipWaiting   | true     | Activate new SW immediately  |
| buildExcludes | regex    | Don't include in SW          |

### 6. Layout and Metadata Updates

**File:** `src/app/layout.tsx` (UPDATED)

Added PWA manifest link and viewport:

```typescript
export const metadata: Metadata = {
  title: 'VHealth - Health Management',
  description: 'Smart health tracking and AI-powered practice planning',
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
  },
};
```

### 7. Environment Variables

**File:** `.env.example` (UPDATED)

Added Firebase configuration variables:

```env
# Firebase Cloud Messaging (FCM) Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_firebase_vapid_public_key
```

**Variable Purposes:**

| Variable            | Purpose                 | Scope  | Required |
| ------------------- | ----------------------- | ------ | -------- |
| API_KEY             | Firebase authentication | Public | Yes      |
| AUTH_DOMAIN         | Firebase auth domain    | Public | Yes      |
| PROJECT_ID          | GCP project identifier  | Public | Yes      |
| STORAGE_BUCKET      | Cloud Storage bucket    | Public | Yes      |
| MESSAGING_SENDER_ID | FCM sender ID           | Public | Yes      |
| APP_ID              | Firebase app identifier | Public | Yes      |
| VAPID_KEY           | Push encryption key     | Public | Yes      |

### 8. TypeScript Type Declarations

**Files:**

- `src/types/next-pwa.d.ts` - next-pwa type definitions
- `src/types/minimatch.d.ts` - minimatch type definitions

Type declarations for external libraries without built-in types.

### 9. Dependencies

**New packages added:**

```json
{
  "firebase": "^9.x",
  "next-pwa": "^5.x",
  "qrcode.react": "^1.x"
}
```

**Firebase:** Cloud Messaging and utilities
**next-pwa:** PWA configuration and service worker generation
**qrcode.react:** QR code generation (future: device pairing)

---

## Firebase Setup Instructions

### 1. Create Firebase Project

```bash
# Navigate to Firebase Console
# https://console.firebase.google.com/

# Create new project
# Name: vhealth
# Enable Google Analytics (optional)
```

### 2. Set Up Cloud Messaging

```bash
# In Firebase Console:
# 1. Project Settings → Cloud Messaging tab
# 2. Copy "Server API Key" (for backend)
# 3. Generate new Web Push Certificate
# 4. Copy "Web Push Certificate" (save securely)
```

### 3. Get Firebase Configuration

```bash
# Project Settings → General tab
# Copy web config:
{
  "apiKey": "AIzaSy...",
  "authDomain": "vhealth-xxxxx.firebaseapp.com",
  "projectId": "vhealth-xxxxx",
  "storageBucket": "vhealth-xxxxx.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abc123def456",
  "measurementId": "G-XXXXXXX"
}
```

### 4. Generate VAPID Key

```bash
# Option A: Use Firebase Console
# Cloud Messaging → Web Push Certificates → Manage existing

# Option B: Use Firebase CLI
npm install -g firebase-tools
firebase login
firebase projects:list
firebase config:get
firebase emulators:start
```

### 5. Update Environment Variables

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vhealth-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vhealth-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vhealth-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BMxxx...
```

---

## PWA Installation Flow

```
User visits app
  ↓
Browser detects manifest.json
  ↓
Browser checks service worker
  ↓
Service worker installed and activated
  ↓
PWA eligible for installation
  ↓
Install prompt shown (optional)
  ↓
User clicks install
  ↓
App installed to home screen
  ↓
App opens in standalone mode
```

---

## Push Notification Flow

```
Backend event triggered
  (e.g., practice reminder, health alert)
  ↓
Backend queries user's registered devices
  ↓
Backend sends FCM message
  {
    notification: {
      title: "Practice Reminder",
      body: "Time for your morning practice!"
    },
    data: {
      link: "/practice"
    }
  }
  ↓
Firebase Cloud Messaging service
  ↓
Message delivered to device
  ↓
If app is open:
  ├─ Foreground message handler
  ├─ Show in-app notification
  └─ Navigate if clicked
  ↓
If app is closed:
  ├─ Service worker receives message
  ├─ Shows system notification
  ├─ User clicks notification
  └─ navigates to specified URL
```

---

## Browser Support

### FCM Support

| Browser          | Min Version | Notes               |
| ---------------- | ----------- | ------------------- |
| Chrome           | 50+         | Full support        |
| Firefox          | 48+         | Full support        |
| Edge             | 17+         | Full support        |
| Safari           | 16.4+       | Partial (macOS/iOS) |
| Opera            | 37+         | Full support        |
| Samsung Internet | 5+          | Full support        |

### PWA Support

| Platform           | Min Version | Install Method             |
| ------------------ | ----------- | -------------------------- |
| Chrome (Desktop)   | All         | Address bar popup          |
| Chrome (Android)   | All         | Menu → Install app         |
| Firefox (Desktop)  | Latest      | Menu option                |
| Safari (iOS/macOS) | 15+         | Share → Add to home screen |
| Samsung Internet   | 5+          | Menu option                |

### Fallback Strategy

For unsupported browsers:

1. `checkFcmSupport()` returns false
2. `requestNotificationPermission()` returns null
3. `getNotificationStatus()` shows as unsupported
4. App continues to work normally
5. No errors shown to user

---

## Security Considerations

### VAPID Key Protection

```typescript
// Public VAPID key can be in environment (client-side)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=...

// Private VAPID key stays on backend only
// Never send to frontend
```

### Permission Model

```typescript
// Firebase config is public (API key, project ID, etc.)
// But FCM requires:
// 1. Valid domain (manifest scope)
// 2. User permission (Notification.requestPermission)
// 3. Service worker registration
// These provide security:
// - Domain verification prevents CSRF
// - User permission is explicit opt-in
// - Service worker validates requests
```

### Service Worker Scope

```typescript
// Register with specific scope
navigator.serviceWorker.register('/firebase-messaging-sw.js', {
  scope: '/', // Only intercepts /
});

// Prevents service worker from affecting other apps
// on same domain (if any)
```

---

## Testing Checklist

### Firebase Setup

- [ ] Firebase project created
- [ ] Cloud Messaging enabled
- [ ] VAPID key generated
- [ ] All env vars configured

### Service Worker

- [ ] Service worker registers successfully
- [ ] FCM config passed to worker
- [ ] Background messages handled
- [ ] Notification clicks work

### PWA

- [ ] Manifest link in HTML
- [ ] Manifest valid (validate at manifest-validator.appspot.com)
- [ ] All icon sizes present
- [ ] App installable on supported browsers
- [ ] Installed app works offline (for cached routes)

### Push Notifications

- [ ] Permission request shows on first use
- [ ] FCM token successfully obtained
- [ ] Token can be sent to backend for registration
- [ ] Test notification from Firebase console works
- [ ] Notification shows with correct icon/title
- [ ] Clicking notification opens correct URL

---

## Deployment Considerations

### Build Time

```bash
bun run build
# Generates:
# - .next/static/... (Next.js bundles)
# - public/sw.js (Service worker from next-pwa)
# - public/workbox-*.js (Workbox runtime)
```

### Environment Variables in Docker

```dockerfile
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_VAPID_KEY

ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
# ... etc for each var
```

### Cloud Run Configuration

Environment variables must be set in Cloud Run service:

```bash
gcloud run deploy vhealth-frontend-prod \
  --set-env-vars=NEXT_PUBLIC_FIREBASE_API_KEY=... \
  --set-env-vars=NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=... \
  # ... etc
```

---

## Monitoring & Debugging

### Local Testing

```bash
# Development (PWA disabled in dev mode)
bun run dev
# Service worker not auto-registered
# Manual registration in browser DevTools

# Production simulation
NODE_ENV=production bun run build
bun run start
# Service worker registered
# Access at localhost:3000
```

### Chrome DevTools

```
F12 → Application tab
├── Manifest
│   └── Check validity, icons, theme colors
├── Service Workers
│   └── Check registration, updates, offline support
├── Storage
│   ├── Cache Storage (workbox caches)
│   └── IndexedDB (Firebase auth tokens)
└── Network
    └── Check offline functionality (simulated)
```

### Firebase Console Monitoring

```
Firebase Console → Cloud Messaging
├── Send test message
│   ├── Select topic
│   ├── Enter title and body
│   └── Send (check device receives)
└── Analytics
    ├── Delivery rate
    ├── Error rate
    └── Geographic distribution
```

---

## Related Documentation

- `docs/system-architecture.md` - Overall architecture including FCM
- `docs/deployment-guide.md` - Deployment with environment variables
- Phase 06 documentation - Device service for token registration
- Phase 09 documentation - Notification UI components
