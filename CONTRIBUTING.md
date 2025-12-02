# Contributing to VHealth

## Project Structure

### Component Organization

All components follow this structure:

```
src/components/
├── ui/          # shadcn/ui components (don't modify directly)
├── shared/      # Single reusable components (Avatar, Logo, Card)
├── form/        # Form-specific components (TextField, Dropdown)
├── layout/      # Layout components (Header, Footer)
├── marketing/   # Marketing page sections
├── chat/        # Chat feature components
├── predict/     # Prediction feature components
└── icons/       # Icon components
```

**Rules:**

- Feature-specific components go in feature folders (chat/, predict/)
- Single reusable components go in shared/
- NEVER create single-component folders at root
- Use barrel exports (index.ts) for multi-component folders

### Context Organization

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

- Each context in its own folder
- Main context file: `[Name]Context.tsx`
- Supporting files: `actions.ts`, `reducer.ts`, `types.ts`
- Always provide barrel export (index.ts)
- NO prefix on supporting files (use `actions.ts`, not `authActions.ts`)

### Type Organization

ALL types must live in `/src/types/`, organized by domain:

```
src/types/
├── auth.ts        # User, AuthState, LoginCredentials
├── user.ts        # UserData, UpdateUserProfileData
├── api.ts         # Generic API types
├── chat.ts
├── conversation.ts
└── prediction.ts
```

**Rules:**

- NO inline type definitions in service files
- Service files IMPORT types, never define them
- Use consistent naming: `[Entity]Data` for DTOs, `[Entity]` for domain models

### Naming Conventions

| Type             | Pattern                  | Example                       |
| ---------------- | ------------------------ | ----------------------------- |
| Components       | PascalCase               | `TextField`, `ChatMessage`    |
| Files            | Match component name     | `TextField.tsx`               |
| Folders          | kebab-case OR PascalCase | `form/` or `ChatComponents/`  |
| Constants        | SCREAMING_SNAKE_CASE     | `DEFAULT_AVATAR_PATH`         |
| Config objects   | SCREAMING + `as const`   | `AVATAR_CONFIG`               |
| Functions        | camelCase                | `formatDate`, `validateEmail` |
| Services         | camelCaseService         | `authService`, `userService`  |
| Hooks            | `use` + PascalCase       | `useAuth`, `useChat`          |
| Types/Interfaces | PascalCase               | `User`, `ApiResponse`         |

### Styling

**Use Tailwind exclusively.** NO SCSS modules.

```tsx
// ✅ Good
<div className="flex items-center justify-between p-4 rounded-lg bg-white">

// ❌ Bad
import styles from './Component.module.scss';
<div className={styles.container}>
```

**Use `cn()` for conditional classes:**

```tsx
import { cn } from '@/lib/utils';

<div
  className={cn('base-classes', isActive && 'active-classes', className)}
></div>;
```

### Import Organization

Order imports as follows:

```tsx
// 1. React/Next
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { z } from 'zod';
import { useForm } from 'react-hook-form';

// 3. Internal - Components
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/form/TextField';

// 4. Internal - Hooks/Utils/Types
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { User } from '@/types/auth';

// 5. Internal - Services/API
import { authService } from '@/services/auth';

// 6. Styles (if any)
import '@/styles/custom.css';
```

## Code Quality

### Before Committing

```bash
# Run linter
bun run lint

# Fix auto-fixable issues
bun run lint:fix

# Format code
bun run format

# Type check
bun run type-check

# Build (catches most errors)
bun run build
```

### Pre-commit Hooks

Husky runs automatically on commit:

- Formats all staged files with Prettier
- Runs ESLint on TypeScript files and auto-fixes
- Blocks commit if errors found

## Development Workflow

1. **Create feature branch:**

   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes following conventions above**

3. **Test thoroughly:**

   ```bash
   bun run dev
   bun run build
   bun run lint
   ```

4. **Commit with conventional commits:**

   ```bash
   git commit -m "feat(auth): add password reset flow"
   git commit -m "fix(chat): resolve message ordering bug"
   git commit -m "refactor(components): migrate Card to Tailwind"
   ```

5. **Push and create PR**

## Questions?

Check CLAUDE.md for project-specific instructions.
