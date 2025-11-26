import { useAuth } from '@/contexts/auth';
import { useConversation } from '@/contexts/conversation';
import { conversationService } from '@/services/conversation';
import { qaService } from '@/services/qa';
import { qaStreamingService } from '@/services/qaStreaming';
import { ChatMessage } from '@/types/chat';
import type { QuestionResponse, ValidationError } from '@/types/qa';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseQAChatReturn {
  messages: ChatMessage[];
  isInitializing: boolean;
  isWaitingForResponse: boolean;
  error: string | null;
  askQuestion: (question: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  clearMessages: () => void;
  // Streaming properties
  isStreaming: boolean;
  streamingContent: string;
  streamingMessageId: string | null;
  streamingAnswers: Record<string, string[]> | null;
  streamingTokenCount: number;
}

export const useQAChat = (): UseQAChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [streamingAnswers, setStreamingAnswers] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [streamingTokenCount, setStreamingTokenCount] = useState(0);

  // Refs for stable references
  const streamAbortControllerRef = useRef<AbortController | null>(null);
  const streamContentAccumulatorRef = useRef<string>('');

  const { user } = useAuth();
  const {
    currentConversation,
    createConversation,
    switchConversation,
    loadConversations,
  } = useConversation();

  const generateMessageId = () =>
    `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

  const addMessage = useCallback(
    (content: string, role: 'user' | 'assistant') => {
      const newMessage: ChatMessage = {
        id: generateMessageId(),
        role,
        content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newMessage]);
    },
    []
  );

  /**
   * Reset streaming state
   */
  const resetStreamingState = useCallback(() => {
    setIsStreaming(false);
    setStreamingContent('');
    setStreamingMessageId(null);
    setStreamingAnswers(null);
    setStreamingTokenCount(0);
    streamContentAccumulatorRef.current = '';
  }, []);

  /**
   * Finalize streaming message and save to conversation
   */
  const finalizeStreamingMessage = useCallback(
    async (
      summary: string,
      totalTokens: number,
      userId: string,
      conversationId: number
    ) => {
      // Save to conversation FIRST (if we have one)
      if (conversationId && userId) {
        try {
          await conversationService.createMessage({
            conversation_id: conversationId,
            content: summary,
            content_type: 'text',
            user_id: Number(userId),
            metadata: {
              source: 'ai_generated',
              model_used: 'streaming-qa',
              qa_results: streamingAnswers || undefined,
              total_tokens: totalTokens,
            },
          });
        } catch (convError) {
          console.error('Failed to save streaming message:', convError);
        }
      }

      // Add complete AI message to messages
      addMessage(summary, 'assistant');

      // Double requestAnimationFrame to ensure the new message is fully rendered
      // First frame: React commits the new message to DOM
      // Second frame: Browser paints the new message
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resetStreamingState();
          setIsWaitingForResponse(false);
        });
      });
    },
    [addMessage, streamingAnswers, resetStreamingState]
  );

  // Cleanup streaming connection on unmount or conversation switch
  useEffect(() => {
    return () => {
      if (streamAbortControllerRef.current) {
        streamAbortControllerRef.current.abort();
        streamAbortControllerRef.current = null;
      }
    };
  }, [currentConversation?.id]); // Cleanup when conversation changes

  // Load conversation history when current conversation changes
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (currentConversation?.id && user) {
        try {
          setIsInitializing(true);
          const response = await conversationService.getMessages(
            currentConversation.id,
            { limit: 100 }
          );

          const conversationMessages: ChatMessage[] = response.messages.map(
            msg => ({
              id: msg.id.toString(),
              role:
                msg.metadata?.source === 'user_input' ? 'user' : 'assistant',
              content: msg.content,
              timestamp: new Date(msg.created_at),
            })
          );
          if (!isWaitingForResponse) {
            setMessages(conversationMessages);
          }
        } catch (error) {
          console.error('Failed to load conversation history:', error);
          // Don't set error state here as it's not critical for user experience
        } finally {
          setIsInitializing(false);
        }
      } else {
        // No conversation, clear messages
        setMessages([]);
      }
    };

    loadConversationHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversation?.id, user]);

  const askQuestion = useCallback(
    async (question: string) => {
      // Clear previous error
      setError(null);

      // Validate question length
      if (!question.trim()) {
        setError('Vui lòng nhập câu hỏi của bạn');
        return;
      }

      if (question.length > 500) {
        setError('Câu hỏi không được vượt quá 500 ký tự');
        return;
      }

      // Show loading state
      setIsWaitingForResponse(true);

      // Ensure we have a conversation
      let conversationId = currentConversation?.id;
      if (!conversationId && user) {
        try {
          const newConversation = await createConversation({
            title: 'Cuộc trò chuyện mới',
            user_id: Number(user.id),
            metadata: {
              source: 'user_input',
            },
          });
          conversationId = newConversation.id;
          switchConversation(newConversation.id);
        } catch (error) {
          console.error('Failed to create conversation:', error);
          // Fallback to non-persistent mode
        }
      }

      // Add user message immediately
      addMessage(question, 'user');

      let needUpdateTitle = false;

      try {
        // Create user message in conversation if we have one
        if (conversationId) {
          try {
            const messageCount =
              await conversationService.getConversationMessageCount(
                conversationId
              );
            if (messageCount.message_count === 0) {
              needUpdateTitle = true;
            }
            await conversationService.createMessage({
              conversation_id: conversationId,
              content: question,
              content_type: 'text',
              user_id: Number(user?.id),
              metadata: {
                source: 'user_input',
              },
            });
          } catch (convError) {
            console.error(
              'Failed to create message in conversation:',
              convError
            );
            // Continue with QA service even if conversation storage fails
          }
        }

        try {
          // Reset any previous streaming state
          resetStreamingState();

          // Start SSE streaming
          const abortController = await qaStreamingService.askQuestionStream(
            {
              question,
              threshold: 0.55,
              top_k: 7,
            },
            {
              // Handle content chunks
              onChunk: (chunk: string, tokenCount: number) => {
                if (!isStreaming) {
                  setIsStreaming(true);
                }
                // Prevent memory leak by limiting accumulator size to ~50KB
                const MAX_CONTENT_LENGTH = 50000;
                const newContent = streamContentAccumulatorRef.current + chunk;

                if (newContent.length > MAX_CONTENT_LENGTH) {
                  console.warn(
                    'Streaming content exceeded max length, truncating...'
                  );
                  streamContentAccumulatorRef.current =
                    newContent.slice(-MAX_CONTENT_LENGTH);
                } else {
                  streamContentAccumulatorRef.current = newContent;
                }

                setStreamingContent(streamContentAccumulatorRef.current);
                setStreamingTokenCount(tokenCount);
              },

              // Handle answers
              // Handle answers
              onAnswers: (answers: Record<string, string[]>) => {
                setStreamingAnswers(answers);
              },

              // Handle completion
              onComplete: (summary: string, totalTokens: number) => {
                console.warn('Streaming complete');
                finalizeStreamingMessage(
                  summary,
                  totalTokens,
                  user?.id || '',
                  conversationId || 0
                );
                if (needUpdateTitle && conversationId) {
                  loadConversations();
                }
              },

              // Handle errors (fallback to non-streaming)
              onError: (err: Error) => {
                console.error(
                  'Streaming error, falling back to non-streaming:',
                  err
                );
                resetStreamingState();

                // Fallback to non-streaming (use existing logic below)
                qaService
                  .askQuestion({ question, threshold: 0.55, top_k: 7 })
                  .then(response => {
                    addMessage(response.summary, 'assistant');

                    if (conversationId) {
                      conversationService
                        .createMessage({
                          conversation_id: conversationId,
                          content: response.summary,
                          content_type: 'text',
                          user_id: Number(user?.id),
                          metadata: {
                            source: 'ai_generated',
                            model_used: 'fallback-non-streaming',
                            qa_results: response.answers,
                          },
                        })
                        .catch(console.error);
                    }
                  })
                  .catch(() => {
                    setError('Đã xảy ra lỗi. Vui lòng thử lại.');
                    addMessage(
                      'Xin lỗi, đã xảy ra lỗi khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.',
                      'assistant'
                    );
                  })
                  .finally(() => {
                    setIsWaitingForResponse(false);
                  });
              },
            },
            {
              getAccessToken: () => localStorage.getItem('access_token'),
            }
          );

          streamAbortControllerRef.current = abortController;

          // Streaming initiated successfully - return early
          return;
        } catch (streamingSetupError) {
          console.error('Failed to setup streaming:', streamingSetupError);
          resetStreamingState();
          // Fall through to non-streaming logic below
        }

        // Call the Q&A API
        const response: QuestionResponse = await qaService.askQuestion({
          question,
          threshold: 0.55,
          top_k: 7,
        });

        // Add AI response with the summary
        addMessage(response.summary, 'assistant');

        // Create AI message in conversation if we have one
        if (conversationId) {
          try {
            await conversationService.createMessage({
              conversation_id: conversationId,
              content: response.summary,
              content_type: 'text',
              user_id: Number(user?.id),
              metadata: {
                source: 'ai_generated',
                model_used: 'vietnamese-sbert',
                qa_results: response.answers,
              },
            });
          } catch (convError) {
            console.error(
              'Failed to create AI message in conversation:',
              convError
            );
            // Don't fail the whole operation if conversation storage fails
          }
        }
        if (needUpdateTitle && conversationId) {
          loadConversations();
        }
      } catch (err) {
        const axiosError = err as AxiosError<ValidationError>;

        // Handle different error types
        if (axiosError.response?.status === 422) {
          // Validation error
          const validationError = axiosError.response.data as ValidationError;
          const errorMessage =
            validationError.detail?.map(d => d.msg).join(', ') ||
            'Dữ liệu không hợp lệ';
          setError(errorMessage);
          addMessage(
            `Xin lỗi, ${errorMessage.toLowerCase()}. Vui lòng thử lại.`,
            'assistant'
          );
        } else if (
          axiosError.response?.status === 401 ||
          axiosError.response?.status === 403
        ) {
          // Authentication error
          setError('Vui lòng đăng nhập để sử dụng tính năng này');
          addMessage(
            'Vui lòng đăng nhập để sử dụng tính năng này.',
            'assistant'
          );
        } else if (axiosError.message === 'Phiên đăng nhập đã hết hạn') {
          // Token expired (handled by interceptor)
          setError('Phiên đăng nhập đã hết hạn');
        } else {
          // Network or server error
          setError('Đã xảy ra lỗi. Vui lòng thử lại.');
          addMessage(
            'Xin lỗi, đã xảy ra lỗi khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.',
            'assistant'
          );
        }
      } finally {
        setIsWaitingForResponse(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      addMessage,
      currentConversation,
      user,
      createConversation,
      switchConversation,
    ]
  );

  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      // Clear previous error
      setError(null);

      // Validate new content
      if (!newContent.trim()) {
        setError('Vui lòng nhập câu hỏi của bạn');
        return;
      }

      if (newContent.length > 500) {
        setError('Câu hỏi không được vượt quá 500 ký tự');
        return;
      }

      // Find the message index
      const messageIndex = messages.findIndex(msg => msg.id === messageId);
      if (messageIndex === -1) return;

      // Update the user message content
      setMessages(prev => {
        const updated = [...prev];
        updated[messageIndex] = {
          ...updated[messageIndex],
          content: newContent.trim(),
        };
        return updated;
      });

      // Remove all messages after the edited message (including the AI response)
      setMessages(prev => prev.slice(0, messageIndex + 1));

      // Show loading state
      setIsWaitingForResponse(true);

      try {
        // Call the Q&A API with new content
        const response: QuestionResponse = await qaService.askQuestion({
          question: newContent.trim(),
          threshold: 0.55,
          top_k: 7,
        });

        // Add new AI response
        addMessage(response.summary, 'assistant');
      } catch (err) {
        const axiosError = err as AxiosError<ValidationError>;

        // Handle different error types
        if (axiosError.response?.status === 422) {
          // Validation error
          const validationError = axiosError.response.data as ValidationError;
          const errorMessage =
            validationError.detail?.map(d => d.msg).join(', ') ||
            'Dữ liệu không hợp lệ';
          setError(errorMessage);
          addMessage(
            `Xin lỗi, ${errorMessage.toLowerCase()}. Vui lòng thử lại.`,
            'assistant'
          );
        } else if (
          axiosError.response?.status === 401 ||
          axiosError.response?.status === 403
        ) {
          // Authentication error
          setError('Vui lòng đăng nhập để sử dụng tính năng này');
          addMessage(
            'Vui lòng đăng nhập để sử dụng tính năng này.',
            'assistant'
          );
        } else if (axiosError.message === 'Phiên đăng nhập đã hết hạn') {
          // Token expired (handled by interceptor)
          setError('Phiên đăng nhập đã hết hạn');
        } else {
          // Network or server error
          setError('Đã xảy ra lỗi. Vui lòng thử lại.');
          addMessage(
            'Xin lỗi, đã xảy ra lỗi khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.',
            'assistant'
          );
        }
      } finally {
        setIsWaitingForResponse(false);
      }
    },
    [messages, addMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isWaitingForResponse,
    isInitializing,
    error,
    askQuestion,
    editMessage,
    clearMessages,
    // Streaming properties
    isStreaming,
    streamingContent,
    streamingMessageId,
    streamingAnswers,
    streamingTokenCount,
  };
};
