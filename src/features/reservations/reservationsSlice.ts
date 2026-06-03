import { createSlice } from '@reduxjs/toolkit';
import type { Reservation } from '../../models/reservation.model';
import { cancelReservationThunk, fetchAllReservationsThunk, fetchMyReservationsThunk, reserveClassThunk } from './reservationsThunks';

type ReservationsState = {
  all: Reservation[];
  items: Reservation[];
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: ReservationsState = {
  all: [],
  items: [],
  error: null,
  status: 'idle',
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyReservationsThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyReservationsThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchMyReservationsThunk.rejected, (state, action) => {
        state.error = String(action.payload ?? 'reservations.error.load');
        state.status = 'failed';
      })
      .addCase(fetchAllReservationsThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllReservationsThunk.fulfilled, (state, action) => {
        state.all = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAllReservationsThunk.rejected, (state, action) => {
        state.error = String(action.payload ?? 'reservations.error.load');
        state.status = 'failed';
      })
      .addCase(reserveClassThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.classId !== action.payload.classId);
        state.items.push(action.payload);
        state.all = state.all.filter((item) => item.id !== action.payload.id);
        state.all.push(action.payload);
      })
      .addCase(cancelReservationThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.all = state.all.filter((item) => item.id !== action.payload);
      });
  },
});

export default reservationsSlice.reducer;
