import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loader } from '../../components/common/Loader';
import { Pagination } from '../../components/common/Pagination';
import { FormInput } from '../../components/forms/FormInput';
import type { ClassSession } from '../../models/class-session.model';
import type { Reservation } from '../../models/reservation.model';
import type { AppUser } from '../../models/user.model';
import { getPageCount, getPageItems } from '../../utils/pagination';
import { classSessionSchema, getTodayDateValue, type ClassSessionFormValues } from '../../utils/validators';
import { useAdminViewModel } from '../../viewmodels/useAdminViewModel';

const emptyClassForm: ClassSessionFormValues = {
  active: true,
  capacity: 10,
  date: '',
  time: '',
  title: '',
  trainer: '',
};

const classesPageSize = 4;
const reservationsPageSize = 5;

type ReservationsTableProps = {
  classSession: ClassSession;
  reservations: Reservation[];
  reservationUsers: AppUser[];
};

function ReservationsTable({ classSession, reservations, reservationUsers }: ReservationsTableProps) {
  const intl = useIntl();
  const [page, setPage] = useState(1);
  const pageCount = getPageCount(reservations.length, reservationsPageSize);
  const paginatedReservations = getPageItems(reservations, page, reservationsPageSize);

  useEffect(() => {
    setPage(1);
  }, [reservations.length]);

  if (reservations.length === 0) {
    return (
      <p className="mt-2 text-sm text-slate-600">
        <FormattedMessage id="admin.reservations.empty" />
      </p>
    );
  }

  return (
    <>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="py-2 pr-4 font-medium"><FormattedMessage id="admin.reservations.user" /></th>
              <th className="py-2 pr-4 font-medium"><FormattedMessage id="admin.reservations.class" /></th>
              <th className="py-2 pr-4 font-medium"><FormattedMessage id="admin.reservations.status" /></th>
              <th className="py-2 font-medium"><FormattedMessage id="admin.reservations.position" /></th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservations.map((reservation) => {
              const reservationUser = reservationUsers.find((user) => user.id === reservation.userId);

              return (
                <tr className="border-t border-slate-100" key={reservation.id}>
                  <td className="py-2 pr-4 text-slate-700">
                    <span className="block font-semibold text-slate-950">{reservationUser?.name ?? intl.formatMessage({ id: 'admin.reservations.unknownUser' })}</span>
                    <span className="block text-xs text-slate-500">{reservationUser?.email ?? reservation.userId}</span>
                  </td>
                  <td className="py-2 pr-4 text-slate-700">{classSession.title}</td>
                  <td className="py-2 pr-4 text-slate-700">
                    <FormattedMessage id={`reservation.status.${reservation.status}`} values={{ position: reservation.position }} />
                  </td>
                  <td className="py-2 text-slate-700">{reservation.position ?? '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} onPageChange={setPage} pageCount={pageCount} />
    </>
  );
}

export default function AdminClassesPage() {
  const intl = useIntl();
  const { classes, classesError, isClassesLoading, removeClass, reservations, reservationUsers, saveClass } = useAdminViewModel();
  const [selectedClass, setSelectedClass] = useState<ClassSession | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ClassSessionFormValues>({
    resolver: zodResolver(classSessionSchema),
    defaultValues: emptyClassForm,
  });
  const pageCount = getPageCount(classes.length, classesPageSize);
  const paginatedClasses = getPageItems(classes, page, classesPageSize);

  useEffect(() => {
    setPage(1);
  }, [classes.length]);

  useEffect(() => {
    reset(selectedClass ? {
      active: selectedClass.active,
      capacity: selectedClass.capacity,
      date: selectedClass.date,
      time: selectedClass.time,
      title: selectedClass.title,
      trainer: selectedClass.trainer,
    } : emptyClassForm);
  }, [reset, selectedClass]);

  function openCreateModal() {
    setSelectedClass(undefined);
    setIsModalOpen(true);
  }

  function openEditModal(classSession: ClassSession) {
    setSelectedClass(classSession);
    setIsModalOpen(true);
  }

  async function submit(values: ClassSessionFormValues) {
    await saveClass(values, selectedClass);
    setIsModalOpen(false);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-xl shadow-violet-100/70">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-violet-700">
            <FormattedMessage id="admin.kicker" />
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            <FormattedMessage id="admin.classes.title" />
          </h1>
        </div>
        <button className="rounded-xl bg-violet-700 px-5 py-3 font-bold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500" onClick={openCreateModal} type="button">
          <FormattedMessage id="admin.classes.create" />
        </button>
      </div>
      {classesError ? <ErrorMessage messageId={classesError} /> : null}
      {isClassesLoading ? <Loader /> : null}
      {!isClassesLoading && classes.length === 0 ? <EmptyState messageId="admin.classes.empty" /> : null}
      <div className="mt-8 grid gap-4">
        {paginatedClasses.map((classSession) => {
          const classReservations = reservations.filter((reservation) => reservation.classId === classSession.id);

          return (
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" key={classSession.id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">{classSession.title}</h2>
                <p className="mt-1 text-sm font-medium text-slate-600">{classSession.trainer}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-violet-300 hover:text-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500" onClick={() => openEditModal(classSession)} type="button">
                  <FormattedMessage id="admin.classes.edit" />
                </button>
                <button className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500" onClick={() => removeClass(classSession.id)} type="button">
                  <FormattedMessage id="admin.classes.delete" />
                </button>
              </div>
            </div>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="text-sm font-semibold text-slate-800">
                <FormattedMessage id="admin.reservations.title" />
              </h3>
              <ReservationsTable classSession={classSession} reservations={classReservations} reservationUsers={reservationUsers} />
            </div>
          </article>
          );
        })}
      </div>
      <Pagination currentPage={page} onPageChange={setPage} pageCount={pageCount} />

      <Dialog className="relative z-50" onClose={setIsModalOpen} open={isModalOpen}>
        <div className="fixed inset-0 bg-slate-950/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <DialogTitle className="text-xl font-black text-slate-950">
              <FormattedMessage id={selectedClass ? 'admin.classes.edit' : 'admin.classes.create'} />
            </DialogTitle>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)}>
              <FormInput error={errors.title} label={intl.formatMessage({ id: 'class.title' })} registration={register('title')} type="text" />
              <FormInput error={errors.trainer} label={intl.formatMessage({ id: 'class.trainer' })} registration={register('trainer')} type="text" />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput error={errors.date} label={intl.formatMessage({ id: 'class.date' })} min={getTodayDateValue()} registration={register('date')} type="date" />
                <FormInput error={errors.time} label={intl.formatMessage({ id: 'class.time' })} registration={register('time')} type="time" />
              </div>
              <FormInput error={errors.capacity} label={intl.formatMessage({ id: 'class.capacity' })} registration={register('capacity', { valueAsNumber: true })} type="number" />
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input className="h-4 w-4 rounded border-slate-300" type="checkbox" {...register('active')} />
                <FormattedMessage id="class.active" />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500" onClick={() => setIsModalOpen(false)} type="button">
                  <FormattedMessage id="admin.classes.close" />
                </button>
                <button className="rounded-xl bg-violet-700 px-4 py-2 font-bold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500" type="submit">
                  <FormattedMessage id="admin.classes.save" />
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
