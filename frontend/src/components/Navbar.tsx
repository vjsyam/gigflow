import { useAuthStore } from '../context/authStore';
import { useThemeStore } from '../context/themeStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    void navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-sky-400">Gig</span>
          <span className="text-xl font-black tracking-tight">Flow</span>
          <span className="ml-2 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
            {user?.role}
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="btn-ghost p-2 rounded-lg text-lg"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* User */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-hover)]">
            <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
          </div>

          <button onClick={handleLogout} className="btn-ghost px-3 py-1.5 text-sm text-red-400 hover:text-red-300">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
