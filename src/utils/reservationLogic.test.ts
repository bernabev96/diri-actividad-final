import { describe, expect, it } from 'vitest';
import type { ClassSession } from '../models/class-session.model';
import type { Reservation } from '../models/reservation.model';
import {
  findUserReservation,
  getReservationStatusForCapacity,
  getReservedCount,
  getWaitlistCount,
  hasAvailableSpots,
  promoteFirstWaitlistReservation,
} from './reservationLogic';

const classSession: ClassSession = {
  active: true,
  capacity: 2,
  createdAt: '2026-06-03T10:00:00.000Z',
  date: '2026-06-04',
  id: 'class-1',
  time: '18:00',
  title: 'Cross training',
  trainer: 'Laura',
};

const reservations: Reservation[] = [
  {
    classId: 'class-1',
    createdAt: '2026-06-03T10:00:00.000Z',
    id: 'reservation-1',
    position: null,
    status: 'reserved',
    userId: 'user-1',
  },
  {
    classId: 'class-1',
    createdAt: '2026-06-03T10:01:00.000Z',
    id: 'reservation-2',
    position: 1,
    status: 'waitlist',
    userId: 'user-2',
  },
];

describe('reservationLogic', () => {
  it('counts reserved spots by class', () => {
    expect(getReservedCount('class-1', reservations)).toBe(1);
  });

  it('counts waitlist entries by class', () => {
    expect(getWaitlistCount('class-1', reservations)).toBe(1);
  });

  it('finds the reservation for a user and class', () => {
    expect(findUserReservation('class-1', 'user-2', reservations)?.status).toBe('waitlist');
  });

  it('detects available spots', () => {
    expect(hasAvailableSpots(classSession, reservations)).toBe(true);
  });

  it('returns waitlist status when capacity is full', () => {
    expect(getReservationStatusForCapacity(1, reservations)).toBe('waitlist');
  });

  it('promotes the first waitlist reservation to reserved', () => {
    const updatedReservations = promoteFirstWaitlistReservation(reservations);

    expect(updatedReservations.find((reservation) => reservation.id === 'reservation-2')).toMatchObject({
      position: null,
      status: 'reserved',
    });
  });
});
