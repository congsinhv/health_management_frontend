# Code Standards and Guidelines

This document outlines the code standards and best practices for the `health_management_frontend` project. Adherence to these guidelines ensures consistency, maintainability, and scalability of the codebase.

## 1. General Principles

- **Readability**: Code should be easy to understand for anyone reading it.
- **Maintainability**: Code should be easy to modify and extend.
- **Reusability**: Favor creating reusable components, hooks, and utilities.
- **Performance**: Write efficient code, especially in UI rendering and data fetching.
- **Security**: Implement secure coding practices, especially for authentication and API interactions.
- **Testability**: Write code that is easy to test, and include comprehensive unit and integration tests.

## 2. Naming Conventions

- **Variables and Functions**: `camelCase` (e.g., `userName`, `getWeatherData`).
- **Components**: `PascalCase` (e.g., `UserProfile`, `ScheduleCard`).
- **Files**: `kebab-case` for components (e.g., `user-profile.tsx`), `camelCase` or `kebab-case` for others based on common conventions (e.g., `actions.ts`, `auth-context.tsx`).
- **Types and Interfaces**: `PascalCase` (e.g., `User`, `AuthState`).

## 3. TypeScript Best Practices

- **Strict Mode**: Ensure TypeScript strict mode is enabled in `tsconfig.json`.
- **Explicit Types**: Use explicit types for function arguments, return values, and complex variables. Avoid `any` whenever possible.
- **Type Organization**: **ALL types live in `/src/types/`**. Services and components should IMPORT types, never define them inline.
  - Example: `src/types/auth.ts`, `src/types/user.ts`, `src/types/api.ts`.
- **Interfaces vs. Types**: Prefer `type` for aliases and unions, `interface` for object shapes.

## 4. Component Structure and Organization

- **Folder-by-Feature**: Organize components into logical feature folders within `src/components/`.
  - `src/components/chat/`, `src/components/predict/`, `src/components/profile/ScheduleSection/`.
- **Shared Components**: Reusable, generic components should be placed in `src/components/shared/`.
- **Form Components**: Dedicated components for forms in `src/components/form/`.
- **Layout Components**: Components related to overall page layout in `src/components/layout/`.
- **UI Primitives**: `shadcn/ui` components should remain in `src/components/ui/` and not be modified directly.
- **No Single-Component Root Folders**: Avoid creating individual folders at the `src/components/` root for single components.
- **Barrel Exports**: Use `index.ts` files for barrel exports within multi-component folders to simplify imports.
  - Example: `src/components/profile/ScheduleSection/index.ts` exports all components within `ScheduleSection`.

## 5. Styling Conventions (Tailwind CSS v4)

- **Exclusive Use of Tailwind**: Only Tailwind CSS v4 should be used for styling. **NO SCSS modules**.
- **`cn()` Utility**: Use the `cn()` utility from `@/lib/utils` for conditional class joining.
- **Custom CSS Variables**: Utilize custom CSS variables defined in `globals.css` for theming.
- **Responsive Design**: Implement responsive design using Tailwind's utility classes.

## 6. State Management

- **AuthContext**: Use `AuthContext` for global authentication state.
- **React Query**: Use TanStack Query (React Query) for server state management (data fetching, caching, and synchronization).
- **Local Storage**: For persisting tokens and other non-sensitive user preferences.
- **React Hooks**: Use `useState`, `useEffect`, `useCallback`, `useMemo` for component-level state and optimizations.

## 7. API Integration

- **Axios**: Use Axios for all HTTP requests.
- **Interceptors**: Leverage Axios interceptors for:
  - Attaching authentication tokens.
  - Handling automatic token refresh.
  - Centralized error handling and toast notifications.
  - Request/response logging.
- **Services Layer**: Encapsulate API calls in `src/services/` with clear, type-safe interfaces.

## 8. Error Handling

- **Centralized Error Handling**: Implement global error boundaries for React components.
- **API Error Handling**: Use Axios interceptors to catch API errors and display user-friendly messages (e.g., toast notifications).
- **Logging**: Use the custom logger in `src/lib/logger.ts` for consistent logging.

## 9. Testing

- **Unit Tests**: Write unit tests for individual components, hooks, and utility functions.
  - Store tests in `__tests__` folders adjacent to the tested code (e.g., `src/components/profile/ScheduleSection/__tests__/ScheduleSection.test.tsx`).
- **Integration Tests**: Implement integration tests for critical flows.
- **Testing Library**: Use Jest and React Testing Library.

## 10. Code Quality Tools

- **ESLint**: Use `bun run lint` to identify and fix code style issues.
- **Prettier**: Use `bun run format` to ensure consistent code formatting.
- **Husky**: Pre-commit hooks (`lint-staged`) should be configured to run linting and formatting checks.
- **Type Checking**: Run `bun run type-check` to catch TypeScript errors.

## 11. Documentation

- **Inline Comments**: Use clear and concise comments for complex logic or non-obvious code.
- **JSDoc**: Use JSDoc for functions, components, and types where appropriate.
- **Markdown Files**: Maintain high-level documentation in the `./docs` directory, including:
  - `project-overview-pdr.md`
  - `code-standards.md`
  - `codebase-summary.md`
  - `system-architecture.md`
