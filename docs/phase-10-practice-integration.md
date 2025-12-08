# Phase 10 - Practice Page Notification Integration

**Project:** VHealth (health_management_frontend)
**Phase:** 10 - Practice Page Notification Integration
**Status:** Implemented
**Last Updated:** December 2025
**Completion Date:** 2025-12-08

---

## Overview

Phase 10 integrates the notification setup flow into the Practice Page, implementing a gating mechanism that ensures users register a mobile device before they can save their practice schedules. This phase enhances user engagement by ensuring practice reminders can be delivered effectively.

**Key Goals:**

- Gate practice form submission behind mobile device registration
- Handle `?device=register` query parameter for deep-linking from mobile
- Show notification setup modal when no mobile device is registered
- Auto-trigger device registration on mobile devices with query parameter
- Maintain existing form validation and functionality

---

## Changes Summary

### 1. Practice Page Integration

**File:** `src/app/practice/page.tsx` (MAJOR UPDATE)

The practice page has been significantly enhanced with notification gating logic:

```typescript
// Notification modal state
const [showNotificationModal, setShowNotificationModal] = useState(false);
const [isAutoRegistering, setIsAutoRegistering] = useState(false);

// Fetch user devices
const {
  data: devicesData,
  isLoading: isLoadingDevices,
  refetch: refetchDevices,
} = useDevices();

const registerDevice = useRegisterDevice();

// Check if user has mobile device
const hasMobileDevice = devicesData?.devices
  ? deviceService.hasMobileDevice(devicesData.devices)
  : false;
```

**Key Features Implemented:**

1. **Device Detection:** Automatically checks if user has a registered mobile device
2. **Modal Gate:** Shows notification modal if no mobile device detected
3. **Query Parameter Handling:** Processes `?device=register` for mobile deep-linking
4. **Auto-Registration:** Registers mobile device automatically when deep-linked
5. **Form Submission Gate:** Prevents saving without mobile device registration
6. **Loading State:** Shows loading while checking device status

### 2. Notification Gate Banner

**Visual Component:** Added to practice page when no mobile device

```tsx
{
  !hasMobileDevice && (
    <div className='mx-auto mb-6 w-[82.5%]'>
      <div className='flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
        <div className='flex items-center gap-3'>
          <span className='text-2xl'>📱</span>
          <div>
            <p className='font-medium text-yellow-800'>
              Chưa có thiết bị di động
            </p>
            <p className='text-sm text-yellow-700'>
              Đăng ký thiết bị để nhận nhắc nhở tập luyện
            </p>
          </div>
        </div>
        <Button
          variant='outline'
          onClick={() => setShowNotificationModal(true)}
          className='border-yellow-400 bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        >
          Đăng ký ngay
        </Button>
      </div>
    </div>
  );
}
```

**Design Elements:**

- Yellow warning theme to indicate action needed
- Clear messaging about device registration requirement
- Prominent button to trigger notification setup
- Responsive design matching overall page layout

### 3. Submit Button State Management

**Enhanced Logic:** Submit button disabled state now includes device check

```tsx
<Button
  type='submit'
  onClick={() => onSubmit(form.getValues())}
  disabled={
    submitMutation.isPending || form.formState.isSubmitting || !hasMobileDevice // New condition
  }
  className='w-full rounded-none bg-black px-17 py-3.25 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto'
>
  {
    submitMutation.isPending || form.formState.isSubmitting
      ? 'Đang lưu...'
      : hasMobileDevice
        ? 'Lưu thiết lập'
        : 'Đăng ký thiết bị trước' // New text
  }
</Button>
```

**User Experience Improvements:**

- Clear messaging about why form cannot be submitted
- Visual distinction between disabled/enabled states
- Context-aware button text based on device status

### 4. Deep-Link Auto-Registration

**Query Parameter Handler:** Automatic device registration on mobile

```typescript
// Handle ?device=register query param on mobile
useEffect(() => {
  const isRegisterFlow = searchParams.get('device') === 'register';

  if (
    isRegisterFlow &&
    isMobileDevice() &&
    !hasMobileDevice &&
    !isLoadingDevices
  ) {
    handleAutoRegister();
  }
}, [searchParams, hasMobileDevice, isLoadingDevices]);

// Auto-register device on mobile deep-link
const handleAutoRegister = async () => {
  setIsAutoRegistering(true);

  try {
    const token = await requestNotificationPermission();
    if (!token) {
      toast.error('Vui lòng cho phép thông báo để tiếp tục');
      setShowNotificationModal(true);
      return;
    }

    const platform = /iphone|ipad|ipod/i.test(navigator.userAgent)
      ? 'ios'
      : 'android';

    await registerDevice.mutateAsync({
      fcm_token: token,
      platform,
      device_name: navigator.userAgent.substring(0, 50),
    });

    toast.success('Đã đăng ký thiết bị thành công!');

    // Remove query param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('device');
    window.history.replaceState({}, '', url.toString());
  } catch (error) {
    console.error('Auto-registration failed:', error);
    toast.error('Không thể đăng ký thiết bị. Vui lòng thử lại.');
    setShowNotificationModal(true);
  } finally {
    setIsAutoRegistering(false);
  }
};
```

