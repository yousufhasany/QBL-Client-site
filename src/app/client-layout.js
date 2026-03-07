'use client';

import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </AuthProvider>
  );
}
