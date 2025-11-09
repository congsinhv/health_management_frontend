/**
 * Hook for reading and updating URL query parameters
 */
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Get a query parameter value
   */
  const get = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  /**
   * Get all query parameters as an object
   */
  const getAll = useCallback((): Record<string, string> => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  /**
   * Set a query parameter
   */
  const set = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  /**
   * Set multiple query parameters at once
   */
  const setMultiple = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  /**
   * Remove a query parameter
   */
  const remove = useCallback(
    (key: string) => {
      set(key, null);
    },
    [set]
  );

  /**
   * Clear all query parameters
   */
  const clear = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return {
    get,
    getAll,
    set,
    setMultiple,
    remove,
    clear,
  };
}