**Auto-Registration Flow:**

1. Detects `?device=register` query parameter
2. Validates mobile device platform
3. Requests notification permission
4. Registers device with FCM token
5. Shows success/error feedback
6. Cleans up URL query parameter

### 5. Form Submission Gate

**Enhanced onSubmit Handler:** Blocks submission without mobile device

```typescript
const onSubmit = async (data: PracticeFormData) => {
  // Gate: Check for mobile device
  if (!hasMobileDevice) {
    toast.error('Vui lòng đăng ký thiết bị di động trước khi lưu');
    setShowNotificationModal(true);
    return;
  }

  const isValid = await form.trigger();
  if (!isValid) {
    toast.error('Vui lòng kiểm tra lại thông tin');
    // Smoothly scroll to first error field
    const firstError = document.querySelector('[aria-invalid="true"]');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (firstError as HTMLElement).focus?.();
    }
    return;
  }
  submitMutation.mutate(data);
};
```

**Gate Logic:**

- Early return if no mobile device registered
- Clear error message explaining requirement
- Automatic modal display for device registration
- Preserves all existing validation logic

### 6. Suspense Wrapper

**Page Structure:** Wrapped with Suspense for useSearchParams compatibility

```typescript
const PracticePageContent = () => {
  // ... all existing implementation moved here
};

// Default export with Suspense
const PracticePage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PracticePageContent />
    </Suspense>
  );
};

const LoadingFallback = () => (
  <>
    <Header className='sticky top-0 left-0 z-50 w-full' />
    <div className='flex min-h-screen items-center justify-center pt-24'>
      <div className='animate-pulse text-gray-500'>Đang tải...</div>
    </div>
    <Footer />
  </>
);
```

---

## Implementation Details

### Component Dependencies

**New Imports Added:**

```typescript
import { useSearchParams } from 'next/navigation';
import { deviceService } from '@/services/device';
import { isMobileDevice } from '@/lib/utils/platform';
import { requestNotificationPermission } from '@/lib/firebase';
import { useDevices, useRegisterDevice } from '@/hooks/useDevices';
import { NotificationSetupModal } from '@/components/practice';
```

**Service Integrations:**

- `deviceService.hasMobileDevice()` - Checks for registered mobile devices
- `useDevices()` - Fetches device list with React Query
- `useRegisterDevice()` - Registers new device mutation
- `isMobileDevice()` - Platform detection utility
- `requestNotificationPermission()` - Firebase FCM token request

### State Management

**New State Variables:**

- `showNotificationModal` - Controls modal visibility
- `isAutoRegistering` - Tracks auto-registration progress
- `devicesData` - Fetched device list
- `hasMobileDevice` - Computed boolean for gating logic

**Query Client Integration:**

```typescript
const queryClient = useQueryClient();

// Invalidate queries on successful save
queryClient.invalidateQueries({ queryKey: ['practiceProfile'] });
queryClient.invalidateQueries({ queryKey: ['userProfile'] });

// Refetch devices after registration
refetchDevices();
```

### Loading States

**Enhanced LoadingOverlay Usage:**

```typescript
<LoadingOverlay
  isVisible={submitMutation.isPending || isAutoRegistering}
  message={isAutoRegistering ? 'Đang đăng ký thiết bị...' : 'Đang lưu thiết lập...'}
/>
```

**Dynamic Loading Messages:**

- "Đang kiểm tra thiết bị..." - During device check
- "Đăng ký thiết bị..." - During auto-registration
- "Đang lưu thiết lập..." - During form submission

---

## User Flow Scenarios

### Scenario 1: Desktop User Without Mobile Device

1. User navigates to Practice page
2. Page shows loading while checking devices
3. Yellow warning banner appears: "Chưa có thiết bị di động"
4. Submit button shows: "Đăng ký thiết bị trước"
5. Clicking submit or "Đăng ký ngay" opens NotificationSetupModal
6. Modal shows QR code for mobile registration
7. After registration, modal closes and banner disappears
8. User can now submit the form

### Scenario 2: Mobile User Without Device

1. User opens Practice page on mobile device
2. Same initial flow as desktop user
3. NotificationSetupModal shows mobile-specific instructions
4. User can directly register on same device
5. PWA installation prompt for iOS (if applicable)
6. FCM registration for Android
7. Modal auto-closes after successful registration

### Scenario 3: Mobile User with Deep-Link

1. User clicks link with `?device=register` parameter
2. Page loads and detects mobile device + query param
3. Auto-registration flow triggers immediately
4. Permission request shown for notifications
5. Device registered with FCM token
6. Success toast notification shown
7. Query parameter removed from URL
8. Page loads normally with device already registered

