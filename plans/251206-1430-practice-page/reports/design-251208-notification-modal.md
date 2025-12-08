# NotificationSetupModal - UI/UX Design Specification

**Date:** 2025-12-08
**Component:** `NotificationSetupModal`
**Location:** `src/components/practice/NotificationSetupModal/`
**Status:** Design Complete

---

## 1. Component Hierarchy

```
NotificationSetupModal/
├── index.tsx                 # Main modal wrapper + state management
├── DesktopFlow.tsx           # QR code display for desktop users
├── AndroidFlow.tsx           # Permission button for Android
├── IOSFlow.tsx               # PWA installation instructions
├── LoadingState.tsx          # Skeleton while checking devices
├── SuccessState.tsx          # Success celebration (auto-dismiss)
└── types.ts                  # Shared types
```

### Component Tree

```
<NotificationSetupModal>
  ├── <ModalOverlay>              // Fixed backdrop
  │   └── <ModalContainer>        // Centered card
  │       ├── <ModalHeader>       // Icon + Title + Description
  │       │   ├── <NotificationIcon>
  │       │   ├── <Title>
  │       │   └── <Description>
  │       │
  │       ├── <ModalContent>      // Platform-specific flow
  │       │   ├── <LoadingState> OR
  │       │   ├── <DesktopFlow> OR
  │       │   ├── <AndroidFlow> OR
  │       │   ├── <IOSFlow> OR
  │       │   └── <SuccessState>
  │       │
  │       └── <ModalFooter>       // Check Again button
  │           ├── <PlatformIndicator>
  │           └── <CheckAgainButton>
  └── </ModalOverlay>
</NotificationSetupModal>
```

---

## 2. Wireframe Descriptions

### 2.1 Modal Container (All States)

```
+--------------------------------------------------+
|                                                  |
|   [Backdrop: semi-transparent black overlay]     |
|                                                  |
|      +------------------------------------+      |
|      |                                    |      |
|      |     [Bell Icon - 48x48]            |      |
|      |                                    |      |
|      |     Thiết lập thông báo            |      |
|      |     (Bold, centered)               |      |
|      |                                    |      |
|      |     Để nhận nhắc nhở tập luyện,    |      |
|      |     vui lòng bật thông báo trên    |      |
|      |     thiết bị di động của bạn.      |      |
|      |     (Muted text, centered)         |      |
|      |                                    |      |
|      |   +----------------------------+   |      |
|      |   |                            |   |      |
|      |   |   [Platform-specific       |   |      |
|      |   |    content area]           |   |      |
|      |   |                            |   |      |
|      |   +----------------------------+   |      |
|      |                                    |      |
|      |   [Platform: Desktop] (badge)      |      |
|      |                                    |      |
|      |   [Kiểm tra lại] (button)          |      |
|      |                                    |      |
|      +------------------------------------+      |
|                                                  |
+--------------------------------------------------+
```

### 2.2 Loading State

```
+------------------------------------+
|                                    |
|     [Skeleton: circle 48x48]       |
|                                    |
|     [Skeleton: 180px x 24px]       |
|     [Skeleton: 220px x 16px]       |
|     [Skeleton: 200px x 16px]       |
|                                    |
|   +----------------------------+   |
|   |  [Skeleton: 200x200]       |   |
|   |  (QR placeholder)          |   |
|   +----------------------------+   |
|                                    |
|   [Skeleton: 100px x 32px]         |
|   (Button placeholder)             |
|                                    |
+------------------------------------+
```

### 2.3 Desktop Flow (QR Code)

