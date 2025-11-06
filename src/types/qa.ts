/**
 * QA/Chat-related types
 * Placeholder for future chat/QA features
 */

export interface QAMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface QAResponse {
  message: string;
  sources?: string[];
}

export interface QASession {
  id: string;
  messages: QAMessage[];
  created_at: string;
  updated_at: string;
}
