import React, { useState, useEffect } from 'react';
import QuestionList from './components/QuestionList';
import { Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';

export default function AllQuestions() {
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermTemprory, setTemprory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const allTags = [
    'Maths', 'Physics', 'Chemistry', 'Mechanical', 'Electrical', 'Civil', 'Computer Science',
    'Electronics', 'Information Technology', 'Chemical Engineering', 'Biotechnology',
    'Aerospace Engineering', 'Materials Science', 'Data Science', 'Artificial Intelligence'
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
    
      const passedState = location.state;

      if (passedState) {
        setSearchTerm(passedState.question);
      }
      setLoading(true);
      try {
        
        const response = await fetch('https://dormtalk.onrender.com/api/questions/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchTerm,
            tags: selectedTags.map(tag => tag.value),
            page
          }),
        });



        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        console.log(data);
        setQuestions(data.questions);
        setCount(parseInt(data.count));

        console.log("count:", count);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [searchTerm, selectedTags, page]);

  const handleTagsChange = (selectedOptions) => {
    setSelectedTags(selectedOptions || []);
  };

  const handleSearchChange = (e) => {
    setTemprory(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    setSearchTerm(searchTermTemprory);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Questions</h1>
          <p className="text-lg text-gray-600 mb-8">Browse through all the questions in our community</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="flex items-center bg-gray-100 rounded-full shadow-sm px-6 py-3 md:col-span-3">
              <input
                type="text"
                value={searchTermTemprory}
                onChange={handleSearchChange}
                placeholder="Search for questions or topics..."
                className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500"
              />
              <button className="text-white bg-gray-500 rounded-full px-4 py-3 ml-2 hover:bg-gray-800 transition" onClick={handleSearchSubmit}>
                <Search className="w-6 h-6" />
              </button>
            </div>
            <div className="md:col-span-2">
              <Select
                isMulti
                name="tags"
                options={allTags.map(tag => ({ value: tag, label: tag }))}
                placeholder="Search and select tags..."
                value={selectedTags}
                onChange={handleTagsChange}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: '#f3f4f6',
                    borderColor: '#f3f4f6',
                    borderRadius: 9999,
                    padding: '0.5rem 0.75rem',
                    boxShadow: 'none',
                    minHeight: '50px',
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: '#6b7280',
                    fontSize: '1rem',
                    textAlign: 'left'
                  }),
                  input: (base) => ({
                    ...base,
                    color: '#1f2937',
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#e5e7eb',
                    borderRadius: '9999px',
                    padding: '2px 6px',
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#1f2937',
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#6b7280',
                    ':hover': {
                      color: '#374151',
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 20,
                  }),
                }}
              />
            </div>
          </div>

          {!loading && (
            <div className="text-sm text-gray-500 mb-6">
              <>Showing {count} total questions</>
            </div>
          )}
        </div>
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 text-lg">Loading questions...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.length > 0 ? (
              questions.map((question) => (
                <QuestionList key={question._id} question={question} />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Try adjusting your search terms or browse all questions."
                    : "No questions have been posted yet."}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      <div className={`grid grid-cols-${Math.ceil(count / 10)} w-[50%] items-center mx-auto`}>
        {Array.from({ length: Math.ceil(count / 10) }).map((_, i) => (
          <button key={i} className="p-2 bg-gray-200 w-[7%] rounded items-center mx-auto hover:bg-gray-300"onClick={(e)=>{setPage(i)}}>
            {i + 1}
          </button>
        ))}
      </div>


    </div >
  );
}
