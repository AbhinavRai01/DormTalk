import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function SpecificQuestion() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const [answerText, setAnswerText] = useState("");

    const handleAnswerSubmit = (e) => {
      e.preventDefault();
      // TODO: handle the answer submission (e.g., POST request)
      console.log("Answer submitted:", answerText);
      setAnswerText(""); // optional reset
    };

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
      {/* Existing Question Content */}
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
      <p className="text-lg text-slate-600 mb-2">
        Asked by: <span className="font-medium text-slate-700">{question.senderID}</span>
      </p>
      <p className="text-md text-slate-700 leading-relaxed mb-8">
        Description: {question.description}
      </p>

      {/* Answer Form */}
      <form className="mt-10" onSubmit={handleAnswerSubmit}>
        <label htmlFor="answer" className="block text-lg font-medium text-slate-800 mb-2">
          Your Answer
        </label>
        <textarea
          id="answer"
          name="answer"
          rows="6"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          className="w-full p-4 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          placeholder="Write your answer here..."
          required
        ></textarea>
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
        >
          Submit Answer
        </button>
      </form>
    </div>

  );
}
