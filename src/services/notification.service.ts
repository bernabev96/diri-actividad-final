import { addDoc, collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import type { AppNotification } from '../models/notification.model';

function getNotificationsCollection() {
  return collection(db, 'notifications');
}

export async function createNotification(userId: string, message: string): Promise<void> {
  await addDoc(getNotificationsCollection(), {
    userId,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export async function getUserNotifications(userId: string): Promise<AppNotification[]> {
  const notificationsQuery = query(getNotificationsCollection(), where('userId', '==', userId));
  const snapshot = await getDocs(notificationsQuery);
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as AppNotification)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export function subscribeToUserNotifications(
  userId: string,
  callback: (notifications: AppNotification[]) => void,
  onError: (error: Error) => void,
) {
  const notificationsQuery = query(getNotificationsCollection(), where('userId', '==', userId));

  return onSnapshot(
    notificationsQuery,
    (snapshot) => {
      const notifications = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }) as AppNotification)
        .sort((first, second) => second.createdAt.localeCompare(first.createdAt));

      callback(notifications);
    },
    onError,
  );
}
