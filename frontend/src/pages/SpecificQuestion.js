import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import AnswerList from './components/AnswerList';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { storage } from "../config/firebase";

export default function SpecificQuestion() {

  const APIKey = "AIzaSyCAorMRTYd5fnolgzXyHCfAgrmNFtTAknM";

  const ai = new GoogleGenAI({ apiKey: APIKey });

  const navigate = useNavigate();

  const [like, setLike] = useState(false);

  const { user, userObject } = useAuthContext();

  const { questionId } = useParams();

  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);

  const [pfp, setPfp] = useState("");
  const [sageAnswer, setSageAnswer] = useState("");

  const [answerText, setAnswerText] = useState("");

  const likeQuestionHandle = (e) => {
    e.preventDefault();

    const likeAnswer = async () => {
      try {
        const response1 = await fetch('http://localhost:5000/api/users/likeQuestion', {
          method: 'POST',
          body: JSON.stringify({
            curUserID: user.userId,
            questionID: questionId
          }),
          headers: { 'Content-Type': 'application/json' }
        });

        if (response1.ok) {
          const incObj = await response1.json(); // Assuming your API returns 1 or -1 directly
          const inc = incObj.inc;
          console.log(inc);

          if (inc === 1) {
            const response2 = await fetch('http://localhost:5000/api/questions/like', {
              method: 'POST',
              body: JSON.stringify({ questionId: questionId }),
              headers: { 'Content-Type': 'application/json' }
            });

            if (response2.ok) {
              setLikesCount(likesCount + 1);
              console.log("Liked question");

              setLike(true);
            } else {
              console.error("Failed to like question");
            }

          } else if (inc === -1) {
            const response2 = await fetch('http://localhost:5000/api/questions/unlike', {
              method: 'POST',
              body: JSON.stringify({ questionId: questionId }),
              headers: { 'Content-Type': 'application/json' }
            });

            if (response2.ok) {
              setLikesCount(likesCount - 1);
              console.log("Unliked question");
              setLike(false);
            } else {
              console.error("Failed to unlike question");
            }
          }
        } else {
          console.error("Failed at likeAnswer step");
        }
      } catch (error) {
        console.error("Error in likeAnswer:", error);
      }
    };

    likeAnswer();
  };

  const [url, setUrl] = useState("");

  function handleImageUpload(event) {

    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
    uploadBytes(storageRef, file)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        console.log("Image URL:", url);
        setUrl(url);  // Update the state with the image URL
        // You can set this URL to state if you want to display the image
      })
      .catch((error) => {
        console.error("Upload error:", error);
      });
  }

  const sageAnswerSubmit = async (e) => {
    try {
      e.preventDefault(); // Prevent default form submission if needed

      // Validate inputs
      if (!question?.question) {
        throw new Error('Question is required');
      }

      if (!question._id) {
        throw new Error('Question ID is missing');
      }

      // Generate AI response
      const prompt = `Answer the following question in multiple paragraphs using natural paragraph formatting. Avoid using explicit escape characters or newline symbols. Just write normally as if typing in a document: ${question.question}, ${question.description}`;
      
      const sageResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a cute anime character. Your name is Sage.",
          maxOutputTokens: 400,
          temperature: 0.1
        }
      });


      // Check if AI response is valid
      if (!sageResponse?.text) {
        throw new Error('Failed to generate AI response');
      }

      // Send to server
      const serverResponse = await fetch(`http://localhost:5000/api/questions/sageanswer/${question._id}`, {
        method: 'POST',
        body: JSON.stringify({ answer: sageResponse.text }),
        headers: { 'Content-Type': 'application/json' }
      });

      // Check server response
      if (!serverResponse.ok) {
        const errorData = await serverResponse.json().catch(() => ({}));
        throw new Error(`Server error: ${serverResponse.status} - ${errorData.message || 'Unknown error'}`);
      }

      // Success - update state
      setSageAnswer(sageResponse.text);
      console.log('Sage answer submitted successfully');

    } catch (error) {
      console.error('Error in sageAnswerSubmit:', error);

    }
  };
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    const answer = {
      questionID: questionId,
      senderID: user.userId,
      content: answerText,
      question: question.question,
      imageURL: url
    };

    const response = await fetch('http://localhost:5000/api/answers/add/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answer),
    });

    if (!response.ok) {
      console.error('Error submitting answer:', response.statusText);
    }

    console.log("Answer submitted:", answerText);
    setAnswerText(""); // optional reset

    window.location.reload();
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

        setSageAnswer(data.sageAnswer);
        setLikesCount(data.likes);

        const imgResponse = await fetch(`http://localhost:5000/api/users/getpfp/${data.senderID}`);
        const imgaData = await imgResponse.json();
        setPfp(imgaData.imageURL);
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
    console.log("userObj: ", userObject.imageURL);

    if (userObject.likedQuestions) {
      if (userObject.likedQuestions.includes(questionId)) {
        setLike(true);
      }
    }


    fetchQuestion();
    fetchAnswers();

  }, [questionId, userObject]);

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
    <div className="mx-auto px-0 sm:px-6 bg-[#f9fafb] rounded-xl">
      <div className="bg-white p-2 sm:p-6 rounded-2xl shadow-md">

        {/* Question Title */}
        <h1 className="text-3xl text-left sm:text-3xl font-[800] text-slate-800 mb-4 leading-snug">
          {question.question}
        </h1>
        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {question.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>



        {/* Author */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src={pfp} // placeholder avatar
            alt="user avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="text-slate-600 text-sm">
            By:<span className="font-medium text-slate-700 cursor-pointer hover:text-blue-600" onClick={() => { navigate('/profile/' + question.senderID) }}> {question.senderID}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-base text-left text-slate-700 leading-relaxed mb-6">
          {question.description}
        </p>

        {/* Optional Image */}
        {question.imageURL && (
          <img src={question.imageURL} alt="question" className="mb-6 rounded-lg border border-gray-200 shadow-sm" />
        )}

        {/* Like Button */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={likeQuestionHandle}
            disabled={!user}
            className={`px-4 py-2 text-sm rounded-md border text-gray-700 transition 
    ${user ? 'bg-white border-gray-300 hover:bg-gray-100 cursor-pointer' : 'bg-gray-200 border-gray-200 cursor-not-allowed'}
  `}
          >
            {like ? "Unlike" : "Like"}
          </button>
          <p className="text-gray-500 text-sm">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</p>
        </div>

        {/* Answer Form */}
        {user ? (<form className="mb-12" onSubmit={handleAnswerSubmit}>
          <label htmlFor="answer" className="block text-lg text-left font-[800] text-slate-800 mb-2">
            Your Answer
          </label>
          <textarea
            id="answer"
            name="answer"
            rows="5"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className="w-full p-4 bg-gray-100 text-slate-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your answer here..."
            required
          ></textarea>

          {/* Image Upload and Submit Button */}
          <div className="mt-4 flex items-end justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-2 min-w-[200px]">
              <label className="text-sm text-left font-medium text-gray-700">
                Upload image <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>


            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
            >
              Post Answer
            </button>
          </div>
        </form>) : ("sign in to answer")}
      </div>
      <div className="bg-white p-2 mt-3 w-[100%] sm:p-6 rounded-2xl shadow-md border border-gray-100">
        {/* Sage Header */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Sage</p>
            <p className="text-xs text-gray-500">AI Assistant</p>
          </div>
        </div>

        {/* Response */}
        {sageAnswer ? (<div className='pt-2 text-sm text-left'>

          <ReactMarkdown>
            {`${sageAnswer}`}
          </ReactMarkdown>
        </div>
        ) : (
          <button
            onClick={sageAnswerSubmit}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            Ask Sage for answer
          </button>
        )}
      </div>



      {/* Answers Section */}
      <div>
        <h2 className="text-2xl font-bold text-left text-slate-800 mb-6">Answers ({answers.length})</h2>
        {answers.length === 0 ? (
          <p className="text-slate-500">No answers yet. Be the first to answer!</p>
        ) : (
          answers.map((answer, index) => (
            <AnswerList
              key={answer._id || index}
              answer={answer}
              index={index}
              likedAnswer={userObject ? userObject.likedAnswers : []}
              userId={user ? user.userId : ""}
            />
          ))
        )}
      </div>
    </div>
  );

}
