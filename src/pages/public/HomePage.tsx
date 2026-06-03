import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Logo } from '../../components/common/Logo';
import { ROUTES } from '../../config/routes';

const featureIds = ['reservations', 'waitlist', 'admin'] as const;
const highlightedClasses = ['strength', 'mobility', 'hiit'] as const;

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
        <div>
          <Logo />
          <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            <FormattedMessage id="home.title" />
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            <FormattedMessage id="home.subtitle" />
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={ROUTES.register}
              className="rounded-xl bg-violet-700 px-5 py-3 font-bold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              <FormattedMessage id="home.primaryAction" />
            </Link>
            <Link
              to={ROUTES.login}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 transition hover:border-violet-300 hover:text-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              <FormattedMessage id="home.secondaryAction" />
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xl shadow-violet-100/70">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-violet-700">
              <FormattedMessage id="home.featured.title" />
            </h2>
            <div className="mt-5 grid gap-3">
              {highlightedClasses.map((classId) => (
                <article className="rounded-2xl border border-slate-200 bg-white p-4" key={classId}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-950">
                        <FormattedMessage id={`home.highlight.${classId}.title`} />
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        <FormattedMessage id={`home.highlight.${classId}.meta`} />
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      <FormattedMessage id="home.highlight.available" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-12 md:grid-cols-3">
        {featureIds.map((featureId) => (
          <article key={featureId} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">
              <FormattedMessage id={`home.feature.${featureId}.title`} />
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              <FormattedMessage id={`home.feature.${featureId}.text`} />
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-4 rounded-3xl bg-violet-950 p-6 text-white md:grid-cols-[0.8fr_1.2fr] md:p-8">
          <div>
            <h2 className="text-2xl font-black">
              <FormattedMessage id="home.gym.title" />
            </h2>
            <p className="mt-3 text-sm leading-6 text-violet-100">
              <FormattedMessage id="home.gym.text" />
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {['schedule', 'location', 'coaches'].map((item) => (
              <div className="rounded-2xl bg-white/10 p-4" key={item}>
                <p className="text-sm font-bold">
                  <FormattedMessage id={`home.gym.${item}`} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
        <FormattedMessage id="home.footer" />
      </footer>
    </>
  );
}
