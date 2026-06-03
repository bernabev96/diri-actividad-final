import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import classesReducer from '../features/classes/classesSlice';
import reservationsReducer from '../features/reservations/reservationsSlice';
import uiReducer from '../features/ui/uiSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  classes: classesReducer,
  reservations: reservationsReducer,
  ui: uiReducer,
});

export default rootReducer;
