import { FormattedMessage } from 'react-intl';

type ErrorMessageProps = {
  messageId: string;
};

export function ErrorMessage({ messageId }: ErrorMessageProps) {
  return (
    <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
      <FormattedMessage id={messageId} />
    </p>
  );
}
