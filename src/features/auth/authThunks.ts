import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginWithEmail, logoutFromFirebase, registerWithEmail, type LoginInput, type RegisterInput } from '../../services/auth.service';
import { logger } from '../../services/logger.service';
import { createUserProfile, getUserProfile } from '../../services/user.service';

export const loginThunk = createAsyncThunk('auth/login', async (input: LoginInput, { rejectWithValue }) => {
  try {
    const firebaseUser = await loginWithEmail(input);
    const profile = await getUserProfile(firebaseUser.uid);

    if (!profile) {
      return rejectWithValue('auth.error.profileNotFound');
    }

    logger.info('User logged in', { userId: firebaseUser.uid });
    return profile;
  } catch (error) {
    logger.error('Login failed', error);
    return rejectWithValue('auth.error.login');
  }
});

export const registerThunk = createAsyncThunk('auth/register', async (input: RegisterInput, { rejectWithValue }) => {
  try {
    const firebaseUser = await registerWithEmail(input);
    const profile = await createUserProfile({
      id: firebaseUser.uid,
      name: input.name,
      email: input.email,
    });

    logger.info('User registered', { userId: firebaseUser.uid });
    return profile;
  } catch (error) {
    logger.error('Register failed', error);
    return rejectWithValue('auth.error.register');
  }
});

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutFromFirebase();
    logger.info('User logged out');
  } catch (error) {
    logger.error('Logout failed', error);
    return rejectWithValue('auth.error.logout');
  }
});
