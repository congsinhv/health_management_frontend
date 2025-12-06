# VHealth Frontend - Codebase Summary

**Project:** health_management_frontend
**Framework:** Next.js 15.5.3 with App Router
**Language:** TypeScript 5.x
**Styling:** Tailwind CSS v4
**Package Manager:** Bun
**Last Updated:** December 2025

---

## Directory Structure

### Root Level

```
health_management_frontend/
├── src/                       # Main application source code
├── docs/                      # Documentation files
├── public/                    # Static assets (SVG, fonts, images)
├── terraform/                 # Infrastructure as Code (IaC)
├── .github/                   # GitHub configuration and workflows
├── .husky/                    # Git hooks configuration
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── components.json           # shadcn/ui configuration
├── eslintrc.json            # ESLint configuration
├── prettier.config.js        # Code formatting rules
├── Dockerfile                # Docker containerization
├── .dockerignore             # Docker exclusions
├── Jenkinsfile               # CI/CD pipeline
├── package.json              # Project dependencies
└── README.md                 # Project overview
```

### src/ - Application Source Code

#### app/ - Next.js App Router Pages

```
src/app/
├── (auth)/                    # Authentication routes (grouped)
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── forgot-password/      # Password recovery initiation
│   ├── reset-password/       # Password reset form
│   ├── verify-email/         # Email verification page
│   ├── resend-verification/  # Resend verification email
│   ├── google/callback/      # Google OAuth callback handler
│   └── callback/             # Generic OAuth callback
│
├── (dashboard)/               # Protected dashboard routes (grouped)
│   ├── dashboard/            # Main dashboard page
│   ├── profile/              # User profile management
│   ├── settings/             # Account settings
│   ├── health-tracking/      # Health metrics tracking
│   ├── chatbox/              # AI chat interface
│   ├── predict/              # Health prediction page
│   └── practice/             # Practice plan configuration (Phase 2)
│
├── api/                       # API route handlers
│   └── health/               # Health-related API endpoints
│
├── layout.tsx                 # Root layout with providers
├── page.tsx                   # Landing page (/)
└── globals.css               # Global styles (Tailwind CSS)
```

**Key Pattern:** Grouped routes using `(groupName)` syntax (Route Groups) - improves organization without affecting URL structure.

#### components/ - React Components (Atomic Design)

**8 Component Categories:**