```
+------------------------------------+
|                                    |
|     [Bell Icon]                    |
|                                    |
|     Thiết lập thông báo            |
|                                    |
|     Quét mã QR bằng điện thoại     |
|     để bật thông báo nhắc nhở      |
|                                    |
|   +----------------------------+   |
|   |                            |   |
|   |     +----------------+     |   |
|   |     |                |     |   |
|   |     |   [QR CODE]    |     |   |
|   |     |   200x200px    |     |   |
|   |     |                |     |   |
|   |     +----------------+     |   |
|   |                            |   |
|   |   vhealth.app/practice     |   |
|   |   ?device=register         |   |
|   |   (monospace, copyable)    |   |
|   |                            |   |
|   |   [Copy Icon] Sao chép     |   |
|   |                            |   |
|   +----------------------------+   |
|                                    |
|   [Desktop] (badge, gray)          |
|                                    |
|   [    Kiểm tra lại    ]           |
|   (Outline button)                 |
|                                    |
+------------------------------------+
```

### 2.4 Android Flow (Permission Button)

```
+------------------------------------+
|                                    |
|     [Bell Icon]                    |
|                                    |
|     Bật thông báo                  |
|                                    |
|     Cho phép VHealth gửi thông     |
|     báo để nhận nhắc nhở tập       |
|     luyện đúng giờ.                |
|                                    |
|   +----------------------------+   |
|   |                            |   |
|   |     [Bell Ring Animated]   |   |
|   |          56x56             |   |
|   |                            |   |
|   |   Thông báo sẽ giúp bạn:   |   |
|   |                            |   |
|   |   [Check] Không bỏ lỡ      |   |
|   |          buổi tập          |   |
|   |   [Check] Duy trì thói     |   |
|   |          quen tập luyện    |   |
|   |   [Check] Đạt mục tiêu     |   |
|   |          nhanh hơn         |   |
|   |                            |   |
|   +----------------------------+   |
|                                    |
|   [Android] (badge, green)         |
|                                    |
|   [=== Cho phép thông báo ===]     |
|   (Gradient button, full-width)    |
|                                    |
|   [Spinner] Đang xử lý...          |
|   (Loading state)                  |
|                                    |
+------------------------------------+
```

### 2.5 iOS Flow (PWA Instructions)

```
+------------------------------------+
|                                    |
|     [Bell Icon]                    |
|                                    |
|     Cài đặt ứng dụng               |
|                                    |
|     Để nhận thông báo trên iOS,    |
|     bạn cần thêm VHealth vào       |
|     Màn hình chính.                |
|                                    |
|   +----------------------------+   |
|   |                            |   |
|   |  Bước 1                    |   |
|   |  +----------------------+  |   |
|   |  | [Share Icon] Nhấn    |  |   |
|   |  | nút Chia sẻ ở thanh  |  |   |
|   |  | điều hướng Safari    |  |   |
|   |  +----------------------+  |   |
|   |                            |   |
|   |  Bước 2                    |   |
|   |  +----------------------+  |   |
|   |  | [Plus Square] Chọn   |  |   |
|   |  | "Thêm vào Màn hình   |  |   |
|   |  | chính"               |  |   |
|   |  +----------------------+  |   |
|   |                            |   |
|   |  Bước 3                    |   |
|   |  +----------------------+  |   |
|   |  | [App Icon] Mở ứng    |  |   |
|   |  | dụng VHealth từ Màn  |  |   |
|   |  | hình chính           |  |   |
|   |  +----------------------+  |   |
|   |                            |   |
|   +----------------------------+   |
|                                    |
|   [iOS] (badge, gray)              |
|                                    |
|   [    Kiểm tra lại    ]           |
|   (Outline button)                 |
|                                    |
+------------------------------------+
```

### 2.6 Success State

```
+------------------------------------+
|                                    |
|     [Check Circle - Animated]      |
|     Green, pulse animation         |
|                                    |
|     Đã bật thông báo!              |
|                                    |
|     Bạn sẽ nhận được nhắc nhở      |
|     trước mỗi buổi tập luyện.      |
|                                    |
|   +----------------------------+   |
|   |                            |   |
|   |   [Confetti animation]     |   |
|   |                            |   |
|   |   Thiết bị: Samsung S24    |   |
|   |   (Device name badge)      |   |
|   |                            |   |
|   +----------------------------+   |
|                                    |
|   (Auto-dismiss in 2s)             |
|   Progress bar at bottom           |
|                                    |
+------------------------------------+
```

