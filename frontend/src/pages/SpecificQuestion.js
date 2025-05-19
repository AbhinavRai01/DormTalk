import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

export default function SpecificQuestion() {

  const { user } = useAuthContext();

  const { questionId } = useParams();

  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const [answerText, setAnswerText] = useState("");

    const handleAnswerSubmit = (e) => {
      e.preventDefault();
      const answer = {
        questionID : questionId,
        senderID : user.userId,
        content: answerText,
        question: question.question
      };

      const response = fetch('http://localhost:5000/api/answers/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answer),
      });

      if (!response.ok) {
        console.error('Error submitting answer:', response.statusText);
        return;
      }

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

    const fetchAnswers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/answers/question/${questionId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log(data);
        setAnswers(data);
      } catch (error) {
        console.error('Error fetching answers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
    fetchAnswers();

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
      {/* Answers Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Answers</h2>
        {answers.length === 0 ? (
          <p className="text-slate-600">No answers yet. Be the first to answer!</p>
        ) : (
          answers.map((answer, index) => (
            <div key={index} className="border border-slate-300 p-4 rounded-lg mb-4">
              <p className="text-md text-slate-700">{answer.content}</p>
              <p className="text-sm text-slate-500 mt-2">
                Answered by: <span className="font-medium">{answer.senderID}</span>
              </p>
            </div>
          ))
        )}
    </div>
    </div>

  );
}
