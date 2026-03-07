'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let user;
      if (isRegister) {
        user = await register(name, email, password);
      } else {
        user = await login(email, password);
      }
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || (isRegister ? 'Registration failed' : 'Login failed'));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-card rounded-3xl shadow-xl p-8 relative overflow-hidden">
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-2 gradient-bg"></div>

          {/* Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-bg text-white text-2xl font-bold shadow-lg shadow-purple-300/40 mb-4">
              {isRegister ? 'QBL' : 'QBL'}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isRegister ? 'Start your QBL journey' : 'Log in to your QBL account'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
              <span>QBL</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50/50"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50/50"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full gradient-bg text-white p-3 rounded-xl hover:opacity-90 transition font-semibold shadow-lg shadow-purple-300/30 btn-press"
            >
              {isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="text-purple-600 font-semibold hover:underline"
              >
                {isRegister ? 'Login' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
