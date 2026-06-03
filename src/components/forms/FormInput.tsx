import type { InputHTMLAttributes } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { useIntl } from 'react-intl';

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: FieldError;
  label: string;
  registration: UseFormRegisterReturn;
};

export function FormInput({ error, label, registration, ...props }: FormInputProps) {
  const intl = useIntl();
  const errorMessage = error?.message ? intl.formatMessage({ id: error.message }) : null;

  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-600 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        aria-invalid={Boolean(error)}
        {...registration}
        {...props}
      />
      {errorMessage ? <span className="mt-1 block text-sm text-red-600">{errorMessage}</span> : null}
    </label>
  );
}
