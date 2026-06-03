import { FormattedMessage } from 'react-intl';
import type { ClassSession } from '../../models/class-session.model';
import type { Reservation } from '../../models/reservation.model';
import { formatClassDate } from '../../utils/formatters';
import { ReservationBadge } from './ReservationBadge';

type ClassCardProps = {
  classSession: ClassSession;
  reservedCount: number;
  reservation?: Reservation;
  waitlistCount: number;
  onCancel: (reservation: Reservation) => void;
  onReserve: (classSession: ClassSession) => void;
};

export function ClassCard({ classSession, onCancel, onReserve, reservation, reservedCount, waitlistCount }: ClassCardProps) {
  const isFull = reservedCount >= classSession.capacity;
  const availableSpots = Math.max(classSession.capacity - reservedCount, 0);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/60">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-violet-700">
            <FormattedMessage id="class.session" />
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">{classSession.title}</h2>
          <p className="mt-1 text-sm font-medium text-slate-600">{classSession.trainer}</p>
        </div>
        <ReservationBadge reservation={reservation} />
      </div>

      <dl className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <dt className="font-bold text-slate-500"><FormattedMessage id="class.date" /></dt>
          <dd className="mt-1 font-semibold text-slate-900">{formatClassDate(classSession.date, classSession.time)}</dd>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4">
          <dt className="font-bold text-emerald-700"><FormattedMessage id="class.available" /></dt>
          <dd className="mt-1 font-black text-emerald-900">{availableSpots}</dd>
        </div>
        <div className="rounded-2xl bg-violet-50 p-4">
          <dt className="font-bold text-violet-700"><FormattedMessage id="class.capacity" /></dt>
          <dd className="mt-1 font-black text-violet-950">{reservedCount}/{classSession.capacity}</dd>
        </div>
        <div className="rounded-2xl bg-amber-50 p-4">
          <dt className="font-bold text-amber-700"><FormattedMessage id="class.waitlist" /></dt>
          <dd className="mt-1 font-black text-amber-900">{waitlistCount}</dd>
        </div>
      </dl>

      <div className="mt-6">
        {reservation ? (
          <button className="rounded-xl border border-red-200 bg-white px-4 py-2.5 font-bold text-red-700 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500" onClick={() => onCancel(reservation)} type="button">
            <FormattedMessage id="reservation.cancel" />
          </button>
        ) : (
          <button className="rounded-xl bg-violet-700 px-4 py-2.5 font-bold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500" onClick={() => onReserve(classSession)} type="button">
            <FormattedMessage id={isFull ? 'reservation.joinWaitlist' : 'reservation.reserve'} />
          </button>
        )}
      </div>
    </article>
  );
}
