import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { setAuthUser } from '../features/auth/authSlice';
import { selectAuthUser } from '../features/auth/authSelectors';
import type { AppNotification } from '../models/notification.model';
import { logger } from '../services/logger.service';
import { subscribeToUserNotifications } from '../services/notification.service';
import { sendPasswordReset } from '../services/auth.service';
import { updateUserProfile } from '../services/user.service';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { ProfileFormValues } from '../utils/validators';

export function useProfileViewModel() {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [areNotificationsLoading, setAreNotificationsLoading] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const initialValues = useMemo(
    () => ({
      name: user?.name ?? '',
      phone: user?.phone ?? '',
    }),
    [user?.name, user?.phone],
  );

  async function updateProfile(values: ProfileFormValues) {
    if (!user) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserProfile(user.id, values);
      dispatch(setAuthUser({ ...user, ...values }));
      setSuccess(true);
      logger.info('Profile updated', { userId: user.id });
    } catch (updateError) {
      logger.error('Profile update failed', updateError);
      setError('profile.error.update');
    } finally {
      setIsLoading(false);
    }
  }

  async function requestPasswordReset() {
    if (!user?.email) {
      return;
    }

    try {
      await sendPasswordReset(user.email);
      setPasswordResetSent(true);
      toast.success(intl.formatMessage({ id: 'profile.password.toastSuccess' }));
    } catch (error) {
      logger.error('Password reset email failed', error);
      toast.error(intl.formatMessage({ id: 'profile.password.error' }));
    }
  }

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setAreNotificationsLoading(false);
      return;
    }

    const userId = user.id;
    setAreNotificationsLoading(true);
    setNotificationsError(null);

    const unsubscribe = subscribeToUserNotifications(
      userId,
      (result) => {
        setNotifications(result);
        setAreNotificationsLoading(false);
      },
      (error) => {
        logger.error('Notifications subscription failed', error);
        setNotificationsError('notifications.error.load');
        setAreNotificationsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  return {
    error,
    areNotificationsLoading,
    initialValues,
    isLoading,
    notifications,
    notificationsError,
    passwordResetSent,
    requestPasswordReset,
    success,
    updateProfile,
    user,
  };
}
