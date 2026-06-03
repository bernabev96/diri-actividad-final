import { Outlet } from 'react-router-dom';
import { useAuthSessionViewModel } from '../../viewmodels/useAuthSessionViewModel';
import { useNotificationToastsViewModel } from '../../viewmodels/useNotificationToastsViewModel';
import { Navbar } from './Navbar';

export function AppLayout() {
  useAuthSessionViewModel();
  useNotificationToastsViewModel();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
