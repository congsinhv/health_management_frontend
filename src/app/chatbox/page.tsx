'use client';

import HeaderVertical from '@/components/header/HeaderVertical';
import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.scss';
import HeartbeatIcon from '@/components/icons/heartbeat';
import MenuIcon from '@/components/icons/menu';
import ChatMessage from '@/components/chat/ChatMessage';
import QuickResponses from '@/components/chat/QuickResponses';
import { useChat } from '@/hooks/useChat';
import {
  HealthOptionType,
  OBESITY_PREDICTION_FLOW,
  DIET_RECOMMENDATION_FLOW,
} from '@/types/chat';

const ChatboxPage = () => {
  const [message, setMessage] = useState('');
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);
  const {
    session,
    isWaitingForResponse,
    startNewSession,
    processUserResponse,
    resetSession,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const handleHealthOptionClick = (option: HealthOptionType) => {
    startNewSession(option);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !session || isWaitingForResponse) return;

    const currentFlow =
      session.healthOption === 'obesity-prediction'
        ? OBESITY_PREDICTION_FLOW
        : DIET_RECOMMENDATION_FLOW;
    const currentStep = currentFlow[session.currentStep];

    // Parse response based on type
    let response: string | number = message.trim();
    if (currentStep.responseType === 'number') {
      const numValue = parseFloat(message.trim());
      if (!isNaN(numValue)) {
        response = numValue;
      }
    }

    await processUserResponse(response);
    setMessage('');
  };

  const handleQuickResponse = async (choice: string) => {
    if (!session || isWaitingForResponse) return;
    await processUserResponse(choice);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    resetSession();
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
        {!session ? (
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
                onClick={() => handleHealthOptionClick('obesity-prediction')}
              >
                <div className={styles.option_content}>
                  <h3>Dự đoán khả năng thừa cân, béo phì</h3>
                </div>
                <div className={styles.option_icon}>
                  <HeartbeatIcon />
                </div>
              </div>

              <div
                className={styles.health_option}
                onClick={() => handleHealthOptionClick('diet-recommendation')}
              >
                <div className={styles.option_content}>
                  <h3>
                    Gợi ý chế độ ăn cá nhân hóa, dựa trên thông tin của bạn
                  </h3>
                </div>
                <div className={styles.option_icon}>
                  <MenuIcon />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Active chat session
          <div className={styles.chat_session} ref={chatContainerRef}>
            <div className={styles.chat_header}>
              <h2>
                {session.healthOption === 'obesity-prediction'
                  ? 'Dự đoán thừa cân, béo phì'
                  : 'Gợi ý chế độ ăn'}
              </h2>
              <button
                className={styles.new_chat_button}
                onClick={handleNewChat}
              >
                <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                  <path
                    d='M17 3L3 17M3 3L17 17'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
                Cuộc trò chuyện mới
              </button>
            </div>

            <div className={styles.messages_container}>
              {session.messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {currentChoices && !isWaitingForResponse && (
                <QuickResponses
                  choices={currentChoices}
                  onSelect={handleQuickResponse}
                />
              )}

              {isWaitingForResponse && (
                <ChatMessage
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
        )}

        {/* Chat input - only show when session is active and not showing quick responses */}
        {session && !currentChoices && (
          <div className={styles.chat_input_container}>
            <div className={styles.chat_input_wrapper}>
              <textarea
                className={styles.chat_input}
                placeholder={
                  session.healthOption === 'obesity-prediction'
                    ? 'Nhập câu trả lời của bạn...'
                    : 'Nhập thông tin của bạn...'
                }
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                disabled={isWaitingForResponse}
              />
              <div className={styles.input_actions}>
                <span className={styles.character_count}>
                  {message.length}/1000
                </span>
                <button
                  className={styles.send_button}
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isWaitingForResponse}
                >
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                    <path
                      d='M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatboxPage;
