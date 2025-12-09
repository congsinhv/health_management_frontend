# Duplicate Notification Analysis Report

## Executive Summary

The duplicate notification issue is caused by a race condition between the Service Worker (background handler) and the application's foreground handler. Both are attempting to display notifications for the same event, particularly when the application is in a "mixed" state (e.g., in background but with a client still technically active/visible to the browser, or during the transition between foreground/background).

## Technical Analysis

### 1. Dual Notification Sources

The application has two distinct paths for handling notifications:

1.  **Foreground Handler (`FirebaseNotificationProvider.tsx`)**:
    - Active when the user is using the app.
    - Listens to `onMessage` from Firebase.
    - Displays a `sonner` toast notification.
    - **Does not** trigger a system notification (browser push notification).

2.  **Background Handler (`firebase-messaging-sw.js`)**:
    - Active when the app is in the background or closed.
    - Listens to the `push` event.
    - Explicitly attempts to check for focused clients before showing a notification.
    - **Triggers a system notification** if no focused client is found.

### 2. The Conflict

The duplication arises in `firebase-messaging-sw.js`:

```javascript
// Check if any app window is currently focused (foreground)
event.waitUntil(
  clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then(clientList => {
      const hasFocusedClient = clientList.some(client => client.focused);

      if (hasFocusedClient) {
        // ... skip notification
        return;
      }

      // ... show notification
      return showNotification();
    })
);
```

While this logic attempts to prevent duplicates, it is not foolproof:

- **Race Conditions**: There can be a delay between the `push` event arriving and the client focus check.
- **Browser Behavior**: "Focus" state can be ambiguous during tab switching or minimizing.
- **Multiple Service Workers**: The project has `public/sw.js` (Workbox) and `public/firebase-messaging-sw.js`. If they both try to handle push events (though Workbox config suggests it's mainly for caching), it could be an issue, but the primary conflict is within the Firebase setup.

### 3. Key Findings

- **`src/lib/firebase.ts`**: The `setupForegroundMessageHandler` correctly uses `onMessage` which only fires when the app is in focus. This handler _only_ shows a toast, which is correct.
- **`public/firebase-messaging-sw.js`**:
  - It manually implements deduplication using `handledMessages` set.
  - It manually implements the "foreground check" using `clients.matchAll()`.
  - **CRITICAL**: Firebase JS SDK _also_ has internal logic for handling messages. By manually handling the `push` event _and_ using the Firebase SDK, we might be stepping on the SDK's default behavior, or the SDK might be firing `onBackgroundMessage` (which we capture but don't show notification for) while our manual `push` listener _also_ fires.

### 4. Root Cause

The most likely cause is the manual `push` event listener in `firebase-messaging-sw.js` effectively "double-handling" the notification logic that the Firebase SDK might also be trying to manage, or simply that the `hasFocusedClient` check returns `false` in edge cases where the user _is_ effectively in the app (or just switched), causing the SW to show a system notification _while_ the app receives the `onMessage` event and shows a toast.

However, the user report says "duplicated notifications within 1 event from the system". This implies **two system notifications**, or **one system notification + one toast** that look identical.

If it's **two system notifications**:

1.  One from our manual `showNotification()` call.
2.  One potentially from the browser/OS if the payload contains a `notification` block and the browser handles it automatically before the SW intercepts it (though `event.preventDefault()` isn't explicitly called, typical SW push handling overrides this). Or, if `firebase-messaging-sw.js` is registered multiple times or in a weird state.

If it's **one system notification + one toast**:

1.  The SW thinks the app is in background (showing system notification).
2.  The App thinks it is in foreground (receiving `onMessage` and showing toast).

This "split brain" scenario is common.

## Recommendations

### 1. Improve Deduplication Logic

Enhance the message deduplication in `public/firebase-messaging-sw.js` to be more robust. The current `handledMessages` Set is in-memory and might be reset if the SW restarts.

### 2. Refine "Foreground" Detection

Instead of just checking `client.focused`, we can try to communicate with the client. However, a simpler fix is often better.

### 3. Payload Strategy (Recommended Fix)

**Change how the backend sends notifications.**

- **Notification Messages**: (contain `notification` key) -> SDK handles display automatically when in background. `onMessage` handles it in foreground.
- **Data Messages**: (contain ONLY `data` key) -> SW `push` handler is responsible for everything.

**Current Setup**: The SW code expects a payload that might have `notification` or `data`.

**Fix in `firebase-messaging-sw.js`**:
If the payload contains a `notification` property, the browser/Firebase SDK often handles the display automatically when in background. By _also_ calling `showNotification` manually in the `push` event listener, we create a duplicate.

**Action**: Modify `public/firebase-messaging-sw.js` to **NOT** show a notification if the payload allows the default Firebase SDK handler to do it, OR ensure we are the _only_ ones doing it.

Given the code:

```javascript
messaging.onBackgroundMessage(payload => {
  console.log(
    '[SW] Firebase onBackgroundMessage received (not showing, handled by push event)'
  );
  // Intentionally empty
});
```

We are suppressing the SDK's background handler. But the _browser_ might still show a notification if the push payload has a `notification` dictionary and the SW doesn't consume the event properly.

**Proposed Solution**:
Modify `public/firebase-messaging-sw.js` to ensure we don't double-fire.

1.  **Check the Payload**: If the incoming push message has a `notification` property, the browser might display it automatically.
2.  **Tagging**: Ensure the `tag` property is consistently used. Notifications with the same `tag` replace each other. The current code generates a tag:
    ```javascript
    const tag = notification.tag || data.tag || `vhealth-${Date.now()}`;
    ```
    Using `Date.now()` guarantees a _new_ notification every time, preventing the OS from deduping identical messages. **Fix: Use a consistent tag id from the message data (e.g., `data.messageId` or `data.eventId`) if available.**

### 4. Code Fixes

**File**: `public/firebase-messaging-sw.js`

1.  **Stable Tagging**: Change the default tag generation to use something from the payload if possible, or a constant if it's a generic update.
2.  **Clearer Logic**: Ensure we aren't showing a notification if `onBackgroundMessage` would have done it (though we silenced it).

## Unresolved Questions

1.  What does the exact payload from the backend look like? Does it contain both `notification` and `data` fields?
2.  Is the user seeing **two system notifications** or **one system notification + one toast**? (Assuming the former based on "duplicated notifications... from the system").

## Action Plan

1.  **Modify `public/firebase-messaging-sw.js`**:
    - Improve `tag` generation to avoid unique timestamps for the same event.
    - Verify the `shouldHandleMessage` logic.

2.  **Verify Backend Payload**: Ensure the backend isn't sending two requests.

3.  **Test**: Send a test notification and observe behavior.
