import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ClassSession } from '../../models/class-session.model';
import { createClassThunk, deleteClassThunk, fetchClassesThunk, updateClassThunk } from './classesThunks';

type ClassesState = {
  items: ClassSession[];
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: ClassesState = {
  items: [],
  error: null,
  status: 'idle',
};

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    setClasses(state, action: PayloadAction<ClassSession[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassesThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassesThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchClassesThunk.rejected, (state, action) => {
        state.error = String(action.payload ?? 'classes.error.load');
        state.status = 'failed';
      })
      .addCase(createClassThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateClassThunk.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
      })
      .addCase(deleteClassThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteClassThunk.rejected, (state, action) => {
        state.error = String(action.payload ?? 'classes.error.delete');
        state.status = 'failed';
      });
  },
});

export const { setClasses } = classesSlice.actions;
export default classesSlice.reducer;
