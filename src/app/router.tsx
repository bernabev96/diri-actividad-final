import { lazy, Suspense, type ReactNode } from 'react';
import { createHashRouter } from 'react-router-dom';
import { AdminRoute } from '../components/auth/AdminRoute';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AppLayout } from '../components/common/AppLayout';
import { Loader } from '../components/common/Loader';
import { ROUTES } from '../config/routes';

const HomePage = lazy(() => import('../pages/public/HomePage'));
const LoginPage = lazy(() => import('../pages/public/LoginPage'));
const RegisterPage = lazy(() => import('../pages/public/RegisterPage'));
const ClassesPage = lazy(() => import('../pages/private/ClassesPage'));
const ProfilePage = lazy(() => import('../pages/private/ProfilePage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminClassesPage = lazy(() => import('../pages/admin/AdminClassesPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));
const NotFoundPage = lazy(() => import('../pages/errors/NotFoundPage'));
const UnexpectedErrorPage = lazy(() => import('../pages/errors/UnexpectedErrorPage'));

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<Loader />}>{element}</Suspense>;
}

export const router = createHashRouter([
  {
    path: ROUTES.home,
    element: <AppLayout />,
    errorElement: withSuspense(<UnexpectedErrorPage />),
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: ROUTES.login.slice(1), element: withSuspense(<LoginPage />) },
      { path: ROUTES.register.slice(1), element: withSuspense(<RegisterPage />) },
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.classes.slice(1), element: withSuspense(<ClassesPage />) },
          { path: ROUTES.profile.slice(1), element: withSuspense(<ProfilePage />) },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          { path: ROUTES.admin.slice(1), element: withSuspense(<AdminDashboardPage />) },
          { path: ROUTES.adminClasses.slice(1), element: withSuspense(<AdminClassesPage />) },
          { path: ROUTES.adminUsers.slice(1), element: withSuspense(<AdminUsersPage />) },
        ],
      },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
]);
