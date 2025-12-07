'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth';
import Header from '@/components/layout/Header';
import Loading from '../loading/Loading';
import NavigationLoader from '../loading/NavigationLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component for Next.js App Router
 *
 * Restricts access to authenticated users only. If user is not authenticated,
 * they will be redirected to the login page (or custom redirectTo path).
 *
 * @example
 * ```tsx
 * // Basic usage
 * export default function ProfilePage() {
 *   return (
 *     <ProtectedRoute>
 *       <div>Protected content</div>
 *     </ProtectedRoute>
 *   );
 * }
 *
 * // With custom redirect
 * export default function SettingsPage() {
 *   return (
 *     <ProtectedRoute redirectTo="/auth/login">
 *       <SettingsContent />
 *     </ProtectedRoute>
 *   );
 * }
 *
 * // With custom loading fallback
 * export default function DashboardPage() {
 *   return (
 *     <ProtectedRoute fallback={<CustomLoader />}>
 *       <DashboardContent />
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */
export function ProtectedRoute({
  children,
  redirectTo = '/auth/login',
  fallback,
  requireAuth = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only redirect if auth check is complete and user is not authenticated
    if (!requireAuth) {
      return;
    }

    if (!isLoading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      // Store the current pathname to redirect back after login
      const returnUrl = encodeURIComponent(pathname);
      router.push(
        `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}returnUrl=${returnUrl}`
      );
    }
  }, [isAuthenticated, isLoading, router, redirectTo, pathname, requireAuth]);

  // Show loading state
  if (isLoading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className='min-h-screen bg-white dark:bg-gray-900'>
        <Header />
        <div className='container mx-auto px-4 py-8'>
          <div className='text-lg text-gray-600 dark:text-gray-300'>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // If auth is not required, render children immediately
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Show redirect message if not authenticated
  if (!isAuthenticated) {
    return <NavigationLoader />;
  }

  return <>{children}</>;
}
