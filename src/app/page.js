'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="text-center py-16 relative">
        {/* Decorative floating shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-40 animate-float"></div>
        <div className="absolute top-20 right-16 w-14 h-14 bg-pink-200 rounded-full opacity-40 animate-float-delay"></div>
        <div className="absolute bottom-10 left-1/4 w-10 h-10 bg-blue-200 rounded-full opacity-40 animate-float"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-yellow-200 rounded-full opacity-30 animate-float-delay"></div>

        <div className="relative z-10">
          <div className="inline-block mb-6">
            <span className="gradient-bg text-white text-sm font-semibold px-4 py-2 rounded-full">
              Real-time Classroom Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
              QBL
            </span>
          </h1>

          <p className="text-gray-500 mb-10 max-w-lg mx-auto text-lg">
            Question Based Learning — where teachers ask and students answer
            instantly. Make your classroom interactive and fun!
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="glass-card rounded-2xl p-6 card-hover">
              <div className="text-4xl mb-3">&#x1F3AF;</div>
              <h3 className="font-bold text-gray-800 mb-1">Live Questions</h3>
              <p className="text-sm text-gray-500">Ask questions in real-time during class</p>
            </div>
            <div className="glass-card rounded-2xl p-6 card-hover">
              <div className="text-4xl mb-3">&#x1F4F1;</div>
              <h3 className="font-bold text-gray-800 mb-1">QR Code Join</h3>
              <p className="text-sm text-gray-500">Students scan and join instantly</p>
            </div>
            <div className="glass-card rounded-2xl p-6 card-hover">
              <div className="text-4xl mb-3">&#x1F512;</div>
              <h3 className="font-bold text-gray-800 mb-1">Anonymous</h3>
              <p className="text-sm text-gray-500">Student answers stay completely private</p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="gradient-bg text-white px-8 py-4 rounded-full hover:opacity-90 transition font-semibold text-lg shadow-lg shadow-purple-300/50 btn-press"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="gradient-bg text-white px-8 py-4 rounded-full hover:opacity-90 transition font-semibold text-lg shadow-lg shadow-purple-300/50 btn-press"
              >
                Teacher Login
              </Link>
            )}
            <Link
              href="/join"
              className="bg-white border-2 border-purple-400 text-purple-600 px-8 py-4 rounded-full hover:bg-purple-50 transition font-semibold text-lg btn-press"
            >
              Join as Student
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-purple-300/40">1</div>
            <h4 className="font-semibold mb-1">Create Session</h4>
            <p className="text-sm text-gray-500">Teacher creates a live session</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full gradient-bg-ocean flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-blue-300/40">2</div>
            <h4 className="font-semibold mb-1">Add Questions</h4>
            <p className="text-sm text-gray-500">Prepare your questions</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full gradient-bg-sunset flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-pink-300/40">3</div>
            <h4 className="font-semibold mb-1">Students Join</h4>
            <p className="text-sm text-gray-500">Scan QR code to join</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full gradient-bg-forest flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-green-300/40">4</div>
            <h4 className="font-semibold mb-1">Get Answers</h4>
            <p className="text-sm text-gray-500">View anonymous responses</p>
          </div>
        </div>
      </div>
    </div>
  );
}
