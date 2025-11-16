/**
 * Conversation Context Provider
 * Manages conversation state and provides conversation methods to the app
 * Following AuthContext pattern for consistency
 */

'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from 'react';
import { ConversationContextType } from '@/types/conversation';
import { conversationReducer } from './conversation/conversationReducer';
import { initialState } from './conversation/conversationTypes';
import { conversationActions } from './conversation/conversationActions';
import {
  CreateConversationRequest,
  UpdateConversationRequest,
  ConversationListParams,
} from '@/types/conversation';
import { tokenStorage } from '@/lib/storage';

// Create context
const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

// Conversation provider component
export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(conversationReducer, initialState);

  // Load conversations on mount if user is authenticated
  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      conversationActions.loadConversations(dispatch);
    }
  }, []);

  // Save current conversation to localStorage when it changes
  useEffect(() => {
    if (state.currentConversationId) {
      localStorage.setItem(
        'currentConversationId',
        state.currentConversationId.toString()
      );
    } else {
      localStorage.removeItem('currentConversationId');
    }
  }, [state.currentConversationId]);

  // Wrap all actions to use the dispatch from this component
  const loadConversations = useCallback(
    async (params?: ConversationListParams): Promise<void> => {
      return conversationActions.loadConversations(dispatch, params);
    },
    []
  );

  const createConversation = useCallback(
    async (request: CreateConversationRequest): Promise<any> => {
      return conversationActions.createConversation(dispatch, request);
    },
    []
  );

  const updateConversation = useCallback(
    async (id: number, request: UpdateConversationRequest): Promise<any> => {
      return conversationActions.updateConversation(dispatch, id, request);
    },
    []
  );

  const deleteConversation = useCallback(
    async (id: number): Promise<boolean> => {
      return conversationActions.deleteConversation(dispatch, id);
    },
    []
  );

  const switchConversation = useCallback(
    (conversationId: number | null): void => {
      conversationActions.switchConversation(dispatch, conversationId);
    },
    []
  );

  const clearError = useCallback(() => {
    conversationActions.clearError(dispatch);
  }, []);

  const clearConversations = useCallback(() => {
    conversationActions.clearConversations(dispatch);
  }, []);

  // Computed values
  const currentConversation =
    state.conversations.find(conv => conv.id === state.currentConversationId) ||
    null;

  const activeConversations = state.conversations.filter(
    conv => !conv.is_archived
  );
  const pinnedConversations = activeConversations.filter(
    conv => conv.is_pinned
  );
  const unpinnedConversations = activeConversations.filter(
    conv => !conv.is_pinned
  );

  const contextValue: ConversationContextType = {
    // State (excluding error which is overridden below)
    conversations: state.conversations,
    isLoading: state.isLoading,
    hasMore: state.hasMore,
    totalCount: state.totalCount,
    error: state.error || undefined, // Convert null to undefined

    // Computed values
    currentConversation,
    activeConversations,
    pinnedConversations,
    unpinnedConversations,

    // Actions
    loadConversations,
    createConversation,
    updateConversation,
    deleteConversation,
    switchConversation,
    clearError,
    clearConversations,
  };

  return (
    <ConversationContext.Provider value={contextValue}>
      {children}
    </ConversationContext.Provider>
  );
}

// Custom hook to use conversation context
export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      'useConversation must be used within a ConversationProvider'
    );
  }
  return context;
}
