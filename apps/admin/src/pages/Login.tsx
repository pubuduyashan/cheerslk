import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      // Fallback demo login when Supabase is not configured
      if (email === 'admin@cheerslk.com' && password === 'admin123') {
        toast.success('Welcome back! (demo mode)');
        navigate('/');
      } else {
        toast.error(error);
      }
    } else {
      toast.success('Welcome back!');
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-brand-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">C</span>
          </div>
          <h1 className="text-3xl font-bold text-white">CheersLK</h1>
          <p className="mt-2 text-gray-400">Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-dark-800 border border-dark-700 p-8"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Sign in to your account</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cheerslk.com"
                required
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-2.5 text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-2.5 text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-dark-800 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="mt-4 text-xs text-center text-gray-500">
            Demo: admin@cheerslk.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
