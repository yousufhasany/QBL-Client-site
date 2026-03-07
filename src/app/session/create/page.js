'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function CreateSessionPage() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/sessions', { title });
      router.push(`/session/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-3xl shadow-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 gradient-bg-ocean"></div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-bg-ocean text-white text-2xl mb-4 shadow-lg shadow-blue-300/40">
              &#x1F4CB;
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Create New Session</h1>
            <p className="text-sm text-gray-500 mt-1">Start a new interactive session for your class</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Session Title</label>
              <input
                type="text"
                placeholder="e.g. Math Quiz - Chapter 5"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50/50"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full gradient-bg-ocean text-white p-3 rounded-xl hover:opacity-90 transition font-semibold shadow-lg shadow-blue-300/30 btn-press"
            >
              Create Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
