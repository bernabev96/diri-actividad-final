import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { FormInput } from '../../components/forms/FormInput';
import { Pagination } from '../../components/common/Pagination';
import { getPageCount, getPageItems } from '../../utils/pagination';
import { profileSchema, type ProfileFormValues } from '../../utils/validators';
import { useProfileViewModel } from '../../viewmodels/useProfileViewModel';

const validNotificationMessageIds = new Set([
  'notification.promoted',
  'notification.promotedWithClass',
  'notification.waitlistJoined',
  'notification.waitlistJoinedWithClass',
  'notification.waitlistLeft',
  'notification.waitlistLeftWithClass',
]);

function getNotificationMessage(notificationMessage: unknown) {
  if (typeof notificationMessage !== 'string') {
    return {
      classTitle: undefined,
      messageId: 'notifications.unknown',
    };
  }

  const [messageId, classTitle] = notificationMessage.split('|');

  return {
    classTitle,
    messageId: validNotificationMessageIds.has(messageId) ? messageId : 'notifications.unknown',
  };
}

function getNotificationDate(createdAt: unknown) {
  if (typeof createdAt !== 'string') {
    return null;
  }

  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? null : date;
}

const notificationsPageSize = 5;

export default function ProfilePage() {
  const intl = useIntl();
  const {
    areNotificationsLoading,
    error,
    initialValues,
    isLoading,
    notifications,
    notificationsError,
    passwordResetSent,
    requestPasswordReset,
    success,
    updateProfile,
    user,
  } = useProfileViewModel();
  const [notificationsPage, setNotificationsPage] = useState(1);
  const notificationsPageCount = getPageCount(notifications.length, notificationsPageSize);
  const paginatedNotifications = getPageItems(notifications, notificationsPage, notificationsPageSize);
  const userName = typeof user?.name === 'string' ? user.name : '';
  const userEmail = typeof user?.email === 'string' ? user.email : '';
  const userInitials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'GQ';
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  useEffect(() => {
    setNotificationsPage(1);
  }, [notifications.length]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-violet-100/70">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-violet-700 text-2xl font-black text-white">
            {userInitials}
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-violet-700">
              <FormattedMessage id="profile.title" />
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">{userName}</h1>
            <p className="mt-1 text-sm text-slate-600">{userEmail}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            <FormattedMessage id="profile.data.title" />
          </h2>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit(updateProfile)}>
            <FormInput
              error={errors.name}
              label={intl.formatMessage({ id: 'auth.name' })}
              registration={register('name')}
              type="text"
            />
            <FormInput
              error={errors.phone}
              label={intl.formatMessage({ id: 'profile.phone' })}
              registration={register('phone')}
              type="tel"
            />
            {error ? <ErrorMessage messageId={error} /> : null}
            {success ? (
              <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <FormattedMessage id="profile.success" />
              </p>
            ) : null}
            <button className="rounded-xl bg-violet-700 px-4 py-3 font-bold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:bg-slate-300" disabled={isLoading} type="submit">
              <FormattedMessage id={isLoading ? 'auth.loading' : 'profile.submit'} />
            </button>
          </form>
        </section>

        <div className="grid gap-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              <FormattedMessage id="profile.security.title" />
            </h2>
            <button
              className="mt-5 rounded-xl bg-violet-700 px-4 py-3 font-bold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              onClick={requestPasswordReset}
              type="button"
            >
              <FormattedMessage id="profile.password.change" />
            </button>
            {passwordResetSent ? (
              <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <FormattedMessage id="profile.password.success" />
              </p>
            ) : null}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-950">
                <FormattedMessage id="notifications.title" />
              </h2>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-800">
                <FormattedMessage id="notifications.count" values={{ count: notifications.length }} />
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              <FormattedMessage id="notifications.description" />
            </p>
            {notificationsError ? <ErrorMessage messageId={notificationsError} /> : null}
            {areNotificationsLoading ? (
              <p className="mt-4 text-sm text-slate-600">
                <FormattedMessage id="common.loading" />
              </p>
            ) : notifications.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">
                <FormattedMessage id="notifications.empty" />
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {paginatedNotifications.map((notification) => {
                  const notificationMessage = getNotificationMessage(notification.message);
                  const notificationDate = getNotificationDate(notification.createdAt);

                  return (
                    <li className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" key={notification.id}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span>
                          <FormattedMessage
                            id={notificationMessage.messageId}
                            values={{ classTitle: notificationMessage.classTitle }}
                          />
                        </span>
                        <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-bold text-emerald-900">
                          <FormattedMessage id={notification.read ? 'notifications.read' : 'notifications.unread'} />
                        </span>
                      </div>
                      {notificationDate ? (
                        <time className="mt-2 block text-xs text-emerald-700" dateTime={notification.createdAt}>
                          {intl.formatDate(notificationDate, {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}{' '}
                          {intl.formatTime(notificationDate, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </time>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
            <Pagination currentPage={notificationsPage} onPageChange={setNotificationsPage} pageCount={notificationsPageCount} />
          </section>
        </div>
      </div>
    </section>
  );
}
