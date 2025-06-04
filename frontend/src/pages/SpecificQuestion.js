import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import AnswerList from './components/AnswerList';
import { useNavigate } from 'react-router-dom';

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { storage } from "../config/firebase";

export default function SpecificQuestion() {

  const navigate = useNavigate();

  const [like, setLike] = useState(false);

  const { user, userObject } = useAuthContext();

  const { questionId } = useParams();

  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);

  const [pfp,setPfp] = useState(""); 

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

const [url,setUrl] = useState("");

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


const handleAnswerSubmit = (e) => {
  e.preventDefault();
  const answer = {
    questionID: questionId,
    senderID: user.userId,
    content: answerText,
    question: question.question,
    imageURL: url
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
  console.log("userObj: ",userObject.imageURL);

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
        <span className="font-medium text-slate-700 hover:text-blue-600" onClick={() => {navigate('/profile/'+question.senderID)}}>By: {question.senderID}</span>
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
  {user? (<form className="mb-12" onSubmit={handleAnswerSubmit}>
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
    <div className="flex-1 min-w-[200px]">
      <label className="block mb-1 text-sm text-left font-medium text-gray-700">
        Upload image (optional)
      </label>
      <input
        type="file"
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-700"
      />
    </div>

    <button
      type="submit"
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
    >
      Post Answer
    </button>
  </div>
</form>):("sign in to answer")}
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
            likedAnswer={userObject? userObject.likedAnswers : []}
            userId={user? user.userId: ""}
          />
        ))
      )}
    </div>
  </div>
);

}
