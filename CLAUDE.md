# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses Bun as the package manager:

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build production application
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check code formatting
- `bun run format:fix` - Format and fix linting issues

## Project Architecture

This is a Next.js 15 health management application called "VHealth" with the following architecture:

### Core Structure

- **Next.js App Router** with TypeScript and Turbopack
- **Tailwind CSS** for styling, configured with CSS variables
- **shadcn/ui** component library with New York style
- **React Query (TanStack Query)** for server state management
- **Axios** for API calls with automatic token refresh
- **React Hook Form** with Zod validation
- **Custom authentication context** with token management

### Key Directories

- `src/app/` - Next.js app router pages and API routes
- `src/components/` - Reusable React components (including `ui/` for shadcn components)
- `src/contexts/` - React contexts (AuthContext)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utilities, constants, and configuration
- `src/services/` - API service functions
- `src/types/` - TypeScript type definitions

### Authentication System

- **JWT-based authentication** with access/refresh token rotation
- **OAuth Google login** support
- **Automatic token refresh** with request queuing
- **Protected routes** using HOC and context
- **Email verification** flow

### API Integration

- **Base URL**: Configured via `NEXT_PUBLIC_API_URL` (defaults to localhost:8000)
- **Axios interceptors** handle token injection and automatic refresh
- **Request/Response logging** with custom logger
- **Error handling** with toast notifications

### State Management

- **AuthContext** for authentication state
- **React Query** for server state
- **Local storage** for token persistence
- **React hooks** for component-level state

### Styling

- **Tailwind CSS v4** exclusively (100% Tailwind, 0% SCSS)
- **Custom CSS variables** defined in globals.css
- **Custom fonts** (SVN-Gilroy family) loaded locally
- **shadcn/ui** components with consistent theming
- **Use `cn()` utility** from `@/lib/utils` for conditional classes

### Configuration Files

- **Path aliases**: `@/*` maps to `./src/*`
- **Component aliases**: `@/components`, `@/lib`, `@/hooks`, `@/ui`
- **SVG handling**: Configured for both Turbopack and Webpack
- **Standalone output**: Enabled for Docker deployment

### Key Features

- Multi-page authentication flow (login, register, forgot password, etc.)
- Dashboard and health tracking pages
- Profile management with avatar upload
- Settings page
- Floating chat button component
- Responsive design with custom fonts

---

## Development Conventions

### Component Structure

All components organized into clear categories:

- **Feature components:** `src/components/chat/`, `src/components/predict/`
- **Reusable components:** `src/components/shared/` (Avatar, Logo, Card, Navigation, ErrorBoundary, ProtectedRoute)
- **Form components:** `src/components/form/` (TextField, Dropdown, NumberInput, RatioField)
- **Layout components:** `src/components/layout/` (Header, HeaderVertical, Footer)
- **Marketing components:** `src/components/marketing/` (FeaturesSection, InformationSection)
- **UI primitives:** `src/components/ui/` (shadcn/ui - don't modify directly)

**Rules:**

- Feature-specific components in feature folders
- Single reusable components in `shared/`
- Never create single-component folders at root
- Use barrel exports (index.ts) for multi-component folders

### Context Organization

Each context in its own folder with barrel export:

```
src/contexts/
├── auth/
│   ├── AuthContext.tsx
│   ├── actions.ts
│   ├── reducer.ts
│   ├── types.ts
│   └── index.ts
└── conversation/
    └── ... (same pattern)
```

**Rules:**

- Main context file: `[Name]Context.tsx`
- Supporting files: `actions.ts`, `reducer.ts`, `types.ts`
- NO prefixes on supporting files (use `actions.ts`, not `authActions.ts`)

### Type Organization

**ALL types live in `/src/types/`**. Services IMPORT types, never define them inline.

```
src/types/
├── auth.ts        # User, AuthState, LoginCredentials, RegisterCredentials, AuthResponse
├── user.ts        # UserData, UpdateUserProfileData
├── api.ts         # Generic API types (ApiResponse, ApiError, PaginatedResponse)
├── streaming.ts   # SSE and streaming types
├── conversation.ts
├── chat.ts
└── prediction.ts
```

### Utilities Organization

Utilities consolidated in `src/lib/utils/`:

```
src/lib/
├── utils/
│   ├── index.ts       # Barrel export
│   ├── cn.ts          # Classname utility
│   ├── avatar.ts      # Avatar utilities
│   ├── transforms.ts  # Data transformation utilities
│   └── prediction.ts  # Prediction utilities
├── constants.ts
├── storage.ts
├── logger.ts
└── react-query.tsx
```

### Styling Conventions

**Use Tailwind exclusively.** NO SCSS modules.

```tsx
// ✅ Good - Tailwind classes
<div className="flex items-center justify-between p-4 rounded-lg bg-white">

// ✅ Good - Conditional classes with cn()
import { cn } from '@/lib/utils';
<div className={cn("base-classes", isActive && "active-classes", className)}>

// ❌ Bad - SCSS modules (removed in Phase 4)
import styles from './Component.module.scss';
<div className={styles.container}>
```

### Code Quality Tools

- **ESLint** with Next.js and TypeScript configs
- **Prettier** with Tailwind plugin
- **Husky** pre-commit hooks with lint-staged
- **TypeScript** strict mode

**Available Scripts:**

- `bun run lint` - Run ESLint
- `bun run lint:fix` - Auto-fix ESLint issues
- `bun run type-check` - Run TypeScript compiler
- `bun run format` - Format with Prettier
- `bun run format:check` - Check formatting
- `bun run format:fix` - Format and fix linting

See `CONTRIBUTING.md` for complete development conventions and guidelines.
