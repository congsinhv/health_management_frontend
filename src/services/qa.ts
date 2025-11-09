/**
 * QA service
 * Handles Q&A API interactions for chat features
 */

import apiClient from './api';
import type {
  AskQuestionRequest,
  QuestionResponse,
  QASession,
} from '@/types/qa';

export const qaService = {
  /**
   * Send a question to the Q&A system
   * @param request - Question request with optional threshold and top_k
   * @returns The answer from the Q&A system
   */
  askQuestion: async (
    request: AskQuestionRequest
  ): Promise<QuestionResponse> => {
    const response = await apiClient.post<QuestionResponse>('/api/v1/qa/ask', {
      question: request.question,
      threshold: request.threshold ?? 0.55,
      top_k: request.top_k ?? 7,
    });
    return response.data;
  },

  /**
   * Get QA session history
   * @param sessionId - Optional session ID to get specific session
   * @returns QA session data
   */
  getSession: async (sessionId?: string): Promise<QASession> => {
    const endpoint = sessionId
      ? `/api/v1/qa/sessions/${sessionId}`
      : '/api/v1/qa/sessions/current';
    const response = await apiClient.get<QASession>(endpoint);
    return response.data;
  },
};
