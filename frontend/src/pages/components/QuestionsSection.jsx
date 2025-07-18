// components/QuestionsTab.jsx
import React, { useEffect, useState } from 'react';
import QuestionItem from './QuestionsItem';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function QuestionsSection() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res   = await fetch('http://localhost:5000/api/questions/search', {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify({ searchTerm: '', tags: [], page: 0 })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setQuestions(data.questions);

        console.log(data);
      } catch (e) {
        console.error('Error fetching questions:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <main className="max-w-5xl mx-auto">
      {/* header like in screenshot */}
      <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h2 className="text-xl font-semibold">Questions</h2>
                <select className="border rounded px-2 py-1 text-sm">
                    <option>Hot</option>
                    <option>New</option>
                </select>
            </div>

      {loading ? (
        <div className="flex justify-center py-12 text-gray-600 gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading questions…
        </div>
      ) : questions.length ? (
        questions.map(q =>

             (
          <QuestionItem
            key={q._id}
            question={q}
          />
        ))
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions yet</h3>
          <p className="text-gray-600">Check back later or be the first to post a question.</p>
        </div>
      )}
    </main>
  );
}
