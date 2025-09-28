import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

interface UseForgotPasswordReturn {
  requestReset: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  clearError: () => void;
  reset: () => void;
}

export function useForgotPassword(): UseForgotPasswordReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
  }, []);

  const requestReset = useCallback(async (email: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      logger.debug('Yêu cầu đặt lại mật khẩu', { email });

      await api.auth.requestPasswordReset(email);
      setIsSuccess(true);

      logger.authSuccess('Yêu cầu đặt lại mật khẩu thành công', { email });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Gửi email đặt lại mật khẩu thất bại. Vui lòng thử lại.';

      setError(errorMessage);

      logger.authError(
        'Yêu cầu đặt lại mật khẩu thất bại',
        err instanceof Error ? err : new Error(errorMessage),
        {
          email,
        }
      );

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    requestReset,
    isLoading,
    error,
    isSuccess,
    clearError,
    reset,
  };
}
