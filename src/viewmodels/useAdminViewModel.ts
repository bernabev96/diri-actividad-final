import { useEffect, useState } from 'react';
import { selectClasses, selectClassesError, selectClassesStatus } from '../features/classes/classesSelectors';
import { createClassThunk, deleteClassThunk, fetchClassesThunk, updateClassThunk } from '../features/classes/classesThunks';
import { selectAllReservations } from '../features/reservations/reservationsSelectors';
import { fetchAllReservationsThunk } from '../features/reservations/reservationsThunks';
import type { ClassSession } from '../models/class-session.model';
import type { AppUser } from '../models/user.model';
import { logger } from '../services/logger.service';
import { getAllUsers, searchUsers as searchUsersByTerm } from '../services/user.service';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { ClassSessionFormValues, UserSearchFormValues } from '../utils/validators';

export function useAdminViewModel() {
  const dispatch = useAppDispatch();
  const classes = useAppSelector(selectClasses);
  const classesStatus = useAppSelector(selectClassesStatus);
  const classesError = useAppSelector(selectClassesError);
  const reservations = useAppSelector(selectAllReservations);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [reservationUsers, setReservationUsers] = useState<AppUser[]>([]);
  const [userSearchError, setUserSearchError] = useState<string | null>(null);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  useEffect(() => {
    dispatch(fetchClassesThunk());
    dispatch(fetchAllReservationsThunk());
  }, [dispatch]);

  useEffect(() => {
    async function loadReservationUsers() {
      try {
        const result = await getAllUsers();
        setReservationUsers(result);
      } catch (error) {
        logger.error('Reservation users load failed', error);
      }
    }

    void loadReservationUsers();
  }, []);

  async function saveClass(values: ClassSessionFormValues, selectedClass?: ClassSession) {
    if (selectedClass) {
      await dispatch(updateClassThunk({ classId: selectedClass.id, data: values }));
      return;
    }

    await dispatch(createClassThunk(values));
  }

  async function removeClass(classId: string) {
    await dispatch(deleteClassThunk(classId));
  }

  async function searchUsers(values: UserSearchFormValues) {
    setIsSearchingUsers(true);
    setUserSearchError(null);

    try {
      const result = await searchUsersByTerm(values.email);
      setUsers(result);
    } catch (error) {
      logger.error('User search failed', error);
      setUserSearchError('admin.users.error');
    } finally {
      setIsSearchingUsers(false);
    }
  }

  return {
    classes,
    classesError,
    isClassesLoading: classesStatus === 'loading',
    isSearchingUsers,
    removeClass,
    reservations,
    reservationUsers,
    saveClass,
    searchUsers,
    userSearchError,
    users,
  };
}
