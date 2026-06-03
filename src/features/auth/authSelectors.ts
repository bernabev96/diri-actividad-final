import type { RootState } from '../../store/store';

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.user);
export const selectIsAdmin = (state: RootState) => state.auth.user?.role === 'admin';
