import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { selectAuthError, selectAuthStatus, selectAuthUser } from '../features/auth/authSelectors';
import { loginThunk, logoutThunk, registerThunk } from '../features/auth/authThunks';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { LoginFormValues, RegisterFormValues } from '../utils/validators';

export function useAuthViewModel() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectAuthUser);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  async function login(values: LoginFormValues) {
    const result = await dispatch(loginThunk(values));

    if (loginThunk.fulfilled.match(result)) {
      navigate(ROUTES.classes);
    }
  }

  async function register(values: RegisterFormValues) {
    const result = await dispatch(registerThunk(values));

    if (registerThunk.fulfilled.match(result)) {
      navigate(ROUTES.classes);
    }
  }

  async function logout() {
    await dispatch(logoutThunk());
    navigate(ROUTES.home);
  }

  return {
    error,
    isAuthenticated: Boolean(user),
    isLoading: status === 'loading',
    login,
    logout,
    register,
    user,
  };
}
