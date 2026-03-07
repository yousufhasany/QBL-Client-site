'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getSocket } from '@/lib/socket';

export default function LiveSessionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');

  // Answer panel state
  const [showAnswers, setShowAnswers] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [answerQuestionIndex, setAnswerQuestionIndex] = useState(0);
  const [answerIndex, setAnswerIndex] = useState(-1);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/sessions/${id}`);
        setSession(res.data.session);
        setQuestions(res.data.questions);

        if (res.data.session.status === 'draft') {
          await api.put(`/api/sessions/${id}/status`, { status: 'active' });
        }

        const socket = getSocket();
        socket.emit('join-session', res.data.session.sessionCode);
      } catch (err) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load session');
        }
      }
    };
    load();

    return () => {
      const socket = getSocket();
      socket.off('answer-received');
    };
  }, [id, router]);

  const handleNextQuestion = () => {
    if (currentIndex >= questions.length) return;
    const socket = getSocket();
    socket.emit('next-question', {
      sessionCode: session.sessionCode,
      question: questions[currentIndex],
    });
    setCurrentIndex((prev) => prev + 1);
  };

  const handleEndSession = () => {
    const socket = getSocket();
    socket.emit('end-session', {
      sessionCode: session.sessionCode,
      sessionId: id,
    });
    router.push(`/session/${id}/results`);
  };

  const handleViewAnswers = async () => {
    try {
      const res = await api.get(`/api/questions/session/${id}/answers`);
      setAnswers(res.data);
      setAnswerQuestionIndex(0);
      setAnswerIndex(-1);
      setShowAnswers(true);
    } catch (err) {
      setError('Failed to load answers');
    }
  };

  const handleCloseAnswers = () => {
    setShowAnswers(false);
  };

  // Group answers by question order
  const grouped = questions.map((q) => {
    const questionAnswers = answers.filter((ans) => {
      const ansQId = ans.questionId?._id || ans.questionId;
      return ansQId === q._id;
    });
    return {
      _id: q._id,
      questionText: q.questionText,
      answers: questionAnswers.map((a) => a.answerText),
    };
  });

  const currentGrouped = grouped[answerQuestionIndex];
  const currentGroupedAnswers = currentGrouped?.answers || [];
  const isLastAnswerQuestion = answerQuestionIndex >= grouped.length - 1;
  const isLastAnswer = answerIndex >= currentGroupedAnswers.length - 1;
  const isAnswersFinished = isLastAnswerQuestion && isLastAnswer;
  const isAnswerAtStart = answerQuestionIndex === 0 && answerIndex === -1;

  const handleNextAnswer = () => {
    if (answerIndex < currentGroupedAnswers.length - 1) {
      setAnswerIndex((prev) => prev + 1);
    } else if (!isLastAnswerQuestion) {
      setAnswerQuestionIndex((prev) => prev + 1);
      setAnswerIndex(-1);
    }
  };

  const handlePrevAnswer = () => {
    if (answerIndex > -1) {
      setAnswerIndex((prev) => prev - 1);
    } else if (answerQuestionIndex > 0) {
      const prevQ = grouped[answerQuestionIndex - 1];
      setAnswerQuestionIndex((prev) => prev - 1);
      setAnswerIndex(prevQ.answers.length - 1);
    }
  };

  if (error) return <p className="text-center py-20 text-red-600">{error}</p>;
  if (!session) return <p className="text-center py-20">Loading...</p>;

  const currentQuestion = questions[currentIndex - 1];
  const isFinished = currentIndex >= questions.length;

  // Answer panel view
  if (showAnswers) {
    const totalAnswers = answers.length;

    if (grouped.length === 0) {
      return (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">&#x1F4ED;</div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">No Questions Yet</h1>
          <button
            onClick={handleCloseAnswers}
            className="gradient-bg text-white px-6 py-3 rounded-full hover:opacity-90 transition font-semibold btn-press"
          >
            Back to Live
          </button>
        </div>
      );
    }

    return (
      <div className="text-center py-10">
        <div className="inline-block mb-4">
          <span className="gradient-bg-warm text-white text-sm font-semibold px-4 py-2 rounded-full">
            Viewing Answers
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">{session.title}</h1>
        <p className="text-gray-500 mb-8">{totalAnswers} total response(s)</p>

        <div className="glass-card rounded-3xl p-8 max-w-lg mx-auto mb-8 shadow-xl">
          <p className="text-sm text-purple-500 font-medium mb-2">
            Question {answerQuestionIndex + 1} of {grouped.length}
          </p>
          <p className="text-xl font-semibold mb-4 text-gray-800">
            {currentGrouped.questionText}
          </p>

          {currentGroupedAnswers.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No answers received for this question.</p>
          ) : answerIndex === -1 ? (
            <div className="bg-purple-50 text-purple-600 p-4 rounded-xl text-sm font-medium">
              {currentGroupedAnswers.length} response(s) &mdash; press Next to reveal
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-400 mb-2">
                Response {answerIndex + 1} of {currentGroupedAnswers.length}
              </p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl text-lg text-gray-800 border border-purple-100">
                {currentGroupedAnswers[answerIndex]}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={handlePrevAnswer}
            disabled={isAnswerAtStart}
            className={`px-6 py-3 rounded-full transition font-semibold btn-press ${
              isAnswerAtStart
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-800'
            }`}
          >
            &larr; Previous
          </button>

          {!isAnswersFinished && (
            <button
              onClick={handleNextAnswer}
              className="gradient-bg text-white px-6 py-3 rounded-full hover:opacity-90 transition font-semibold btn-press shadow-lg shadow-purple-300/30"
            >
              Next &rarr;
            </button>
          )}

          <button
            onClick={handleCloseAnswers}
            className="gradient-bg-forest text-white px-6 py-3 rounded-full hover:opacity-90 transition font-semibold btn-press shadow-md"
          >
            Back to Live
          </button>
        </div>
      </div>
    );
  }

  // Live session view
  return (
    <div className="text-center py-10">
      <div className="inline-block mb-4">
        <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full animate-pulse-glow">
          &#x1F534; LIVE
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{session.title}</h1>
      <p className="text-gray-500 mb-8">
        Session Code: <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-purple-600 font-bold">{session.sessionCode}</span>
      </p>

      {currentQuestion ? (
        <div className="glass-card rounded-3xl p-10 max-w-lg mx-auto mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 gradient-bg-ocean"></div>
          <p className="text-sm text-blue-500 font-medium mb-3 mt-1">
            Question {currentIndex} of {questions.length}
          </p>
          <p className="text-2xl font-semibold text-gray-800">{currentQuestion.questionText}</p>
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-10 max-w-lg mx-auto mb-8">
          <div className="text-5xl mb-4">&#x1F680;</div>
          <p className="text-gray-500 text-lg">
            Press &quot;Start&quot; to begin the session.
          </p>
        </div>
      )}

      <div className="flex gap-3 justify-center flex-wrap">
        {!isFinished ? (
          <button
            onClick={handleNextQuestion}
            className="gradient-bg text-white px-8 py-3 rounded-full hover:opacity-90 transition font-semibold text-lg btn-press shadow-lg shadow-purple-300/30"
          >
            {currentIndex === 0 ? '&#x25B6; Start' : 'Next Question &rarr;'}
          </button>
        ) : (
          <button
            onClick={handleEndSession}
            className="bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 transition font-semibold text-lg btn-press shadow-lg shadow-red-300/30"
          >
            End Session
          </button>
        )}
        <button
          onClick={handleViewAnswers}
          className="bg-white border-2 border-purple-400 text-purple-600 px-6 py-3 rounded-full hover:bg-purple-50 transition font-semibold btn-press"
        >
          View Answers
        </button>
      </div>
    </div>
  );
}
