// Ensure you replace this with the public key from your backend
const PUBLIC_VAPID_KEY = 'REPLACE_WITH_YOUR_PUBLIC_KEY';

export async function setupPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push messaging is not supported');
    return;
  }

  try {
    // 1. Register the Service Worker (Must be served from your public root)
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered');

    // 2. Request permission and subscribe
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });

    // 3. Send subscription to your backend
    await fetch('http://localhost:3000/api/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });

    console.log('Successfully subscribed to push notifications!');
  } catch (error) {
    console.error('Error setting up push notifications:', error);
  }
}

// Helper function required to convert VAPID key to a Uint8Array for the browser
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}