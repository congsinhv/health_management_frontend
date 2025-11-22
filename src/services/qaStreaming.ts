/**
 * Q&A Streaming Service
 * Handles Server-Sent Events (SSE) for progressive AI responses
 *
 * Features:
 * - JWT authentication via Authorization header
 * - Progressive content streaming with summary_chunk events
 * - Related answers via answers_found events
 * - Automatic retry on transient failures
 * - Manual abort via AbortController
 *
 * @see plans/20251116-sse-streaming-integration/BACKEND_RESPONSE_FORMAT.md
 */

import {
  fetchEventSource,
  EventSourceMessage,
} from '@microsoft/fetch-event-source';
import type { AskQuestionRequest, ValidationError } from '@/types/qa';
import type {
  SSEEvent,
  SummaryChunkPayload,
  AnswersFoundPayload,
  StreamCompletePayload,
  QuestionReceivedPayload,
} from '@/types/sse';
import type { StreamCallbacks, StreamOptions } from '@/types/streaming';

/**
 * Custom error classes for retry logic
 */
class RetriableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RetriableError';
  }
}

class FatalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FatalError';
  }
}

export const qaStreamingService = {
  /**
   * Ask a question with SSE streaming response
   * Returns AbortController for connection cleanup
   *
   * @example
   * const abortController = await qaStreamingService.askQuestionStream(
   *   { question: 'What is BMI?', threshold: 0.55, top_k: 7 },
   *   {
   *     onChunk: (chunk, tokenCount) => console.log('Chunk:', chunk),
   *     onAnswers: (answers) => console.log('Answers:', answers),
   *     onComplete: (summary, totalTokens) => console.log('Done:', summary),
   *     onError: (err) => console.error('Error:', err),
   *   }
   * );
   *
   * // Later, to cancel:
   * abortController.abort();
   */
  askQuestionStream: async (
    request: AskQuestionRequest,
    callbacks: StreamCallbacks,
    options?: StreamOptions
  ): Promise<AbortController> => {
    const { onChunk, onAnswers, onComplete, onError, onQuestionReceived } =
      callbacks;
    const abortController = new AbortController();

    // Get access token (default: from localStorage)
    const getToken =
      options?.getAccessToken ||
      (() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('access_token');
        }
        return null;
      });

    const accessToken = getToken();
    if (!accessToken) {
      onError(new Error('Vui lòng đăng nhập để sử dụng tính năng này'));
      return abortController;
    }

    // Determine base URL from environment (remove trailing slash)
    const baseURL = (
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    ).replace(/\/$/, '');
    const url = `${baseURL}/api/v1/qa/ask-stream`;

    try {
      await fetchEventSource(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          question: request.question,
          threshold: request.threshold ?? 0.55,
          top_k: request.top_k ?? 7,
        }),
        signal: options?.signal || abortController.signal,

        // Validate response before processing
        async onopen(response) {
          if (
            response.ok &&
            response.headers.get('content-type')?.includes('text/event-stream')
          ) {
            return; // Success - start processing events
          }

          // Handle error responses
          if (response.status === 401 || response.status === 403) {
            throw new FatalError('Phiên đăng nhập đã hết hạn');
          }

          if (response.status === 422) {
            const errorData: ValidationError = await response.json();
            const errorMessage =
              errorData.detail?.map(d => d.msg).join(', ') ||
              'Dữ liệu không hợp lệ';
            throw new FatalError(errorMessage);
          }

          if (response.status >= 400 && response.status < 500) {
            throw new FatalError(`Lỗi client: ${response.status}`);
          }

          // Server errors are retriable
          throw new RetriableError(`Lỗi server: ${response.status}`);
        },

        // Handle incoming messages
        onmessage(event: EventSourceMessage) {
          try {
            // Parse event data (backend sends JSON with SSEEvent wrapper)
            const parsed: SSEEvent = JSON.parse(event.data);

            // Dispatch by event type
            switch (parsed.event_type) {
              case 'question_received': {
                const payload = parsed.data as QuestionReceivedPayload;
                onQuestionReceived?.(payload.question);
                break;
              }

              case 'answers_found': {
                const payload = parsed.data as AnswersFoundPayload;
                onAnswers(payload.answers, payload.count);
                break;
              }

              case 'summary_chunk': {
                const payload = parsed.data as SummaryChunkPayload;
                onChunk(payload.chunk, payload.token_count);
                break;
              }

              case 'stream_complete': {
                const payload = parsed.data as StreamCompletePayload;
                onComplete(payload.summary, payload.total_tokens);
                abortController.abort(); // Close connection
                break;
              }

              default:
                console.warn('Unknown SSE event type:', parsed.event_type);
            }
          } catch (parseError) {
            console.error('Failed to parse SSE event:', parseError);
            onError(new Error('Lỗi khi xử lý phản hồi từ server'));
          }
        },

        // Handle errors with retry logic
        onerror(err) {
          if (err instanceof FatalError) {
            onError(err);
            throw err; // Stop retrying
          }

          if (err instanceof RetriableError) {
            // Allow retry with default backoff
            console.warn('Retriable SSE error, retrying...', err);
            return; // Continue retrying
          }

          // Unknown errors are fatal
          onError(err);
          throw new FatalError(err.message);
        },

        // Connection closed
        onclose() {
          // Normal closure - no action needed
          // eslint-disable-next-line no-console
          console.debug('SSE connection closed');
        },
      });
    } catch (error) {
      // Handle connection initiation errors
      if (error instanceof Error) {
        onError(error);
      } else {
        onError(new Error('Đã xảy ra lỗi không xác định'));
      }
    }

    return abortController;
  },
};
