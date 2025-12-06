# VHealth - System Architecture

**Project:** health_management_frontend
**Framework:** Next.js 15.5.3 with TypeScript 5.x
**Architecture Type:** Layered/Multi-tier client-side application
**Last Updated:** December 2025

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Frontend Architecture Layers](#frontend-architecture-layers)
3. [Authentication & Security Architecture](#authentication--security-architecture)
4. [State Management Architecture](#state-management-architecture)
5. [API Integration Architecture](#api-integration-architecture)
6. [Component Hierarchy](#component-hierarchy)
7. [Data Flow Patterns](#data-flow-patterns)
8. [Routing Architecture](#routing-architecture)
9. [Build & Deployment Architecture](#build--deployment-architecture)
10. [Infrastructure Architecture](#infrastructure-architecture)

---

## High-Level Architecture

### System Context Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js SPA (VHealth Frontend) - HTML/CSS/JavaScript   │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────┘
                                       │ HTTP/HTTPS Requests
                        ┌──────────────┼──────────────┐
                        ▼              ▼              ▼
            ┌──────────────────┐  ┌──────────┐  ┌────────────┐
            │ Django REST API  │  │ Google   │  │ GCP Secret │
            │ (Backend)        │  │ OAuth 2  │  │ Manager    │
            │ localhost:8000   │  │ Service  │  │            │
            └──────────────────┘  └──────────┘  └────────────┘
                    │                               (optional)
                    ▼
            ┌──────────────────┐
            │   PostgreSQL     │
            │   Database       │
            └──────────────────┘
```

### Component Stack

```
Layer 1: Next.js Pages (App Router)
  │
  ├─── Routes: /auth/login, /dashboard, etc.
  └─── Providers: Layout with AuthProvider, QueryClientProvider
         │
         ▼
Layer 2: React Components (100+)
  │
  ├─── UI Components (shadcn/ui)
  ├─── Feature Components (Chat, Predict, etc.)
  ├─── Layout Components (Header, Footer, etc.)
  └─── Shared Components (Avatar, Card, etc.)
         │
         ▼
Layer 3: Hooks & Context
  │
  ├─── useAuth() - Authentication state
  ├─── useChat() - Chat state
  ├─── useQuery() - Server state (React Query)
  └─── useState(), useEffect() - Local state
         │
         ▼
Layer 4: Services (API abstraction)
  │
  ├─── authService
  ├─── userService
  ├─── chatService
  ├─── healthService
  └─── [other services]
         │
         ▼
Layer 5: Axios HTTP Client
  │
  ├─── Request Interceptor (JWT injection)
  ├─── Response Interceptor (401 handling)
  ├─── Error Interceptor (logging)
  └─── Request Queue (token refresh)
         │
         ▼
Layer 6: Backend API & External Services
```

---

## Frontend Architecture Layers

### 1. Presentation Layer (Pages & Components)

**Location:** `src/app/` and `src/components/`

**Responsibilities:**

- Render UI elements
- Handle user interactions
- Display data from state/services
- Form input and validation

**Key Components:**

- Page components (auth, dashboard, etc.)
- Feature components (chat, health tracking)
- Layout components (header, footer)
- Reusable UI components (button, input, card)

**Architecture Pattern:**

```
Page
  ├── Layout Component
  ├── Feature Components
  │   ├── Sub-components
  │   └── Form Components
  └── Loading/Error States
```

### 2. Business Logic Layer (Hooks & Context)

**Location:** `src/hooks/`, `src/contexts/`

**Responsibilities:**

- Manage application state
- Handle user authentication
- Manage conversation state
- Provide data to components via custom hooks

**Key Patterns:**

- Context for global state (auth, conversation)
- Custom hooks for state logic
- Reducer pattern for complex state

**State Management:**

```
AuthContext
  └── useAuth() → Components
      ├── user
      ├── isAuthenticated
      ├── isLoading
      └── login(), logout(), register()

ConversationContext
  └── useConversation() → Components
      ├── currentConversation
      ├── messages
      └── switchConversation()

React Query
  └── useSuspenseQuery() → Components
      ├── Data caching
      ├── Background refetch
      └── Loading states
```

### 3. Service Layer (API Abstraction)

**Location:** `src/services/`

**Responsibilities:**

- Encapsulate API calls
- Handle request/response transformation
- Provide typed interfaces to business logic

**Service Modules:**

```
auth.ts      → POST /auth/login, POST /auth/register, etc.
user.ts      → GET /users/me, PATCH /users/profile, etc.
chat.ts      → POST /chat/messages, GET /chat/history, etc.
conversation.ts → GET /conversations, POST /conversations, etc.
health.ts    → GET/POST health metrics, goals, etc.
upload.ts    → POST file uploads, avatars, etc.
qa.ts        → POST Q&A queries, GET suggestions
```

**Pattern:**

```
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login-with-refresh', {
    email,
    password,
  });
  return response.data as AuthResponse;
};
```

### 4. HTTP Client Layer (Axios)

**Location:** `src/services/api.ts`

**Responsibilities:**

- Make HTTP requests
- Add JWT tokens to requests
- Handle 401 responses with token refresh
- Log requests and errors
- Queue requests during refresh

**Request Lifecycle:**

```
Component calls Service
    ↓
Service calls api.post/get/etc.
    ↓
Request Interceptor
  ├── Get token from localStorage
  ├── Add to Authorization header
  └── Send request
    ↓
Backend Response
    ↓
Response Interceptor
  ├── Check status code
  ├── If 401 → Queue request + refresh token
  └── Return response
    ↓
Service returns to Component
```

**Request Queue Implementation:**

```typescript
let isRefreshing = false;
const requestQueue: Array<() => void> = [];

// During 401 response:
if (!isRefreshing) {
  isRefreshing = true;

  // Refresh token
  refreshToken()
    .then(() => {
      // Execute queued requests
      requestQueue.forEach(callback => callback());
      requestQueue.length = 0;
    })
    .finally(() => {
      isRefreshing = false;
    });
}

// Queue the original request
requestQueue.push(() => {
  // Retry original request with new token
});
```

### 5. Type System

**Location:** `src/types/`

**Organization:**

```
auth.ts
  - User
  - AuthState
  - LoginCredentials
  - AuthResponse

api.ts
  - ApiResponse<T>
  - ApiError
  - PaginatedResponse<T>

chat.ts
  - ChatMessage
  - ChatResponse

health.ts
  - HealthMetric
  - HealthGoal

(and more domain-specific types)
```

---

## Authentication & Security Architecture

### JWT Token Flow

```
┌─────────────────────────────────────────────────────────┐
│                    LOGIN FLOW                           │
└─────────────────────────────────────────────────────────┘

USER ENTERS CREDENTIALS
    ↓
[LoginPage Component]
    ↓
[useAuth hook calls authContext.login()]
    ↓
[auth/actions.ts → login() function]
    ↓
[API Call: POST /auth/login-with-refresh]
    ├─► Send: email, password
    └─► Receive: access_token, refresh_token
    ↓
[Store in localStorage]
    ├─► localStorage.setItem('access_token', token)
    └─► localStorage.setItem('refresh_token', refreshToken)
    ↓
[Dispatch AUTH_SUCCESS action]
    ├─► AuthContext state updated
    ├─► user = { id, email, name, ... }
    └─► isAuthenticated = true
    ↓
[Component redirects to /dashboard]
    ↓
USER LOGGED IN
```

### Token Refresh Flow

```
┌─────────────────────────────────────────────────────────┐
│              TOKEN REFRESH FLOW (401 Response)          │
└─────────────────────────────────────────────────────────┘

[Component calls API] (access token valid)
    ↓
[Axios Request Interceptor]
    ├─► Get token: localStorage.getItem('access_token')
    └─► Add header: Authorization: Bearer {token}
    ↓
[Request sent to Backend]
    ↓
[Backend Response: 401 Unauthorized]
    (Token has expired)
    ↓
[Axios Response Interceptor - Detects 401]
    ├─► isRefreshing = true
    └─► Queue current request
    ↓
[POST /auth/refresh-token]
    ├─► Send: refresh_token from localStorage
    └─► Receive: new access_token
    ↓
[Update localStorage]
    ├─► localStorage.setItem('access_token', newToken)
    └─► isRefreshing = false
    ↓
[Retry queued requests]
    ├─► Execute each request in queue
    ├─► All use new token from localStorage
    └─► Return responses to callers
    ↓
[Component receives response]
```

### OAuth Google Flow

```
┌─────────────────────────────────────────────────────────┐
│               GOOGLE OAUTH FLOW                         │
└─────────────────────────────────────────────────────────┘

[LoginPage - "Sign in with Google" button]
    ↓
[Redirect to Google OAuth endpoint]
    ├─► client_id: NEXT_PUBLIC_GOOGLE_CLIENT_ID
    ├─► redirect_uri: /auth/google/callback
    └─► scope: openid email profile
    ↓
[User logs in with Google]
    ↓
[Google redirects back to /auth/google/callback]
    ├─► URL param: code={authorization_code}
    └─► URL param: state={csrf_token}
    ↓
[/auth/google/callback route handler]
    ├─► Validate state token (CSRF protection)
    └─► Exchange code for tokens
    ↓
[Backend validates code with Google]
    ├─► Returns: JWT access/refresh tokens
    └─► Creates user if first login
    ↓
[Frontend stores tokens in localStorage]
    ↓
[Redirect to /dashboard]
```

### Security Measures

| Layer                | Mechanism                   | Implementation                        |
| -------------------- | --------------------------- | ------------------------------------- |
| **Transport**        | HTTPS/TLS 1.3+              | Production only (localhost in dev)    |
| **Authentication**   | JWT with access + refresh   | 15min access, 7-day refresh           |
| **Token Refresh**    | Automatic + request queuing | Prevents race conditions              |
| **Input Validation** | Zod schemas on client       | All form inputs validated before send |
| **XSS Prevention**   | React built-in escaping     | No dangerouslySetInnerHTML usage      |
| **CSRF Protection**  | State tokens in OAuth       | Session validation on sensitive ops   |
| **Storage**          | localStorage (frontend)     | Plan to migrate to httpOnly cookies   |
| **Secrets**          | Environment variables       | NEXT*PUBLIC*\* for client config only |

---

## State Management Architecture

### Global State (Authentication)

```
┌─────────────────────────────────────────────────────┐
│            AuthContext State Shape                  │
└─────────────────────────────────────────────────────┘

AuthState {
  user: {
    id: string
    email: string
    name: string
    avatar_url?: string
  } | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

┌─────────────────────────────────────────────────────┐
│           AuthContext Actions                       │
└─────────────────────────────────────────────────────┘

login(email, password)
  └─► Authenticate user
      └─► Returns: access_token, refresh_token, user

register(email, password, name)
  └─► Create new account
      └─► Returns: verification_email_sent

logout()
  └─► Clear tokens
      └─► Clear user state

refreshToken()
  └─► Silent token refresh
      └─► Updates tokens in storage
```

### Server State (React Query)

```
┌─────────────────────────────────────────────────────┐
│         React Query Hooks in VHealth               │
└─────────────────────────────────────────────────────┘

useQuery({
  queryKey: ['user', userId],
  queryFn: () => getUserProfile(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000,   // 10 minutes
})
  → Caches user profile
  → Background refetch if stale
  → Automatic retry on error

useSuspenseQuery({
  queryKey: ['conversations'],
  queryFn: () => getConversations(),
})
  → Integrates with React Suspense
  → Loading boundary handles loading states
  → Throws errors to Error Boundary

useMutation({
  mutationFn: (data) => createConversation(data),
  onSuccess: (newConversation) => {
    queryClient.invalidateQueries({
      queryKey: ['conversations']
    });
  },
})
  → Create new conversation
  → Invalidate conversations list
  → Triggers automatic refetch
```

### Local Component State

```
Component State Examples:

Form Fields:
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

UI State:
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');

Temporary State:
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
```

### Combined State Flow

```
┌──────────────────────────────────────────────────────┐
│          Typical Page State Combination              │
└──────────────────────────────────────────────────────┘

ChatPage Component
  │
  ├─── Global Auth State (useAuth)
  │    └─► user, isAuthenticated
  │
  ├─── Server State (useQuery)
  │    ├─► conversations (from React Query)
  │    └─► messages (from React Query)
  │
  ├─► Context State (useConversation)
  │    └─► currentConversationId
  │
  └─► Local Component State (useState)
       ├─► messageInput (form field)
       ├─► isExpanded (UI state)
       └─► selectedMessageId (selection state)
```

---

## API Integration Architecture

### Service Layer Pattern

```
┌──────────────────────────────────────────────────────┐
│           Service Module Pattern                     │
└──────────────────────────────────────────────────────┘

src/services/auth.ts

import { api } from './api';
import type { LoginCredentials, AuthResponse } from '@/types/auth';

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post('/auth/login-with-refresh', credentials);
  return response.data;
};

export const register = async (data: RegisterInput): Promise<void> => {
  await api.post('/auth/register', data);
};

// Services are ONLY API calls + type conversions
// No business logic, no state management
```

### Axios Interceptor Architecture

```
┌──────────────────────────────────────────────────────┐
│          Request Interceptor Setup                   │
└──────────────────────────────────────────────────────┘

api.interceptors.request.use((config) => {
  // 1. Get token from localStorage
  const token = localStorage.getItem('access_token');

  // 2. Add to Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 3. Add custom headers
  config.headers['X-Request-ID'] = generateUUID();
  config.headers['X-Timestamp'] = new Date().toISOString();

  return config;
});

┌──────────────────────────────────────────────────────┐
│          Response Interceptor Setup                  │
└──────────────────────────────────────────────────────┘

api.interceptors.response.use(
  (response) => {
    // Success - return as-is
    return response;
  },
  async (error) => {
    const { response, config } = error;

    // Only handle 401 (Unauthorized)
    if (response?.status === 401 && !config._retry) {
      config._retry = true;

      // Start token refresh if not already started
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Call refresh endpoint
          const { data } = await api.post('/auth/refresh-token', {
            refresh_token: localStorage.getItem('refresh_token'),
          });

          // Update token
          localStorage.setItem('access_token', data.access_token);

          // Execute queued requests
          requestQueue.forEach((callback) => callback());
          requestQueue.length = 0;

          // Retry original request
          return api(config);
        } catch (refreshError) {
          // Refresh failed - redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Refresh in progress - queue this request
        return new Promise((resolve) => {
          requestQueue.push(() => {
            resolve(api(config));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);
```

### API Response Typing

```typescript
┌──────────────────────────────────────────────────────┐
│           Generic API Response Type                  │
└──────────────────────────────────────────────────────┘

// Generic wrapper for all API responses
type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
};

// Example usage:
const loginResponse: ApiResponse<AuthTokens> = {
  success: true,
  data: {
    access_token: '...',
    refresh_token: '...',
  },
  timestamp: '2025-12-06T...',
};

// Service function with typing:
export const login = async (
  credentials: LoginCredentials
): Promise<AuthTokens> => {
  const response = await api.post<ApiResponse<AuthTokens>>(
    '/auth/login-with-refresh',
    credentials
  );
  return response.data.data;
};
```

---

## Component Hierarchy

### Page Hierarchy

```
app/
├── (auth)
│   ├── login/page.tsx
│   │   └── LoginPage
│   │       ├── Header
│   │       ├── LoginForm
│   │       │   ├── TextField (email)
│   │       │   ├── TextField (password)
│   │       │   └── SubmitButton
│   │       ├── GoogleOAuthButton
│   │       └── SignupLink
│   │
│   ├── register/page.tsx
│   │   └── RegisterPage
│   │       ├── RegistrationForm
│   │       └── LoginLink
│   │
│   └── ... (other auth pages)
│
└── (dashboard)
    ├── dashboard/page.tsx
    │   └── DashboardPage
    │       ├── Header
    │       ├── HealthSummary
    │       │   ├── MetricCard
    │       │   └── MetricCard
    │       ├── RecentActivity
    │       └── ChatButton
    │
    ├── profile/page.tsx
    │   └── ProfilePage
    │       ├── ProfileForm
    │       ├── AvatarUpload
    │       └── PasswordChange
    │
    ├── chatbox/page.tsx
    │   └── ChatPage
    │       ├── ConversationList
    │       │   └── ConversationListItem
    │       ├── ChatMessages
    │       │   └── ChatMessage
    │       └── ChatInput
    │
    ├── predict/page.tsx
    │   └── PredictPage
    │       ├── HealthMetricsCard
    │       ├── UserInfoSection
    │       └── PredictionResultCard
    │
    └── practice/page.tsx
        └── PracticePage
            ├── BasicInfoSection (Phase 2)
            ├── ScheduleSection (Phase 3)
            │   ├── DayPicker
            │   ├── FlexibleMode
            │   ├── FixedMode
            │   └── TimePeriodInput
            ├── SportsSection
            └── NotesSection
    │
    └── ... (other dashboard pages)

root/layout.tsx
├── AuthProvider
├── QueryClientProvider
├── Header
└── Children pages
```

### Component Classification

```
┌──────────────────────────────────────────────────────┐
│            Component Categories                      │
└──────────────────────────────────────────────────────┘

Pages (in src/app/**/page.tsx)
  → Full page components
  → Handle routing
  → Layout with providers

Feature Components (src/components/chat/, predict/)
  → Business logic specific to feature
  → Can be complex multi-component modules
  → Use feature-specific hooks

Layout Components (src/components/layout/)
  → Header, Footer, Sidebar
  → Used across multiple pages
  → Global UI structure

Form Components (src/components/form/)
  → TextField, NumberInput, Dropdown
  → Wrap shadcn/ui primitives
  → Integrate with React Hook Form

UI Components (src/components/ui/)
  → shadcn/ui Radix primitives
  → Button, Input, Dialog, etc.
  → No business logic

Shared Components (src/components/shared/)
  → Avatar, Card, Logo, Navigation
  → Used across features
  → Generic/reusable
```

### ScheduleSection Component Architecture (Phase 3)

**Location:** `src/components/practice/ScheduleSection/`

**Architecture Pattern:** Compound Component with Controlled Inputs

**Component Hierarchy:**

```
ScheduleSection (Main Container)
  ├── Tabs (Mode Toggle: flexible/fixed)
  ├── DayPicker (Multi-select day buttons)
  └── Conditional Mode Rendering
      ├── FlexibleMode (when mode='flexible')
      │   ├── Maps selectedDays → Day sections
      │   ├── TimePeriodInput (per period)
      │   └── Add Period Button
      └── FixedMode (when mode='fixed')
          └── Single TimePeriodInput
```

**Key Design Decisions:**

- **Controlled Components**: All state managed by React Hook Form
- **Compound Pattern**: Sub-components work together via props
- **Conditional Rendering**: Mode switch changes entire UI structure
- **Reusable TimeInput**: Shared between flexible and fixed modes
- **Real-time Validation**: Immediate feedback on time conflicts
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

**Data Flow:**

```
Form State (React Hook Form)
  ↓ watch()
ScheduleSection
  ↓ props
DayPicker / FlexibleMode / FixedMode
  ↓ callbacks
TimePeriodInput
  ↓ onChange
Back to Form State
```

**Validation Features:**

- Ensures endTime > startTime
- Auto-clears invalid end times
- Calculates duration in real-time
- Shows visual validation states
- Validates at least one day selected
- Prevents overlapping periods per day

---

## Data Flow Patterns

### Pattern 1: User Authentication Flow

```
User Input (email, password)
    ↓
[LoginPage component]
    ↓
[useAuth hook → authContext.login()]
    ↓
[auth/actions.ts → login service call]
    ↓
[services/auth.ts → api.post('/auth/login-with-refresh')]
    ↓
[Axios client → request interceptor → send request]
    ↓
[Backend API processes]
    ↓
[Response: { access_token, refresh_token, user }]
    ↓
[Response interceptor validates]
    ↓
[Service returns typed response]
    ↓
[authContext reducer → AUTH_SUCCESS]
    ↓
[State: user, isAuthenticated=true]
    ↓
[Component redirects to /dashboard]
    ↓
UI Updates with user data
```

### Pattern 2: Data Fetching with React Query

```
[ChatPage component mounts]
    ↓
[useQuery('conversations') called]
    ↓
[React Query checks cache]
    ├─► Cache HIT → Return cached data
    └─► Cache MISS → Fetch from server
    ↓
[Service function called: getConversations()]
    ↓
[Axios client with auth token]
    ↓
[Backend returns conversations array]
    ↓
[React Query caches response]
    ↓
[Component receives data via useSuspenseQuery]
    ↓
[Component renders conversation list]
    ↓
[User selects conversation]
    ↓
[useQuery('messages', conversationId) called]
    ↓
[Messages fetched and cached]
    ↓
[Messages displayed in UI]
```

### Pattern 3: Form Submission

```
[User fills form inputs]
    ↓
[Local state updates: useState]
    ↓
[User submits form]
    ↓
[React Hook Form validation]
    ├─► Zod schema validation
    └─► Client-side error display
    ↓
[If valid, call mutation]
    ↓
[useMutation → service function]
    ↓
[POST request to backend]
    ↓
[If success]
    ├─► Show success toast
    ├─► Invalidate related queries
    └─► Redirect or close dialog
    ↓
[If error]
    ├─► Show error toast
    └─► Display form errors
```

### Pattern 4: Real-Time Chat Streaming

```
[User sends message]
    ↓
[Message added to local state]
    ↓
[POST /chat/send]
    ├─► message text
    └─► conversation_id
    ↓
[Server starts streaming response]
    ↓
[EventSource / Fetch streaming]
    ├─► Chunk 1: "Hello"
    ├─► Chunk 2: ", how"
    ├─► Chunk 3: " are you?"
    └─► Stream ends
    ↓
[Each chunk updates component state]
    ↓
[UI updates in real-time showing "Hello"]
[UI updates showing "Hello, how"]
[UI updates showing "Hello, how are you?"]
    ↓
[Complete message displayed]
    ↓
[React Query invalidates message list]
    ↓
[Background refetch updates cache]
```

### Pattern 6: Practice Plan Form with Schedule Configuration (Phase 3)

```
[PracticePage mounts with ScheduleSection]
    ↓
[useForm() initialized with schedule defaults]
    ├─► mode: 'flexible' (default)
    ├─► selectedDays: [] (empty array)
    ├─► flexiblePeriods: {} (empty object)
    └─► fixedPeriod: { startTime: '', endTime: '' }
    ↓
[ScheduleSection renders with form.control]
    ├─► Mode toggle tabs (flexible/fixed)
    ├─► DayPicker with circular buttons
    ├─► Conditional mode rendering
    └─► Form validation integration
    ↓
[User selects days in DayPicker]
    ├─► onChange updates form.selectedDays
    ├─► Visual feedback (selected state)
    ├─► ARIA labels for accessibility
    └─► Triggers mode component re-render
    ↓
[FlexibleMode renders when mode='flexible']
    ├─► Maps selectedDays to day sections
    ├─► Each day shows TimePeriodInput components
    ├─► "Add period" button per day
    ├─► Dynamic add/remove periods
    └─► Real-time duration calculation
    ↓
[FixedMode renders when mode='fixed']
    ├─► Single TimePeriodInput for all days
    ├─► Helper text about multi-day application
    ├─► No add/remove functionality needed
    └─► Same validation as flexible mode
    ↓
[TimePeriodInput handles time validation]
    ├─► Ensures endTime > startTime
    ├─► Auto-clears invalid end times
    ├─► Calculates duration in real-time
    ├─► Shows visual validation states
    └─► Supports add/remove in flexible mode
    ↓
[Form submission with Zod validation]
    ├─► Validates selectedDays.length > 0
    ├─► Validates time periods format
    ├─► Ensures no overlapping periods per day
    └─► Returns structured schedule data
```

### Pattern 5: Practice Plan Form with Pre-fill (Phase 2)

```
[PracticePage mounts]
    ↓
[useAuth() checks authentication]
    ↓
[useQuery('userProfile', userId) called]
    ├─► Fetches user profile for pre-fill
    └─► StaleTime: 5 minutes
    ↓
[useForm() initialized with default values]
    ├─► basicInfo: { height: undefined, weight: undefined, targetWeight: 0 }
    ├─► schedule: { mode: 'flexible', selectedDays: [] }
    ├─► sports: { predefined: [], custom: [] }
    └─► notes: { personal: '', healthWarnings: '' }
    ↓
[useEffect() watches userProfile load]
    ├─► If profile.height_cm → setValue('basicInfo.height')
    ├─► If profile.weight_kg → setValue('basicInfo.weight')
    ├─► If profile.goal → setValue('basicInfo.goal')
    └─► Fields show lock icon if pre-filled
    ↓
[User interacts with BasicInfoSection]
    ├─► Pre-filled fields show lock icon
    ├─► "From your profile" helper text
    ├─► Target weight validates based on goal
    │   ├─► If goal='gain': target > current
    │   ├─► If goal='lose': target < current
    │   └─► If goal='maintain': target ≈ current (±1kg)
    └─► Real-time validation messages
    ↓
[User submits form]
    ├─► Zod schema validation (client-side)
    ├─► If valid: setIsSubmitting(true)
    ├─► TODO: API integration (Phase 5)
    └─► On error: show toast notification
```

---

## Routing Architecture

### Next.js App Router Structure

```
┌──────────────────────────────────────────────────────┐
│           Route Groups (Grouped Routes)              │
└──────────────────────────────────────────────────────┘

src/app/(auth)/
  ├── login/page.tsx           → /login
  ├── register/page.tsx        → /register
  ├── forgot-password/...      → /forgot-password
  └── layout.tsx               → Auth layout (all auth pages)

src/app/(dashboard)/
  ├── dashboard/page.tsx       → /dashboard
  ├── profile/page.tsx         → /profile
  ├── chatbox/page.tsx         → /chatbox
  ├── predict/page.tsx         → /predict
  ├── practice/page.tsx        → /practice (Phase 2)
  └── layout.tsx               → Dashboard layout

src/app/
  ├── page.tsx                 → / (landing)
  ├── layout.tsx               → Root layout (all pages)
  └── globals.css

Route Groups Benefits:
  - Organize routes without URL structure changes
  - Different layouts for different route groups
  - Shared metadata per group
  - Keep related routes together
```

### Protected Routes Implementation

```
┌──────────────────────────────────────────────────────┐
│         Route Protection Pattern                     │
└──────────────────────────────────────────────────────┘

Protected Route HOC: src/components/shared/ProtectedRoute.tsx

export const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    router.push(`/auth/login?redirect=${window.location.pathname}`);
    return null;
  }

  return children;
};

Usage in page.tsx:
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

### Middleware for Route Protection

```
┌──────────────────────────────────────────────────────┐
│    Future: Route Protection via Middleware           │
└──────────────────────────────────────────────────────┘

src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check token in cookies/headers
  const token = request.cookies.get('accessToken')?.value;

  // If accessing protected route without token
  if (!token && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/chatbox/:path*'],
};
```

---

## Build & Deployment Architecture

### Development Build

```
┌──────────────────────────────────────────────────────┐
│         Development Build (bun run dev)              │
└──────────────────────────────────────────────────────┘

Source Code (TypeScript, JSX, CSS)
    ↓
Turbopack
  ├─► Fast incremental builds
  ├─► Hot module replacement (HMR)
  ├─► Fast refresh for components
  └─► Esbuild for compilation
    ↓
Tailwind CSS Processing
  ├─► JIT (Just-in-Time) CSS generation
  └─► CSS variable substitution
    ↓
Next.js Dev Server
  ├─► localhost:3000
  ├─► Request routes to /app pages
  └─► Serve static assets
    ↓
Browser
  ├─► Fetch HTML from dev server
  ├─► Load JavaScript bundles
  └─► Establish WebSocket for HMR
    ↓
Developer makes change
  ↓
Turbopack detects change
  ↓
HMR sends update to browser
  ↓
Browser updates without full reload
```

### Production Build

```
┌──────────────────────────────────────────────────────┐
│       Production Build (bun run build)               │
└──────────────────────────────────────────────────────┘

Source Code
    ↓
TypeScript Compilation
  ├─► Type checking
  ├─► Emit JavaScript
  └─► Source maps for debugging
    ↓
Webpack (Production)
  ├─► Code minification
  ├─► Tree-shaking (remove unused code)
  ├─► Code splitting per route
  └─► Bundle optimization
    ↓
Tailwind CSS
  ├─► Purge unused styles
  ├─► Minify CSS
  └─► Generate critical CSS
    ↓
Image Optimization
  ├─► Compress images
  ├─► Generate WebP versions
  └─► Create responsive variants
    ↓
Output File Tracing
  ├─► Identify required files
  └─► Reduce image size (50% reduction)
    ↓
.next/ Directory
  ├─► .next/static/ - Static assets
  ├─► .next/server/ - Server-side code
  └─► .next/standalone/ - Docker output
    ↓
Ready for Deployment
```

### Docker Containerization

```
┌──────────────────────────────────────────────────────┐
│         Docker Multi-Stage Build                     │
└──────────────────────────────────────────────────────┘

Stage 1: base
  └─► oven/bun:1.2-alpine
      ├─► Minimal Linux image (~5MB)
      └─► Bun runtime included

Stage 2: deps (Dependency Caching)
  ├─► Install npm dependencies
  ├─► Separate stage for Docker layer caching
  └─► Speeds up subsequent builds

Stage 3: builder (Compilation)
  ├─► Run 'bun run build'
  ├─► Compile Next.js app
  ├─► Inject build arguments:
  │   ├─► NEXT_PUBLIC_API_URL
  │   ├─► NEXT_PUBLIC_GOOGLE_CLIENT_ID
  │   └─► Build metadata
  └─► Output to .next/

Stage 4: runner (Production Image)
  ├─► Copy .next/ from builder
  ├─► Copy public/ assets
  ├─► Create non-root user (nextjs:1001)
  ├─► Expose port 3000
  └─► Run 'bun start'

Final Image: ~200-300MB (optimized)
```

---

## Infrastructure Architecture

### Cloud Deployment Stack

```
┌─────────────────────────────────────────────────────┐
│          Google Cloud Platform (GCP)                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│    vhealth-test Project (Test Environment)          │
├─────────────────────────────────────────────────────┤
│ Cloud Run Service: vhealth-frontend-test            │
│  ├─► 1 vCPU, 512MB memory                           │
│  ├─► Min instances: 0 (scales to zero)              │
│  ├─► Max instances: 3                               │
│  └─► Region: asia-southeast1                        │
│                                                      │
│ Artifact Registry: vhealth-frontend-test            │
│  └─► Stores Docker images for test                  │
│                                                      │
│ Cloud Storage (Terraform State)                     │
│  └─► vhealth-test-frontend-tfstate                  │
│      Stores infrastructure state safely              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│   vhealth-prod Project (Production Environment)     │
├─────────────────────────────────────────────────────┤
│ Cloud Run Service: vhealth-frontend-prod            │
│  ├─► 2 vCPU, 1GB memory                             │
│  ├─► Min instances: 1 (always running)              │
│  ├─► Max instances: 10                              │
│  └─► Region: asia-southeast1                        │
│                                                      │
│ Artifact Registry: vhealth-frontend-prod            │
│  └─► Stores Docker images for prod                  │
│                                                      │
│ Cloud Storage (Terraform State)                     │
│  └─► vhealth-prod-frontend-tfstate                  │
│      Stores infrastructure state safely              │
│                                                      │
│ Secret Manager                                      │
│  ├─► GOOGLE_CLIENT_ID                               │
│  ├─► GOOGLE_CLIENT_SECRET                           │
│  └─► GOOGLE_REDIRECT_URI                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│         Backend & Database (Separate)               │
├─────────────────────────────────────────────────────┤
│ Django REST API: health-management-backend          │
│  └─► Deployed separately                             │
│                                                      │
│ PostgreSQL Database                                 │
│  └─► Managed database instance                      │
└─────────────────────────────────────────────────────┘
```

### CI/CD Pipeline

```
┌─────────────────────────────────────────────────────┐
│        Jenkins Declarative Pipeline                 │
└─────────────────────────────────────────────────────┘

1. Initialize
   └─► Validate configuration

2. Checkout
   └─► Clone branch (develop or feature)

3. Authenticate to GCP
   └─► Load service account credentials

4. Quality Checks (Parallel)
   ├─► ESLint: bun run lint
   ├─► Format: bun run format:check
   └─► Type checking: bun run type-check (optional)

5. Fetch Build Secrets
   └─► Google Secret Manager → build environment

6. Build & Push Docker Image
   ├─► bun run build (compile Next.js)
   ├─► docker build (multi-stage)
   ├─► Tag image: {registry}/{project}/{repo}:{build#}-{commit}
   └─► docker push (to Artifact Registry)

7. Terraform Deployment
   ├─► terraform init (setup backend)
   ├─► terraform plan (preview changes)
   ├─► terraform apply (deploy to Cloud Run)
   └─► terraform output (get service URL)

8. Cleanup
   ├─► docker system prune (remove unused images)
   └─► Workspace cleanup (remove artifacts)

Deployment Time: 15-25 minutes
  ├─► Linting & checks: 2-3 min
  ├─► Docker build & push: 5-8 min
  └─► Terraform deploy: 8-12 min
```

---

## Security Architecture

### Authentication Security

```
┌──────────────────────────────────────────────────────┐
│         JWT Token Security                          │
└──────────────────────────────────────────────────────┘

Access Token (15 minutes)
  ├─► Short-lived for active sessions
  ├─► Stored in localStorage
  ├─► Sent with every request
  └─► Validated by backend on each request

Refresh Token (7 days)
  ├─► Long-lived for token renewal
  ├─► Stored in localStorage
  ├─► Only sent when refreshing access token
  └─► Used only for getting new access token

Token Refresh Security
  ├─► Prevents token expiry UX issues
  ├─► Request queuing prevents race conditions
  ├─► Failed refresh redirects to login
  └─► Token rotation ensures fresh tokens
```

### Data Protection

```
┌──────────────────────────────────────────────────────┐
│       Data Protection in Transit & Storage          │
└──────────────────────────────────────────────────────┘

In Transit
  ├─► HTTPS/TLS 1.3+ enforced (production)
  ├─► Certificates from Google Cloud
  └─► All API calls encrypted

At Rest (Frontend)
  ├─► localStorage - tokens stored unencrypted
  ├─► Plan: migrate to httpOnly cookies
  ├─► No passwords stored on client
  └─► Health data never cached locally

At Rest (Backend)
  ├─► PostgreSQL with encryption at rest
  ├─► Cloud Storage encryption
  ├─► Secret Manager for credentials
  └─► Environment-isolated secrets
```

### Input & Output Security

```
┌──────────────────────────────────────────────────────┐
│      Input/Output Security Measures                  │
└──────────────────────────────────────────────────────┘

Input Validation
  ├─► Zod schemas on all form inputs
  ├─► Client-side validation (UX)
  ├─► Backend re-validation (security)
  ├─► Type safety prevents injection
  └─► SQL injection prevented by ORMs

Output Encoding
  ├─► React auto-escapes HTML
  ├─► No dangerouslySetInnerHTML usage
  ├─► Content Security Policy headers
  └─► X-Frame-Options to prevent clickjacking

CORS Configuration
  ├─► Specific origins whitelisted
  ├─► Credentials allowed for same-origin only
  └─► Preflight checks on complex requests
```

---

## Monitoring & Observability

### Application Monitoring

```
┌──────────────────────────────────────────────────────┐
│       Monitoring Architecture                        │
└──────────────────────────────────────────────────────┘

Client-Side
  ├─► Console errors & warnings
  ├─► Network request logging
  ├─► Performance metrics (Web Vitals)
  └─► Error boundaries catch React errors

Server-Side (Cloud Run)
  ├─► Application logs to Cloud Logging
  ├─► Request/response logging
  ├─► Error rate tracking
  └─► Performance metrics

Analytics (Optional)
  ├─► User behavior tracking
  ├─► Feature usage metrics
  ├─► Session duration & flows
  └─► Enabled via NEXT_PUBLIC_ENABLE_ANALYTICS
```

### Performance Metrics

| Metric                             | Target | Measurement              |
| ---------------------------------- | ------ | ------------------------ |
| **First Contentful Paint (FCP)**   | <2s    | Page becomes interactive |
| **Largest Contentful Paint (LCP)** | <3s    | Main content rendered    |
| **Cumulative Layout Shift (CLS)**  | <0.1   | Layout stability         |
| **Time to Interactive (TTI)**      | <3s    | Page fully interactive   |
| **API Response Time**              | <500ms | Backend latency          |
| **Chat Response Time**             | <2s    | Streaming response start |

---

## Summary Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                       VHealth Complete Flow                    │
└────────────────────────────────────────────────────────────────┘

USER BROWSER
  ↓ types request
NEXT.JS APP ROUTER
  ↓ renders
REACT COMPONENTS
  ↓ uses
CUSTOM HOOKS & CONTEXT
  ↓ calls
SERVICE LAYER (API functions)
  ↓ makes request via
AXIOS CLIENT (with interceptors)
  ↓ sends
HTTP REQUEST (with JWT token)
  ↓ received by
DJANGO REST API (Backend)
  ↓ queries/updates
POSTGRESQL DATABASE
  ↓ responds with
HTTP RESPONSE (JSON data)
  ↓ processed by
AXIOS RESPONSE INTERCEPTOR (401 handling)
  ↓ returned to
SERVICE LAYER
  ↓ updates
REACT QUERY CACHE / CONTEXT
  ↓ triggers
COMPONENT RE-RENDER
  ↓ displays
UPDATED UI

All secured with JWT tokens, validated inputs, and encrypted transport.
```

---

**For more details on specific areas:**

- `docs/codebase-summary.md` - File organization and structure
- `docs/code-standards.md` - Development conventions
- `docs/deployment-guide.md` - Deployment procedures
- `/plans/reports/architecture-quick-reference-251206.md` - Quick reference
