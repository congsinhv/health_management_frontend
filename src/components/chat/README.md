# Chat Component System

This directory contains the chat components for the health management chatbot interface.

## Components

### ChatMessage.tsx

Displays individual chat messages with:

- User/Assistant avatars
- Glassmorphism styling for messages
- Loading animation for AI responses
- Timestamps
- Auto-scroll to new messages

### QuickResponses.tsx

Renders quick response buttons for multiple choice questions:

- Glassmorphism styled buttons
- Smooth animations
- Click handlers for quick selections

## Chat Flow

The chat system supports two main conversation flows:

### 1. Obesity Prediction Flow

Collects user data to predict obesity risk:

- Age
- Gender
- Height (cm)
- Weight (kg)
- Physical activity level
- Family history
- Calculates BMI and provides recommendations

### 2. Diet Recommendation Flow

Creates personalized diet plans:

- Dietary goals (lose weight, gain weight, maintain, build muscle)
- Age
- Height and weight
- Food allergies
- Food preferences (vegetarian, low-carb, etc.)
- Physical activity level
- Generates customized meal plans

## Features

✨ **Conversational AI Experience**

- Context-aware follow-up questions
- Validation of user inputs
- Dynamic response based on user data

🎨 **Modern UI with Glassmorphism**

- Transparent, blurred backgrounds
- Smooth animations
- Gradient accents
- Responsive design

🔄 **Smart Flow Management**

- Step-by-step conversation
- Progress tracking
- Session management
- Easy restart functionality

## Usage Example

```tsx
import ChatMessage from '@/components/chat/ChatMessage';
import QuickResponses from '@/components/chat/QuickResponses';
import { useChat } from '@/hooks/useChat';

const MyComponent = () => {
  const { session, startNewSession, processUserResponse } = useChat();

  // Start a new chat session
  startNewSession('obesity-prediction');

  // Process user response
  await processUserResponse('25'); // age

  return (
    <div>
      {session?.messages.map(msg => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
};
```

## File Structure

```
src/
├── components/
│   └── chat/
│       ├── ChatMessage.tsx          # Message display component
│       ├── ChatMessage.module.scss  # Message styles
│       ├── QuickResponses.tsx       # Quick response buttons
│       └── QuickResponses.module.scss
├── hooks/
│   └── useChat.ts                   # Chat state management hook
├── types/
│   └── chat.ts                      # Type definitions & flows
└── app/
    └── chatbox/
        ├── page.tsx                 # Main chat page
        └── page.module.scss         # Chat page styles
```

## Customization

To add new conversation flows:

1. Define the flow in `src/types/chat.ts`:

```typescript
export const NEW_FLOW: ConversationStep[] = [
  {
    id: 'step1',
    question: 'Your question here?',
    responseType: 'text' | 'number' | 'choice',
    choices: ['Option 1', 'Option 2'], // for choice type
    validation: (value) => /* validation logic */
  },
  // ... more steps
];
```

2. Add the flow to `useChat.ts` in the `getConversationFlow` function
3. Create completion message logic in `generateCompletionMessage`

## Styling

All components use glassmorphism design with:

- `backdrop-filter: blur(10px)`
- Semi-transparent backgrounds
- Subtle borders and shadows
- Smooth transitions and animations
