export type ReservationStatus = 'reserved' | 'waitlist';

export type Reservation = {
  id: string;
  classId: string;
  userId: string;
  status: ReservationStatus;
  position: number | null;
  createdAt: string;
};
