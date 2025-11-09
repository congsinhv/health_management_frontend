/**
 * QA/Chat-related types
 */

export interface QAMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

/**
 * Request body for asking a question to the Q&A API
 */
export interface AskQuestionRequest {
  question: string; // 1-500 characters
  threshold?: number; // 0.0-1.0, default: 0.55
  top_k?: number; // 1-20, default: 7
}

/**
 * Response from the Q&A API
 */
export interface QuestionResponse {
  question: string;
  answers: Record<string, string[]>;
  summary: string;
}

/**
 * Validation error details (422 response)
 */
export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ValidationError {
  detail: ValidationErrorDetail[];
}

export interface QASession {
  id: string;
  messages: QAMessage[];
  created_at: string;
  updated_at: string;
}

// Legacy types for backward compatibility
export interface QAResponse {
  message: string;
  sources?: string[];
}
