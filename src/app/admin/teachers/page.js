'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function ManageTeachersPage() {
  const { user, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== 'admin') {
    return <p>Admin access only.</p>;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/api/auth/register', {
        name,
        email,
        password,
        role: 'teacher',
      });
      setMessage('Teacher registered successfully.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to register teacher');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Teachers</h1>

      <h2 className="font-semibold mb-3">Register New Teacher</h2>
      {message && (
        <p className="bg-blue-50 text-blue-700 p-3 rounded mb-4 text-sm">
          {message}
        </p>
      )}
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          Register Teacher
        </button>
      </form>
    </div>
  );
}
