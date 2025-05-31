import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Your existing QuestionList component with new design
export default function QuestionList({ question }) {
   const navigate = useNavigate(); // You'll need to import this

  return (
    <div
      onClick={() => navigate(`/all-questions/${question._id}`)}
       className="flex items-start gap-4 p-6 rounded-xl cursor-pointer transition-all duration-200 group bg-white shadow-md hover:shadow-lg"
 >
      <div className="w-16 h-16 bg-gray-100 rounded-[20%] flex items-center justify-center flex-shrink-0 mt-1">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg text-left font-semibold font-lexend text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {question.question}
        </h3>
        <p className="text-sm text-left font-lexend text-gray-600 leading-relaxed mb-3">
          {question.description}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="text-sm font-medium text-gray-600">{question.senderID}</span>
      </div>
    </div>
  );
}