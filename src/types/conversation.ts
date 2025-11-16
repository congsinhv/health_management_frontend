/**
 * Conversation API types for backend integration
 * Based on backend API schemas and following existing qa.ts patterns
 */

// ============================================================================
// Core Response Types (Backend API Responses)
// ============================================================================

/**
 * Conversation model response from backend API
 */
export interface ConversationResponse {
  id: number;
  user_id: number;
  title?: string;
  is_pinned: boolean;
  is_archived: boolean;
  message_count?: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

/**
 * Message model response from backend API
 */
export interface MessageResponse {
  id: number;
  conversation_id: number;
  user_id: number;
  content: string;
  content_type: 'text' | 'image' | 'file' | 'system';
  metadata: Record<string, any>;
  version_number?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Message version response for edit history
 */
export interface MessageVersionResponse {
  id: number;
  message_id: number;
  version_number: number;
  content: string;
  metadata: Record<string, any>;
  created_at: string;
}

// ============================================================================
// Request Types (API Request Bodies)
// ============================================================================

/**
 * Request body for creating a new conversation
 */
export interface CreateConversationRequest {
  title?: string;
  user_id?: number;
  metadata?: Record<string, any>;
}

/**
 * Request body for updating a conversation
 */
export interface UpdateConversationRequest {
  title?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Request body for creating a new message
 */
export interface CreateMessageRequest {
  conversation_id: number;
  content: string;
  content_type?: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, any>;
  user_id?: number;
}

/**
 * Request body for updating a message
 */
export interface UpdateMessageRequest {
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Request body for updating conversation title
 */
export interface UpdateConversationTitleRequest {
  title: string;
}

/**
 * Request body for pinning/unpinning conversation
 */
export interface UpdateConversationPinRequest {
  is_pinned: boolean;
}

// ============================================================================
// AI Integration Types
// ============================================================================

/**
 * Request body for AI message generation
 */
export interface AIGenerateRequest {
  conversation_id: number;
  prompt: string;
  context?: Record<string, any>;
  user_id: number;
}

/**
 * Response from AI generation endpoint
 */
export interface AIGenerateResponse {
  content: string;
  metadata: Record<string, any>;
  model_used?: string;
  tokens_used?: number;
}

/**
 * Request body for AI chat pair creation
 */
export interface AIChatPairRequest {
  conversation_id: number;
  user_prompt: string;
}

/**
 * Response for AI health suggestions
 */
export interface AIHealthSuggestionsResponse {
  suggestions: string[];
}

// ============================================================================
// List and Pagination Types
// ============================================================================

/**
 * Response for conversation list with pagination
 */
export interface ConversationListResponse {
  conversations: ConversationResponse[];
  total_count: number;
  has_more: boolean;
}

/**
 * Response for message list with cursor pagination
 */
export interface MessageListResponse {
  messages: MessageResponse[];
  has_more: boolean;
  cursor?: number;
}

/**
 * Response for message version history
 */
export interface MessageVersionListResponse {
  versions: MessageVersionResponse[];
  total_count: number;
}

/**
 * Response for message count
 */
export interface MessageCountResponse {
  message_count: number;
}

// ============================================================================
// Query Parameters Types
// ============================================================================

/**
 * Query parameters for conversation list
 */
export interface ConversationListParams {
  limit?: number;
  offset?: number;
  include_message_count?: boolean;
}

/**
 * Query parameters for message list
 */
export interface MessageListParams {
  limit?: number;
  before?: number; // cursor pagination
}

/**
 * Query parameters for getting conversation with messages
 */
export interface ConversationWithMessagesParams {
  message_limit?: number;
}

// ============================================================================
// Integration Types (Bridge with existing chat system)
// ============================================================================

/**
 * Extended conversation type for frontend integration
 * Combines backend response with frontend-specific properties
 */
export interface ExtendedConversation extends ConversationResponse {
  lastMessage?: MessageResponse;
  unreadCount?: number;
  isActive?: boolean;
}

/**
 * Extended message type for frontend integration
 * Maps backend message to frontend ChatMessage interface
 */
export interface ExtendedMessage extends MessageResponse {
  // Bridge to existing ChatMessage interface
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isLoading?: boolean;
}

/**
 * Local conversation state for UI management
 */
export interface ConversationState {
  currentConversation?: ExtendedConversation;
  conversations: ExtendedConversation[];
  isLoading: boolean;
  error?: string;
  hasMore: boolean;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Conversation API error response
 */
export interface ConversationError {
  detail: string;
  error_code?: string;
  field?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Conversation metadata structure
 */
export interface ConversationMetadata {
  health_option?: string;
  flow_type?: string;
  user_preferences?: Record<string, any>;
  ai_model?: string;
  tokens_used?: number;
}

/**
 * Message metadata structure
 */
export interface MessageMetadata {
  edited?: boolean;
  edit_history?: boolean;
  ai_generated?: boolean;
  model_used?: string;
  tokens_used?: number;
  suggestions?: string[];
}

// Export a type that can be used to identify conversation-related entities
export type ConversationEntityType = 'conversation' | 'message' | 'version';

// ============================================================================
// Context Types (for React Context)
// ============================================================================

/**
 * Conversation Context interface
 * Extends base state with computed values and actions
 */
export interface ConversationContextType {
  // State from ConversationState
  conversations: ExtendedConversation[];
  isLoading: boolean;
  hasMore: boolean;
  totalCount: number;

  // Override error type to match context pattern
  error: string | undefined;

  // Computed values
  currentConversation: ExtendedConversation | null;
  activeConversations: ExtendedConversation[];
  pinnedConversations: ExtendedConversation[];
  unpinnedConversations: ExtendedConversation[];

  // Actions
  loadConversations: (params?: ConversationListParams) => Promise<void>;
  createConversation: (request: CreateConversationRequest) => Promise<any>;
  updateConversation: (
    id: number,
    request: UpdateConversationRequest
  ) => Promise<any>;
  deleteConversation: (id: number) => Promise<boolean>;
  switchConversation: (conversationId: number | null) => void;
  clearError: () => void;
  clearConversations: () => void;
}
