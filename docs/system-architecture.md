# System Architecture - VHealth Frontend

This document details the system architecture of the VHealth frontend application, outlining its core components, interactions, and design principles.

## 1. Overall Architecture

The VHealth frontend is a single-page application (SPA) built using **Next.js 15** with the **App Router**, leveraging **TypeScript** for type safety and **Turbopack** for optimized build performance. It follows a component-based architecture, promoting reusability and maintainability.

```mermaid
graph TD
    User[User] -->|Interacts with| VHealth_Frontend[VHealth Frontend]
    VHealth_Frontend -->|Fetches/Sends Data via Axios| Backend_API[Backend API]
    VHealth_Frontend -->|Manages State with React Query| Data_Cache[Data Cache]
    VHealth_Frontend -->|Authenticates with| Auth_Service[Authentication Service]
    Auth_Service -->|Stores Tokens in| Local_Storage[Local Storage]

    subgraph VHealth Frontend
        direction LR
        NextJS_App[Next.js App Router] --> Pages[Pages]
        NextJS_App --> Components[Components]
        NextJS_App --> Contexts[Contexts]
        NextJS_App --> Hooks[Hooks]
        NextJS_App --> Services[Services]
        NextJS_App --> Lib[Lib (Utils, Constants)]
        NextJS_App --> Types[Types]

        Components --> UI_Primitives[shadcn/ui]
        Components --> Feature_Components[Feature-specific Components]
        Components --> Shared_Components[Shared Reusable Components]
        Components --> Form_Components[Form Components]

        Pages --> Styling[Tailwind CSS v4]
        Components --> Styling
        Contexts --> AuthContext[AuthContext]
        Hooks --> CustomHooks[Custom Hooks]
        Services --> AxiosClient[Axios Instance]
    end
```

## 2. Core Technologies

- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **State Management**: React Query (Server State), React Context (Global Client State)
- **HTTP Client**: Axios
- **Form Management**: React Hook Form with Zod validation
- **Build Tool**: Turbopack

## 3. Key Architectural Layers and Components

### 3.1. Presentation Layer (`src/app/` and `src/components/`)

- **Next.js App Router (`src/app/`)**: Handles routing, page rendering (SSR/SSG/ISR), and API routes.
- **Components (`src/components/`)**:
  - **UI Primitives (`src/components/ui/`)**: Shadcn/ui components (e.g., Button, Input, Card). These are themeable and composable building blocks.
  - **Feature-Specific Components**: Organized by domain (e.g., `src/components/chat/`, `src/components/predict/`, `src/components/profile/`). This includes components like `DeviceList`, `ProfileForm`, etc., relevant to the user profile.
  - **Shared Reusable Components (`src/components/shared/`)**: Generic UI elements used across different features (e.g., Avatar, Logo, Navigation).
  - **Form Components (`src/components/form/`)**: Abstractions for common form inputs.
  - **Layout Components (`src/components/layout/`)**: Structural components like Header, Footer, Sidebars.
- **Styling (Tailwind CSS v4)**: Utilizes Tailwind's utility-first approach for responsive and consistent design. Custom CSS variables in `globals.css` define the application's theme. The `cn()` utility (`@/lib/utils/cn.ts`) is used for conditional class application.

### 3.2. State Management Layer (`src/contexts/` and React Query)

- **AuthContext (`src/contexts/auth/`)**: Manages the global authentication state, including user login status, user information, and JWT tokens. It handles token storage, refresh, and propagation.
  - Comprises `AuthContext.tsx`, `actions.ts`, `reducer.ts`, `types.ts`, and `index.ts`.
- **React Query (TanStack Query)**: Used for managing server-side data. It handles data fetching, caching, synchronization, and updates with the backend API. This offloads complex data management from component state.

### 3.3. Data Access Layer (`src/services/`)

- **API Service Functions**: Encapsulate all interactions with the backend API. Each service file (`src/services/userService.ts`, `src/services/authService.ts`, `src/services/deviceService.ts`) defines functions for specific API endpoints.
- **Axios Instance**: A pre-configured Axios instance handles:
  - **Request Interceptors**: Injecting JWT access tokens into headers.
  - **Response Interceptors**: Automatically refreshing expired access tokens using the refresh token, and re-attempting failed requests.
  - **Error Handling**: Standardized error responses and mapping them to user-friendly messages via toast notifications.
  - **Logging**: Custom logger (`src/lib/logger.ts`) for all API requests and responses.

### 3.4. Utility and Support Layer (`src/hooks/`, `src/lib/`, `src/types/`)

- **Custom Hooks (`src/hooks/`)**: Reusable logic encapsulated in custom React hooks (e.g., `useAuth`, `useFormValidation`).
- **Utilities (`src/lib/utils/`)**: Helper functions (e.g., `cn.ts`, `avatar.ts`, `transforms.ts`) used across the application. Also includes `constants.ts` for global configuration.
- **Type Definitions (`src/types/`)**: Centralized TypeScript type definitions for all data structures (e.g., `auth.ts`, `user.ts`, `api.ts`, `device.ts`). This ensures type consistency and improves developer experience.

## 4. Authentication Flow

1.  **Login**: User provides credentials. `authService` sends a request to the backend.
2.  **Token Storage**: Upon successful login, the backend returns access and refresh tokens. `AuthContext` stores these securely in `localStorage`.
3.  **Protected Routes**: Router guards (implemented via HOCs) check the `AuthContext` for authentication status.
4.  **Automatic Token Refresh**: If an access token expires, Axios interceptors detect the `401 Unauthorized` response, use the refresh token to get a new access token, update `AuthContext` and `localStorage`, and retry the original request transparently.
5.  **Logout**: Clears tokens from `AuthContext` and `localStorage` to ensure a clean session termination.

## 5. Deployment

The application is configured for **standalone output** for efficient Docker deployments. `NEXT_PUBLIC_API_URL` environment variable is used to configure the backend API endpoint.

## 6. Development Workflow

- **Code Quality**: Enforced via ESLint, Prettier, TypeScript strict mode, and pre-commit hooks (Husky with `lint-staged`).
- **Testing**: Unit tests are written using Jest and React Testing Library, located adjacent to components in `__tests__` directories.

This architecture aims to provide a scalable, maintainable, and high-performance foundation for the VHealth application.
