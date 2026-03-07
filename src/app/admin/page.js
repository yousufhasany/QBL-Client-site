'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      // Admin can view all sessions — for now reuses teacher endpoint
      api.get('/api/sessions').then((res) => setSessions(res.data));
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== 'admin') {
    return <p>Admin access only.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-blue-600">{sessions.length}</p>
          <p className="text-sm text-gray-500">Total Sessions</p>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Recent Sessions</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Code</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-3">{s.title}</td>
                <td className="p-3 font-mono">{s.sessionCode}</td>
                <td className="p-3">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
