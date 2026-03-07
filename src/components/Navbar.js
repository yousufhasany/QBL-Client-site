'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="gradient-bg shadow-lg px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
        <span className="bg-white text-purple-600 rounded-lg px-2 py-1 text-lg">Q</span>
        <span>QBL</span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-purple-100 hidden sm:inline">
              {user.name} ({user.role})
            </span>
            <Link
              href="/dashboard"
              className="text-sm bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition btn-press"
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="text-sm bg-red-500/80 text-white px-4 py-2 rounded-full hover:bg-red-500 transition btn-press"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="text-sm bg-white text-purple-600 px-5 py-2 rounded-full hover:bg-purple-50 transition font-semibold btn-press"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
