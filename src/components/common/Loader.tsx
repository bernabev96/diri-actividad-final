import { FormattedMessage } from 'react-intl';

export function Loader() {
  return (
    <div className="flex min-h-64 items-center justify-center p-8" role="status">
      <span className="sr-only">
        <FormattedMessage id="common.loading" />
      </span>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-violet-700" />
    </div>
  );
}
