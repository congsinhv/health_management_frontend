# Codebase Summary

This document provides a high-level overview of the `health_management_frontend` codebase, generated from a `repomix` compaction.

## Project Overview

The `health_management_frontend` is a Next.js 15 application called "VHealth" designed for health management. It leverages a modern frontend stack with TypeScript, Tailwind CSS, shadcn/ui, React Query, Axios, and React Hook Form.

## Core Structure

- **Next.js App Router**: For routing and server-side capabilities.
- **TypeScript**: Ensuring type safety across the codebase.
- **Tailwind CSS v4**: Exclusive styling framework with custom CSS variables.
- **shadcn/ui**: Component library for UI elements (New York style).
- **React Query (TanStack Query)**: For server state management and data fetching.
- **Axios**: HTTP client for API calls with automatic token refresh.
- **React Hook Form** with Zod validation: For robust form handling.
- **Custom authentication context**: Manages JWT-based authentication with access/refresh token rotation.

## Key Directories

- `src/app/`: Next.js app router pages and API routes.
- `src/components/`: Reusable React components, including `ui/` for shadcn components.
- `src/contexts/`: React contexts (e.g., AuthContext).
- `src/hooks/`: Custom React hooks.
- `src/lib/`: Utilities, constants, and configuration (e.g., `utils/cn.ts`, `storage.ts`).
- `src/services/`: API service functions.
- `src/types/`: Centralized TypeScript type definitions.

## Authentication System

- **JWT-based authentication**: Secure token management with access and refresh tokens.
- **OAuth Google login**: Integration for Google authentication.
- **Automatic token refresh**: Ensures continuous user sessions.
- **Protected routes**: Implemented using Higher-Order Components (HOC) and React context.
- **Email verification**: Supports user email verification flows.

## API Integration

- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL`.
- **Axios interceptors**: Handle token injection, automatic refresh, and error handling.
- **Request/Response logging**: Custom logger for development and debugging.
- **Error handling**: Integrated with toast notifications for user feedback.

## State Management

- **AuthContext**: Manages global authentication state.
- **React Query**: Manages server-side data fetching and caching.
- **Local storage**: Persists authentication tokens.
- **React hooks**: Manages component-level state.

## Styling

- **100% Tailwind CSS**: No SCSS modules are used.
- **Custom CSS variables**: Defined in `globals.css`.
- **Custom fonts**: SVN-Gilroy family, loaded locally.
- **shadcn/ui**: Components themed consistently with Tailwind.
- **`cn()` utility**: For conditional class application.

## New UI Components for Phase 2 (Profile Schedule Section)

The recent update introduced a new set of UI components for the profile's schedule section, demonstrating the project's adherence to modular and reusable component architecture. These components include:

- `src/components/profile/ScheduleSection/index.tsx`: Main entry point for the Schedule Section.
- `src/components/profile/ScheduleSection/ScheduleCard.tsx`: Displays individual schedule entries.
- `src/components/profile/ScheduleSection/DayExerciseCard.tsx`: Card for daily exercises within a schedule.
- `src/components/profile/ScheduleSection/EmptyState.tsx`: Component for when no schedule data is available.
- `src/components/profile/ScheduleSection/ScheduleSkeleton.tsx`: Loading skeleton for the schedule section.
- `src/components/profile/ScheduleSection/__tests__/ScheduleSection.test.tsx`: Unit tests for the Schedule Section.
- `src/components/profile/index.ts`: Updated to export the new `ScheduleSection` components.

## Code Quality

- **ESLint**: Enforces code style and best practices.
- **Prettier**: Maintains consistent code formatting.
- **Husky & lint-staged**: Pre-commit hooks for quality assurance.
- **TypeScript strict mode**: Ensures high type safety.

This summary will be periodically updated to reflect the current state of the codebase.
