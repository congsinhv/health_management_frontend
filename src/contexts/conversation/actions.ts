/**
 * Conversation actions
 * Async operations that dispatch to conversation reducer
 * Following auth actions pattern
 */

import { Dispatch } from 'react';
import { ConversationAction } from './types';
import {
  ConversationResponse,
  CreateConversationRequest,
  UpdateConversationRequest,
  ConversationListParams,
} from '@/types/conversation';
import { conversationService } from '@/services/conversation';
import { logger } from '@/lib/logger';

export const conversationActions = {
  /**
   * Load conversations from API
   */
  loadConversations: async (
    dispatch: Dispatch<ConversationAction>,
    params?: ConversationListParams
  ): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      logger.conversation(
        'Loading conversations',
        params as Record<string, unknown>
      );

      const response = await conversationService.getConversations(params);
      dispatch({
        type: 'SET_CONVERSATIONS',
        payload: {
          conversations: response.conversations,
          totalCount: response.total_count,
          hasMore: response.has_more,
        },
      });
    } catch (error) {
      logger.conversationError('Failed to load conversations', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Không thể tải danh sách cuộc trò chuyện',
      });
    }
  },

  /**
   * Create a new conversation
   */
  createConversation: async (
    dispatch: Dispatch<ConversationAction>,
    request: CreateConversationRequest
  ): Promise<ConversationResponse | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      logger.conversation(
        'Creating conversation',
        request as Record<string, unknown>
      );

      const newConversation =
        await conversationService.createConversation(request);
      dispatch({ type: 'ADD_CONVERSATION', payload: newConversation });
      return newConversation;
    } catch (error) {
      logger.conversationError('Failed to create conversation', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Không thể tạo cuộc trò chuyện mới',
      });
      return null;
    }
  },

  /**
   * Update an existing conversation
   */
  updateConversation: async (
    dispatch: Dispatch<ConversationAction>,
    id: number,
    request: UpdateConversationRequest
  ): Promise<ConversationResponse | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      logger.conversation('Updating conversation', {
        id,
        request: request as Record<string, unknown>,
      });

      const updatedConversation = await conversationService.updateConversation(
        id,
        request
      );
      dispatch({ type: 'UPDATE_CONVERSATION', payload: updatedConversation });
      return updatedConversation;
    } catch (error) {
      logger.conversationError('Failed to update conversation', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Không thể cập nhật cuộc trò chuyện',
      });
      return null;
    }
  },

  /**
   * Delete a conversation
   */
  deleteConversation: async (
    dispatch: Dispatch<ConversationAction>,
    id: number
  ): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      logger.conversation('Deleting conversation', { id });

      await conversationService.deleteConversation(id);
      dispatch({ type: 'DELETE_CONVERSATION', payload: id });
      return true;
    } catch (error) {
      logger.conversationError('Failed to delete conversation', error);
      dispatch({ type: 'SET_ERROR', payload: 'Không thể xóa cuộc trò chuyện' });
      return false;
    }
  },

  /**
   * Switch to a different conversation
   */
  switchConversation: (
    dispatch: Dispatch<ConversationAction>,
    conversationId: number | null
  ): void => {
    dispatch({ type: 'SET_LOADING', payload: true });
    logger.conversation('Switching conversation', { conversationId } as Record<
      string,
      unknown
    >);
    dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversationId });
  },

  /**
   * Clear error state
   */
  clearError: (dispatch: Dispatch<ConversationAction>): void => {
    dispatch({ type: 'SET_ERROR', payload: null });
  },

  /**
   * Clear all conversations (for logout)
   */
  clearConversations: (dispatch: Dispatch<ConversationAction>): void => {
    logger.conversation('Clearing all conversations');
    dispatch({ type: 'CLEAR_CONVERSATIONS' });
  },
};
