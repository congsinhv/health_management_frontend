'use client';

import ChatMessageComponent from '@/components/chat/ChatMessage';
import HeaderVertical from '@/components/layout/HeaderVertical';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useConversation } from '@/contexts/conversation';
import { useChat } from '@/hooks/useChat';
import { useQAChat } from '@/hooks/useQAChat';
import { cn } from '@/lib/utils';
import {
  ChatMessage,
  DIET_RECOMMENDATION_FLOW,
  OBESITY_PREDICTION_FLOW,
} from '@/types/chat';
import { LoaderIcon, MoreVertical, Send, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

function ChatboxContent() {
  const [message, setMessage] = useState('');
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  // Guided chat hook (for obesity prediction and diet recommendation)
  const { session, isWaitingForResponse: isGuidedWaiting } = useChat();

  // AI Q&A chat hook
  const {
    messages: qaMessages,
    isWaitingForResponse: isQAWaiting,
    isInitializing,
    error: qaError,
    askQuestion,
    editMessage,
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

  const handleHealthOptionClick = () => {
    // Focus on the chat input
    chatInputRef.current?.focus();
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
    <div className='flex h-screen w-full bg-[#fcfcfc]'>
      <HeaderVertical
        isOpen={isHeaderOpen}
        className={`h-screen transition-all duration-300 ${isHeaderOpen ? 'w-80' : ''}`}
        setIsOpen={setIsHeaderOpen}
      />

      <div
        className={`flex h-screen flex-1 flex-col pl-10 transition-all duration-300 ${isHeaderOpen ? 'w-[calc(100%-320px)]' : 'w-[calc(100%-86px)]'}`}
      >
        {isInitializing || isGuidedWaiting ? (
          <div className='flex h-full items-center justify-center'>
            <LoaderIcon className={cn('text-primary size-4 animate-spin')} />
          </div>
        ) : !session && !currentConversation ? (
          // Welcome screen with health options
          <div className='mx-auto flex max-w-[800px] flex-1 flex-col items-center justify-center gap-8 text-center'>
            <div className='flex flex-col items-center justify-center gap-2'>
              <h1 className='bg-linear-to-r from-black via-cyan-500 to-emerald-400 bg-clip-text text-[42.4px] leading-tight font-semibold text-transparent lg:text-[36px]'>
                Xin chào, <br />
                Tôi có thể giúp gì cho bạn?
              </h1>
              <p className='mx-auto w-[80%] max-w-[600px] text-[0.85rem] leading-relaxed text-gray-600'>
                Trò chuyện trực tiếp với trợ lý sức khỏe, nhận gợi ý chế độ ăn
                cá nhân hóa và dự đoán nguy cơ thừa cân, béo phì
              </p>
            </div>

            <div className='flex w-full flex-wrap justify-center gap-4 lg:gap-5'>
              <div
                className='flex h-max w-fit cursor-pointer flex-col items-center gap-8 rounded border border-gray-600 bg-white/25 px-4 py-2 backdrop-blur-lg transition-all duration-300 lg:min-w-[180px]'
                onClick={handleHealthOptionClick}
              >
                <div className='text-left'>
                  <h3 className='m-0 text-xs leading-6 font-semibold text-[#1e1e1e]'>
                    Chat ngay với AI
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ) : currentConversation ? (
          // AI Chat mode
          <div
            className='mx-auto flex h-full w-full flex-1 flex-col overflow-y-auto'
            ref={chatContainerRef}
          >
            <div className='sticky top-0 z-10 mb-6 flex items-center justify-between border-b border-[#e5e5e5] bg-[#fcfcfc] px-0 py-6'>
              <Button
                variant='outline'
                className='hover:svg:rotate-45 hover:svg:transition-transform hover:svg:duration-300 flex cursor-pointer items-center gap-2 rounded-[12px] border border-[rgba(79,209,199,0.3)] bg-[rgba(79,209,199,0.1)] px-5 py-2.5 text-[0.85rem] font-medium text-[#2c7a7b] backdrop-blur-lg transition-all duration-300 hover:-translate-y-px hover:border-[rgba(79,209,199,0.4)] hover:bg-[rgba(79,209,199,0.2)]'
                onClick={handleNewChat}
              >
                <X className='h-5 w-5' />
                Đóng chat
              </Button>
            </div>

            <div
              className='mx-auto mb-4 w-full max-w-[min(90%,1280px)] flex-1 px-0 py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-[rgba(79,209,199,0.3)] [&::-webkit-scrollbar-thumb:hover]:bg-[rgba(79,209,199,0.5)] [&::-webkit-scrollbar-track]:bg-transparent'
              ref={messagesContainerRef}
            >
              {displayMessages.length === 0 && !isQAWaiting && !isStreaming ? (
                <div className='flex h-full flex-col items-center justify-center gap-8 p-8 text-center'>
                  <p className='m-0 text-lg text-[#666]'>
                    Bạn có thể hỏi tôi bất kỳ câu hỏi nào về sức khỏe!
                  </p>
                  <div className='flex w-full max-w-[400px] flex-col gap-3'>
                    <Button
                      variant='outline'
                      className='cursor-pointer rounded-[8px] border border-[#e5e5e5] bg-white/25 px-5 py-3.5 text-left text-[0.85rem] text-[#1e1e1e] backdrop-blur-lg transition-all duration-300 hover:translate-y-[-2px] hover:border-[rgba(79,209,199,0.3)] hover:bg-[rgba(79,209,199,0.1)]'
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
                      className='cursor-pointer rounded-[8px] border border-[#e5e5e5] bg-white/25 px-5 py-3.5 text-left text-[0.85rem] text-[#1e1e1e] backdrop-blur-lg transition-all duration-300 hover:translate-y-[-2px] hover:border-[rgba(79,209,199,0.3)] hover:bg-[rgba(79,209,199,0.1)]'
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
          <div className='border-t border-[#e5e5e5] bg-[#fcfcfc] px-0 py-5'>
            <div className='relative mx-auto flex max-w-[800px] items-end gap-3 rounded-[12px] border border-[#e5e5e5] bg-white px-5 py-4'>
              <Textarea
                ref={chatInputRef}
                className={cn(
                  'max-h-[120px] min-h-6 flex-1 resize-none border-none bg-transparent text-base leading-6 text-[#1e1e1e] shadow-none outline-none placeholder:text-[#999] focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0'
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
              <div className='flex shrink-0 items-center gap-3'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent p-0 text-[#999] transition-all duration-200 hover:bg-[rgba(79,209,199,0.1)] hover:text-[#2c7a7b] disabled:cursor-not-allowed disabled:opacity-50'
                  title='Đính kèm tài liệu'
                  disabled={isQAWaiting || isStreaming}
                >
                  <MoreVertical className='h-5 w-5' />
                </Button>
                <span
                  className={`text-xs text-[#999] ${message.length > 1000 ? 'font-medium text-[#ef4444]' : ''}`}
                >
                  {message.length}/1000
                </span>
                <Button
                  className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-[8px] border-none bg-[#4fd1c7] text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#3bc4ba] disabled:cursor-not-allowed disabled:bg-[#e5e5e5] disabled:text-[#999]'
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
              <div className='mt-2 rounded-[8px] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)] px-4 py-3 text-center text-[0.85rem] text-[#dc2626]'>
                {qaError}
              </div>
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
