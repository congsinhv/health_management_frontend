'use client';

/**
 * Firebase Notification Provider
 * Sets up foreground message handler globally when app loads
 * Handles notifications when PWA is OPEN (foreground)
 */

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { setupForegroundMessageHandler } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth';

interface FirebaseNotificationProviderProps {
  children: React.ReactNode;
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
          // Show toast notification in addition to browser notification
          const title =
            payload.notification?.title ||
            payload.data?.title ||
            'Thông báo mới';
          const body =
            payload.notification?.body ||
            payload.data?.body ||
            'Bạn có thông báo mới từ VHealth';

          toast(title, {
            description: body,
            duration: 5000,
            action: payload.data?.url
              ? {
                  label: 'Xem',
                  onClick: () => {
                    window.location.href = payload.data?.url || '/practice';
                  },
                }
              : undefined,
          });
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

  // Re-setup when permission changes (e.g., user grants permission)
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

    // Check permission on visibility change (user might have changed it in settings)
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
