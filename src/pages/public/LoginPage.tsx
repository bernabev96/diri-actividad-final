import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { FormInput } from '../../components/forms/FormInput';
import { ROUTES } from '../../config/routes';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { loginSchema, type LoginFormValues } from '../../utils/validators';

export default function LoginPage() {
  const intl = useIntl();
  const { error, isLoading, login } = useAuthViewModel();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-6xl items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-violet-100/70 sm:p-8">
        <div className="text-center">
          <Logo />
          <h1 className="mt-8 text-3xl font-black text-slate-950">
            <FormattedMessage id="login.title" />
          </h1>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(login)}>
          <FormInput
            autoComplete="email"
            error={errors.email}
            label={intl.formatMessage({ id: 'auth.email' })}
            registration={register('email')}
            type="email"
          />
          <FormInput
            autoComplete="current-password"
            error={errors.password}
            label={intl.formatMessage({ id: 'auth.password' })}
            registration={register('password')}
            type="password"
          />
          {error ? (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
              <FormattedMessage id={error} />
            </p>
          ) : null}
          <button
            className="w-full rounded-xl bg-violet-700 px-4 py-3 font-bold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            disabled={isLoading}
            type="submit"
          >
            <FormattedMessage id={isLoading ? 'auth.loading' : 'login.submit'} />
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          <FormattedMessage id="login.noAccount" />{' '}
          <Link className="font-bold text-violet-700 hover:text-violet-900" to={ROUTES.register}>
            <FormattedMessage id="nav.register" />
          </Link>
        </p>
      </div>
    </section>
  );
}
