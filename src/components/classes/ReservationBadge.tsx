import { FormattedMessage } from 'react-intl';
import type { Reservation } from '../../models/reservation.model';

type ReservationBadgeProps = {
  reservation?: Reservation;
};

export function ReservationBadge({ reservation }: ReservationBadgeProps) {
  if (!reservation) {
    return null;
  }

  if (reservation.status === 'reserved') {
    return (
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
        <FormattedMessage id="reservation.status.reserved" />
      </span>
    );
  }

  return (
    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
      <FormattedMessage id="reservation.status.waitlist" values={{ position: reservation.position }} />
    </span>
  );
}
