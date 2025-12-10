/**
 * Platform detection utilities
 */

export type Platform = 'ios' | 'android' | 'desktop';

/**
 * Detect current platform from user agent
 */
export const detectPlatform = (): Platform => {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent.toLowerCase();

  // iOS detection (iPhone, iPad, iPod)
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  }

  // Android detection
  if (/android/.test(ua)) {
    return 'android';
  }

  // Everything else is desktop
  return 'desktop';
};

/**
 * Check if current device is mobile (iOS or Android)
 */
export const isMobileDevice = (): boolean => {
  const platform = detectPlatform();
  return platform === 'ios' || platform === 'android';
};

/**
 * Check if browser supports notifications
 */
export const supportsNotifications = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

/**
 * Check if running as installed PWA
 */
export const isInstalledPWA = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check display-mode media query
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // iOS Safari specific check
  const isIOSPWA =
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
    true;

  return isStandalone || isIOSPWA;
};