1. **ui/** - shadcn/ui Components (20+ primitives)
   - button, input, form, card, dialog, tabs, select
   - checkbox, radio-group, label, textarea, badge
   - alert, skeleton, date-picker, popover, calendar
   - password-strength, sonner (toast notifications)
   - All built on Radix UI primitives

2. **form/** - Form Wrapper Components
   - `TextField.tsx` - Reusable input wrapper with validation
   - `NumberInput.tsx` - Numeric input with constraints
   - `Dropdown.tsx` - Select/dropdown wrapper
   - `RatioField.tsx` - Radio group wrapper
   - Integrates with React Hook Form and Zod

3. **chat/** - Chat Feature Components
   - `ChatFloatingButton.tsx` - Persistent chat button
   - `ChatMessage.tsx` - Individual message renderer
   - `ConversationList.tsx` - Conversation history display
   - `ConversationListItem.tsx` - Single conversation item
   - `ConversationSwitcher.tsx` - Switch between conversations
   - `ConversationTitle.tsx` - Conversation header
   - `QuickResponses.tsx` - Quick suggestion templates
   - `StreamingIndicator.tsx` - Loading animation for streaming

4. **predict/** - Health Prediction Feature
   - `HealthMetricsCard.tsx` - Display user metrics
   - `UserInfoSection.tsx` - User information section
   - `HealthAnalysisSection.tsx` - Health analysis display
   - `DietPlanSection.tsx` - Diet recommendations
   - `WorkoutPlanSection.tsx` - Exercise recommendations
   - `PredictionResultCard.tsx` - Result presentation
   - `index.ts` - Barrel export

5. **layout/** - Layout Components
   - `Header.tsx` - Top navigation bar
   - `HeaderVertical.tsx` - Sidebar/vertical navigation
   - `Footer.tsx` - Page footer

6. **shared/** - Reusable Shared Components
   - `Card.tsx` - Generic card component
   - `Avatar.tsx` - User avatar display
   - `AvatarFill.tsx` - Avatar variant with background
   - `Logo.tsx` - Application logo
   - `Navigation.tsx` - Navigation menu
   - `ProtectedRoute.tsx` - Route protection HOC
   - `ErrorBoundary.tsx` - Error handling wrapper
   - `LoadingOverlay.tsx` - Full-page loading state

7. **marketing/** - Marketing & Landing Page
   - `FeaturesSection.tsx` - Feature highlights
   - `InformationSection.tsx` - Information blocks

8. **icons/** - Custom SVG Icon Components
   - `index.tsx` - Barrel export with all icons
   - `logo.tsx`, `home.tsx`, `add.tsx`, `menu.tsx`
   - `tab.tsx`, `heartbeat.tsx`, `history.tsx`
   - Custom SVG components generated with SVGR

9. **practice/** - Practice Plan Feature (Phase 2-3)
   - `BasicInfoSection.tsx` - Basic health info form with pre-fill
   - `ScheduleSection/` - Schedule configuration components (Phase 3)
     - `index.tsx` - Main schedule section with mode toggle
     - `DayPicker.tsx` - Day selection with circular buttons
     - `FlexibleMode.tsx` - Per-day time period configuration
     - `FixedMode.tsx` - Single time period for all days
     - `TimePeriodInput.tsx` - Time input with validation and duration calculation
     - `ScheduleSection.test.tsx` - Unit tests for schedule components
   - `index.ts` - Barrel export
   - Handles user profile pre-fill, dynamic validation, security lock icons

#### contexts/ - React Context State Management

**Two Context Systems:**

1. **auth/** - Authentication Context

   ```
   ├── AuthContext.tsx    # Provider and useAuth() hook
   ├── actions.ts         # Business logic (login, logout, register, etc.)
   ├── reducer.ts         # State reducer function
   ├── types.ts           # Type definitions (AuthState, AuthAction)
   └── index.ts           # Barrel export
   ```

   - Manages user authentication state
   - Handles token storage and retrieval
   - Provides useAuth() hook for components
   - Integrates with localStorage for persistence

2. **conversation/** - Conversation Context

   ```
   ├── ConversationContext.tsx  # Provider and useConversation() hook
   ├── actions.ts               # Conversation actions
   ├── reducer.ts               # State reducer
   ├── types.ts                 # Type definitions
   └── index.ts                 # Barrel export
   ```

   - Manages chat conversation state
   - Handles conversation history
   - Provides conversation switching

#### hooks/ - Custom React Hooks (8 total)

- `useAuth.ts` - Wrapper around AuthContext
- `useChat.ts` - Chat session management
- `useQAChat.ts` - Q&A chat functionality
- `useAvatarDisplay.ts` - Avatar rendering logic
- `useAvatarError.ts` - Avatar error handling
- `useForgotPassword.ts` - Password reset flow
- `useCountdown.ts` - Countdown timer utility
- `useQueryParams.ts` - URL query parameter parsing

#### lib/ - Utilities & Configuration

```
src/lib/
├── utils/
│   ├── index.ts            # Barrel export
│   ├── cn.ts               # classnames utility (Tailwind)
│   ├── avatar.ts           # Avatar color logic
│   ├── transforms.ts       # Data transformation helpers
│   └── prediction.ts       # Prediction utilities
├── constants.ts            # App-wide constants
├── storage.ts              # localStorage abstraction
├── logger.ts               # Custom logging utility
└── react-query.tsx         # React Query provider config
```

**Key Utilities:**

- `cn()` - conditional Tailwind class combining
- `getAvatarColor()` - deterministic avatar background colors
- `formatDate()`, `parseDate()` - date transformations
- `logger` - centralized logging system
- `storage` - type-safe localStorage wrapper

#### services/ - API Integration Layer (8 modules)

```
src/services/
├── api.ts                  # Axios client with interceptors
├── auth.ts                 # Authentication endpoints
├── user.ts                 # User profile endpoints
├── conversation.ts         # Chat conversation endpoints
├── chat.ts                 # Chat message endpoints
├── qa.ts                   # Q&A assistant endpoints
├── upload.ts               # File upload endpoints
└── health.ts               # Health metrics endpoints
```

**Axios Interceptor Chain:**

1. Request interceptor: Adds JWT token to headers
2. Response interceptor: Handles 401 errors with refresh token
3. Error interceptor: Logs errors and shows toasts
4. Request queuing: Prevents duplicate refresh token calls

#### types/ - TypeScript Type Definitions (11 files)

All types centralized in one location (NOT in service files):

```
src/types/
├── auth.ts          # User, AuthState, LoginCredentials, AuthResponse
├── user.ts          # UserData, UpdateUserProfileData
├── api.ts           # Generic API types (ApiResponse, ApiError)
├── streaming.ts     # SSE and streaming types
├── conversation.ts  # Conversation, Message types
├── chat.ts          # Chat-specific types
├── prediction.ts    # Prediction response types
├── health.ts        # Health metrics types
├── forms.ts         # Form validation types
├── error.ts         # Error handling types
└── index.ts         # Barrel export
```

---

## File Statistics

| Category                   | Count     | Notes                                                                                  |
| -------------------------- | --------- | -------------------------------------------------------------------------------------- |
| Components                 | 105+      | Including ui/, form/, chat/, predict/, layout/, shared/, marketing/, icons/, practice/ |
| Pages                      | 13        | Auth (8) + Dashboard (5)                                                               |
| Services                   | 8         | API service modules                                                                    |
| Hooks                      | 8         | Custom React hooks                                                                     |
| Contexts                   | 2         | Auth + Conversation                                                                    |
| Type Definition Files      | 11        | Comprehensive type coverage                                                            |
| Config Files               | 8         | TS, ESLint, Prettier, Tailwind, etc.                                                   |
| **Total TypeScript Files** | **~200+** | Well-organized and modular                                                             |

---

## Key Architectural Patterns

### 1. Layered Architecture

```
UI Layer (Pages & Components)
    ↓ imports
Business Logic Layer (Hooks, Contexts)
    ↓ imports
Service Layer (API functions)
    ↓ imports
HTTP Client Layer (Axios with interceptors)
    ↓ calls
Backend API
```

### 2. Atomic Design Pattern

- **Atoms:** Basic UI primitives (button, input, label)
- **Molecules:** Form inputs, card layouts, simple combinations
- **Organisms:** Complex components (ChatInterface, HealthDashboard)
- **Templates:** Page layouts
- **Pages:** Complete page implementations

### 3. Context + Hooks Pattern

- Contexts define state shape and provider
- Custom hooks wrap context for easier usage
- Components consume via hooks, not directly accessing context
- Example: `AuthContext` → `useAuth()` → Components

### 4. Service Layer Abstraction

- All API calls go through services (never directly from components)
- Services import types from `types/` directory
- Axios client in `api.ts` provides interceptor chain
- Error handling centralized at service layer

### 5. Type-First Development

- All types defined in `src/types/`
- Services import types, don't define them
- Components typed with JSDoc and explicit types
- Generic API response type wraps all responses

---

## Component Organization Strategy

### Feature-Specific Components

Located in feature folders (`chat/`, `predict/`, etc.):

- Tightly coupled to feature logic
- Can import from shared/ and ui/
- Have barrel exports for clean imports

### Reusable Shared Components

Located in `shared/`:

- Used across multiple features
- Generic functionality (Avatar, Card, Logo)
- Single component per file in shared/
- Reusable across different contexts

### Form Components

Located in `form/`:

- Wrapper components for input types
- Integrate React Hook Form + Zod
- Standardized validation handling
- Consistent styling across all forms

### UI Primitives

Located in `ui/`:

- shadcn/ui components (Radix UI based)
- Don't modify directly - use composition
- All props properly typed with Radix types
- Consistent with design system

### ScheduleSection Components (Phase 3)

Located in `practice/ScheduleSection/`:

**Architecture Pattern:** Compound Component + Controlled Components

- **ScheduleSection** - Main container with mode toggle (flexible/fixed)
- **DayPicker** - Circular button selection for days of week
- **FlexibleMode** - Per-day time period configuration
- **FixedMode** - Single time period applied to all selected days
- **TimePeriodInput** - Reusable time input with validation

**Key Features:**

- Mode switching between flexible and fixed scheduling
- Multi-day selection with visual feedback
- Dynamic time period management (add/remove)
- Real-time duration calculation
- Validation ensuring end time > start time
- Accessibility with ARIA labels and keyboard navigation

---

## State Management Approach

### Authentication State (Global)

**Location:** `src/contexts/auth/`
**Tool:** React Context
**Persistence:** localStorage
**Usage:** `const { user, isAuthenticated } = useAuth()`

- Stored in localStorage for persistence
- Accessed globally via useAuth() hook
- Actions: login, logout, register, refresh
- Used on every protected route

### Server State (Global)

**Location:** Configured in `src/lib/react-query.tsx`
**Tool:** TanStack Query (React Query) v5
**Cache:** In-memory with customizable TTL
**Usage:** `const { data } = useSuspenseQuery(...)`

- API response caching
- Background refetching
- Stale state handling
- Suspense integration

### Local Component State

**Location:** Component files
**Tool:** useState() hook
**Scope:** Single component
**Usage:** Form inputs, UI toggles, temporary state

Examples:

- Form field values during editing
- Modal open/close state
- Accordion expanded sections

### Component Prop State

**Location:** Parent → Child components
**Tool:** React props
**Scope:** Component hierarchy
**Usage:** Configuration and behavior control

---

## Type System Organization

### Type Files by Domain

**auth.ts** - Authentication Types

- `User` - User profile data
- `AuthState` - Global auth state
- `LoginCredentials` - Login form input
- `RegisterCredentials` - Registration input
- `AuthResponse` - Server response after login

**user.ts** - User Management Types

- `UserData` - User profile information
- `UpdateUserProfileData` - Profile update input
- `UserProfile` - Extended user data with medical info

**api.ts** - Generic API Types

- `ApiResponse<T>` - Standard API response wrapper
- `ApiError` - API error response shape
- `PaginatedResponse<T>` - Paginated API responses

**streaming.ts** - Real-Time Data Types

- `SSEEvent` - Server-Sent Event structure
- `StreamingMessage` - Real-time chat message
- `ConnectionStatus` - WebSocket/SSE status

**conversation.ts** - Chat Conversation Types

- `Conversation` - Conversation metadata
- `ConversationListItem` - Conversation list display
- `ConversationMessage` - Message in conversation

**chat.ts** - Chat-Specific Types

- `ChatMessage` - Individual chat message
- `ChatRequest` - User message input
- `ChatResponse` - AI response

**prediction.ts** - Health Prediction Types

- `PredictionInput` - Health metrics input
- `PredictionResult` - AI prediction output
- `HealthInsight` - Individual health insight
  **practice.ts** - Practice Plan Types

- `PracticeFormData` - Complete form structure
- `PracticeBasicInfo` - Basic info section data
- `PracticeSchedule` - Schedule configuration (flexible/fixed modes)
- `TimePeriod` - Time range with start/end times
- `UserPracticeProfile` - Pre-fill profile data

**health.ts** - Health Metrics Types

- `HealthMetric` - Individual metric (weight, BP, etc.)
- `HealthGoal` - User health goal
- `MedicalProfile` - Medical information

---

## API Integration Architecture

### Request Lifecycle

1. **Component** → calls service function
2. **Service** → builds request with types
3. **Axios Request Interceptor** → adds JWT token
4. **Axios** → sends request to backend
5. **Backend** → processes and responds
6. **Axios Response Interceptor** → checks for 401
7. **Token Refresh** (if needed) → refreshes token
8. **Request Retry** → sends with new token
9. **Response** → returned to service
10. **Service** → returns typed response to component

### Interceptor Chain Details

**Request Interceptor** (`api.ts`)

- Adds `Authorization: Bearer {token}` header
- Adds custom headers for request tracking
- Validates token existence before sending

**Response Interceptor** (`api.ts`)

- Checks for 401 status code (unauthorized)
- Queues failed request if token is expired
- Calls refresh token endpoint
- Retries original request with new token
- Returns response to caller

**Queue System** (`api.ts`)

- Prevents N duplicate refresh calls
- Holds failed requests during refresh
- Executes all queued requests after token refresh
- Handles concurrent refresh scenarios

---

## Code Quality Tools

### Linting

**Tool:** ESLint
**Config:** `.eslintrc.json`
**Command:** `bun run lint`
**Rules:**

- Next.js specific rules
- TypeScript strict rules
- React hooks rules
- Import organization

### Code Formatting

**Tool:** Prettier
**Config:** `prettier.config.js`
**Command:** `bun run format`
**Features:**

- Tailwind class sorting
- Consistent spacing and indentation
- Single quotes for JS, double for HTML
- 2-space indentation

### Type Checking

**Tool:** TypeScript
**Config:** `tsconfig.json`
**Mode:** Strict
**Command:** (implicit, runs on build)
**Enforces:**

- No implicit any
- Strict null checks
- Type compatibility validation

### Pre-commit Hooks

**Tool:** Husky + lint-staged
**Config:** `.husky/` directory
**Hooks:**

- Lint staged files before commit
- Format code before commit
- Type check before commit

---

## Notable Files & Their Purposes

| File                                | Purpose                        | Lines |
| ----------------------------------- | ------------------------------ | ----- |
| `src/services/api.ts`               | Axios client with interceptors | 150+  |
| `src/contexts/auth/AuthContext.tsx` | Auth state management          | 100+  |
| `src/lib/react-query.tsx`           | React Query provider setup     | 50+   |
| `src/app/layout.tsx`                | Root layout with providers     | 40+   |
| `src/lib/logger.ts`                 | Centralized logging            | 50+   |
| `src/lib/storage.ts`                | localStorage abstraction       | 40+   |
| `next.config.ts`                    | Next.js configuration          | 60+   |
| `tailwind.config.js`                | Tailwind CSS setup             | 100+  |

---

## Build & Bundle Information

### Next.js Configuration

**Bundler:** Turbopack (development) + Webpack (production)
**Output:** Standalone (Docker-compatible)
**Optimization:**

- Code splitting per route
- Image optimization with Next.js Image component
- CSS minification and tree-shaking
- JavaScript minification and obfuscation

### Tailwind CSS v4

**Features:**

- CSS variables for theming
- Utility-first approach
- No custom SCSS modules
- Built-in dark mode support
- Custom fonts (SVN-Gilroy) configured

### Environment-Specific Builds

- Development: `bun run dev` (Turbopack, hot reload)
- Production: `bun run build && bun run start`
- Docker: `docker build -t vhealth-frontend .`

---

## Dependencies Summary

### Core Framework (4)

- next@15.5.3
- react@19.1.0
- react-dom@19.1.0
- typescript@5.x

### Styling (2)

- tailwindcss@v4
- class-variance-authority (for component variants)

### State Management (2)

- @tanstack/react-query@5
- react-context (built-in)

### Forms & Validation (2)

- react-hook-form@7
- zod@4

### HTTP Client (1)

- axios (with custom interceptors)

### UI Components (3)

- @radix-ui/primitives
- shadcn/ui
- lucide-react (icons)

### Development Tools

- eslint, prettier, husky, lint-staged
- @types/node, @types/react

**Total Dependencies:** ~40 (core + dev + optional)

---

## Git & Version Control

### Branch Strategy

- **main/master** - Production releases only
- **develop** - Integration branch for features
- **feature/\*** - Individual feature branches
- **hotfix/\*** - Emergency production fixes
- **release/\*** - Release preparation branches

### Commit Convention

```
type(scope): description

type: feat, fix, refactor, docs, style, test, chore
scope: auth, chat, predict, health, etc.
description: what was changed and why
```

---

## Testing Infrastructure

### Test Setup

- **Framework:** Jest (configured via Next.js)
- **E2E Tests:** Cypress/Playwright (setup pending)
- **Coverage Target:** >80% for critical paths

### Test Organization

- Unit tests co-located with source files (`.test.ts`)
- Integration tests in `__tests__` directories
- E2E tests in separate `e2e/` directory

---

## Performance Characteristics

| Metric                   | Target | Current        |
| ------------------------ | ------ | -------------- |
| First Contentful Paint   | <2s    | ~1.5s          |
| Largest Contentful Paint | <3s    | ~2.5s          |
| Cumulative Layout Shift  | <0.1   | ~0.08          |
| Time to Interactive      | <3s    | ~2.8s          |
| JavaScript Bundle        | <300KB | ~250KB gzipped |

---

## Security Considerations

### Input Validation

- All forms validated with Zod schemas before submission
- Backend receives only validated data
- XSS prevention through React's built-in protections

### Token Management

- Access tokens kept in memory (cleared on logout)
- Refresh tokens in httpOnly cookies (when implemented)
- Automatic refresh prevents token expiry UX issues

### Data Storage

- Sensitive data not stored in localStorage (implementation phase)
- Session data encrypted when persisted
- No secrets in client-side code (environment variables only)

### API Security

- All requests over HTTPS in production
- CORS configured for specific origins only
- CSRF tokens included in state-changing requests
- Rate limiting on authentication endpoints

---

## Deployment Architecture

### Docker Build Process

```
Build Stage (Bun + Next.js build)
  ↓ (only compiled output kept)
Production Stage (Bun runtime + built app)
  ↓ (non-root user, minimal image)
Container Registry (Google Artifact Registry)
```

### Infrastructure Stack

- **Compute:** Google Cloud Run (serverless)
- **State:** Terraform with GCS backend
- **Registry:** Google Artifact Registry
- **CI/CD:** Jenkins declarative pipeline

### Multi-Environment Deployment

- **Test Environment:** Minimal resources, autoscale to zero
- **Production Environment:** Always-on, auto-scales to handle load
- **State Isolation:** Separate Terraform states per environment

---

## Maintenance & Updates

### Dependency Management

- Monthly security updates
- Quarterly feature updates
- TypeScript strict mode enforced on updates
- Breaking changes documented in migration guides

### Documentation

- Inline code comments for complex logic
- JSDoc comments on public functions
- README files in feature folders
- Separate documentation for architecture

### Monitoring

- Application logs sent to Google Cloud Logging
- Error tracking via error boundaries
- Performance monitoring via Web Vitals
- Uptime monitoring via health endpoints

---

## Known Limitations & Technical Debt

| Item                   | Status          | Notes                              |
| ---------------------- | --------------- | ---------------------------------- |
| Mobile responsiveness  | In Progress     | Phase 2 optimization               |
| Offline support        | Not Implemented | Planned for Phase 3                |
| Progressive Web App    | Not Implemented | Future enhancement                 |
| Multi-language support | Not Implemented | Phase 3 feature                    |
| Analytics integration  | Optional        | Can be enabled via env var         |
| Real-time updates      | Partial         | SSE for chat, WebSocket for future |

---

## For Additional Details, See

- `docs/project-overview-pdr.md` - Project requirements and vision
- `docs/code-standards.md` - Naming and development conventions
- `docs/system-architecture.md` - Technical architecture deep dive
- `docs/deployment-guide.md` - Deployment and operational procedures
- `/plans/reports/scout-src-analysis-251206.md` - Detailed codebase audit