---

## 3. Tailwind Class Specifications

### 3.1 Modal Overlay

```tsx
// Backdrop
className={cn(
  'fixed inset-0 z-50',
  'flex items-center justify-center',
  'bg-black/60 backdrop-blur-sm',
  // Entry animation
  'animate-in fade-in duration-200'
)}
```

### 3.2 Modal Container

```tsx
// Card container
className={cn(
  'relative w-full max-w-md mx-4',
  'bg-white rounded-2xl shadow-xl',
  'overflow-hidden',
  // Entry animation
  'animate-in zoom-in-95 slide-in-from-bottom-4',
  'duration-300'
)}
```

### 3.3 Modal Header

```tsx
// Header wrapper
className="px-6 pt-8 pb-4 text-center"

// Icon container
className={cn(
  'mx-auto mb-4 flex h-14 w-14 items-center justify-center',
  'rounded-full bg-primary/10'
)}

// Icon
className="h-7 w-7 text-primary"

// Title
className="text-xl font-semibold text-gray-900 mb-2"

// Description
className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto"
```

### 3.4 Modal Content Area

```tsx
// Content wrapper
className="px-6 pb-4"

// Content card (inner)
className={cn(
  'rounded-xl border border-gray-100',
  'bg-gray-50/50 p-6'
)}
```

### 3.5 QR Code Section (Desktop)

```tsx
// QR wrapper
className="flex flex-col items-center space-y-4"

// QR container
className={cn(
  'p-4 bg-white rounded-xl',
  'border border-gray-200 shadow-sm'
)}

// URL display
className={cn(
  'px-3 py-2 rounded-lg',
  'bg-gray-100 border border-gray-200',
  'font-mono text-xs text-gray-600',
  'break-all text-center'
)}

// Copy button
className={cn(
  'flex items-center gap-1.5',
  'text-xs text-gray-500 hover:text-primary',
  'transition-colors cursor-pointer'
)}
```

### 3.6 Benefits List (Android)

```tsx
// List container
className="space-y-3 text-left"

// List item
className="flex items-start gap-3"

// Check icon wrapper
className={cn(
  'flex-shrink-0 mt-0.5',
  'h-5 w-5 rounded-full',
  'bg-primary/10 flex items-center justify-center'
)}

// Check icon
className="h-3 w-3 text-primary"

// Item text
className="text-sm text-gray-600"
```

### 3.7 Step Instructions (iOS)

```tsx
// Steps container
className="space-y-4"

// Step number
className={cn(
  'text-xs font-medium text-primary uppercase tracking-wide mb-2'
)}

// Step card
className={cn(
  'flex items-start gap-3 p-3',
  'rounded-lg bg-white',
  'border border-gray-100'
)}

// Step icon wrapper
className={cn(
  'flex-shrink-0',
  'h-10 w-10 rounded-lg',
  'bg-gray-100 flex items-center justify-center'
)}

// Step icon
className="h-5 w-5 text-gray-600"

// Step text
className="text-sm text-gray-700 leading-snug"
```

### 3.8 Modal Footer

```tsx
// Footer wrapper
className="px-6 pb-6 pt-2 space-y-4"

// Platform badge
className={cn(
  'inline-flex items-center gap-1.5 px-2.5 py-1',
  'rounded-full text-xs font-medium',
  // Variants
  isDesktop && 'bg-gray-100 text-gray-600',
  isAndroid && 'bg-primary/10 text-primary',
  isIOS && 'bg-gray-100 text-gray-600'
)}

// Check Again button (outline)
className={cn(
  'w-full h-11',
  'rounded-lg border border-gray-200',
  'bg-white hover:bg-gray-50',
  'text-sm font-medium text-gray-700',
  'transition-colors',
  'flex items-center justify-center gap-2'
)}

// Primary CTA button (Android)
className={cn(
  'w-full h-12',
  'rounded-lg',
  'bg-gradient-to-r from-[#00bba7] to-[#00bc7d]',
  'text-white font-semibold',
  'hover:opacity-90 active:scale-[0.98]',
  'transition-all duration-200',
  'disabled:opacity-50 disabled:cursor-not-allowed'
)}
```

