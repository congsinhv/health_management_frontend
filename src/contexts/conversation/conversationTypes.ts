/**
 * Conversation action types and initial state
 * Following auth pattern for consistency
 */

import { ExtendedConversation } from '@/types/conversation';

// Conversation state interface
export interface ConversationState {
  conversations: ExtendedConversation[];
  currentConversationId: number | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
}

// Conversation reducer actions
export type ConversationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | {
      type: 'SET_CONVERSATIONS';
      payload: {
        conversations: ExtendedConversation[];
        totalCount: number;
        hasMore: boolean;
      };
    }
  | { type: 'SET_CURRENT_CONVERSATION'; payload: number | null }
  | { type: 'ADD_CONVERSATION'; payload: ExtendedConversation }
  | { type: 'UPDATE_CONVERSATION'; payload: ExtendedConversation }
  | { type: 'DELETE_CONVERSATION'; payload: number }
  | {
      type: 'APPEND_CONVERSATIONS';
      payload: { conversations: ExtendedConversation[]; hasMore: boolean };
    }
  | { type: 'CLEAR_CONVERSATIONS' };

// Initial state
export const initialState: ConversationState = {
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  error: null,
  hasMore: true,
  totalCount: 0,
};
