import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { ROUTES } from '../../config/routes';

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-950">
        <FormattedMessage id="notFound.title" />
      </h1>
      <Link to={ROUTES.home} className="mt-6 inline-flex rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white">
        <FormattedMessage id="notFound.link" />
      </Link>
    </section>
  );
}
