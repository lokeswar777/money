import express from 'express';
import webpush from 'web-push';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// IMPORTANT: Generate keys using `npx web-push generate-vapid-keys`
const PUBLIC_VAPID_KEY = 'REPLACE_WITH_YOUR_PUBLIC_KEY';
const PRIVATE_VAPID_KEY = 'REPLACE_WITH_YOUR_PRIVATE_KEY';

webpush.setVapidDetails(
  'mailto:test@example.com',
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

// In-memory store for demo purposes. Use a real database in production!
const subscriptions: any[] = [];

app.post('/api/save-subscription', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscription saved.' });
});

app.post('/api/send-notification', async (req, res) => {
  const payload = JSON.stringify({
    title: 'Hello from Backend!',
    body: 'This is an offline web push notification.'
  });

  try {
    const promises = subscriptions.map(sub => webpush.sendNotification(sub, payload));
    await Promise.all(promises);
    res.status(200).json({ message: 'Notifications sent successfully.' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notifications.' });
  }
});

app.listen(3000, () => console.log('Backend running on port 3000'));