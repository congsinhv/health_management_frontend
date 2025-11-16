/**
 * Conversation service
 * Handles conversation API interactions for persistent chat features
 */

import apiClient from './api';
import type {
  ConversationResponse,
  MessageResponse,
  CreateConversationRequest,
  UpdateConversationRequest,
  CreateMessageRequest,
  UpdateMessageRequest,
  ConversationListParams,
  MessageListParams,
  AIGenerateRequest,
  AIChatPairRequest,
  ConversationListResponse,
  MessageListResponse,
  AIGenerateResponse,
  AIHealthSuggestionsResponse,
  MessageVersionListResponse,
  MessageCountResponse,
} from '@/types/conversation';

export const conversationService = {
  // =======================================================================
  // CONVERSATION CRUD OPERATIONS
  // =======================================================================

  /**
   * Create a new conversation
   * @param request - Conversation creation request with optional title and metadata
   * @returns Created conversation response
   */
  createConversation: async (
    request: CreateConversationRequest
  ): Promise<ConversationResponse> => {
    const response = await apiClient.post<ConversationResponse>(
      '/api/v1/conversations/',
      request
    );
    return response.data;
  },

  /**
   * Get list of conversations with pagination
   * @param params - Query parameters for pagination and filtering
   * @returns Paginated list of conversations
   */
  getConversations: async (
    params: ConversationListParams = {}
  ): Promise<ConversationListResponse> => {
    const { limit = 20, offset = 0, include_message_count = true } = params;
    const response = await apiClient.get<ConversationListResponse>(
      '/api/v1/conversations/',
      {
        params: {
          limit,
          offset,
          include_message_count: include_message_count,
        },
      }
    );
    return response.data;
  },

  /**
   * Get a specific conversation by ID
   * @param id - Conversation ID
   * @returns Conversation details
   */
  getConversation: async (id: number): Promise<ConversationResponse> => {
    const response = await apiClient.get<ConversationResponse>(
      `/api/v1/conversations/${id}`
    );
    return response.data;
  },

  /**
   * Get a conversation with its messages
   * @param id - Conversation ID
   * @param messageLimit - Maximum number of messages to include
   * @returns Conversation with messages
   */
  getConversationWithMessages: async (
    id: number,
    messageLimit = 50
  ): Promise<ConversationResponse & { messages: MessageResponse[] }> => {
    const response = await apiClient.get<
      ConversationResponse & { messages: MessageResponse[] }
    >(`/api/v1/conversations/${id}/messages`, {
      params: { message_limit: messageLimit },
    });
    return response.data;
  },

  /**
   * Update a conversation
   * @param id - Conversation ID
   * @param request - Update request with title, pinned status, or metadata
   * @returns Updated conversation
   */
  updateConversation: async (
    id: number,
    request: UpdateConversationRequest
  ): Promise<ConversationResponse> => {
    const response = await apiClient.put<ConversationResponse>(
      `/api/v1/conversations/${id}`,
      request
    );
    return response.data;
  },

  /**
   * Delete a conversation (soft delete)
   * @param id - Conversation ID
   */
  deleteConversation: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/conversations/${id}`);
  },

  /**
   * Update conversation title
   * @param id - Conversation ID
   * @param title - New title
   * @returns Updated conversation
   */
  updateConversationTitle: async (
    id: number,
    title: string
  ): Promise<ConversationResponse> => {
    const response = await apiClient.put<ConversationResponse>(
      `/api/v1/conversations/${id}/title`,
      title,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  },

  /**
   * Pin or unpin a conversation
   * @param id - Conversation ID
   * @param isPinned - Whether to pin the conversation
   * @returns Updated conversation
   */
  updateConversationPin: async (
    id: number,
    isPinned: boolean
  ): Promise<ConversationResponse> => {
    const response = await apiClient.patch<ConversationResponse>(
      `/api/v1/conversations/${id}/pin`,
      { is_pinned: isPinned }
    );
    return response.data;
  },

  /**
   * Get pinned conversations
   * @param limit - Maximum number of conversations to return
   * @returns List of pinned conversations
   */
  getPinnedConversations: async (
    limit = 10
  ): Promise<ConversationResponse[]> => {
    const response = await apiClient.get<ConversationResponse[]>(
      '/api/v1/conversations/pinned',
      {
        params: { limit },
      }
    );
    return response.data;
  },

  /**
   * Get message count for a conversation
   * @param id - Conversation ID
   * @returns Message count
   */
  getConversationMessageCount: async (
    id: number
  ): Promise<MessageCountResponse> => {
    const response = await apiClient.get<MessageCountResponse>(
      `/api/v1/conversations/${id}/message-count`
    );
    return response.data;
  },

  // =======================================================================
  // MESSAGE CRUD OPERATIONS
  // =======================================================================

  /**
   * Create a new message
   * @param request - Message creation request
   * @returns Created message
   */
  createMessage: async (
    request: CreateMessageRequest
  ): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
      '/api/v1/messages/',
      request
    );
    return response.data;
  },

  /**
   * Get messages for a conversation with pagination
   * @param conversationId - Conversation ID
   * @param params - Pagination parameters
   * @returns Paginated list of messages
   */
  getMessages: async (
    conversationId: number,
    params: MessageListParams = {}
  ): Promise<MessageListResponse> => {
    const { limit = 50, before } = params;
    const queryParams: any = { limit };
    if (before) {
      queryParams.before = before;
    }

    const response = await apiClient.get<MessageListResponse>(
      `/api/v1/messages/conversations/${conversationId}`,
      {
        params: queryParams,
      }
    );
    return response.data;
  },

  /**
   * Get a specific message
   * @param id - Message ID
   * @param conversationId - Conversation ID (required by backend)
   * @returns Message details
   */
  getMessage: async (
    id: number,
    conversationId: number
  ): Promise<MessageResponse> => {
    const response = await apiClient.get<MessageResponse>(
      `/api/v1/messages/${id}`,
      {
        params: { conversation_id: conversationId },
      }
    );
    return response.data;
  },

  /**
   * Update a message content
   * @param id - Message ID
   * @param conversationId - Conversation ID (required by backend)
   * @param request - Update request with new content
   * @returns Updated message
   */
  updateMessage: async (
    id: number,
    conversationId: number,
    request: UpdateMessageRequest
  ): Promise<MessageResponse> => {
    const response = await apiClient.put<MessageResponse>(
      `/api/v1/messages/${id}`,
      request,
      {
        params: { conversation_id: conversationId },
      }
    );
    return response.data;
  },

  /**
   * Delete a message (soft delete)
   * @param id - Message ID
   * @param conversationId - Conversation ID (required by backend)
   */
  deleteMessage: async (id: number, conversationId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/messages/${id}`, {
      params: { conversation_id: conversationId },
    });
  },

  /**
   * Get the latest message in a conversation
   * @param conversationId - Conversation ID
   * @returns Latest message
   */
  getLatestMessage: async (
    conversationId: number
  ): Promise<MessageResponse> => {
    const response = await apiClient.get<MessageResponse>(
      `/api/v1/messages/conversations/${conversationId}/latest`
    );
    return response.data;
  },

  // =======================================================================
  // MESSAGE VERSION CONTROL
  // =======================================================================

  /**
   * Get message version history
   * @param id - Message ID
   * @param conversationId - Conversation ID (required by backend)
   * @returns List of message versions
   */
  getMessageVersionHistory: async (
    id: number,
    conversationId: number
  ): Promise<MessageVersionListResponse> => {
    const response = await apiClient.get<MessageVersionListResponse>(
      `/api/v1/messages/${id}/versions`,
      {
        params: { conversation_id: conversationId },
      }
    );
    return response.data;
  },

  /**
   * Get message with full version history
   * @param id - Message ID
   * @param conversationId - Conversation ID (required by backend)
   * @returns Message with versions
   */
  getMessageWithVersions: async (
    id: number,
    conversationId: number
  ): Promise<MessageResponse & { versions: MessageResponse[] }> => {
    const response = await apiClient.get<
      MessageResponse & { versions: MessageResponse[] }
    >(`/api/v1/messages/${id}/versions/full`, {
      params: { conversation_id: conversationId },
    });
    return response.data;
  },

  /**
   * Restore a message to a specific version
   * @param id - Message ID
   * @param conversationId - Conversation ID (required by backend)
   * @param versionNumber - Version number to restore
   * @returns Restored message
   */
  restoreMessageVersion: async (
    id: number,
    conversationId: number,
    versionNumber: number
  ): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
      `/api/v1/messages/${id}/restore`,
      { version_number: versionNumber },
      {
        params: { conversation_id: conversationId },
      }
    );
    return response.data;
  },

  // =======================================================================
  // AI INTEGRATION
  // =======================================================================

  /**
   * Generate AI response for a message
   * @param request - AI generation request
   * @returns AI generated response
   */
  generateAIResponse: async (
    request: AIGenerateRequest
  ): Promise<AIGenerateResponse> => {
    const response = await apiClient.post<AIGenerateResponse>(
      '/api/v1/messages/ai/generate',
      {
        conversation_id: request.conversation_id,
        prompt: request.prompt,
        context: request.context,
        user_id: request.user_id,
      }
    );
    return response.data;
  },

  /**
   * Create an AI chat pair (user message + AI response)
   * @param request - AI chat pair request
   * @returns User and AI messages
   */
  createAIChatPair: async (
    request: AIChatPairRequest
  ): Promise<[MessageResponse, MessageResponse?]> => {
    const response = await apiClient.post<[MessageResponse, MessageResponse?]>(
      '/api/v1/messages/ai/chat',
      null,
      {
        params: {
          conversation_id: request.conversation_id,
          user_prompt: request.user_prompt,
        },
      }
    );
    return response.data;
  },

  /**
   * Get AI health suggestions for a conversation
   * @param conversationId - Conversation ID
   * @returns Health suggestions
   */
  getAIHealthSuggestions: async (
    conversationId: number
  ): Promise<AIHealthSuggestionsResponse> => {
    const response = await apiClient.get<AIHealthSuggestionsResponse>(
      `/api/v1/messages/conversations/${conversationId}/ai/suggestions`
    );
    return response.data;
  },

  // =======================================================================
  // UTILITY FUNCTIONS
  // =======================================================================

  /**
   * Auto-generate conversation title from first message
   * @param message - First message content
   * @returns Generated title
   */
  generateTitle: (message: string): string => {
    const words = message.split(' ').slice(0, 5);
    return words.join(' ') + (message.split(' ').length > 5 ? '...' : '');
  },

  /**
   * Format conversation date for display
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffHours < 24 * 7) {
      return date.toLocaleDateString('vi-VN', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  },

  /**
   * Filter conversations by search term
   * @param conversations - List of conversations
   * @param searchTerm - Search term
   * @returns Filtered conversations
   */
  searchConversations: (
    conversations: ConversationResponse[],
    searchTerm: string
  ): ConversationResponse[] => {
    if (!searchTerm.trim()) return conversations;

    const term = searchTerm.toLowerCase();
    return conversations.filter(
      conv =>
        conv.title?.toLowerCase().includes(term) ||
        (conv.metadata.tags &&
          Array.isArray(conv.metadata.tags) &&
          (conv.metadata.tags as string[]).some((tag: string) =>
            tag.toLowerCase().includes(term)
          ))
    );
  },

  /**
   * Get message preview text
   * @param content - Message content
   * @param maxLength - Maximum length of preview
   * @returns Preview text
   */
  getMessagePreview: (content: string, maxLength = 50): string => {
    return content.length > maxLength
      ? content.slice(0, maxLength) + '...'
      : content;
  },
};
