import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppUser } from '../../models/user.model';
import { loginThunk, logoutThunk, registerThunk } from './authThunks';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  user: AppUser | null;
  status: AuthStatus;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    setAuthUser(state, action: PayloadAction<AppUser | null>) {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
      state.error = null;
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'unauthenticated';
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.error = String(action.payload ?? 'auth.error.login');
        state.status = 'unauthenticated';
      })
      .addCase(registerThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.error = String(action.payload ?? 'auth.error.register');
        state.status = 'unauthenticated';
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.error = String(action.payload ?? 'auth.error.logout');
      });
  },
});

export const { clearAuthError, setAuthError, setAuthLoading, setAuthUser } = authSlice.actions;
export default authSlice.reducer;
