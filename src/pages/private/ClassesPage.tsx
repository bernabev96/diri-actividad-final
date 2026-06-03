import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ClassCard } from '../../components/classes/ClassCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loader } from '../../components/common/Loader';
import { Pagination } from '../../components/common/Pagination';
import { getPageCount, getPageItems } from '../../utils/pagination';
import { useClassesViewModel } from '../../viewmodels/useClassesViewModel';

const pageSize = 4;

export default function ClassesPage() {
  const { cancel, classItems, error, isLoading, reserve } = useClassesViewModel();
  const [page, setPage] = useState(1);
  const pageCount = getPageCount(classItems.length, pageSize);
  const paginatedClassItems = getPageItems(classItems, page, pageSize);

  useEffect(() => {
    setPage(1);
  }, [classItems.length]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl bg-violet-950 px-6 py-8 text-white shadow-xl shadow-violet-100/70">
        <p className="text-sm font-black uppercase tracking-wider text-emerald-300">
          <FormattedMessage id="classes.kicker" />
        </p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
          <FormattedMessage id="classes.title" />
        </h1>
      </div>
      {error ? <ErrorMessage messageId={error} /> : null}
      {isLoading ? <Loader /> : null}
      {!isLoading && classItems.length === 0 ? <EmptyState messageId="classes.empty" /> : null}
      <div className="mt-8 grid gap-5">
        {paginatedClassItems.map((item) => (
          <ClassCard
            classSession={item.classSession}
            key={item.classSession.id}
            onCancel={cancel}
            onReserve={reserve}
            reservation={item.reservation}
            reservedCount={item.reservedCount}
            waitlistCount={item.waitlistCount}
          />
        ))}
      </div>
      <Pagination currentPage={page} onPageChange={setPage} pageCount={pageCount} />
    </section>
  );
}
