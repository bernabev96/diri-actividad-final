import { FormattedMessage } from 'react-intl';
import { Link, useRouteError } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { logger } from '../../services/logger.service';

export default function UnexpectedErrorPage() {
  const error = useRouteError();
  logger.error('Unexpected route error', error);

  return (
    <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-3xl items-center justify-center px-4 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-violet-100/70">
        <p className="text-sm font-black uppercase tracking-wider text-violet-700">
          <FormattedMessage id="error.unexpected.kicker" />
        </p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">
          <FormattedMessage id="error.unexpected.title" />
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          <FormattedMessage id="error.unexpected.text" />
        </p>
        <Link
          className="mt-6 inline-flex rounded-xl bg-violet-700 px-5 py-3 font-bold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          to={ROUTES.home}
        >
          <FormattedMessage id="notFound.link" />
        </Link>
      </div>
    </section>
  );
}
