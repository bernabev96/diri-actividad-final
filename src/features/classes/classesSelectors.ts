import type { RootState } from '../../store/store';

export const selectClasses = (state: RootState) => state.classes.items;
export const selectClassesStatus = (state: RootState) => state.classes.status;
export const selectClassesError = (state: RootState) => state.classes.error;
