import type { RootState } from '../../store/store';

export const selectMyReservations = (state: RootState) => state.reservations.items;
export const selectAllReservations = (state: RootState) => state.reservations.all;
export const selectReservationsStatus = (state: RootState) => state.reservations.status;
export const selectReservationsError = (state: RootState) => state.reservations.error;
