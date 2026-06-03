import type { ClassSession } from '../models/class-session.model';
import type { Reservation } from '../models/reservation.model';

export function getReservedCount(classId: string, reservations: Reservation[]): number {
  return reservations.filter((reservation) => reservation.classId === classId && reservation.status === 'reserved').length;
}

export function getWaitlistCount(classId: string, reservations: Reservation[]): number {
  return reservations.filter((reservation) => reservation.classId === classId && reservation.status === 'waitlist').length;
}

export function findUserReservation(classId: string, userId: string, reservations: Reservation[]): Reservation | undefined {
  return reservations.find((reservation) => reservation.classId === classId && reservation.userId === userId);
}

export function hasAvailableSpots(classSession: ClassSession, reservations: Reservation[]): boolean {
  return getReservedCount(classSession.id, reservations) < classSession.capacity;
}

export function getReservationStatusForCapacity(capacity: number, reservations: Reservation[]): Reservation['status'] {
  return reservations.filter((reservation) => reservation.status === 'reserved').length < capacity ? 'reserved' : 'waitlist';
}

export function promoteFirstWaitlistReservation(reservations: Reservation[]): Reservation[] {
  const waitlist = reservations
    .filter((reservation) => reservation.status === 'waitlist')
    .sort((first, second) => (first.position ?? 0) - (second.position ?? 0));
  const promotedReservation = waitlist[0];

  if (!promotedReservation) {
    return reservations;
  }

  return reservations.map((reservation) =>
    reservation.id === promotedReservation.id ? { ...reservation, status: 'reserved', position: null } : reservation,
  );
}
