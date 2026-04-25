self.addEventListener('push', (event: any) => {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || 'New Notification';
  const options = {
    body: data.body || 'You have a new message.',
    icon: '/icon.png', // Optional: Replace with a real icon path in your public folder
  };

  event.waitUntil(
    (self as any).registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();
  // Optional: Open a specific URL when the user clicks the notification
  event.waitUntil(
    (self as any).clients.matchAll({ type: 'window' }).then((clientsArr: any[]) => {
      if (clientsArr.length) {
        clientsArr[0].focus();
      } else {
        (self as any).clients.openWindow('/');
      }
    })
  );
});