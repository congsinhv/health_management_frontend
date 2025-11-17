'use client';

import ChatMessageComponent from '@/components/chat/ChatMessage';
import HeaderVertical from '@/components/header/HeaderVertical';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useConversation } from '@/contexts/ConversationContext';
import { useChat } from '@/hooks/useChat';
import { useQAChat } from '@/hooks/useQAChat';
import { cn } from '@/lib/utils';
import {
  ChatMessage,
  DIET_RECOMMENDATION_FLOW,
  HealthOptionType,
  OBESITY_PREDICTION_FLOW,
} from '@/types/chat';
import { LoaderIcon, MoreVertical, Send, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';

function ChatboxContent() {
  const [message, setMessage] = useState('');
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);

  // Guided chat hook (for obesity prediction and diet recommendation)
  const {
    session,
    isWaitingForResponse: isGuidedWaiting,
    startNewSession,
  } = useChat();

  // AI Q&A chat hook
  const {
    messages: qaMessages,
    isWaitingForResponse: isQAWaiting,
    isInitializing,
    error: qaError,
    askQuestion,
    editMessage,
    clearMessages,
    // Streaming state
    isStreaming,
    streamingContent,
    streamingMessageId,
  } = useQAChat();

  // Conversation context
  const { currentConversation, switchConversation } = useConversation();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);

  // Detect if user scrolled up manually
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      userScrolledUpRef.current = !isAtBottom;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom when streaming content updates (only if user at bottom)
  useEffect(() => {
    if (isStreaming && !userScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamingContent, isStreaming]);

  // Auto scroll to bottom when new finalized messages arrive
  useEffect(() => {
    if (!isStreaming && qaMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [qaMessages.length, isStreaming]);

  // Auto scroll for guided chat messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const handleHealthOptionClick = (option: HealthOptionType) => {
    if (option === 'ai-chat') {
      // AI chat mode - no need to start a session
      clearMessages();
    } else {
      // Guided flow mode
      startNewSession(option);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isQAWaiting || isStreaming) return;

    const questionToSend = message.trim();
    // Clear input IMMEDIATELY before API call
    setMessage('');
    await askQuestion(questionToSend);
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    await editMessage(messageId, newContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = async () => {
    // Create a new conversation if we're in AI chat mode
    switchConversation(null);
  };

  // Get current step for quick responses
  const getCurrentStepChoices = () => {
    if (!session) return null;
    const currentFlow =
      session.healthOption === 'obesity-prediction'
        ? OBESITY_PREDICTION_FLOW
        : DIET_RECOMMENDATION_FLOW;
    const currentStep = currentFlow[session.currentStep];
    return currentStep.responseType === 'choice' ? currentStep.choices : null;
  };

  const currentChoices = getCurrentStepChoices();

  // Create temporary streaming message for display
  const streamingMessage: ChatMessage | null = isStreaming
    ? {
        id: streamingMessageId || 'streaming-temp',
        role: 'assistant' as const,
        content: streamingContent,
        timestamp: new Date(),
      }
    : null;

  // Combine finalized messages with streaming message
  const displayMessages = streamingMessage
    ? [...qaMessages, streamingMessage]
    : qaMessages;

  return (
    <div className={styles.chatbox_page}>
      <HeaderVertical
        isOpen={isHeaderOpen}
        className={styles.header_vertical}
        setIsOpen={setIsHeaderOpen}
      />

      <div
        className={`${styles.main_content} ${!isHeaderOpen ? styles.collapsed : ''}`}
      >
        {isInitializing || isGuidedWaiting ? (
          <div className='flex h-full items-center justify-center'>
            <LoaderIcon className={cn('text-primary size-4 animate-spin')} />
          </div>
        ) : !session && !currentConversation ? (
          // Welcome screen with health options
          <div className={styles.chat_container}>
            <div className={styles.greeting_section}>
              <h1 className={styles.greeting_title}>
                Xin chào, <br />
                Tôi có thể giúp gì cho bạn?
              </h1>
              <p className={styles.greeting_subtitle}>
                Trò chuyện trực tiếp với trợ lý sức khỏe, nhận gợi ý chế độ ăn
                cá nhân hóa và dự đoán nguy cơ thừa cân, béo phì
              </p>
            </div>

            <div className={styles.health_options}>
              <div
                className={styles.health_option}
                onClick={() => handleHealthOptionClick('ai-chat')}
              >
                <div className={styles.option_content}>
                  <h3>Chat ngay với AI</h3>
                </div>
              </div>
              {/*
              <div
                className={styles.health_option}
                onClick={() => handleHealthOptionClick('obesity-prediction')}
              >
                <div className={styles.option_content}>
                  <h3>Dự đoán khả năng thừa cân, béo phì</h3>
                </div>
              </div>

              <div
                className={styles.health_option}
                onClick={() => handleHealthOptionClick('diet-recommendation')}
              >
                <div className={styles.option_content}>
                  <h3>Gợi ý chế độ ăn cá nhân hóa</h3>
                </div>
              </div> */}
            </div>
          </div>
        ) : currentConversation ? (
          // AI Chat mode
          <div className={styles.chat_session} ref={chatContainerRef}>
            <div className={styles.chat_header}>
              <Button
                variant='outline'
                className={styles.new_chat_button}
                onClick={handleNewChat}
              >
                <X className='h-5 w-5' />
                Đóng chat
              </Button>
            </div>

            <div
              className={styles.messages_container}
              ref={messagesContainerRef}
            >
              {displayMessages.length === 0 && !isQAWaiting && !isStreaming ? (
                <div className={styles.ai_welcome}>
                  <p className={styles.ai_welcome_text}>
                    Bạn có thể hỏi tôi bất kỳ câu hỏi nào về sức khỏe!
                  </p>
                  <div className={styles.suggestions}>
                    <Button
                      variant='outline'
                      className={styles.suggestion_button}
                      onClick={() =>
                        handleSuggestionClick(
                          'Dự đoán khả năng thừa cân, béo phì'
                        )
                      }
                    >
                      Dự đoán khả năng thừa cân, béo phì
                    </Button>
                    <Button
                      variant='outline'
                      className={styles.suggestion_button}
                      onClick={() =>
                        handleSuggestionClick('Gợi ý chế độ ăn cá nhân hóa')
                      }
                    >
                      Gợi ý chế độ ăn cá nhân hóa
                    </Button>
                  </div>
                </div>
              ) : (
                displayMessages.map((msg, index) => {
                  const isStreamingMsg =
                    isStreaming && index === displayMessages.length - 1;
                  return (
                    <ChatMessageComponent
                      key={msg.id}
                      message={msg}
                      onEdit={
                        msg.role === 'user' ? handleEditMessage : undefined
                      }
                      isStreamingMessage={isStreamingMsg}
                    />
                  );
                })
              )}

              {isQAWaiting && !isStreaming && (
                <ChatMessageComponent
                  message={{
                    id: 'loading',
                    role: 'assistant',
                    content: '',
                    timestamp: new Date(),
                    isLoading: true,
                  }}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        ) : null}

        {/* Chat input - show for AI chat or active guided session (without quick responses) */}
        {(currentConversation || !currentChoices) && (
          <div className={styles.chat_input_container}>
            <div className={styles.chat_input_wrapper}>
              <Textarea
                className={cn(
                  styles.chat_input,
                  'shadow-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0'
                )}
                placeholder={
                  isStreaming
                    ? 'Đang nhận phản hồi...'
                    : currentConversation
                      ? 'Nhập câu hỏi của bạn...'
                      : session?.healthOption === 'obesity-prediction'
                        ? 'Nhập câu trả lời của bạn...'
                        : 'Nhập thông tin của bạn...'
                }
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isQAWaiting || isStreaming}
                maxLength={1000}
              />
              <div className={styles.input_actions}>
                <Button
                  variant='ghost'
                  size='icon'
                  className={styles.attachment_button}
                  title='Đính kèm tài liệu'
                  disabled={isQAWaiting || isStreaming}
                >
                  <MoreVertical className='h-5 w-5' />
                </Button>
                <span
                  className={`${styles.character_count} ${
                    message.length > 1000 ? styles.character_count_error : ''
                  }`}
                >
                  {message.length}/1000
                </span>
                <Button
                  className={styles.send_button}
                  onClick={handleSendMessage}
                  disabled={
                    !message.trim() ||
                    isQAWaiting ||
                    isStreaming ||
                    message.length > 1000
                  }
                >
                  {isStreaming ? 'Đang xử lý...' : <Send className='h-5 w-5' />}
                </Button>
              </div>
            </div>
            {qaError && currentConversation && (
              <div className={styles.error_message}>{qaError}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatboxPage() {
  return (
    <ProtectedRoute>
      <ChatboxContent />
    </ProtectedRoute>
  );
}
