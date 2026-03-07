'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { getSocket } from '@/lib/socket';

export default function JoinSessionPage() {
  const { code } = useParams();
  const [session, setSession] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    const join = async () => {
      try {
        const res = await api.get(`/api/sessions/join/${code}`);
        setSession(res.data);

        const socket = getSocket();
        socketRef.current = socket;

        const setupSocket = () => {
          socket.emit('join-session', code);

          socket.on('new-question', (q) => {
            setQuestion(q);
            setAnswer('');
            setSubmitted(false);
          });

          socket.on('session-ended', () => {
            setEnded(true);
          });
        };

        if (socket.connected) {
          setupSocket();
        } else {
          socket.on('connect', setupSocket);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not join session');
      }
    };
    join();

    return () => {
      if (socketRef.current) {
        socketRef.current.off('new-question');
        socketRef.current.off('session-ended');
        socketRef.current.off('connect');
      }
    };
  }, [code]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    const socket = socketRef.current || getSocket();
    socket.emit('submit-answer', {
      sessionId: session._id,
      questionId: question._id,
      answerText: answer,
    });
    setSubmitted(true);
  };

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="glass-card rounded-3xl p-10 text-center max-w-sm">
          <div className="text-5xl mb-4">&#x26A0;&#xFE0F;</div>
          <p className="text-red-600 text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (ended) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="glass-card rounded-3xl p-10 text-center max-w-sm shadow-xl">
          <div className="text-6xl mb-4">&#x1F389;</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Session Ended</h1>
          <p className="text-gray-500">Thank you for participating!</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-float">&#x1F50D;</div>
          <p className="text-gray-500 text-lg">Joining session...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="glass-card rounded-3xl p-10 text-center max-w-sm shadow-xl">
          <div className="text-6xl mb-4 animate-float">&#x23F3;</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">{session.title}</h1>
          <p className="text-gray-500">Waiting for the teacher to start questions...</p>
          <div className="mt-6 flex justify-center gap-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 gradient-bg-ocean"></div>

          <p className="text-sm text-blue-500 font-medium mb-2 mt-1 text-center">Current Question</p>
          <h2 className="text-xl font-bold mb-6 text-center text-gray-800">{question.questionText}</h2>

          {submitted ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">&#x2705;</div>
              <p className="text-green-600 font-semibold text-lg">Answer submitted!</p>
              <p className="text-gray-400 text-sm mt-2">Waiting for next question...</p>
              <div className="mt-4 flex justify-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full border border-gray-200 p-4 rounded-xl bg-gray-50/50 min-h-[120px]"
                required
              />
              <button
                type="submit"
                className="w-full gradient-bg text-white p-3 rounded-xl hover:opacity-90 transition font-semibold shadow-lg shadow-purple-300/30 btn-press"
              >
                Submit Answer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
