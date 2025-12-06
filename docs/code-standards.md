# VHealth - Code Standards & Development Guidelines

**Framework:** Next.js 15.5.3 with TypeScript 5.x
**Styling:** Tailwind CSS v4 (100% Tailwind, NO SCSS)
**Last Updated:** December 2025

---

## Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [File Organization](#file-organization)
3. [Component Structure](#component-structure)
4. [Context Organization](#context-organization)
5. [Type Definitions](#type-definitions)
6. [Import/Export Conventions](#importexport-conventions)
7. [Styling Conventions](#styling-conventions)
8. [Code Quality Standards](#code-quality-standards)
9. [Git Workflow](#git-workflow)
10. [Testing Standards](#testing-standards)

---

## Naming Conventions

### Files & Folders

#### PascalCase for Components

```
✅ GOOD
src/components/chat/ChatMessage.tsx
src/components/shared/Avatar.tsx
src/contexts/auth/AuthContext.tsx
src/hooks/useAuth.ts

❌ BAD
src/components/chat/chatMessage.tsx
src/components/shared/avatar.tsx
src/contexts/auth/authContext.tsx
```

#### camelCase for Utilities & Services

```
✅ GOOD
src/services/authService.ts → should be auth.ts
src/lib/utils/transforms.ts
src/lib/constants.ts
src/types/auth.ts

❌ BAD
src/services/AuthService.ts
src/lib/utils/Transforms.ts
```

#### kebab-case for Routes

```
✅ GOOD
src/app/(auth)/login/page.tsx
src/app/(dashboard)/health-tracking/page.tsx
src/app/(auth)/forgot-password/page.tsx

❌ BAD
src/app/(auth)/Login/page.tsx
src/app/(dashboard)/healthTracking/page.tsx
```

#### camelCase for Variables, Functions, Constants

```
✅ GOOD
const userProfile = { name: "John" };
function getUserData() { ... }
const API_TIMEOUT = 5000;
let isLoading = false;

❌ BAD
const UserProfile = { name: "John" };
function get_user_data() { ... }
const apiTimeout = 5000;  // constants should be UPPER_SNAKE_CASE
```

#### PascalCase for Types, Interfaces, Enums

```
✅ GOOD
interface UserData { ... }
type AuthResponse = { ... };
enum UserRole { ADMIN, USER, GUEST }
class UserService { ... }

❌ BAD
interface user_data { ... }
type authResponse = { ... };
enum userRole { ... }
```

### Component Naming

#### React Component Files

```
✅ GOOD - Descriptive PascalCase
ChatMessage.tsx
ConversationList.tsx
ProtectedRoute.tsx
ErrorBoundary.tsx

❌ BAD
ChatMsg.tsx
ConvList.tsx
ProtRoute.tsx
ErrorHandler.tsx
```

#### Custom Hook Naming

```
✅ GOOD - Always start with "use"
useAuth.ts
useChat.ts
useAvatarDisplay.ts
useForgotPassword.ts
useCountdown.ts

❌ BAD
auth.ts
ChatHook.ts
avatarDisplay.ts
getAuth.ts
```

#### Context Provider Naming

```
✅ GOOD
AuthContext.tsx (provides AuthProvider and useAuth)
ConversationContext.tsx (provides ConversationProvider and useConversation)
// Exported as:
export const AuthProvider = ...
export const useAuth = ...

❌ BAD
auth.tsx
useAuthContext.ts (wrong - should be AuthContext.tsx)
createAuthContext.ts
```

### API/Service Function Naming

#### Service Functions (src/services/)

```
✅ GOOD - Descriptive action verbs
login(credentials)
register(userData)
logout()
getUserProfile()
updateProfile(data)
refreshToken()
sendVerificationEmail()
fetchConversations()

❌ BAD
auth()
doRegister()
removeAuth()
get()
updateData()
refreshAuth()
```

---

## File Organization

### Directory Structure Rules

#### Component Folders

```
✅ GOOD - Feature folders with multiple components
src/components/chat/
  ├── ChatMessage.tsx
  ├── ConversationList.tsx
  ├── QuickResponses.tsx
  └── index.ts  // Barrel export

❌ BAD - Single component folders at root
src/components/ChatMessage/
  └── ChatMessage.tsx

✅ GOOD - Reusable single components in shared/
src/components/shared/
  ├── Avatar.tsx
  ├── Card.tsx
  ├── Logo.tsx
  └── Navigation.tsx
```

#### Barrel Exports (index.ts)

```
✅ GOOD - Clean imports
src/components/chat/index.ts:
  export { ChatMessage } from './ChatMessage';
  export { ConversationList } from './ConversationList';
  export { QuickResponses } from './QuickResponses';

// Usage in other files:
import { ChatMessage, ConversationList } from '@/components/chat';

❌ BAD - Direct file imports (verbose)
import ChatMessage from '@/components/chat/ChatMessage.tsx';
import ConversationList from '@/components/chat/ConversationList.tsx';
```

#### Type Organization

```
✅ GOOD - All types in src/types/
src/types/
  ├── auth.ts         # Auth-related types
  ├── user.ts         # User profile types
  ├── chat.ts         # Chat types
  ├── api.ts          # Generic API types
  └── index.ts        # Barrel export

// Usage:
import { User, AuthState } from '@/types/auth';
import { ChatMessage } from '@/types/chat';

❌ BAD - Types scattered in service files
src/services/auth.ts (with types defined here)
src/services/chat.ts (with types defined here)
// This breaks the single responsibility principle
```

#### Context Organization

```
✅ GOOD - Organized context folders
src/contexts/auth/
  ├── AuthContext.tsx   # Main context and provider
  ├── actions.ts        # Business logic functions
  ├── reducer.ts        # State reducer
  ├── types.ts          # Context-specific types
  └── index.ts          # Barrel export

src/contexts/conversation/
  ├── ConversationContext.tsx
  ├── actions.ts
  ├── reducer.ts
  ├── types.ts
  └── index.ts

❌ BAD - Scattered context files
src/contexts/authContext.tsx
src/contexts/authActions.ts
src/contexts/conversationContext.tsx
src/contexts/conversationActions.ts
// Harder to navigate and understand relationship
```

---

## Component Structure

### React Component Template

#### Functional Component with Hooks

```tsx
✅ GOOD
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

interface ChatMessageProps {
  message: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  className?: string;
}

/**
 * Renders a single chat message with sender context
 * @param message - The message content
 * @param sender - Who sent the message
 * @param timestamp - When the message was sent
 */
export const ChatMessage = ({
  message,
  sender,
  timestamp,
  className,
}: ChatMessageProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <div
      className={cn(
        'rounded-lg p-4 mb-4',
        sender === 'user' && 'bg-blue-100 ml-8',
        sender === 'assistant' && 'bg-gray-100 mr-8',
        className,
      )}
    >
      <p className="text-sm font-semibold mb-1">
        {sender === 'user' ? 'You' : 'Assistant'}
      </p>
      <p className="text-gray-800">{message}</p>
      <time className="text-xs text-gray-500 mt-2 block">
        {timestamp.toLocaleTimeString()}
      </time>
    </div>
  );
};
```

#### Key Patterns:

1. Import types at top with `type` keyword for tree-shaking
2. Define props interface with clear documentation
3. Add JSDoc comment explaining component
4. Use `useCallback` for event handlers to prevent re-renders
5. Use `cn()` utility for conditional Tailwind classes
6. Export as named export (not default)
7. Component name matches file name exactly

---

## Context Organization

### Context Structure Pattern

```tsx
// src/contexts/auth/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' };

// src/contexts/auth/reducer.ts
export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'AUTH_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'AUTH_LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
};

// src/contexts/auth/actions.ts
import { login as loginService } from '@/services/auth';

export const login = async (
  dispatch: Dispatch<AuthAction>,
  email: string,
  password: string
) => {
  dispatch({ type: 'AUTH_START' });
  try {
    const response = await loginService(email, password);
    dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
  } catch (error) {
    dispatch({
      type: 'AUTH_ERROR',
      payload: error instanceof Error ? error.message : 'Login failed',
    });
  }
};

// src/contexts/auth/AuthContext.tsx
import { createContext, useReducer, useCallback } from 'react';
import { authReducer } from './reducer';
import { login } from './actions';
import type { AuthState, AuthAction } from './types';

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const handleLogin = useCallback(
    (email: string, password: string) => login(dispatch, email, password),
    []
  );

  const handleLogout = useCallback(() => {
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider
      value={{ state, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// src/contexts/auth/index.ts (Barrel export)
export { AuthContext, AuthProvider } from './AuthContext';
export { useAuth } from './useAuth'; // See hooks section
export type { AuthState, AuthAction } from './types';

// src/hooks/useAuth.ts (Hook wrapper)
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Rules:

- `types.ts` defines all types for context
- `reducer.ts` handles state transitions
- `actions.ts` contains business logic
- `[Name]Context.tsx` creates context and provider
- `index.ts` exports everything with barrel pattern
- Custom hook wrapper in `src/hooks/`

---

## Type Definitions

### Type Organization Standards

#### Location

```
✅ ALL types go in src/types/
❌ Never define types in components, services, or contexts
```

#### Type vs Interface

```
✅ Use 'type' for unions and aliases
type UserRole = 'admin' | 'user' | 'guest';
type ApiResponse<T> = { success: boolean; data: T };

✅ Use 'interface' for object shapes (extensible)
interface User {
  id: string;
  email: string;
}

interface AdminUser extends User {
  permissions: string[];
}

❌ Don't mix conventions arbitrarily
```

#### Generic Types

```
✅ GOOD - Clear, reusable generics
type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
};

// Usage:
const userResponse: ApiResponse<User> = ...
const users: PaginatedResponse<User> = ...

❌ BAD - Overly complex or unclear generics
type Response<T, U, V> = { data: T; meta: U; error: V };
```

#### Required Properties vs Optional

```
✅ GOOD - Clear intent
interface CreateUserInput {
  email: string;         // Required
  name: string;          // Required
  phone?: string;        // Optional
  bio?: string;          // Optional
}

❌ BAD - Unclear which are required
interface CreateUserInput {
  email?: string;
  name?: string;
  phone?: string;
  bio?: string;
}
```

#### Utility Types

```
✅ Use TypeScript built-in utility types
type UserWithoutPassword = Omit<User, 'password'>;
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;
type UserKeys = keyof User;
type UserValues = User[keyof User];

❌ Don't reinvent what TypeScript provides
```

---

## Import/Export Conventions

### Import Organization

```tsx
✅ GOOD - Organized imports
// 1. External libraries (React, third-party)
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 2. Project aliases (@/)
import { ChatMessage } from '@/components/chat';
import { useAuth } from '@/hooks';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

// 3. Relative imports (rarely used)
import { someHelper } from './helpers';

// 4. Side effects (if needed)
import './styles.css';
```

### Export Conventions

#### Named Exports (Preferred)

```tsx
✅ GOOD - Explicit, refactorable
export const ChatMessage = () => { ... };
export const ConversationList = () => { ... };
export const useChat = () => { ... };

// Usage:
import { ChatMessage, ConversationList } from '@/components/chat';

❌ BAD - Default exports, harder to refactor
export default ChatMessage;
export default ConversationList;
```

#### Barrel Exports (index.ts)

```tsx
✅ GOOD
// src/components/chat/index.ts
export { ChatMessage } from './ChatMessage';
export { ConversationList } from './ConversationList';
export { QuickResponses } from './QuickResponses';

// Clean imports elsewhere:
import { ChatMessage } from '@/components/chat';

❌ BAD - Importing from nested files
import ChatMessage from '@/components/chat/ChatMessage';
import ConversationList from '@/components/chat/ConversationList';
```

#### Type Exports

```tsx
✅ GOOD - Use 'type' keyword for tree-shaking
import type { User, AuthState } from '@/types/auth';

❌ BAD - Regular import for types
import { User, AuthState } from '@/types/auth';
```

---

## Styling Conventions

### Tailwind CSS Only

```tsx
✅ GOOD - 100% Tailwind CSS
<div className="flex items-center justify-between p-4 rounded-lg bg-white shadow-md">
  <span className="text-lg font-semibold text-gray-900">Title</span>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Action
  </button>
</div>

❌ BAD - SCSS modules (removed, never use)
import styles from './Component.module.scss';
<div className={styles.container}>

❌ BAD - CSS files (not for component styling)
import './Component.css';  // Don't do this
```

### Conditional Classes with cn()

```tsx
✅ GOOD - Use cn() utility for conditions
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button = ({ variant = 'primary', disabled }: ButtonProps) => {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded font-semibold transition',
        variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      disabled={disabled}
    >
      Click me
    </button>
  );
};

❌ BAD - String concatenation
className={'bg-blue-500' + (disabled ? ' opacity-50' : '')}

❌ BAD - Ternary in className
className={variant === 'primary' ? 'bg-blue-500' : 'bg-gray-200'}
```

### Color & Theme Management

```tsx
// Define in tailwind.config.js
theme: {
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    danger: '#EF4444',
  },
}

✅ GOOD - Use semantic colors
<div className="bg-primary text-white">Primary Button</div>
<div className="bg-secondary text-white">Success Button</div>

✅ GOOD - Use Tailwind's built-in variants
<div className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700">
  Content
</div>
```

### Common Patterns

```tsx
✅ GOOD - Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

✅ GOOD - Flexbox layouts
<div className="flex items-center justify-between space-x-4">

✅ GOOD - Spacing consistency
<div className="p-4 mb-4 space-y-2">

✅ GOOD - Typography hierarchy
<h1 className="text-4xl font-bold">Main Title</h1>
<h2 className="text-2xl font-semibold">Section Title</h2>
<p className="text-base text-gray-600">Body text</p>
```

---

## Code Quality Standards

### ESLint Rules

**Key Rules Enforced:**

```json
{
  "react/react-in-jsx-scope": "off",
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "warn",
  "@typescript-eslint/no-unused-vars": "warn",
  "@typescript-eslint/explicit-return-types": "warn",
  "no-console": ["warn", { "allow": ["warn", "error"] }]
}
```

### Prettier Configuration

**Format Options:**

```js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
};
```

### TypeScript Strict Mode

All TypeScript files must comply with strict mode:

```tsx
✅ GOOD - Explicit types
function getUserById(id: string): Promise<User> {
  return fetchUser(id);
}

const users: User[] = [];
const user: User | null = null;

❌ BAD - Implicit types
function getUserById(id) {  // Missing return type
  return fetchUser(id);
}

const users = [];  // Missing type annotation
let user = null;   // 'any' type
```

### Code Comments

```tsx
✅ GOOD - Meaningful comments
// Queue pending requests during token refresh to prevent race conditions
const requestQueue: Array<() => void> = [];

/**
 * Refresh the authentication token
 * @returns Promise resolving when token is refreshed
 */
async function refreshAuthToken(): Promise<void> {
  // Implementation
}

❌ BAD - Obvious or misleading comments
// Increment counter
counter++;

// This function does something important
function doSomething() { ... }
```

### Error Handling

```tsx
✅ GOOD - Explicit error handling
try {
  const response = await loginService(email, password);
  dispatch({ type: 'AUTH_SUCCESS', payload: response });
} catch (error) {
  const message = error instanceof Error ? error.message : 'Login failed';
  dispatch({ type: 'AUTH_ERROR', payload: message });
}

❌ BAD - Silent failures
try {
  const response = await loginService(email, password);
} catch {
  // Silently fail - bad for debugging
}
```

---

## Git Workflow

### Branch Naming

```
✅ GOOD
feature/user-authentication
feature/health-dashboard
fix/token-refresh-race-condition
docs/api-integration-guide
chore/update-dependencies

❌ BAD
user-auth
healthdash
token-bug
add-docs
update
```

### Commit Convention

```
Format: type(scope): description

type:
  feat      - New feature
  fix       - Bug fix
  refactor  - Code refactoring
  docs      - Documentation changes
  style     - Code style changes (formatting)
  test      - Test additions/modifications
  chore     - Build, CI, dependencies

scope:
  auth      - Authentication module
  chat      - Chat feature
  predict   - Health prediction
  health    - Health tracking
  ui        - UI components
  api       - API integration
  (etc.)

Examples:
  feat(auth): Add OAuth Google integration
  fix(chat): Fix conversation history loading race condition
  docs(api): Update API integration guide
  chore(deps): Update React Query to v5.2.0
  refactor(types): Consolidate API response types
```

### Commit Messages

```
✅ GOOD - Descriptive and clear
feat(auth): Add automatic token refresh with request queuing

Implement Axios interceptor to automatically refresh expired access tokens.
Add request queue to prevent duplicate refresh calls during high concurrency.
Maintains seamless user experience without visible token expiry.

Fixes #123

❌ BAD - Vague or unclear
Fix stuff
Updated code
auth changes
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make commits following convention
3. Create PR with descriptive title and description
4. Request code review
5. Address feedback and commit changes
6. Merge when approved (squash commits if many)

---

## Testing Standards

### Test File Naming

```
✅ GOOD
src/components/chat/ChatMessage.test.tsx
src/services/auth.test.ts
src/hooks/useAuth.test.ts

❌ BAD
src/components/chat/ChatMessage.spec.tsx
src/services/authService.test.ts
src/hooks/auth.test.ts
```

### Test Structure

```tsx
✅ GOOD - Clear test organization
import { render, screen } from '@testing-library/react';
import { ChatMessage } from '@/components/chat';

describe('ChatMessage Component', () => {
  describe('rendering', () => {
    it('should render message text', () => {
      render(<ChatMessage message="Hello" sender="user" />);
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('should display sender name', () => {
      render(<ChatMessage message="Hi" sender="assistant" />);
      expect(screen.getByText('Assistant')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should handle expand action', () => {
      // Test expand functionality
    });
  });
});

❌ BAD - Disorganized tests
it('should work', () => { ... });
it('test 2', () => { ... });
it('another test', () => { ... });
```

### Coverage Targets

- **Minimum:** >80% for critical modules
- **Target:** >90% for business logic
- **Exceptions:** UI snapshot tests okay with 70%

---

## Performance Best Practices

### Component Memoization

```tsx
✅ GOOD - Memoize expensive renders
import { memo, useCallback } from 'react';

const ChatMessage = memo(({ message, sender }: Props) => {
  return <div>{message}</div>;
});

❌ BAD - Unnecessary memoization
const SimpleButton = memo(() => <button>Click</button>);
```

### useCallback and useMemo

```tsx
✅ GOOD - Use when passing to memoized components
const handleChange = useCallback((value) => {
  setQuery(value);
}, []);  // Empty deps - function never changes

const memoizedData = useMemo(() => {
  return expensiveComputation(data);
}, [data]);  // Recompute only when data changes

❌ BAD - Overuse useCallback/useMemo
const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]);  // Defeats purpose of memoization
```

### Image Optimization

```tsx
✅ GOOD - Use Next.js Image component
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={40}
  height={40}
  priority
/>

❌ BAD - Using <img> tag directly
<img src="/avatar.jpg" alt="User avatar" />
```

---

## Documentation Requirements

### JSDoc Comments

```tsx
/**
 * Authenticates user with email and password
 *
 * @param email - User email address
 * @param password - User password (min 8 chars)
 * @returns Promise resolving to authenticated user
 * @throws Error if authentication fails
 *
 * @example
 * const user = await login('user@example.com', 'password123');
 */
export const login = async (email: string, password: string): Promise<User> => {
  // Implementation
};
```

### README Files

Each feature folder should have README:

````markdown
# Chat Feature

## Overview

Provides real-time chat interface for health discussions.

## Components

- ChatMessage - Individual message display
- ConversationList - List of conversations
- QuickResponses - Suggested responses

## Usage

```tsx
import { ChatMessage } from '@/components/chat';
```
````

## Key Files

- `ChatMessage.tsx` - Main message component
- `useChat.ts` - Chat state management hook

```

---

## Quick Reference Checklist

Before committing code:

- [ ] All TypeScript types properly defined in `src/types/`
- [ ] Component props have TypeScript interface
- [ ] Function return types explicitly specified
- [ ] No implicit `any` types
- [ ] ESLint passes (`bun run lint`)
- [ ] Prettier formatting applied (`bun run format`)
- [ ] Components use only Tailwind CSS (no SCSS)
- [ ] Conditional classes use `cn()` utility
- [ ] All imports use path aliases (`@/`)
- [ ] Barrel exports used for multi-component folders
- [ ] Comments explain "why", not "what"
- [ ] Tests added for new functionality
- [ ] No console.logs in production code
- [ ] Commit message follows convention

---

**For more details, see:**
- `docs/codebase-summary.md` - Architecture and file organization
- `docs/system-architecture.md` - Technical design
- `/CONTRIBUTING.md` - Contribution guidelines
```
