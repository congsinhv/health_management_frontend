# Codebase Summary

This document provides an overview of the codebase structure and key files, generated using `repomix`.

## Overall Statistics

- **Total Files**: 187
- **Total Tokens**: 176,960
- **Total Characters**: 723,340

## Top 5 Files by Token Count

1.  `src/app/predict/validation.test.ts` (6,197 tokens, 22,276 chars, 3.5%)
2.  `src/app/predict/page.tsx` (5,042 tokens, 31,063 chars, 2.8%)
3.  `src/app/practice/page.test.tsx` (4,707 tokens, 20,310 chars, 2.7%)
4.  `src/app/profile/page.tsx` (4,502 tokens, 22,037 chars, 2.5%)
5.  `src/components/predict/HealthMetricsCard.tsx` (3,582 tokens, 7,926 chars, 2%)

## Security Review

- No suspicious files detected.

## Binary Files Detected

The following 4 binary files were detected and excluded from the output:

1. `src/fonts/SVN-Gilroy-Bold.otf`
2. `src/fonts/SVN-Gilroy-Medium.otf`
3. `src/fonts/SVN-Gilroy-Regular.otf`
4. `src/fonts/SVN-Gilroy-SemiBold.otf`

These files are typically font files and their exclusion is expected.

## Project Structure Highlights (based on included patterns: `src/**,*.md`)

The `src` directory contains the core application logic, including:

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable React components, organized into feature-specific (e.g., `profile/`, `predict/`), shared, form, and layout categories.
- `contexts/`: React contexts for global state management.
- `hooks/`: Custom React hooks.
- `lib/`: Utilities, constants, and configurations.
- `services/`: API service functions.
- `types/`: TypeScript type definitions.

The root directory also contains Markdown files such as `README.md` and other documentation.