### Scenario 4: User with Already Registered Device

1. User navigates to Practice page
2. Device check completes quickly
3. No banner or modal shown
4. Normal form submission flow
5. Submit button shows: "Lưu thiết lập"

---

## Error Handling

### Auto-Registration Failures

```typescript
try {
  // Registration logic
} catch (error) {
  console.error('Auto-registration failed:', error);
  toast.error('Không thể đăng ký thiết bị. Vui lòng thử lại.');
  setShowNotificationModal(true);
}
```

**Failure Scenarios:**

- Notification permission denied
- FCM token generation failed
- Network issues during registration
- API errors from backend
- Platform detection failures

**Fallback Strategy:**

1. Show descriptive error message
2. Fall back to manual registration modal
3. Allow user to try again
4. Preserve form state during error

### Form Submission Validation

**Enhanced Error Scenarios:**

- Missing mobile device: Shows toast + modal
- Form validation errors: Scrolls to first error field
- Network errors: Toast with retry suggestion
- Server errors: Generic error message

---

## Testing Checklist

### Device Detection

- [ ] Loading state shows while checking devices
- [ ] Banner appears when no mobile device registered
- [ ] Banner disappears when device registered
- [ ] Multiple devices handled correctly

### Modal Integration

- [ ] Modal opens on banner click
- [ ] Modal opens on submit without device
- [ ] Modal closes on successful registration
- [ ] Modal refetches devices on success

### Deep-Link Handling

- [ ] Query parameter detected correctly
- [ ] Auto-registration triggers on mobile
- [ ] Permission request shown
- [ ] URL cleaned up after registration
- [ ] No auto-registration on desktop

### Form Submission

- [ ] Submit button disabled without device
- [ ] Submit button text changes correctly
- [ ] Form validation preserved
- [ ] Success flow works with device
- [ ] Error handling works correctly

### Responsive Design

- [ ] Banner responsive on mobile/tablet
- [ ] Modal responsive across devices
- [ ] Loading states consistent
- [ ] Button states clear

---

## Performance Considerations

### Device Check Optimization

```typescript
// Only fetch devices once per session
const {
  data: devicesData,
  isLoading: isLoadingDevices,
  refetch: refetchDevices,
} = useDevices({
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### Effect Dependencies

Optimized to prevent unnecessary re-renders:

```typescript
// Specific dependencies to prevent race conditions
useEffect(() => {
  // Auto-register logic
}, [searchParams, hasMobileDevice, isLoadingDevices]);

useEffect(() => {
  // Modal show logic
}, [isLoadingDevices, hasMobileDevice, isAutoRegistering]);
```

---

## Accessibility Considerations

### Screen Reader Support

- Banner uses semantic HTML structure
- ARIA labels on interactive elements
- Toast notifications announced to screen readers
- Modal focuses management

### Keyboard Navigation

- Tab order maintained with new elements
- Submit button accessible via keyboard
- Modal keyboard navigation preserved
- Focus management during auto-registration

### Visual Design

- High contrast colors for warning banner
- Clear visual indicators for button states
- Loading indicators with accessible text
- Error messages with clear, actionable text

---

## Browser Compatibility

### Mobile Detection

Relies on `navigator.userAgent` string parsing:

- iOS: `/iphone|ipad|ipod/i`
- Android: `/android/i`
- Fallback: Touch capability detection

### Notification API

Supported in:

- Chrome 50+
- Firefox 48+
- Edge 17+
- Safari 16.4+

### FCM Support

Requires service worker support and HTTPS.

---

## Security Considerations

### Input Validation

- Query parameter validated before processing
- Platform detection uses regex patterns
- Device name truncated to prevent abuse
- FCM tokens validated by backend

### Permission Handling

- Explicit user permission required
- Clear explanation of permission purpose
- Graceful fallback if denied
- No silent registration

### Data Protection

- FCM tokens sent via HTTPS
- Device registration authenticated
- No sensitive data in query parameters
- Secure token storage in backend

---

## Future Enhancements

### Planned Improvements

1. **Multi-Device Support**
   - Allow multiple mobile devices per user
   - Device nicknames for identification
   - Primary device selection

2. **Notification Preferences**
   - Granular notification types
   - Customizable reminder times
   - Do-not-disturb hours

3. **Desktop Notifications**
   - Web Push API integration
   - Cross-device synchronization
   - Notification history

4. **Analytics Integration**
   - Track registration conversion
   - Monitor notification engagement
   - A/B test messaging variants

---

## Related Documentation

- `docs/phase-06-device-service.md` - Device registration service
- `docs/phase-08-firebase-pwa.md` - Firebase and PWA setup
- `docs/phase-09-notification-ui.md` - Notification UI components
- `docs/system-architecture.md` - Overall notification architecture
- `docs/deployment-guide.md` - Environment configuration
