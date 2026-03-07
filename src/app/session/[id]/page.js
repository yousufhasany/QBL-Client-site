'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import QuestionCard from '@/components/QuestionCard';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import Link from 'next/link';

export default function SessionDetailPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    const res = await api.get(`/api/sessions/${id}`);
    setSession(res.data.session);
    setQuestions(res.data.questions);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    await api.post('/api/questions', {
      sessionId: id,
      questionText: newQuestion,
      questionOrder: questions.length + 1,
    });
    setNewQuestion('');
    fetchSession();
  };

  const handleDelete = async (questionId) => {
    await api.delete(`/api/questions/${questionId}`);
    fetchSession();
  };

  const handleRestart = async () => {
    await api.put(`/api/sessions/${id}/restart`);
    fetchSession();
  };

  if (!session) return <p className="text-center py-20">Loading...</p>;

  const joinUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/join/${session.sessionCode}`;
  const isCompleted = session.status === 'completed';

  const statusConfig = {
    draft: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Draft' },
    active: { bg: 'bg-green-50 text-green-700 border-green-200', label: 'Active' },
    completed: { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Completed' },
  };
  const config = statusConfig[session.status] || statusConfig.draft;

  return (
    <div>
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 gradient-bg"></div>
        <div className="flex items-center justify-between mt-1">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{session.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-mono">
                {session.sessionCode}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full border font-medium ${config.bg}`}>
                {config.label}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {isCompleted && (
              <>
                <Link
                  href={`/session/${id}/results`}
                  className="bg-white border-2 border-purple-400 text-purple-600 px-5 py-2 rounded-full hover:bg-purple-50 transition font-semibold text-sm btn-press"
                >
                  View Results
                </Link>
                <button
                  onClick={handleRestart}
                  className="gradient-bg-forest text-white px-5 py-2 rounded-full hover:opacity-90 transition font-semibold text-sm btn-press shadow-md"
                >
                  Restart Session
                </button>
              </>
            )}
            {!isCompleted && (
              <Link
                href={`/session/${id}/live`}
                className="gradient-bg-forest text-white px-6 py-2 rounded-full hover:opacity-90 transition font-semibold text-sm btn-press shadow-lg shadow-green-300/30 flex items-center gap-2"
              >
                &#x25B6; Go Live
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Questions */}
        <div>
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            &#x2753; Questions
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
              {questions.length}
            </span>
          </h2>
          <div className="space-y-3 mb-4">
            {questions.map((q, i) => (
              <QuestionCard
                key={q._id}
                question={q}
                index={i}
                onDelete={handleDelete}
              />
            ))}
            {questions.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-6">No questions yet. Add one below!</p>
            )}
          </div>
          <form onSubmit={handleAddQuestion} className="flex gap-2">
            <input
              type="text"
              placeholder="Type a new question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="flex-1 border border-gray-200 p-3 rounded-xl bg-gray-50/50"
            />
            <button
              type="submit"
              className="gradient-bg text-white px-5 py-3 rounded-xl hover:opacity-90 transition font-semibold btn-press shadow-md"
            >
              Add
            </button>
          </form>
        </div>

        {/* QR Code */}
        <div>
          <h2 className="font-bold text-lg text-gray-800 mb-4">&#x1F4F1; Student Join</h2>
          <QRCodeDisplay url={joinUrl} />
        </div>
      </div>
    </div>
  );
}
