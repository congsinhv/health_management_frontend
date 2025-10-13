export type MessageRole = 'user' | 'assistant' | 'system';

export type HealthOptionType =
  | 'obesity-prediction'
  | 'diet-recommendation'
  | null;

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  healthOption: HealthOptionType;
  messages: ChatMessage[];
  userResponses: Record<string, string | number>;
  currentStep: number;
  isCompleted: boolean;
}

export interface ConversationFlow {
  healthOption: HealthOptionType;
  steps: ConversationStep[];
}

export interface ConversationStep {
  id: string;
  question: string;
  responseType: 'text' | 'number' | 'choice';
  choices?: string[];
  validation?: (value: string | number) => boolean;
  nextStep?: (response: string | number) => string | null;
}

// Predefined conversation flows for each health option
export const OBESITY_PREDICTION_FLOW: ConversationStep[] = [
  {
    id: 'welcome',
    question:
      'Chào bạn! Tôi sẽ giúp bạn dự đoán khả năng thừa cân, béo phì. Để bắt đầu, bạn bao nhiêu tuổi?',
    responseType: 'number',
    validation: value => typeof value === 'number' && value > 0 && value < 120,
  },
  {
    id: 'gender',
    question: 'Giới tính của bạn là gì?',
    responseType: 'choice',
    choices: ['Nam', 'Nữ', 'Khác'],
  },
  {
    id: 'height',
    question: 'Chiều cao của bạn là bao nhiêu? (đơn vị: cm)',
    responseType: 'number',
    validation: value => typeof value === 'number' && value > 50 && value < 250,
  },
  {
    id: 'weight',
    question: 'Cân nặng hiện tại của bạn là bao nhiêu? (đơn vị: kg)',
    responseType: 'number',
    validation: value => typeof value === 'number' && value > 20 && value < 300,
  },
  {
    id: 'activity',
    question: 'Mức độ hoạt động thể chất hàng ngày của bạn như thế nào?',
    responseType: 'choice',
    choices: [
      'Ít vận động',
      'Vận động nhẹ',
      'Vận động vừa phải',
      'Vận động nhiều',
    ],
  },
  {
    id: 'family-history',
    question: 'Gia đình bạn có tiền sử béo phì không?',
    responseType: 'choice',
    choices: ['Có', 'Không', 'Không rõ'],
  },
];

export const DIET_RECOMMENDATION_FLOW: ConversationStep[] = [
  {
    id: 'welcome',
    question:
      'Xin chào! Tôi sẽ giúp bạn tạo chế độ ăn cá nhân hóa. Trước tiên, bạn có mục tiêu gì cho chế độ ăn?',
    responseType: 'choice',
    choices: ['Giảm cân', 'Tăng cân', 'Duy trì cân nặng', 'Tăng cơ'],
  },
  {
    id: 'age',
    question: 'Bạn bao nhiêu tuổi?',
    responseType: 'number',
    validation: value => typeof value === 'number' && value > 0 && value < 120,
  },
  {
    id: 'height',
    question: 'Chiều cao của bạn là bao nhiêu? (đơn vị: cm)',
    responseType: 'number',
    validation: value => typeof value === 'number' && value > 50 && value < 250,
  },
  {
    id: 'weight',
    question: 'Cân nặng hiện tại của bạn là bao nhiêu? (đơn vị: kg)',
    responseType: 'number',
    validation: value => typeof value === 'number' && value > 20 && value < 300,
  },
  {
    id: 'allergies',
    question:
      'Bạn có dị ứng với thực phẩm nào không? (Nếu có, vui lòng liệt kê. Nếu không, gõ "Không")',
    responseType: 'text',
  },
  {
    id: 'food-preferences',
    question:
      'Bạn có sở thích ăn uống đặc biệt nào không? (Ví dụ: chay, ăn kiêng low-carb...)',
    responseType: 'text',
  },
  {
    id: 'activity',
    question: 'Mức độ hoạt động thể chất hàng ngày của bạn?',
    responseType: 'choice',
    choices: [
      'Ít vận động',
      'Vận động nhẹ',
      'Vận động vừa phải',
      'Vận động nhiều',
    ],
  },
];
