import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuestionList({ question }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/all-questions/${question._id}`)}
      className="bg-white shadow-md rounded-2xl p-6 border border-slate-200 cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="mb-2 flex flex-wrap gap-2">
        {question.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-slate-200 text-slate-800 px-2 py-1 rounded-full text-sm font-semibold"
          >
            {tag}
          </span>
        ))}
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{question.question}</h2>
      <p className="text-md text-slate-600">Asked by: {question.senderID}</p>
    </div>
  );
}
