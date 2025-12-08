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

/**
 * Validate Firebase configuration
 */
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

export const initializeFirebase = (): FirebaseApp | undefined => {
  if (typeof window === 'undefined') return undefined;

  if (!isFirebaseConfigured()) {
    console.warn(
      'Firebase not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.'
    );
    return undefined;
  }

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
 * Register FCM service worker and pass config
 */
export const registerFcmServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }

    if (!isFirebaseConfigured()) {
      console.warn('Firebase not configured. Skipping FCM SW registration.');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
        { scope: '/' }
      );

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;

      // Pass Firebase config to service worker
      if (registration.active) {
        registration.active.postMessage({
          type: 'FIREBASE_CONFIG',
          config: firebaseConfig,
        });
      }

      return registration;
    } catch (error) {
      console.error('Failed to register FCM service worker:', error);
      return null;
    }
  };

/**
 * Request notification permission and get FCM token
 * @returns FCM token or null if permission denied
 */
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    // Register service worker first
    await registerFcmServiceWorker();

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
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

/**
 * Check if FCM is supported in current browser
 */
export const checkFcmSupport = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  return await isSupported();
};
