import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ClassSessionFormData } from '../../models/class-session.model';
import { createClassSession, deleteClassSession, getClasses, updateClassSession } from '../../services/class.service';
import { logger } from '../../services/logger.service';
import { getReservationsByClass } from '../../services/reservation.service';

export const fetchClassesThunk = createAsyncThunk('classes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await getClasses();
  } catch (error) {
    logger.error('Fetch classes failed', error);
    return rejectWithValue('classes.error.load');
  }
});

export const createClassThunk = createAsyncThunk('classes/create', async (data: ClassSessionFormData, { rejectWithValue }) => {
  try {
    return await createClassSession(data);
  } catch (error) {
    logger.error('Create class failed', error);
    return rejectWithValue('classes.error.save');
  }
});

export const updateClassThunk = createAsyncThunk(
  'classes/update',
  async ({ classId, data }: { classId: string; data: ClassSessionFormData }, { rejectWithValue }) => {
    try {
      await updateClassSession(classId, data);
      return { id: classId, createdAt: new Date().toISOString(), ...data };
    } catch (error) {
      logger.error('Update class failed', error);
      return rejectWithValue('classes.error.save');
    }
  },
);

export const deleteClassThunk = createAsyncThunk('classes/delete', async (classId: string, { rejectWithValue }) => {
  try {
    const reservations = await getReservationsByClass(classId);

    if (reservations.length > 0) {
      return rejectWithValue('classes.error.deleteHasReservations');
    }

    await deleteClassSession(classId);
    return classId;
  } catch (error) {
    logger.error('Delete class failed', error);
    return rejectWithValue('classes.error.delete');
  }
});
