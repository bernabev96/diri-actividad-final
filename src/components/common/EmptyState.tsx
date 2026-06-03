import { FormattedMessage } from 'react-intl';

type EmptyStateProps = {
  messageId: string;
};

export function EmptyState({ messageId }: EmptyStateProps) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 shadow-sm">
      <FormattedMessage id={messageId} />
    </div>
  );
}
