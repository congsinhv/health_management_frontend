# VHealth Design Guidelines

> Comprehensive design system documentation for the VHealth health management platform.
> Last updated: 2025-12-04

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Guidelines](#5-component-guidelines)
6. [Animation & Interaction](#6-animation--interaction)
7. [Accessibility](#7-accessibility)
8. [Dark Mode](#8-dark-mode)
9. [Icons](#9-icons)
10. [Quick Reference](#10-quick-reference)

---

## 1. Design Philosophy

### Core Principles

VHealth is a health management platform designed with these guiding principles:

| Principle                | Description                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------- |
| **Health-Focused**       | Calming, trustworthy visual language using green tones that evoke wellness and vitality |
| **Accessibility-First**  | WCAG 2.1 AA compliance minimum; design for all users                                    |
| **Clean & Professional** | Healthcare aesthetic with clear hierarchy and minimal visual noise                      |
| **Mobile-First**         | Responsive design starting from mobile breakpoints                                      |
| **Performance**          | Optimized animations and lightweight interactions                                       |

### Visual Identity

- **Primary Brand Color**: Health green (`oklch(0.52 0.18 162)`)
- **Tone**: Professional, calming, trustworthy
- **Style**: Modern healthcare with rounded corners and soft shadows

---

## 2. Color System

VHealth uses OKLCH color space for perceptually uniform colors with excellent dark mode support.

### 2.1 Semantic Colors

#### Light Mode

```css
/* Primary - Health Green */
--primary: oklch(0.52 0.18 162);
--primary-foreground: oklch(0.98 0 0);

/* Accent - Lighter Green */
--accent: oklch(0.65 0.15 150);
--accent-foreground: oklch(0.98 0 0);

/* Background & Foreground */
--background: oklch(1 0 0); /* Pure white */
--foreground: oklch(0.145 0 0); /* Near black */

/* Surface Colors */
--card: oklch(1 0 0);
--card-foreground: oklch(0.145 0 0);
--popover: oklch(1 0 0);
--popover-foreground: oklch(0.145 0 0);

/* Secondary & Muted */
--secondary: oklch(0.97 0 0);
--secondary-foreground: oklch(0.205 0 0);
--muted: oklch(0.97 0 0);
--muted-foreground: oklch(0.556 0 0);

/* Utility Colors */
--border: oklch(0.922 0 0);
--input: oklch(0.922 0 0);
--ring: oklch(0.52 0.18 162);
--destructive: oklch(0.577 0.245 27.325);
```

#### Dark Mode

```css
--primary: oklch(0.65 0.15 150); /* Lighter for dark bg */
--primary-foreground: oklch(0.145 0 0);
--accent: oklch(0.72 0.16 150);
--background: oklch(0.145 0 0);
--foreground: oklch(0.985 0 0);
--card: oklch(0.205 0 0);
--border: oklch(1 0 0 / 10%);
--input: oklch(1 0 0 / 15%);
```

### 2.2 Health Green Palette

10-shade scale for flexible usage:

| Token        | Light Mode             | Dark Mode              | Usage              |
| ------------ | ---------------------- | ---------------------- | ------------------ |
| `health-50`  | `oklch(0.98 0.02 150)` | `oklch(0.22 0.12 170)` | Subtle backgrounds |
| `health-100` | `oklch(0.95 0.04 150)` | `oklch(0.25 0.13 168)` | Hover states       |
| `health-200` | `oklch(0.9 0.08 150)`  | `oklch(0.3 0.14 165)`  | Light accents      |
| `health-300` | `oklch(0.82 0.12 150)` | `oklch(0.4 0.15 162)`  | Secondary elements |
| `health-400` | `oklch(0.72 0.16 150)` | `oklch(0.5 0.16 158)`  | Icons, borders     |
| `health-500` | `oklch(0.62 0.18 150)` | `oklch(0.6 0.16 154)`  | Primary buttons    |
| `health-600` | `oklch(0.52 0.18 162)` | `oklch(0.65 0.15 150)` | **Brand primary**  |
| `health-700` | `oklch(0.42 0.16 165)` | `oklch(0.7 0.15 148)`  | Hover states       |
| `health-800` | `oklch(0.32 0.14 168)` | `oklch(0.75 0.14 146)` | Active states      |
| `health-900` | `oklch(0.22 0.12 170)` | `oklch(0.8 0.13 144)`  | Dark text          |

### 2.3 Grey Scale

```css
--grey-50: #f9fafa; /* Lightest backgrounds */
--grey-100: #f7f7f7; /* Input backgrounds */
--grey-200: #efefef; /* Borders, dividers */
--grey-300: #d5d5d5; /* Secondary borders */
--grey-400: #b3b8c3; /* Placeholder text */
```

### 2.4 Chart Colors

For data visualization:

```css
--chart-1: oklch(0.52 0.18 162); /* Primary green */
--chart-2: oklch(0.65 0.15 150); /* Accent green */
--chart-3: oklch(0.45 0.2 170); /* Deep teal */
--chart-4: oklch(0.6 0.16 145); /* Warm green */
--chart-5: oklch(0.55 0.17 155); /* Mid green */
```

### 2.5 Color Usage Guidelines

```tsx
// Primary actions
<Button className="bg-primary text-primary-foreground" />

// Health-themed gradient (CTAs)
<Button className="bg-gradient-to-r from-[#00bba7] to-[#00bc7d] text-white" />

// Subtle backgrounds
<div className="bg-health-50" />

// Error states
<div className="border-destructive text-destructive" />

// Success states
<div className="border-green-500/50 bg-green-50 text-green-700" />

// Warning states
<div className="border-yellow-500/50 bg-yellow-50 text-yellow-700" />
```

---

## 3. Typography

### 3.1 Font Family

VHealth uses **SVN-Gilroy**, a custom font loaded locally with Vietnamese language support.

```tsx
// Font configuration (src/app/layout.tsx)
const gilroy = localFont({
  src: [
    { path: '../fonts/SVN-Gilroy-Regular.otf', weight: '400' },
    { path: '../fonts/SVN-Gilroy-Medium.otf', weight: '500' },
    { path: '../fonts/SVN-Gilroy-SemiBold.otf', weight: '600' },
    { path: '../fonts/SVN-Gilroy-Bold.otf', weight: '700' },
  ],
  variable: '--font-gilroy',
  display: 'swap',
});
```

### 3.2 Font Weights

| Weight | Class           | Usage                    |
| ------ | --------------- | ------------------------ |
| 400    | `font-normal`   | Body text, paragraphs    |
| 500    | `font-medium`   | Labels, navigation links |
| 600    | `font-semibold` | Subheadings, card titles |
| 700    | `font-bold`     | Headings, emphasis       |

### 3.3 Type Scale

| Element    | Size            | Line Height | Weight | Class Example                         |
| ---------- | --------------- | ----------- | ------ | ------------------------------------- |
| Display    | 2rem            | 1.2         | 700    | `text-[2rem] leading-tight font-bold` |
| H1         | 1.5rem (24px)   | 1.4         | 700    | `text-2xl leading-9 font-bold`        |
| H2         | 1.25rem (20px)  | 1.4         | 700    | `text-xl leading-7 font-bold`         |
| H3         | 1.1rem          | 1.4         | 600    | `text-lg leading-6 font-semibold`     |
| Body Large | 1rem (16px)     | 1.75        | 400    | `text-base leading-7`                 |
| Body       | 0.95rem         | 1.6         | 400    | `text-[0.95rem] leading-relaxed`      |
| Small      | 0.875rem (14px) | 1.5         | 400    | `text-sm`                             |
| Caption    | 0.75rem (12px)  | 1.5         | 400    | `text-xs`                             |

### 3.4 Typography Patterns

```tsx
// Page title
<h1 className="text-2xl leading-9 font-medium tracking-[0.07px] text-[#101828]">
  Chào Mừng Trở Lại
</h1>

// Section description
<p className="text-base leading-6 font-normal tracking-tight text-[#6a7282]">
  Đăng nhập vào tài khoản của bạn
</p>

// Form labels
<label className="text-xs font-normal text-slate-500">
  Email
</label>

// Helper text
<span className="text-xs text-[#657282] italic">
  Chưa có tài khoản?
</span>

// Card title (using font-gilroy utility)
<div className="font-gilroy font-semibold leading-none">
  Card Title
</div>
```

---

## 4. Spacing & Layout

### 4.1 Base Unit

VHealth uses an **4px base unit** with common multiples:

| Token | Value | Usage            |
| ----- | ----- | ---------------- |
| `1`   | 4px   | Minimal gaps     |
| `2`   | 8px   | Tight spacing    |
| `3`   | 12px  | Default gaps     |
| `4`   | 16px  | Standard padding |
| `6`   | 24px  | Section spacing  |
| `8`   | 32px  | Large gaps       |
| `12`  | 48px  | Section padding  |

### 4.2 Common Spacing Patterns

```tsx
// Card internal padding
<Card className="py-6">
  <CardContent className="px-6" />
</Card>

// Form field gaps
<form className="space-y-4">

// Section spacing
<div className="space-y-8">

// Header padding
<div className="px-12 py-1">  {/* Desktop */}
<div className="px-6">         {/* Mobile (md:px-6) */}
```

### 4.3 Responsive Breakpoints

| Breakpoint | Width   | Usage                    |
| ---------- | ------- | ------------------------ |
| Default    | 0px+    | Mobile-first base styles |
| `md`       | 768px+  | Tablet adjustments       |
| `lg`       | 1024px+ | Desktop layouts          |

### 4.4 Container Widths

```tsx
// Max content width
<div className="max-w-[1340px] mx-auto">

// Form container
<div className="w-full max-w-[26rem]">  {/* 416px */}

// Auth layout split
<div className="w-full lg:w-[661px]">  {/* Left panel */}
```

### 4.5 Border Radius

```css
--radius: 0.625rem; /* 10px - Base */
--radius-sm: calc(var(--radius) - 4px); /* 6px */
--radius-md: calc(var(--radius) - 2px); /* 8px */
--radius-lg: var(--radius); /* 10px */
--radius-xl: calc(var(--radius) + 4px); /* 14px */
```

| Element           | Radius | Class            |
| ----------------- | ------ | ---------------- |
| Buttons (default) | 6px    | `rounded-md`     |
| Buttons (large)   | full   | `rounded-full`   |
| Cards             | 12px   | `rounded-xl`     |
| Inputs            | 10px   | `rounded-[10px]` |
| Chat bubbles      | 24px   | `rounded-[24px]` |
| Badges            | full   | `rounded-full`   |
| Modals/Popovers   | 8px    | `rounded-lg`     |

---

## 5. Component Guidelines

### 5.1 Buttons

#### Variants

| Variant       | Usage                   | Example                 |
| ------------- | ----------------------- | ----------------------- |
| `default`     | Primary actions         | Login, Submit           |
| `gradient`    | CTAs, important actions | Sign up, Get started    |
| `outline`     | Secondary actions       | Cancel, Back            |
| `ghost`       | Tertiary actions        | Icon buttons in toolbar |
| `destructive` | Dangerous actions       | Delete, Remove          |
| `social`      | OAuth buttons           | Google login            |
| `link`        | Inline links            | Forgot password         |

#### Sizes

| Size      | Height  | Usage                      |
| --------- | ------- | -------------------------- |
| `sm`      | 32px    | Compact UI, inline actions |
| `default` | 36px    | Standard buttons           |
| `lg`      | 48px    | Primary CTAs, full-width   |
| `icon`    | 36x36px | Icon-only buttons          |
| `icon-lg` | 48x48px | Large icon buttons         |

#### Code Examples

```tsx
// Primary CTA with gradient
<Button variant="gradient" size="lg" className="w-full">
  <span className="font-semibold">Đăng nhập</span>
</Button>

// Outline secondary
<Button variant="outline" size="default" className="h-9 rounded-full px-6">
  <span className="text-xs font-medium text-gray-600 italic">ĐĂNG KÝ</span>
</Button>

// Social login
<Button variant="social" size="icon-lg">
  <Google className="h-5 w-5" />
</Button>

// Ghost icon button
<Button variant="ghost" size="sm" className="h-8 min-w-8 gap-1">
  <Copy className="h-4 w-4" />
</Button>
```

### 5.2 Form Inputs

#### Input Styling

```tsx
<Input
  className={cn(
    // Base styles
    'h-12 w-full min-w-0 rounded-[10px] border bg-[#f7f7f7]',
    'px-3 py-1 text-sm shadow-xs',
    // Placeholder
    'placeholder:text-[#717182]',
    // Focus state
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]',
    // Error state
    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
    // Disabled
    'disabled:pointer-events-none disabled:opacity-50'
  )}
/>
```

#### Form Field Pattern

```tsx
<FormField
  control={form.control}
  name='email'
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type='email' placeholder='Nhập email của bạn' {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 5.3 Cards

```tsx
// Standard card
<Card className="rounded-xl border py-6 shadow-sm">
  <CardHeader className="px-6">
    <CardTitle className="font-gilroy font-semibold">Title</CardTitle>
    <CardDescription className="text-muted-foreground text-sm">
      Description
    </CardDescription>
  </CardHeader>
  <CardContent className="px-6">
    {/* Content */}
  </CardContent>
  <CardFooter className="px-6">
    {/* Actions */}
  </CardFooter>
</Card>

// Image card with overlay
<div className={cn(
  'relative min-h-[200px] overflow-hidden rounded-2xl',
  'before:absolute before:inset-0 before:z-10',
  'before:bg-gradient-to-b before:from-transparent before:via-black/20 before:to-black/70'
)}>
  <Image src={image} fill className="object-cover" />
  <p className="absolute bottom-0 z-20 p-4 text-sm font-medium text-white">
    {description}
  </p>
</div>
```

### 5.4 Badges

```tsx
// Default (primary)
<Badge>New</Badge>

// Secondary
<Badge variant="secondary">Pending</Badge>

// Destructive
<Badge variant="destructive">Error</Badge>

// Outline
<Badge variant="outline">Draft</Badge>
```

### 5.5 Alerts

```tsx
// Success alert
<Alert variant="success">
  <AlertTitle>Thành công!</AlertTitle>
  <AlertDescription>Cập nhật hồ sơ thành công.</AlertDescription>
</Alert>

// Error alert
<Alert variant="destructive">
  <AlertTitle>Lỗi</AlertTitle>
  <AlertDescription>Đã có lỗi xảy ra.</AlertDescription>
</Alert>

// Inline error message
<div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-500 italic">
  {errorMessage}
</div>
```

---

## 6. Animation & Interaction

### 6.1 Transition Defaults

```tsx
// Standard transition
className = 'transition-all duration-200';

// Color/shadow transitions
className = 'transition-[color,box-shadow]';

// Hover scale effect
className = 'hover:scale-105 active:scale-95';

// Hover lift effect
className = 'hover:-translate-y-px active:translate-y-0';
```

### 6.2 Animation Keyframes

```css
/* Slide in animation (chat messages) */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Loading bounce (typing indicator) */
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
```

### 6.3 Loading States

```tsx
// Spinner in button
<Button disabled>
  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
  <span>Đang tải...</span>
</Button>

// Typing indicator dots
<div className="flex gap-[0.4rem]">
  <span className="h-2 w-2 animate-bounce rounded-full bg-[#4fd1c7] [animation-delay:-0.32s]" />
  <span className="h-2 w-2 animate-bounce rounded-full bg-[#4fd1c7] [animation-delay:-0.16s]" />
  <span className="h-2 w-2 animate-bounce rounded-full bg-[#4fd1c7]" />
</div>

// Skeleton loading
<Skeleton className="h-4 w-[200px]" />
```

### 6.4 Hover & Focus States

```tsx
// Button hover/focus
className={cn(
  'outline-none',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  'hover:bg-gray-50',
  'active:scale-95'
)}

// Interactive card hover
className="transition-all duration-200 hover:scale-105 hover:shadow-lg"

// Link hover
className="hover:underline hover:text-gray-900/80"

// Action button hover (chat)
className={cn(
  'text-[#666] transition-all duration-200',
  'hover:-translate-y-px hover:bg-[rgba(79,209,199,0.1)] hover:text-[#2c7a7b]'
)}
```

### 6.5 Floating Button

```tsx
// Floating chat button
<button className={cn(
  'fixed right-6 bottom-6 z-1000',
  'flex h-16 w-16 items-center justify-center rounded-full',
  'border-none bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
  'transition-all duration-300',
  'hover:scale-110 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]',
  'focus:shadow-[0_6px_20px_rgba(0,0,0,0.2),0_0_0_3px_rgba(59,130,246,0.3)]',
  'active:scale-95',
  'md:right-5 md:bottom-5 md:h-14 md:w-14'
)}>
```

---

## 7. Accessibility

### 7.1 Color Contrast

| Element            | Minimum Ratio | Current Status                     |
| ------------------ | ------------- | ---------------------------------- |
| Body text          | 4.5:1         | `oklch(0.145 0 0)` on white - Pass |
| Large text (18px+) | 3:1           | Pass                               |
| UI components      | 3:1           | Primary green passes               |
| Placeholder text   | 4.5:1         | `#717182` on `#f7f7f7` - Check     |

### 7.2 Focus Indicators

```tsx
// Standard focus ring
className =
  'focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring';

// Custom focus for buttons
className =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500';

// Never remove focus outlines
className = 'outline-none'; // Only use with visible focus alternatives
```

### 7.3 ARIA Labels

```tsx
// Icon buttons must have labels
<button aria-label="Open AI chat assistant">
  <LottieAnimation />
</button>

// Menu buttons
<button aria-label="User menu">
  <Avatar />
</button>

// Action buttons
<Button title="Sao chép" aria-label="Copy message">
  <Copy className="h-4 w-4" />
</Button>
```

### 7.4 Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order should follow visual order
- Escape key should close modals/popovers
- Enter/Space should activate buttons

```tsx
// Keyboard handlers for edit mode
const handleEditKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSave();
  } else if (e.key === 'Escape') {
    handleCancel();
  }
};
```

### 7.5 Reduced Motion

```tsx
// Respect user preference
className="motion-safe:animate-slide-in"

// Or in CSS
@media (prefers-reduced-motion: reduce) {
  .animate-slide-in {
    animation: none;
  }
}
```

### 7.6 Screen Reader Support

```tsx
// Role attributes
<div role="alert">Error message</div>

// Status messages
<div aria-live="polite">Loading...</div>

// Hidden decorative elements
<span aria-hidden="true">*</span>
```

---

## 8. Dark Mode

### 8.1 Implementation

Dark mode is activated via the `.dark` class on an ancestor element:

```tsx
// In globals.css
@custom-variant dark (&:is(.dark *));

// Usage
<html className="dark">
```

### 8.2 Color Mapping Strategy

| Light Mode             | Dark Mode              | Reason                       |
| ---------------------- | ---------------------- | ---------------------------- |
| `oklch(0.52 0.18 162)` | `oklch(0.65 0.15 150)` | Primary needs more lightness |
| `oklch(1 0 0)`         | `oklch(0.145 0 0)`     | Background inversion         |
| `oklch(0.145 0 0)`     | `oklch(0.985 0 0)`     | Foreground inversion         |
| Solid borders          | Alpha borders          | Better depth perception      |

### 8.3 Component Adaptations

```tsx
// Input with dark mode support
<Input className="dark:bg-input/30 dark:border-input" />

// Button dark mode
<Button className="dark:bg-destructive/60" />

// Ghost hover
<Button variant="ghost" className="dark:hover:bg-accent/50" />

// Card surfaces
<Card className="dark:bg-card" />  // Uses oklch(0.205 0 0)
```

### 8.4 Health Palette Inversion

In dark mode, the health green palette is inverted for proper contrast:

- Light shades (50-200) become darker
- Dark shades (700-900) become lighter
- This maintains the same visual hierarchy with opposite lightness

---

## 9. Icons

### 9.1 Icon Library

VHealth uses **Lucide React** as the primary icon library (configured in `components.json`).

```tsx
import { User, LogOut, Copy, Check, Pencil, RotateCw } from 'lucide-react';
```

### 9.2 Custom Icons

Custom icons are stored in `src/components/icons/`:

```tsx
import { Google } from '@/components/icons';
```

### 9.3 Icon Sizing

| Context           | Size  | Class                                  |
| ----------------- | ----- | -------------------------------------- |
| In buttons        | 16px  | `h-4 w-4` or auto via `[&_svg]:size-4` |
| Standalone small  | 16px  | `h-4 w-4`                              |
| Standalone medium | 20px  | `h-5 w-5`                              |
| Navigation        | 24px  | `h-6 w-6`                              |
| Large/hero        | 32px+ | `h-8 w-8`                              |

### 9.4 Icon Button Pattern

```tsx
// Icon-only button
<Button variant="ghost" size="icon">
  <Copy className="h-4 w-4" />
  <span className="sr-only">Copy</span>
</Button>

// Icon with text
<Button variant="ghost" size="sm" className="gap-1">
  <Copy className="h-4 w-4" />
  <span className="text-xs">Copy</span>
</Button>
```

---

## 10. Quick Reference

### 10.1 Common Patterns

```tsx
// Page container
<div className="min-h-screen bg-white">
  <div className="mx-auto max-w-[1340px] px-12 md:px-6">

// Auth layout
<div className="flex min-h-screen">
  <div className="w-full lg:w-[661px]">  {/* Form side */}
  <div className="hidden flex-1 lg:block">  {/* Image side */}

// Form section
<div className="w-full max-w-[26rem] space-y-8">

// Card grid
<div className="grid grid-cols-4 gap-6">
```

### 10.2 Tailwind Utilities Used

```tsx
// Class merging utility
import { cn } from '@/lib/utils';

<div
  className={cn('base-classes', condition && 'conditional-classes', className)}
/>;
```

### 10.3 Design Tokens Quick List

```
Colors:
  primary         oklch(0.52 0.18 162)
  accent          oklch(0.65 0.15 150)
  destructive     oklch(0.577 0.245 27.325)
  health-600      oklch(0.52 0.18 162)  [brand]

Spacing:
  xs    4px   (gap-1)
  sm    8px   (gap-2)
  md    12px  (gap-3)
  base  16px  (gap-4)
  lg    24px  (gap-6)
  xl    32px  (gap-8)

Radius:
  sm    6px   (rounded-md)
  base  10px  (rounded-[10px])
  lg    12px  (rounded-xl)
  full  9999px (rounded-full)

Font Weights:
  normal     400
  medium     500
  semibold   600
  bold       700
```

### 10.4 File References

| File                  | Purpose                     |
| --------------------- | --------------------------- |
| `src/app/globals.css` | CSS variables, theme config |
| `components.json`     | shadcn/ui configuration     |
| `src/app/layout.tsx`  | Font loading                |
| `src/lib/utils/cn.ts` | Class merging utility       |
| `src/components/ui/`  | Base UI components          |

---

## Changelog

| Date       | Version | Changes                            |
| ---------- | ------- | ---------------------------------- |
| 2025-12-04 | 1.0.0   | Initial design guidelines document |

---

**Questions or Updates?**

Contact the design team or submit issues to the repository.
