import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { Navbar } from '../components/Navbar';

export function ProtectedLayout() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
