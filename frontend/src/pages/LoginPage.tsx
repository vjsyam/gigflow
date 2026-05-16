import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthStore } from '../context/authStore';
import { LoginForm } from '../types';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  const validate = () => {
    const errs: Partial<LoginForm> = {};
    if (!form.email) errs.email = 'Required';
    if (!form.password) errs.password = 'Required';
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authApi.login(form);
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      void navigate('/');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 mb-3">
            <span className="text-4xl font-black tracking-tight text-sky-400">Gig</span>
            <span className="text-4xl font-black tracking-tight">Flow</span>
          </div>
          <p className="text-[var(--text-muted)] text-sm">Smart Leads Dashboard</p>
        </div>

        <div className="card p-8">
          <h1 className="text-xl font-bold mb-6">Sign In</h1>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className={`input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="admin@gigflow.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className={`input ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            No account?{' '}
            <Link to="/register" className="text-sky-400 hover:underline font-medium">
              Create one
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)]">
            <p className="text-xs font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Demo Accounts</p>
            <div className="space-y-1 text-xs font-mono text-[var(--text-muted)]">
              <p>Admin: admin@gigflow.com / Admin@123</p>
              <p>Sales: sales@gigflow.com / Sales@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
