import { FormattedMessage } from 'react-intl';

type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="inline-flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-700 text-base font-black text-white shadow-sm shadow-violet-200">
        GQ
      </span>
      {!compact ? (
        <span className="text-xl font-black tracking-tight text-slate-950">
          <FormattedMessage id="app.name" />
        </span>
      ) : null}
    </div>
  );
}
