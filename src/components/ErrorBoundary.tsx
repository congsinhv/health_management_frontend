/**
 * Error Boundary Component
 * Catches React errors and provides fallback UI
 */

'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { logger } from '@/lib/logger';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to logger service
    logger.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });

    // Call optional error callback
    this.props.onError?.(error, errorInfo);

    // Update state with error info
    this.setState({
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
          <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg'>
            <div className='mb-4 flex items-center justify-center'>
              <div className='rounded-full bg-red-100 p-3'>
                <svg
                  className='h-8 w-8 text-red-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              </div>
            </div>

            <h2 className='mb-2 text-center text-2xl font-semibold text-gray-900'>
              Đã có lỗi xảy ra
            </h2>

            <p className='mb-6 text-center text-gray-600'>
              Xin lỗi, đã xảy ra lỗi không mong muốn. Vui lòng thử lại.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mb-6 rounded border border-gray-200 bg-gray-50 p-4'>
                <summary className='cursor-pointer font-medium text-gray-700'>
                  Chi tiết lỗi (chỉ hiển thị trong môi trường phát triển)
                </summary>
                <div className='mt-3 space-y-2'>
                  <p className='text-sm font-semibold text-red-600'>
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className='overflow-x-auto text-xs text-gray-600'>
                      {this.state.error.stack}
                    </pre>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div className='mt-3'>
                      <p className='text-sm font-medium text-gray-700'>
                        Component Stack:
                      </p>
                      <pre className='overflow-x-auto text-xs text-gray-600'>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className='flex flex-col gap-3'>
              <Button
                onClick={this.handleReset}
                className='w-full'
                variant='default'
              >
                Thử lại
              </Button>
              <Button
                onClick={this.handleReload}
                className='w-full'
                variant='outline'
              >
                Tải lại trang
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                className='w-full'
                variant='ghost'
              >
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper for Error Boundary with custom fallback
 */
export function ErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-md rounded-lg border border-red-200 bg-white p-6 shadow-sm'>
        <h3 className='mb-2 text-lg font-semibold text-red-600'>
          Đã xảy ra lỗi
        </h3>
        <p className='mb-4 text-sm text-gray-600'>{error.message}</p>
        <Button onClick={resetError} size='sm'>
          Thử lại
        </Button>
      </div>
    </div>
  );
}
