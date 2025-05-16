import React, { useState, useEffect } from 'react';
import QuestionList from './components/QuestionList';

export default function AllQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/questions');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-slate-800 mb-6">All Questions</h1>
      {loading ? (
        <p className="text-slate-600 text-lg">Loading...</p>
      ) : (
        <div className="grid gap-6">
          {questions.map((question) => (
            <QuestionList key={question._id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}
