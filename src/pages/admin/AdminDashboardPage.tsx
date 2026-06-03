import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { ROUTES } from '../../config/routes';

export default function AdminDashboardPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl bg-violet-950 px-6 py-8 text-white shadow-xl shadow-violet-100/70">
        <p className="text-sm font-black uppercase tracking-wider text-emerald-300">
          <FormattedMessage id="admin.kicker" />
        </p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
          <FormattedMessage id="admin.title" />
        </h1>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link className="rounded-3xl border border-slate-200 bg-white p-6 font-bold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-violet-800 hover:shadow-lg hover:shadow-violet-100/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500" to={ROUTES.adminClasses}>
          <FormattedMessage id="admin.link.classes" />
        </Link>
        <Link className="rounded-3xl border border-slate-200 bg-white p-6 font-bold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-violet-800 hover:shadow-lg hover:shadow-violet-100/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500" to={ROUTES.adminUsers}>
          <FormattedMessage id="admin.link.users" />
        </Link>
      </div>
    </section>
  );
}
