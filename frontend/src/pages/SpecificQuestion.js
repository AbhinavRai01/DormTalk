import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function SpecificQuestion() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      console.log("Question id:", questionId);
      try {
        const response = await fetch(`http://localhost:5000/api/questions/${questionId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log(data);
        setQuestion(data);
      } catch (error) {
        console.error('Error fetching question:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-800">Loading...</h1>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-red-600">Question not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 bg-white shadow-md rounded-2xl border border-slate-200">
      <div className="mb-4 flex flex-wrap gap-2">
        {question.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-slate-200 text-slate-800 px-2 py-1 rounded-full text-sm font-semibold"
          >
            {tag}
          </span>
        ))}
      </div>
      <h1 className="text-4xl font-bold text-slate-800 mb-4">{question.question}</h1>
      <p className="text-lg text-slate-600 mb-2">Asked by: <span className="font-medium text-slate-700">{question.senderID}</span></p>
      <p className="text-md text-slate-700 leading-relaxed">Description: {question.description}</p>
    </div>
  );
}
