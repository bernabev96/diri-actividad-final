import { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { selectAuthUser } from '../features/auth/authSelectors';
import { logger } from '../services/logger.service';
import { subscribeToUserNotifications } from '../services/notification.service';
import { useAppSelector } from '../store/hooks';

export function useNotificationToastsViewModel() {
  const intl = useIntl();
  const user = useAppSelector(selectAuthUser);
  const hasLoadedNotifications = useRef(false);
  const knownNotificationIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      hasLoadedNotifications.current = false;
      knownNotificationIds.current = new Set();
      return;
    }

    const unsubscribe = subscribeToUserNotifications(
      user.id,
      (notifications) => {
        const hasNewPromotion = notifications.some(
          (notification) =>
            !knownNotificationIds.current.has(notification.id) && notification.message.startsWith('notification.promoted'),
        );

        if (hasLoadedNotifications.current && hasNewPromotion) {
          toast.info(intl.formatMessage({ id: 'notifications.toastNew' }));
        }

        knownNotificationIds.current = new Set(notifications.map((notification) => notification.id));
        hasLoadedNotifications.current = true;
      },
      (error) => {
        logger.error('Notification toast subscription failed', error);
      },
    );

    return () => unsubscribe();
  }, [intl, user]);
}
