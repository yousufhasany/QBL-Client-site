'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import SessionCard from '@/components/SessionCard';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/api/sessions').then((res) => setSessions(res.data));
    }
  }, [user]);

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!user) return <p className="text-center py-20">Please log in to access the dashboard.</p>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Sessions</h1>
          <p className="text-gray-500 mt-1">{sessions.length} session(s) total</p>
        </div>
        <Link
          href="/session/create"
          className="gradient-bg text-white px-6 py-3 rounded-full hover:opacity-90 transition font-semibold shadow-lg shadow-purple-300/30 btn-press flex items-center gap-2"
        >
          <span className="text-lg">+</span> Create Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">&#x1F4DA;</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No sessions yet</h3>
          <p className="text-gray-500 mb-6">Create your first session to get started!</p>
          <Link
            href="/session/create"
            className="gradient-bg text-white px-6 py-3 rounded-full hover:opacity-90 transition font-semibold inline-block btn-press"
          >
            Create Your First Session
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {sessions.map((s) => (
            <SessionCard key={s._id} session={s} />
          ))}
        </div>
      )}
    </div>
  );
}
