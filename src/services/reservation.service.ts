import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import type { Reservation, ReservationStatus } from '../models/reservation.model';
import { getClassSessionById } from './class.service';
import { createNotification } from './notification.service';
import { logger } from './logger.service';

function getReservationsCollection() {
  return collection(db, 'reservations');
}

export async function getAllReservations(): Promise<Reservation[]> {
  const snapshot = await getDocs(getReservationsCollection());
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as Reservation)
    .sort((first, second) => first.createdAt.localeCompare(second.createdAt));
}

export async function getReservationsByClass(classId: string): Promise<Reservation[]> {
  const reservationsQuery = query(getReservationsCollection(), where('classId', '==', classId));
  const snapshot = await getDocs(reservationsQuery);
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as Reservation)
    .sort((first, second) => first.createdAt.localeCompare(second.createdAt));
}

export async function getReservationsByUser(userId: string): Promise<Reservation[]> {
  const reservationsQuery = query(getReservationsCollection(), where('userId', '==', userId));
  const snapshot = await getDocs(reservationsQuery);
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as Reservation)
    .sort((first, second) => first.createdAt.localeCompare(second.createdAt));
}

export async function reserveClass(classId: string, userId: string, capacity: number): Promise<Reservation> {
  const currentReservations = await getReservationsByClass(classId);
  const existingReservation = currentReservations.find((reservation) => reservation.userId === userId);

  if (existingReservation) {
    return existingReservation;
  }

  const reservedCount = currentReservations.filter((reservation) => reservation.status === 'reserved').length;
  const waitlistCount = currentReservations.filter((reservation) => reservation.status === 'waitlist').length;
  const status: ReservationStatus = reservedCount < capacity ? 'reserved' : 'waitlist';
  const position = status === 'waitlist' ? waitlistCount + 1 : null;
  const reservationData = {
    classId,
    userId,
    status,
    position,
    createdAt: new Date().toISOString(),
  };
  const document = await addDoc(getReservationsCollection(), reservationData);
  const classSession = await getClassSessionById(classId);

  if (status === 'waitlist') {
    await createNotification(userId, classSession ? `notification.waitlistJoinedWithClass|${classSession.title}` : 'notification.waitlistJoined');
    logger.info('User joined waitlist', { classId, userId, position });
  } else {
    logger.info('User reserved class', { classId, userId });
  }

  return { id: document.id, ...reservationData };
}

export async function cancelReservation(reservation: Reservation): Promise<void> {
  await deleteDoc(doc(getReservationsCollection(), reservation.id));
  const classSession = await getClassSessionById(reservation.classId);

  if (reservation.status === 'waitlist') {
    await createNotification(
      reservation.userId,
      classSession ? `notification.waitlistLeftWithClass|${classSession.title}` : 'notification.waitlistLeft',
    );
    logger.info('User left waitlist', { classId: reservation.classId, userId: reservation.userId });
  } else {
    logger.info('User cancelled reservation', { classId: reservation.classId, userId: reservation.userId });
  }

  if (reservation.status !== 'reserved') {
    await reorderWaitlist(reservation.classId);
    return;
  }

  const waitlist = (await getReservationsByClass(reservation.classId))
    .filter((item) => item.status === 'waitlist')
    .sort((first, second) => (first.position ?? 0) - (second.position ?? 0));

  const nextReservation = waitlist[0];

  if (nextReservation) {
    await updateDoc(doc(getReservationsCollection(), nextReservation.id), {
      status: 'reserved',
      position: null,
    });

    const classSession = await getClassSessionById(reservation.classId);
    const message = classSession ? `notification.promotedWithClass|${classSession.title}` : 'notification.promoted';
    await createNotification(nextReservation.userId, message);
    logger.info('Waitlist user promoted', { classId: reservation.classId, userId: nextReservation.userId });
  }

  await reorderWaitlist(reservation.classId);
}

async function reorderWaitlist(classId: string): Promise<void> {
  const waitlist = (await getReservationsByClass(classId))
    .filter((item) => item.status === 'waitlist')
    .sort((first, second) => (first.createdAt > second.createdAt ? 1 : -1));

  await Promise.all(
    waitlist.map((reservation, index) =>
      updateDoc(doc(getReservationsCollection(), reservation.id), {
        position: index + 1,
      }),
    ),
  );
}
