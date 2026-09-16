import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/admin';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Loader2, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@skylite.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      login(res.token, res.admin);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-darker flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mx-auto mb-3 border border-brand-gold/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-heading font-bold tracking-tight text-white">
          SkyLite <span className="text-brand-gold">Admin</span>
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Private Theatre Operations & Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-brand-dark py-8 px-6 shadow-2xl rounded-2xl border border-gray-800 space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-xs text-red-400 text-center font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Admin Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 bg-brand-darker border border-gray-800 rounded-lg py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                  placeholder="admin@skylite.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 bg-brand-darker border border-gray-800 rounded-lg py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-sm font-heading font-bold text-brand-dark bg-brand-gold hover:bg-yellow-400 focus:outline-none disabled:opacity-70 transition-colors shadow-lg shadow-brand-gold/10 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In to Dashboard'}
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-gray-800/80 text-center">
            <span className="text-[11px] text-gray-500">
              Demo Admin Credentials: <strong className="text-gray-400">admin@skylite.com</strong> / <strong className="text-gray-400">Admin@123</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;