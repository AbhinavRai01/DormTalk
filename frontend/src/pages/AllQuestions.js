import React, { useState, useEffect } from 'react';
import QuestionList from './components/QuestionList';
import { Search, Bell, Menu, User } from 'lucide-react';

export default function AllQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter questions based on search
  const filteredQuestions = questions.filter(question =>
    question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    question.senderID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All Questions
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Browse through all the questions in our community
          </p>
          
          {!loading && (
            <div className="text-sm text-gray-500 mb-6">
              {searchQuery ? (
                <>Showing {filteredQuestions.length} results for "{searchQuery}"</>
              ) : (
                <>Showing {questions.length} total questions</>
              )}
            </div>
          )}
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 text-lg">Loading questions...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <QuestionList key={question._id} question={question} />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600">
                  {searchQuery 
                    ? "Try adjusting your search terms or browse all questions."
                    : "No questions have been posted yet."}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-center gap-8 mb-4">
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Help</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Legal</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Feedback</a>
          </div>
          <div className="text-center text-gray-500 text-sm">
            ©2023 Academy
          </div>
        </div>
      </footer>
    </div>
  );
}