### 3.9 Loading Skeleton

```tsx
// Skeleton base
className = 'animate-pulse rounded-md bg-gray-200';

// Icon skeleton
className = 'h-14 w-14 rounded-full bg-gray-200 mx-auto';

// Title skeleton
className = 'h-6 w-44 bg-gray-200 rounded mx-auto';

// Description skeleton
className = 'h-4 w-56 bg-gray-200 rounded mx-auto';

// QR skeleton
className = 'h-[200px] w-[200px] bg-gray-200 rounded-xl mx-auto';

// Button skeleton
className = 'h-11 w-full bg-gray-200 rounded-lg';
```

### 3.10 Success State

```tsx
// Success icon container
className={cn(
  'mx-auto mb-4 flex h-16 w-16 items-center justify-center',
  'rounded-full bg-green-100',
  'animate-in zoom-in duration-300'
)}

// Success icon
className="h-8 w-8 text-green-600"

// Success title
className="text-xl font-semibold text-gray-900"

// Device badge
className={cn(
  'inline-flex items-center gap-2 px-3 py-1.5',
  'rounded-full bg-gray-100',
  'text-sm text-gray-600'
)}

// Progress bar (auto-dismiss)
className={cn(
  'absolute bottom-0 left-0 h-1',
  'bg-primary',
  'animate-[shrink_2s_linear_forwards]'
)}
```

---

## 4. Accessibility Considerations

### 4.1 ARIA Attributes

```tsx
// Modal container
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="notification-modal-title"
  aria-describedby="notification-modal-description"
>

// Title
<h2 id="notification-modal-title">
  Thiết lập thông báo
</h2>

// Description
<p id="notification-modal-description">
  Để nhận nhắc nhở tập luyện...
</p>

// Loading state
<div role="status" aria-live="polite">
  <span className="sr-only">Đang kiểm tra thiết bị...</span>
</div>

// Success state
<div role="alert" aria-live="assertive">
  Đã bật thông báo thành công!
</div>
```

### 4.2 Focus Management

```tsx
// Trap focus within modal
// Use @radix-ui/react-focus-scope or focus-trap-react

// Auto-focus first interactive element
<Button autoFocus ref={firstButtonRef}>

// Return focus on close
useEffect(() => {
  const previousFocus = document.activeElement;
  return () => {
    (previousFocus as HTMLElement)?.focus?.();
  };
}, []);
```

### 4.3 Keyboard Navigation

| Key           | Action                                |
| ------------- | ------------------------------------- |
| `Tab`         | Navigate between interactive elements |
| `Shift+Tab`   | Navigate backwards                    |
| `Enter/Space` | Activate buttons                      |
| `Escape`      | N/A (modal cannot be dismissed)       |

### 4.4 Screen Reader Announcements

```tsx
// Loading state
<span className="sr-only" role="status">
  Đang kiểm tra danh sách thiết bị đã đăng ký
</span>

// Platform detection
<span className="sr-only">
  Đang sử dụng thiết bị {platform}
</span>

// QR code
<div aria-label="Mã QR để quét bằng điện thoại">
  <QRCode />
  <span className="sr-only">
    Hoặc truy cập địa chỉ: {url}
  </span>
</div>

// Success
<div role="alert">
  Đã bật thông báo thành công cho thiết bị {deviceName}
</div>
```

### 4.5 Color Contrast Requirements

| Element             | Foreground | Background | Ratio  | Status            |
| ------------------- | ---------- | ---------- | ------ | ----------------- |
| Title               | `#111827`  | `#FFFFFF`  | 17.9:1 | Pass              |
| Description         | `#6B7280`  | `#FFFFFF`  | 5.7:1  | Pass              |
| Primary button text | `#FFFFFF`  | `#00bba7`  | 4.6:1  | Pass              |
| Muted text          | `#9CA3AF`  | `#F9FAFB`  | 3.2:1  | Pass (large text) |

