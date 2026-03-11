'use client';

import Link from 'next/link';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">{children}</main>

        <footer className="bg-gray-900 text-gray-300 mt-auto">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-white text-purple-600 rounded-lg px-2 py-1 text-lg font-bold">Q</span>
                  <span className="text-xl font-bold text-white">QBL</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Question Based Learning — a real-time classroom interaction platform where teachers ask and students answer instantly.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-semibold mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                  <li><Link href="/login" className="hover:text-white transition">Login</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                  <li><Link href="/session/create" className="hover:text-white transition">Create Session</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-white font-semibold mb-3">Contact</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Developed by <span className="text-white">Yousuf Hasan</span></li>
                  <li>hyousuf266@gmail.com, &amp; Independent University, Bangladesh</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} QBL — Question Based Learning. All rights reserved Yousuf Hasan.</p>
              <div className="flex gap-4">
                <Link href="/" className="hover:text-white transition">Privacy Policy</Link>
                <Link href="/" className="hover:text-white transition">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
