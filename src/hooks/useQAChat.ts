import { useState, useCallback } from 'react';
import { qaService } from '@/services/qa';
import { ChatMessage } from '@/types/chat';
import type { QuestionResponse, ValidationError } from '@/types/qa';
import { AxiosError } from 'axios';

interface UseQAChatReturn {
  messages: ChatMessage[];
  isWaitingForResponse: boolean;
  error: string | null;
  askQuestion: (question: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  clearMessages: () => void;
}

export const useQAChat = (): UseQAChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Add user message immediately
      addMessage(question, 'user');

      // Show loading state
      setIsWaitingForResponse(true);

      try {
        // Call the Q&A API
        const response: QuestionResponse = await qaService.askQuestion({
          question,
          threshold: 0.55,
          top_k: 7,
        });

        // Add AI response with the summary
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
    [addMessage]
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
    error,
    askQuestion,
    editMessage,
    clearMessages,
  };
};
