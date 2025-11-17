/**
 * Server-Sent Events (SSE) Type Definitions
 * Based on actual /api/v1/qa/ask-stream response format
 *
 * @see plans/20251116-sse-streaming-integration/BACKEND_RESPONSE_FORMAT.md
 */

/**
 * SSE event type identifiers from backend
 */
export type SSEEventType =
  | 'question_received' // Initial confirmation
  | 'answers_found' // Search results
  | 'summary_chunk' // Progressive AI response (multiple events)
  | 'stream_complete'; // Final event with complete summary

/**
 * Generic SSE event wrapper (backend format)
 * All events follow this structure
 */
export interface SSEEvent<T = any> {
  event_type: SSEEventType;
  data: T;
  metadata: Record<string, any>;
  timestamp: string; // ISO 8601 format
}

/**
 * Payload for question_received event
 */
export interface QuestionReceivedPayload {
  question: string;
}

/**
 * Payload for answers_found event
 */
export interface AnswersFoundPayload {
  answers: Record<string, string[]>; // Category name → Answer list
  count: number; // Total answer count
}

/**
 * Payload for summary_chunk events (streaming)
 * Multiple events received character/token by character/token
 */
export interface SummaryChunkPayload {
  chunk: string; // Incremental text content (can be single char or word)
  token_count: number; // Running token count
}

/**
 * Payload for stream_complete event
 */
export interface StreamCompletePayload {
  total_tokens: number; // Total tokens in complete stream
  summary: string; // Complete summary text
}

/**
 * Discriminated union for type-safe event handling
 */
export type SSEEventPayload =
  | (SSEEvent<QuestionReceivedPayload> & { event_type: 'question_received' })
  | (SSEEvent<AnswersFoundPayload> & { event_type: 'answers_found' })
  | (SSEEvent<SummaryChunkPayload> & { event_type: 'summary_chunk' })
  | (SSEEvent<StreamCompletePayload> & { event_type: 'stream_complete' });

/**
 * Streaming connection state (frontend)
 */
export interface StreamingState {
  isStreaming: boolean;
  streamingContent: string; // Accumulated chunks during stream
  streamingTokenCount: number; // Current token count
  error: Error | null;
  answers: Record<string, string[]> | null;
}

/**
 * SSE service configuration
 */
export interface SSEConfig {
  url: string;
  question: string;
  threshold?: number;
  top_k?: number;
  onQuestionReceived?: (question: string) => void;
  onChunk: (chunk: string, tokenCount: number) => void;
  onAnswers: (answers: Record<string, string[]>, count: number) => void;
  onComplete: (summary: string, totalTokens: number) => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}
