/**
 * QA service
 * Placeholder for future chat/QA features
 */

import apiClient from './api';
import type { QAResponse, QASession } from '@/types/qa';

export const qaService = {
  /**
   * Send a question to the QA system
   * @param question - The question to ask
   * @returns The answer from the QA system
   */
  askQuestion: async (question: string): Promise<QAResponse> => {
    // TODO: Implement when QA endpoint is available
    const response = await apiClient.post<QAResponse>('/api/v1/qa/ask', {
      question,
    });
    return response.data;
  },

  /**
   * Get QA session history
   * @param sessionId - Optional session ID to get specific session
   * @returns QA session data
   */
  getSession: async (sessionId?: string): Promise<QASession> => {
    // TODO: Implement when QA endpoint is available
    const endpoint = sessionId
      ? `/api/v1/qa/sessions/${sessionId}`
      : '/api/v1/qa/sessions/current';
    const response = await apiClient.get<QASession>(endpoint);
    return response.data;
  },
};
