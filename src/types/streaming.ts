/**
 * Streaming types for Q&A service
 */

/**
 * Callback functions for streaming events
 */
export interface StreamCallbacks {
  onChunk: (chunk: string, tokenCount: number) => void;
  onAnswers: (answers: Record<string, string[]>, count: number) => void;
  onComplete: (summary: string, totalTokens: number) => void;
  onError: (error: Error) => void;
  onQuestionReceived?: (question: string) => void;
}

/**
 * Optional configuration for streaming
 */
export interface StreamOptions {
  signal?: AbortSignal; // External abort signal
  getAccessToken?: () => string | null; // Token provider function
}
