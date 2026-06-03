import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { selectAuthStatus, selectIsAdmin, selectIsAuthenticated } from '../../features/auth/authSelectors';
import { useAppSelector } from '../../store/hooks';
import { Loader } from '../common/Loader';

export function AdminRoute() {
  const location = useLocation();
  const isAdmin = useAppSelector(selectIsAdmin);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);

  if (status === 'idle' || status === 'loading') {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.classes} replace />;
  }

  return <Outlet />;
}
