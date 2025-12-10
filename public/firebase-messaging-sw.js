// Firebase Cloud Messaging Service Worker
// This file must be in public/ for proper scope

importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

// Firebase config will be passed via postMessage from the main app
let firebaseApp = null;
let messaging = null;

// Listen for config from main app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    if (!firebaseApp) {
      firebaseApp = firebase.initializeApp(event.data.config);
      messaging = firebase.messaging();

      // Handle background messages
      messaging.onBackgroundMessage(payload => {
        const notificationTitle = payload.notification?.title || 'VHealth';
        const notificationOptions = {
          body: payload.notification?.body || 'Bạn có thông báo mới',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          data: payload.data,
        };

        self.registration.showNotification(
          notificationTitle,
          notificationOptions
        );
      });
    }
  }
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/practice';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(urlToOpen);
      })
  );
});
