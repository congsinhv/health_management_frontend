import { useState, useEffect, useCallback } from 'react';

interface UseAvatarErrorOptions {
  /**
   * The avatar URL to watch for changes
   */
  avatarUrl?: string | null;
  /**
   * User ID to reset error state when user changes
   */
  userId?: string;
}

/**
 * Custom hook to handle avatar image loading errors with automatic reset
 * when avatar URL or user changes.
 */
export function useAvatarError({
  avatarUrl,
  userId,
}: UseAvatarErrorOptions = {}) {
  const [hasError, setHasError] = useState(false);

  // Reset error state when avatar URL or user changes
  useEffect(() => {
    setHasError(false);
  }, [avatarUrl, userId]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const resetError = useCallback(() => {
    setHasError(false);
  }, []);

  return {
    hasError,
    handleError,
    resetError,
  };
}
