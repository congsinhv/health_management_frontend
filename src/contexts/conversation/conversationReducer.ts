/**
 * Conversation reducer
 * Pure state management logic for conversations
 * Following auth reducer pattern for consistency
 */

import { ConversationState } from '@/contexts/conversation/conversationTypes';
import { ConversationAction } from './conversationTypes';

export function conversationReducer(
  state: ConversationState,
  action: ConversationAction
): ConversationState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? null : state.error, // Clear error when loading starts
      };

    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'SET_CONVERSATIONS':
      return {
        ...state,
        conversations: action.payload.conversations,
        totalCount: action.payload.totalCount,
        hasMore: action.payload.hasMore,
        isLoading: false,
        error: null,
      };

    case 'APPEND_CONVERSATIONS':
      return {
        ...state,
        conversations: [
          ...state.conversations,
          ...action.payload.conversations,
        ],
        hasMore: action.payload.hasMore,
        isLoading: false,
        error: null,
      };

    case 'SET_CURRENT_CONVERSATION':
      return {
        ...state,
        currentConversationId: action.payload,
        isLoading: false,
        error: null,
      };

    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
        totalCount: state.totalCount + 1,
        currentConversationId: action.payload.id,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.id ? action.payload : conv
        ),
        isLoading: false,
        error: null,
      };

    case 'DELETE_CONVERSATION':
      const newConversations = state.conversations.filter(
        conv => conv.id !== action.payload
      );
      return {
        ...state,
        conversations: newConversations,
        totalCount: Math.max(0, state.totalCount - 1),
        // Clear current conversation if it was deleted
        currentConversationId:
          state.currentConversationId === action.payload
            ? newConversations.length > 0
              ? newConversations[0].id
              : null
            : state.currentConversationId,
        isLoading: false,
        error: null,
      };

    case 'CLEAR_CONVERSATIONS':
      return {
        ...state,
        conversations: [],
        currentConversationId: null,
        totalCount: 0,
        hasMore: true,
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
}
