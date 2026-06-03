import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Reservation } from '../../models/reservation.model';
import { logger } from '../../services/logger.service';
import { cancelReservation, getAllReservations, getReservationsByUser, reserveClass } from '../../services/reservation.service';

export const fetchAllReservationsThunk = createAsyncThunk('reservations/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await getAllReservations();
  } catch (error) {
    logger.error('Fetch all reservations failed', error);
    return rejectWithValue('reservations.error.load');
  }
});

export const fetchMyReservationsThunk = createAsyncThunk('reservations/fetchMine', async (userId: string, { rejectWithValue }) => {
  try {
    return await getReservationsByUser(userId);
  } catch (error) {
    logger.error('Fetch reservations failed', error);
    return rejectWithValue('reservations.error.load');
  }
});

export const reserveClassThunk = createAsyncThunk(
  'reservations/reserveClass',
  async ({ classId, userId, capacity }: { classId: string; userId: string; capacity: number }, { rejectWithValue }) => {
    try {
      const reservation = await reserveClass(classId, userId, capacity);
      logger.info('Reservation request completed', { classId, status: reservation.status, userId });
      return reservation;
    } catch (error) {
      logger.error('Reserve class failed', error);
      return rejectWithValue('reservations.error.reserve');
    }
  },
);

export const cancelReservationThunk = createAsyncThunk('reservations/cancel', async (reservation: Reservation, { rejectWithValue }) => {
  try {
    await cancelReservation(reservation);
    logger.info('Reservation cancellation completed', { reservationId: reservation.id, status: reservation.status });
    return reservation.id;
  } catch (error) {
    logger.error('Cancel reservation failed', error);
    return rejectWithValue('reservations.error.cancel');
  }
});
