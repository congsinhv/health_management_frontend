/**
 * Firebase initialization for FCM notifications
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
  isSupported,
  MessagePayload,
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
 * Error types for notification permission request
 */
export type NotificationError =
  | 'permission_denied'
  | 'sw_registration_failed'
  | 'fcm_not_supported'
  | 'vapid_not_configured'
  | 'token_error'
  | 'unknown';

export interface NotificationResult {
  token: string | null;
  error?: NotificationError;
  errorMessage?: string;
}

/**
 * Request notification permission and get FCM token
 * @returns Object with FCM token or error details
 */
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  const result = await requestNotificationPermissionWithDetails();
  return result.token;
};

/**
 * Request notification permission with detailed error information
 * @returns Object with FCM token or detailed error information
 */
export const requestNotificationPermissionWithDetails =
  async (): Promise<NotificationResult> => {
    try {
      // Register service worker first
      const swRegistration = await registerFcmServiceWorker();
      if (!swRegistration) {
        console.error('Service worker registration failed');
        return {
          token: null,
          error: 'sw_registration_failed',
          errorMessage: 'Không thể đăng ký service worker. Vui lòng thử lại.',
        };
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied:', permission);
        return {
          token: null,
          error: 'permission_denied',
          errorMessage:
            'Vui lòng cho phép thông báo trong cài đặt trình duyệt.',
        };
      }

      const messagingInstance = await getFirebaseMessaging();
      if (!messagingInstance) {
        console.error('FCM not supported or Firebase not initialized');
        return {
          token: null,
          error: 'fcm_not_supported',
          errorMessage:
            'Trình duyệt không hỗ trợ thông báo đẩy. Vui lòng sử dụng Chrome hoặc Safari mới nhất.',
        };
      }

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        console.error('VAPID key not configured');
        return {
          token: null,
          error: 'vapid_not_configured',
          errorMessage:
            'Cấu hình thông báo chưa hoàn tất. Vui lòng liên hệ hỗ trợ.',
        };
      }

      const token = await getToken(messagingInstance, { vapidKey });
      if (!token) {
        return {
          token: null,
          error: 'token_error',
          errorMessage: 'Không thể lấy token thông báo. Vui lòng thử lại.',
        };
      }

      return { token };
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return {
        token: null,
        error: 'unknown',
        errorMessage: `Lỗi không xác định: ${error instanceof Error ? error.message : 'Unknown'}`,
      };
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

/**
 * Callback type for foreground message handler
 */
export type ForegroundMessageCallback = (payload: MessagePayload) => void;

/**
 * Setup foreground message handler
 * This handles notifications when the PWA is OPEN (foreground)
 * ONLY shows toast - no browser notification (user is already in app)
 * @param callback Callback to handle the message (e.g., show toast)
 * @returns Unsubscribe function or null if setup failed
 */
export const setupForegroundMessageHandler = async (
  callback?: ForegroundMessageCallback
): Promise<(() => void) | null> => {
  const messagingInstance = await getFirebaseMessaging();
  if (!messagingInstance) {
    console.warn('FCM not available for foreground messages');
    return null;
  }

  const unsubscribe = onMessage(messagingInstance, payload => {
    // ONLY call callback (for toast) - NO browser notification
    // User is already in the app, toast is sufficient
    // Browser notification would be duplicate/annoying
    if (callback) {
      callback(payload);
    }
  });

  return unsubscribe;
};
