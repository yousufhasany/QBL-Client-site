'use client';

import Link from 'next/link';
import api from '@/lib/api';

export default function SessionCard({ session, onDelete }) {
  const statusConfig = {
    draft: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      gradient: 'from-amber-400 to-orange-400',
      label: 'Draft',
    },
    active: {
      bg: 'bg-green-50 text-green-700 border-green-200',
      gradient: 'from-green-400 to-emerald-400',
      label: 'Active',
    },
    completed: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      gradient: 'from-blue-400 to-indigo-400',
      label: 'Completed',
    },
  };

  const config = statusConfig[session.status] || statusConfig.draft;

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this session? This cannot be undone.');
    if (!confirmed) return;

    try {
      await api.delete(`/api/sessions/${session._id}`);
      onDelete?.(session._id);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete session';
      alert(message);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 card-hover relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`}></div>

      <div className="flex items-start justify-between mb-3 mt-1">
        <h3 className="font-bold text-gray-800 text-lg">{session.title}</h3>
        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${config.bg}`}>
          {config.label}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-mono">
          {session.sessionCode}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/session/${session._id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-700 transition"
        >
          Manage Session;
        </Link>
        <button
          onClick={handleDelete}
          className="text-sm text-red-600 hover:text-red-700 font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
