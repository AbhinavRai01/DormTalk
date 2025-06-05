import React, { useState } from 'react';
import bgremoved from '../assets/bgremoved.png';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NewHome() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    const onSearchHandle = (e) => {
      navigate('/all-questions',{
        state : {question: searchTerm}
      })
    }

  return (
    <div className=" flex items-center justify-center px-6 py-6">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left side - Text content */}
        <div className="text-left">
            <button className='bg-gray-600 text-white px-2 py-2 rounded-2xl mb-4 mr-2 md:hidden' onClick={(e) => navigate('/add-question')}>Ask a Question</button>
            <button className='bg-gray-600 text-white px-2 py-2 rounded-2xl mb-4 mr-2 md:hidden' onClick={(e) => navigate('/all-questions')}> Answer</button>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Made for Engineers,<br className="block" /> by Engineers
          </h1>
          <p className="text-lg text-gray-700 mt-6">
            Ask questions, get answers, and build a community of knowledge.
            Join us in creating a platform where engineers share their expertise and learn from each other.
          </p>

          {/* Search Bar */}
          <div className="mt-10">
            <div className="flex items-center bg-gray-100 rounded-full shadow-sm px-6 py-3">
              <input
                type="text"
                placeholder="Search for questions or topics..."
                className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500"
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
              />
              <button className="text-white bg-gray-500 rounded-full px-4 py-3 ml-2 hover:bg-gray-800 transition" onClick={onSearchHandle}>
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:flex justify-center md:justify-end">
          <img
            src={bgremoved}
            alt="Engineers illustration"
            className="w-full max-w-md md:max-w-lg"
          />
        </div>
      </div>
    </div>
  );
}
