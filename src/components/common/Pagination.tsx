import { FormattedMessage } from 'react-intl';

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, onPageChange, pageCount }: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="pagination">
      <button
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        <FormattedMessage id="pagination.previous" />
      </button>
      <span className="rounded-xl bg-violet-50 px-3 py-2 text-sm font-bold text-violet-800">
        <FormattedMessage id="pagination.current" values={{ current: currentPage, total: pageCount }} />
      </span>
      <button
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        <FormattedMessage id="pagination.next" />
      </button>
    </nav>
  );
}
