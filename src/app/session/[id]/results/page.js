'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function ResultsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerIndex, setAnswerIndex] = useState(-1);

  useEffect(() => {
    const load = async () => {
      try {
        const sessionRes = await api.get(`/api/sessions/${id}`);
        setSession(sessionRes.data.session);
        setQuestions(sessionRes.data.questions);

        const answersRes = await api.get(`/api/questions/session/${id}/answers`);
        setAnswers(answersRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load results');
        }
      }
    };
    load();
  }, [id, router]);

  const handleRestart = async () => {
    try {
      await api.put(`/api/sessions/${id}/restart`);
      router.push(`/session/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to restart session');
    }
  };

  if (error) return <p className="text-center py-20 text-red-600">{error}</p>;
  if (!session) return <p className="text-center py-20">Loading results...</p>;

  const grouped = questions.map((q) => {
    const questionAnswers = answers.filter((ans) => {
      const ansQId = ans.questionId?._id || ans.questionId;
      return ansQId === q._id;
    });
    return {
      _id: q._id,
      questionText: q.questionText,
      questionOrder: q.questionOrder,
      answers: questionAnswers.map((a) => a.answerText),
    };
  });

  const totalAnswers = answers.length;
  const currentQuestion = grouped[questionIndex];
  const currentAnswers = currentQuestion?.answers || [];
  const isLastQuestion = questionIndex >= grouped.length - 1;
  const isLastAnswer = answerIndex >= currentAnswers.length - 1;
  const isFinished = isLastQuestion && isLastAnswer;

  const handleNext = () => {
    if (answerIndex < currentAnswers.length - 1) {
      setAnswerIndex((prev) => prev + 1);
    } else if (!isLastQuestion) {
      setQuestionIndex((prev) => prev + 1);
      setAnswerIndex(-1);
    }
  };

  const handlePrev = () => {
    if (answerIndex > -1) {
      setAnswerIndex((prev) => prev - 1);
    } else if (questionIndex > 0) {
      const prevQuestion = grouped[questionIndex - 1];
      setQuestionIndex((prev) => prev - 1);
      setAnswerIndex(prevQuestion.answers.length - 1);
    }
  };

  const isAtStart = questionIndex === 0 && answerIndex === -1;
  const isSessionActive = session.status === 'active';

  if (grouped.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="glass-card rounded-3xl p-10 text-center max-w-sm">
          <div className="text-5xl mb-4">&#x1F4ED;</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Results: {session.title}</h1>
          <p className="text-gray-500 mb-6">No questions in this session.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="gradient-bg-forest text-white px-5 py-2 rounded-full hover:opacity-90 transition font-semibold btn-press"
            >
              Restart Session
            </button>
            <Link
              href="/dashboard"
              className="bg-white border-2 border-gray-300 text-gray-600 px-5 py-2 rounded-full hover:bg-gray-50 transition font-semibold btn-press"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-10">
      <div className="inline-block mb-4">
        <span className="gradient-bg-sunset text-white text-sm font-semibold px-4 py-2 rounded-full">
          Session Results
        </span>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-gray-800">{session.title}</h1>
      <p className="text-gray-500 mb-8">{totalAnswers} total response(s)</p>

      <div className="glass-card rounded-3xl p-8 max-w-lg mx-auto mb-8 shadow-xl">
        <p className="text-sm text-purple-500 font-medium mb-2">
          Question {questionIndex + 1} of {grouped.length}
        </p>
        <p className="text-xl font-semibold mb-4 text-gray-800">{currentQuestion.questionText}</p>

        {currentAnswers.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No answers received for this question.</p>
        ) : answerIndex === -1 ? (
          <div className="bg-purple-50 text-purple-600 p-4 rounded-xl text-sm font-medium">
            {currentAnswers.length} response(s) &mdash; press Next to reveal
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-400 mb-2">
              Response {answerIndex + 1} of {currentAnswers.length}
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl text-lg text-gray-800 border border-purple-100">
              {currentAnswers[answerIndex]}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={handlePrev}
          disabled={isAtStart}
          className={`px-6 py-3 rounded-full transition font-semibold btn-press ${
            isAtStart
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-700 text-white hover:bg-gray-800'
          }`}
        >
          &larr; Previous
        </button>

        {!isFinished ? (
          <button
            onClick={handleNext}
            className="gradient-bg text-white px-6 py-3 rounded-full hover:opacity-90 transition font-semibold btn-press shadow-lg shadow-purple-300/30"
          >
            Next &rarr;
          </button>
        ) : (
          <div className="flex gap-3 flex-wrap justify-center">
            {isSessionActive && (
              <Link
                href={`/session/${id}/live`}
                className="gradient-bg text-white px-6 py-3 rounded-full hover:opacity-90 transition font-semibold btn-press shadow-md"
              >
                Back to Live
              </Link>
            )}
            <button
              onClick={handleRestart}
              className="gradient-bg-forest text-white px-6 py-3 rounded-full hover:opacity-90 transition font-semibold btn-press shadow-md"
            >
              Restart Session
            </button>
            <Link
              href="/dashboard"
              className="bg-white border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-full hover:bg-gray-50 transition font-semibold btn-press"
            >
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
