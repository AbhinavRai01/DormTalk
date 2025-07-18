// components/QuestionItem.jsx
import React from 'react';
import { MessageSquare, Heart, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuestionItem({ question, onClick }) {
    const navigate = useNavigate();
  return (
    <div
      className="text-left p-4 mb-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition"
    >
      {/* meta line */}
      <div className="text-sm text-gray-500 mb-1">
        {question.cluster ? question.cluster.name : 'No tags'} • Posted by {question.senderID}
      </div>
    <div onClick={() =>{navigate(`/all-questions/${question._id}`)}}>
      {/* title */}
      <h2 className="text-lg font-semibold mb-2">{question.question}</h2>

      {/* short description / first few chars */}
      <p className="text-gray-700 mb-3 line-clamp-2">
        {question.description}
      </p>

      {/* action row */}
      <div className="flex gap-6 text-sm text-gray-600 items-center">
        <span className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          Comments
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          Likes
        </span>
        <span className="flex items-center gap-1">
          <Bookmark className="w-4 h-4" />
          Save
        </span>
      </div>
      </div>
    </div>
  );
}
