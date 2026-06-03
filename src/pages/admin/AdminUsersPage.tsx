import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loader } from '../../components/common/Loader';
import { Pagination } from '../../components/common/Pagination';
import { FormInput } from '../../components/forms/FormInput';
import { getPageCount, getPageItems } from '../../utils/pagination';
import { userSearchSchema, type UserSearchFormValues } from '../../utils/validators';
import { useAdminViewModel } from '../../viewmodels/useAdminViewModel';

const pageSize = 6;

export default function AdminUsersPage() {
  const intl = useIntl();
  const { isSearchingUsers, searchUsers, userSearchError, users } = useAdminViewModel();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<UserSearchFormValues>({
    resolver: zodResolver(userSearchSchema),
    defaultValues: {
      email: '',
    },
  });
  const [page, setPage] = useState(1);
  const pageCount = getPageCount(users.length, pageSize);
  const paginatedUsers = getPageItems(users, page, pageSize);

  useEffect(() => {
    setPage(1);
  }, [users.length]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-violet-100/70">
        <p className="text-sm font-black uppercase tracking-wider text-violet-700">
          <FormattedMessage id="admin.kicker" />
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          <FormattedMessage id="admin.users.title" />
        </h1>
      </div>
      <form className="mt-8 flex max-w-xl flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end" onSubmit={handleSubmit(searchUsers)}>
        <div className="flex-1">
          <FormInput error={errors.email} label={intl.formatMessage({ id: 'admin.users.search' })} registration={register('email')} type="search" />
        </div>
        <button className="rounded-xl bg-violet-700 px-5 py-3 font-bold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:bg-slate-300" disabled={isSearchingUsers} type="submit">
          <FormattedMessage id="admin.users.submit" />
        </button>
      </form>
      {userSearchError ? <ErrorMessage messageId={userSearchError} /> : null}
      {isSearchingUsers ? <Loader /> : null}
      {!isSearchingUsers && users.length === 0 ? <EmptyState messageId="admin.users.empty" /> : null}
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {paginatedUsers.map((user) => (
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" key={user.id}>
            <h2 className="font-bold text-slate-950">{user.name}</h2>
            <p className="text-sm text-slate-600">{user.email}</p>
            <p className="mt-3 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-800">
              <FormattedMessage id={`role.${user.role}`} />
            </p>
          </article>
        ))}
      </div>
      <Pagination currentPage={page} onPageChange={setPage} pageCount={pageCount} />
    </section>
  );
}
