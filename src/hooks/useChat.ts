import { useState, useCallback } from 'react';
import {
  ChatMessage,
  ChatSession,
  HealthOptionType,
  ConversationStep,
  OBESITY_PREDICTION_FLOW,
  DIET_RECOMMENDATION_FLOW,
} from '@/types/chat';

export const useChat = () => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const getConversationFlow = (
    healthOption: HealthOptionType
  ): ConversationStep[] => {
    switch (healthOption) {
      case 'obesity-prediction':
        return OBESITY_PREDICTION_FLOW;
      case 'diet-recommendation':
        return DIET_RECOMMENDATION_FLOW;
      default:
        return [];
    }
  };

  const generateMessageId = () =>
    `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const startNewSession = useCallback((healthOption: HealthOptionType) => {
    const flow = getConversationFlow(healthOption);
    const firstQuestion = flow[0];

    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      healthOption,
      messages: [
        {
          id: generateMessageId(),
          role: 'assistant',
          content: firstQuestion.question,
          timestamp: new Date(),
        },
      ],
      userResponses: {},
      currentStep: 0,
      isCompleted: false,
    };

    setSession(newSession);
  }, []);

  const addMessage = useCallback(
    (content: string, role: 'user' | 'assistant') => {
      if (!session) return;

      const newMessage: ChatMessage = {
        id: generateMessageId(),
        role,
        content,
        timestamp: new Date(),
      };

      setSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
        };
      });
    },
    [session]
  );

  const processUserResponse = useCallback(
    async (response: string | number) => {
      if (!session) return;

      const flow = getConversationFlow(session.healthOption);
      const currentStep = flow[session.currentStep];

      // Add user message
      addMessage(response.toString(), 'user');

      // Validate response if validation function exists
      if (currentStep.validation && !currentStep.validation(response)) {
        setTimeout(() => {
          addMessage(
            'Xin lỗi, câu trả lời không hợp lệ. Vui lòng thử lại.',
            'assistant'
          );
        }, 500);
        return;
      }

      // Store user response
      setSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          userResponses: {
            ...prev.userResponses,
            [currentStep.id]: response,
          },
        };
      });

      // Show loading state
      setIsWaitingForResponse(true);

      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Move to next step
      const nextStepIndex = session.currentStep + 1;

      if (nextStepIndex < flow.length) {
        const nextStep = flow[nextStepIndex];
        addMessage(nextStep.question, 'assistant');

        setSession(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            currentStep: nextStepIndex,
          };
        });
      } else {
        // Conversation completed
        const completionMessage = generateCompletionMessage(
          session.healthOption,
          session.userResponses
        );
        addMessage(completionMessage, 'assistant');

        setSession(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            isCompleted: true,
          };
        });
      }

      setIsWaitingForResponse(false);
    },
    [session, addMessage]
  );

  const generateCompletionMessage = (
    healthOption: HealthOptionType,
    responses: Record<string, string | number>
  ): string => {
    if (healthOption === 'obesity-prediction') {
      const height = Number(responses.height) / 100; // Convert to meters
      const weight = Number(responses.weight);
      const bmi = weight / (height * height);

      let bmiCategory = '';
      let recommendation = '';

      if (bmi < 18.5) {
        bmiCategory = 'thiếu cân';
        recommendation =
          'Bạn nên tăng cường dinh dưỡng và tập thể dục để cải thiện sức khỏe.';
      } else if (bmi < 23) {
        bmiCategory = 'bình thường';
        recommendation =
          'Cân nặng của bạn ở mức lý tưởng. Hãy duy trì lối sống lành mạnh!';
      } else if (bmi < 25) {
        bmiCategory = 'thừa cân';
        recommendation =
          'Bạn đang ở mức thừa cân nhẹ. Nên điều chỉnh chế độ ăn và tăng cường vận động.';
      } else {
        bmiCategory = 'béo phì';
        recommendation =
          'Bạn nên tham khảo ý kiến bác sĩ và xây dựng kế hoạch giảm cân phù hợp.';
      }

      return `Dựa trên thông tin bạn cung cấp:\n\n🔍 Chỉ số BMI: ${bmi.toFixed(1)}\n📊 Phân loại: ${bmiCategory}\n\n💡 Khuyến nghị: ${recommendation}\n\nBạn có muốn tôi tư vấn thêm về chế độ ăn uống không?`;
    } else if (healthOption === 'diet-recommendation') {
      const goal = responses.welcome;
      const activity = responses.activity;

      return `Dựa trên mục tiêu "${goal}" và mức độ hoạt động "${activity}" của bạn, tôi đã tạo một kế hoạch dinh dưỡng phù hợp:\n\n🥗 Chế độ ăn được cá nhân hóa:\n• Calo khuyến nghị: 1800-2000 kcal/ngày\n• Protein: 120-150g/ngày\n• Carbs: 200-250g/ngày\n• Chất béo lành mạnh: 50-70g/ngày\n\n📋 Gợi ý thực đơn:\n• Sáng: Yến mạch với hoa quả và hạt\n• Trưa: Cơm gạo lứt, thịt/cá, rau xanh\n• Tối: Salad với protein, dầu olive\n\nBạn có muốn biết thêm chi tiết về từng bữa ăn không?`;
    }

    return 'Cảm ơn bạn đã cung cấp thông tin. Tôi sẽ tiếp tục hỗ trợ bạn nếu cần!';
  };

  const resetSession = useCallback(() => {
    setSession(null);
    setIsWaitingForResponse(false);
  }, []);

  return {
    session,
    isWaitingForResponse,
    startNewSession,
    processUserResponse,
    resetSession,
  };
};
