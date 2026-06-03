import { useEffect } from 'react';
import { setAuthError, setAuthLoading, setAuthUser } from '../features/auth/authSlice';
import { subscribeToFirebaseAuth } from '../services/auth.service';
import { logger } from '../services/logger.service';
import { getUserProfile } from '../services/user.service';
import { useAppDispatch } from '../store/hooks';

export function useAuthSessionViewModel() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthLoading());

    const unsubscribe = subscribeToFirebaseAuth(async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          dispatch(setAuthUser(null));
          return;
        }

        const profile = await getUserProfile(firebaseUser.uid);
        dispatch(setAuthUser(profile));
      } catch (error) {
        logger.error('Auth session listener failed', error);
        dispatch(setAuthError('auth.error.session'));
      }
    });

    return unsubscribe;
  }, [dispatch]);
}
