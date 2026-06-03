import { useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { selectClasses, selectClassesError, selectClassesStatus } from '../features/classes/classesSelectors';
import { fetchClassesThunk } from '../features/classes/classesThunks';
import { selectAuthUser } from '../features/auth/authSelectors';
import { selectAllReservations, selectMyReservations, selectReservationsError, selectReservationsStatus } from '../features/reservations/reservationsSelectors';
import { cancelReservationThunk, fetchAllReservationsThunk, fetchMyReservationsThunk, reserveClassThunk } from '../features/reservations/reservationsThunks';
import type { ClassSession } from '../models/class-session.model';
import type { Reservation } from '../models/reservation.model';
import { isClassSessionFinished } from '../utils/formatters';
import { findUserReservation, getReservedCount, getWaitlistCount } from '../utils/reservationLogic';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export type ClassListItem = {
  classSession: ClassSession;
  reservedCount: number;
  reservation?: Reservation;
  waitlistCount: number;
};

export function useClassesViewModel() {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const classes = useAppSelector(selectClasses);
  const classesStatus = useAppSelector(selectClassesStatus);
  const classesError = useAppSelector(selectClassesError);
  const reservations = useAppSelector(selectAllReservations);
  const myReservations = useAppSelector(selectMyReservations);
  const reservationsStatus = useAppSelector(selectReservationsStatus);
  const reservationsError = useAppSelector(selectReservationsError);
  const user = useAppSelector(selectAuthUser);

  useEffect(() => {
    dispatch(fetchClassesThunk());
    dispatch(fetchAllReservationsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyReservationsThunk(user.id));
    }
  }, [dispatch, user]);

  const classItems = useMemo<ClassListItem[]>(
    () =>
      classes
        .filter((classSession) => classSession.active && !isClassSessionFinished(classSession.date, classSession.time))
        .map((classSession) => ({
          classSession,
          reservedCount: getReservedCount(classSession.id, reservations),
          reservation: user ? findUserReservation(classSession.id, user.id, myReservations) : undefined,
          waitlistCount: getWaitlistCount(classSession.id, reservations),
        })),
    [classes, myReservations, reservations, user],
  );

  async function reserve(classSession: ClassSession) {
    if (!user) {
      return;
    }

    if (isClassSessionFinished(classSession.date, classSession.time)) {
      toast.error(intl.formatMessage({ id: 'reservations.error.finished' }));
      return;
    }

    try {
      const reservation = await dispatch(reserveClassThunk({ classId: classSession.id, userId: user.id, capacity: classSession.capacity })).unwrap();
      await dispatch(fetchAllReservationsThunk()).unwrap();
      await dispatch(fetchMyReservationsThunk(user.id)).unwrap();

      toast[reservation.status === 'reserved' ? 'success' : 'info'](
        intl.formatMessage({ id: reservation.status === 'reserved' ? 'toast.reservation.reserved' : 'toast.reservation.waitlist' }),
      );
    } catch {
      toast.error(intl.formatMessage({ id: 'reservations.error.reserve' }));
    }
  }

  async function cancel(reservation: Reservation) {
    try {
      await dispatch(cancelReservationThunk(reservation)).unwrap();
      await dispatch(fetchAllReservationsThunk()).unwrap();

      if (user) {
        await dispatch(fetchMyReservationsThunk(user.id)).unwrap();
      }

      toast.info(intl.formatMessage({ id: 'toast.reservation.cancelled' }));
    } catch {
      toast.error(intl.formatMessage({ id: 'reservations.error.cancel' }));
    }
  }

  return {
    classItems,
    error: classesError ?? reservationsError,
    isLoading: classesStatus === 'loading' || reservationsStatus === 'loading',
    reserve,
    cancel,
  };
}