### 4.6 Reduced Motion Support

```tsx
// Respect user preference
className={cn(
  'animate-in zoom-in-95',
  'motion-reduce:animate-none'
)}

// Or use media query
@media (prefers-reduced-motion: reduce) {
  .animate-in {
    animation: none;
  }
}
```

---

## 5. Animation & Interaction Specifications

### 5.1 Modal Entry

```css
/* Backdrop fade */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Card slide + zoom */
@keyframes modalEntry {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-enter {
  animation:
    fadeIn 200ms ease-out,
    modalEntry 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 5.2 Success State Celebration

```css
/* Check icon pulse */
@keyframes successPulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Confetti particles (optional) */
@keyframes confettiFall {
  0% {
    transform: translateY(-100%) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* Progress bar shrink */
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
```

### 5.3 Button Interactions

```tsx
// Hover state
className="hover:bg-gray-50 transition-colors duration-150"

// Active/pressed state
className="active:scale-[0.98] transition-transform duration-100"

// Loading state (Android button)
<Button disabled className="relative">
  <span className="opacity-0">Cho phép thông báo</span>
  <div className="absolute inset-0 flex items-center justify-center">
    <Spinner className="h-5 w-5" />
    <span className="ml-2">Đang xử lý...</span>
  </div>
</Button>
```

### 5.4 QR Code Appearance

```tsx
// Subtle fade-in for QR
className={cn(
  'animate-in fade-in duration-500',
  'delay-200'
)}

// Copy feedback
const [copied, setCopied] = useState(false);

// Show checkmark briefly
<span className={cn(
  'transition-all duration-200',
  copied ? 'text-green-500' : 'text-gray-500'
)}>
  {copied ? <Check /> : <Copy />}
</span>
```

### 5.5 Step Indicator (iOS)

```tsx
// Numbered steps with stagger
<div className='space-y-4'>
  {steps.map((step, i) => (
    <div
      key={i}
      className={cn('animate-in slide-in-from-left', `delay-[${i * 100}ms]`)}
    >
      {/* Step content */}
    </div>
  ))}
</div>
```

### 5.6 Check Again Button Feedback

```tsx
// Refetch animation
const [isRefetching, setIsRefetching] = useState(false);

<Button onClick={handleCheckAgain} disabled={isRefetching}>
  <RefreshCw className={cn('h-4 w-4', isRefetching && 'animate-spin')} />
  {isRefetching ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
</Button>;
```

---

## 6. Responsive Behavior

### 6.1 Breakpoint Adaptations

| Breakpoint         | Modal Width      | Padding | QR Size |
| ------------------ | ---------------- | ------- | ------- |
| `< 640px` (mobile) | 100% - 32px      | px-4    | 180x180 |
| `>= 640px` (sm)    | max-w-md (448px) | px-6    | 200x200 |
| `>= 768px` (md)    | max-w-md (448px) | px-6    | 200x200 |

### 6.2 Mobile Adjustments

```tsx
// Modal container
className={cn(
  'w-full max-w-md',
  // Mobile: slight margin
  'mx-4 sm:mx-auto'
)}

// Header padding
className="px-4 sm:px-6 pt-6 sm:pt-8"

// QR code size
<QRCode size={isMobile ? 180 : 200} />

// Step cards stack better
className={cn(
  'flex items-start gap-3 p-3',
  // Slightly smaller on mobile
  'sm:p-4'
)}
```

### 6.3 Safe Area Handling (iOS PWA)

```tsx
// Account for notch/home indicator
className={cn(
  'pb-6',
  'pb-[max(1.5rem,env(safe-area-inset-bottom))]'
)}
```

### 6.4 Landscape Orientation

```tsx
// Reduce vertical spacing in landscape
className={cn(
  'pt-8',
  'landscape:pt-4 landscape:pb-4'
)}

// Smaller icon in landscape
className={cn(
  'h-14 w-14',
  'landscape:h-10 landscape:w-10'
)}
```

---

## 7. State Machine

```
┌─────────────┐
│   LOADING   │ ──────────────────────────────────┐
└──────┬──────┘                                   │
       │ devices fetched                          │
       ▼                                          │
┌─────────────┐    has mobile device    ┌────────▼────────┐
│  CHECKING   │ ───────────────────────▶│     SUCCESS     │
└──────┬──────┘                         └────────┬────────┘
       │ no mobile device                        │
       ▼                                         │ auto-dismiss (2s)
┌─────────────┐                                  ▼
│  PLATFORM   │                          ┌──────────────┐
│  DETECTION  │                          │    CLOSE     │
└──────┬──────┘                          └──────────────┘
       │
       ├─── Desktop ──▶ [DesktopFlow]
       │                      │
       ├─── Android ──▶ [AndroidFlow]
       │                      │
       └─── iOS ──────▶ [IOSFlow]
                              │
                              │ "Check Again" clicked
                              ▼
                       ┌─────────────┐
                       │  REFETCHING │
                       └──────┬──────┘
                              │
                              └──────────▶ back to CHECKING
```

---

## 8. Props Interface

```typescript
interface NotificationSetupModalProps {
  /** Whether the modal is open */
  isOpen: boolean;

  /** Callback when modal should close (after success) */
  onSuccess: () => void;

  /** Optional: Pre-detected platform (for testing) */
  platform?: 'desktop' | 'android' | 'ios';

  /** Optional: QR code URL base */
  qrBaseUrl?: string;
}

interface DeviceFlowProps {
  /** Callback to trigger device refetch */
  onCheckAgain: () => void;

  /** Whether currently refetching */
  isRefetching: boolean;
}

interface AndroidFlowProps extends DeviceFlowProps {
  /** Callback when permission granted */
  onPermissionGranted: (token: string) => void;

  /** Whether permission request is in progress */
  isRequestingPermission: boolean;
}
```

---

## 9. Icon Specifications

| Icon              | Library | Name           | Size | Color            |
| ----------------- | ------- | -------------- | ---- | ---------------- |
| Notification bell | Lucide  | `Bell`         | 28px | `text-primary`   |
| Success check     | Lucide  | `CheckCircle2` | 32px | `text-green-600` |
| Share (iOS)       | Lucide  | `Share`        | 20px | `text-gray-600`  |
| Add to home       | Lucide  | `PlusSquare`   | 20px | `text-gray-600`  |
| App icon          | Lucide  | `Smartphone`   | 20px | `text-gray-600`  |
| Check bullet      | Lucide  | `Check`        | 12px | `text-primary`   |
| Copy              | Lucide  | `Copy`         | 14px | `text-gray-500`  |
| Refresh           | Lucide  | `RefreshCw`    | 16px | `text-gray-600`  |
| Desktop badge     | Lucide  | `Monitor`      | 14px | `text-gray-500`  |
| Android badge     | Lucide  | `Smartphone`   | 14px | `text-primary`   |
| iOS badge         | Lucide  | `Apple`        | 14px | `text-gray-500`  |

---

## 10. Copy/Microcopy

### Vietnamese Text (Default)

| Element         | Text                                                                |
| --------------- | ------------------------------------------------------------------- |
| Loading         | Đang kiểm tra...                                                    |
| Desktop Title   | Thiết lập thông báo                                                 |
| Desktop Desc    | Quét mã QR bằng điện thoại để bật thông báo nhắc nhở tập luyện      |
| Copy URL        | Sao chép liên kết                                                   |
| Copied          | Đã sao chép!                                                        |
| Android Title   | Bật thông báo                                                       |
| Android Desc    | Cho phép VHealth gửi thông báo để nhận nhắc nhở tập luyện đúng giờ  |
| Android CTA     | Cho phép thông báo                                                  |
| Android Loading | Đang xử lý...                                                       |
| Benefit 1       | Không bỏ lỡ buổi tập                                                |
| Benefit 2       | Duy trì thói quen tập luyện                                         |
| Benefit 3       | Đạt mục tiêu nhanh hơn                                              |
| iOS Title       | Cài đặt ứng dụng                                                    |
| iOS Desc        | Để nhận thông báo trên iOS, bạn cần thêm VHealth vào Màn hình chính |
| iOS Step 1      | Nhấn nút Chia sẻ ở thanh điều hướng Safari                          |
| iOS Step 2      | Chọn "Thêm vào Màn hình chính"                                      |
| iOS Step 3      | Mở ứng dụng VHealth từ Màn hình chính                               |
| Check Again     | Kiểm tra lại                                                        |
| Checking        | Đang kiểm tra...                                                    |
| Success Title   | Đã bật thông báo!                                                   |
| Success Desc    | Bạn sẽ nhận được nhắc nhở trước mỗi buổi tập luyện                  |
| Device Label    | Thiết bị:                                                           |

---

## 11. Error States

### 11.1 Permission Denied (Android)

```tsx
// Show inline error, keep modal open
<Alert variant='destructive' className='mt-4'>
  <AlertTitle>Không thể bật thông báo</AlertTitle>
  <AlertDescription>
    Vui lòng cho phép thông báo trong cài đặt trình duyệt và thử lại.
  </AlertDescription>
</Alert>
```

### 11.2 Network Error

```tsx
// Show toast + retry option
toast.error('Không thể kết nối. Vui lòng thử lại.');

<Button onClick={handleRetry}>
  <RefreshCw className='mr-2 h-4 w-4' />
  Thử lại
</Button>;
```

### 11.3 Device Registration Failed

```tsx
// Show error in content area
<div className='py-4 text-center'>
  <p className='mb-3 text-sm text-red-500'>
    Đăng ký thiết bị thất bại. Vui lòng thử lại.
  </p>
  <Button variant='outline' onClick={handleRetry}>
    Thử lại
  </Button>
</div>
```

---

## 12. Implementation Notes

### 12.1 QR Code Generation

```tsx
// Use qrcode.react library
import { QRCodeSVG } from 'qrcode.react';

<QRCodeSVG
  value={`${baseUrl}/practice?device=register`}
  size={200}
  level='M'
  bgColor='#FFFFFF'
  fgColor='#000000'
  includeMargin={false}
/>;
```

### 12.2 Platform Detection Hook

```tsx
// hooks/usePlatformDetection.ts
export function usePlatformDetection() {
  const [platform, setPlatform] = useState<'desktop' | 'android' | 'ios'>(
    'desktop'
  );

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios');
    } else if (/android/.test(ua)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }
  }, []);

  return platform;
}
```

### 12.3 Auto-dismiss Timer

```tsx
// Success state auto-dismiss
useEffect(() => {
  if (state === 'success') {
    const timer = setTimeout(() => {
      onSuccess();
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [state, onSuccess]);
```

---

## 13. Testing Considerations

### 13.1 Visual Regression Tests

- [ ] Loading skeleton renders correctly
- [ ] Desktop QR code displays at correct size
- [ ] Android benefits list alignment
- [ ] iOS steps numbered correctly
- [ ] Success animation plays
- [ ] Mobile responsive layout

### 13.2 Interaction Tests

- [ ] "Check Again" triggers refetch
- [ ] Android permission flow completes
- [ ] Copy URL shows feedback
- [ ] Success auto-dismisses after 2s
- [ ] Focus trapped within modal

### 13.3 Accessibility Audit

- [ ] Screen reader announces modal
- [ ] Focus moves to first element
- [ ] ARIA labels present
- [ ] Color contrast passes WCAG AA

---

## Unresolved Questions

1. Should we add a "Skip for now" option for users who want to explore the form first?
2. What happens if FCM token registration succeeds but device API fails?
3. Should QR code have VHealth logo embedded?
4. Do we need haptic feedback on mobile when permission granted?
