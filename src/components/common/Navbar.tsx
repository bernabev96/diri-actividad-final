import { Link, NavLink } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { ROUTES } from '../../config/routes';
import { selectAuthUser, selectIsAdmin } from '../../features/auth/authSelectors';
import { setLocale } from '../../features/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { Logo } from './Logo';

const baseLinkClass =
  'rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 hover:bg-violet-50 hover:text-violet-800';

export function Navbar() {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const locale = useAppSelector((state) => state.ui.locale);
  const { logout } = useAuthViewModel();

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    `${baseLinkClass} ${isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-700'}`;

  function changeLocale(nextLocale: 'es' | 'en') {
    localStorage.setItem('gymqueue.locale', nextLocale);
    dispatch(setLocale(nextLocale));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link className="rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500" to={ROUTES.home}>
          <Logo />
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          <NavLink to={ROUTES.home} className={navClassName}>
            <FormattedMessage id="nav.home" />
          </NavLink>
          {user ? (
            <>
              <NavLink to={ROUTES.classes} className={navClassName}>
                <FormattedMessage id="nav.classes" />
              </NavLink>
              <NavLink to={ROUTES.profile} className={navClassName}>
                <FormattedMessage id="nav.profile" />
              </NavLink>
              {isAdmin ? (
                <NavLink to={ROUTES.admin} className={navClassName}>
                  <FormattedMessage id="nav.admin" />
                </NavLink>
              ) : null}
              <button className={baseLinkClass} onClick={logout} type="button">
                <FormattedMessage id="auth.logout" />
              </button>
            </>
          ) : (
            <>
              <NavLink to={ROUTES.login} className={navClassName}>
                <FormattedMessage id="nav.login" />
              </NavLink>
              <NavLink to={ROUTES.register} className={navClassName}>
                <FormattedMessage id="nav.register" />
              </NavLink>
            </>
          )}
          <select
            aria-label={intl.formatMessage({ id: 'nav.language' })}
            className="ml-2 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            value={locale}
            onChange={(event) => changeLocale(event.target.value as 'es' | 'en')}
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
        </div>
      </nav>
    </header>
  );
}
