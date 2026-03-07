'use client';

export default function QuestionCard({ question, index, onEdit, onDelete }) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-start justify-between card-hover">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <p className="mt-1 text-gray-700">{question.questionText}</p>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex gap-2 flex-shrink-0 ml-3">
          {onEdit && (
            <button
              onClick={() => onEdit(question)}
              className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition font-medium"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(question._id)}
              className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-full hover:bg-red-100 transition font-medium"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
