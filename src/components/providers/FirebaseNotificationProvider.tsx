'use client';

/**
 * Firebase Notification Provider
 * Shows system notification when app is in foreground
 * Service Worker handles notifications when app is closed
 */

import { useEffect, useRef } from 'react';
import { setupForegroundMessageHandler } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth';

interface FirebaseNotificationProviderProps {
  children: React.ReactNode;
}

// Track handled message IDs to prevent duplicates
const handledMessageIds = new Set<string>();
const MESSAGE_DEDUP_WINDOW_MS = 5000;

function getMessageId(payload: {
  notification?: { title?: string; body?: string };
  data?: {
    message_id?: string;
    title?: string;
    body?: string;
    tag?: string;
    type?: string;
  };
}): string {
  const notification = payload.notification || {};
  const data = payload.data || {};

  if (data.message_id) {
    return data.message_id;
  }

  return `${notification.title || data.title || ''}-${notification.body || data.body || ''}-${data.tag || data.type || ''}`;
}

export const FirebaseNotificationProvider = ({
  children,
}: FirebaseNotificationProviderProps) => {
  const { user } = useAuth();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const isSetupRef = useRef(false);

  useEffect(() => {
    // Only setup if user is logged in and we haven't setup yet
    if (!user || isSetupRef.current) return;

    // Check if notification permission is granted
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const setupHandler = async () => {
      try {
        isSetupRef.current = true;

        const unsubscribe = await setupForegroundMessageHandler(payload => {
          // Foreground message received

          // Create message ID for deduplication
          const messageId = getMessageId(payload);

          // Skip if already handled
          if (handledMessageIds.has(messageId)) {
            return;
          }

          handledMessageIds.add(messageId);
          setTimeout(
            () => handledMessageIds.delete(messageId),
            MESSAGE_DEDUP_WINDOW_MS
          );

          // Extract notification content
          const notification = payload.notification || {};
          const data = payload.data || {};

          const title = notification.title || data.title || 'VHealth';
          const body =
            notification.body || data.body || 'Bạn có thông báo mới từ VHealth';

          const tag =
            data.tag || data.message_id || `vhealth-foreground-${Date.now()}`;

          // Show system notification when app is in foreground
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready
              .then(registration => {
                return registration.showNotification(title, {
                  body: body,
                  icon: '/icons/icon-192x192.png',
                  badge: '/icons/badge-72x72.png',
                  tag: tag,
                  data: { ...data, url: data.url || '/practice' },
                  requireInteraction: true,
                  silent: false,
                });
              })
              .catch(() => {
                // Fallback to native Notification API
                try {
                  new Notification(title, {
                    body: body,
                    icon: '/icons/icon-192x192.png',
                    tag: tag,
                  });
                } catch {
                  // Notification failed
                }
              });
          } else {
            // Fallback for browsers without service worker
            try {
              new Notification(title, {
                body: body,
                icon: '/icons/icon-192x192.png',
                tag: tag,
              });
            } catch {
              // Notification failed
            }
          }
        });

        if (unsubscribe) {
          unsubscribeRef.current = unsubscribe;
        }
      } catch (error) {
        console.error('[Firebase] Error setting up foreground handler:', error);
        isSetupRef.current = false;
      }
    };

    setupHandler();

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
        isSetupRef.current = false;
      }
    };
  }, [user]);

  // Re-setup when permission changes
  useEffect(() => {
    if (!user) return;

    const handlePermissionChange = async () => {
      if (Notification.permission === 'granted' && !isSetupRef.current) {
        const unsubscribe = await setupForegroundMessageHandler();
        if (unsubscribe) {
          unsubscribeRef.current = unsubscribe;
          isSetupRef.current = true;
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handlePermissionChange();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  return <>{children}</>;
};
