import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AnswerList({ answer, index, likedAnswer, userId }) {

  const navigate = useNavigate();

  const [like, setLike] = useState(likedAnswer?.includes(answer._id) || false);
  const [pfp,setPfp] = useState("");
  const [likes,setLikes] = useState(answer.likes);
  
  const likeHandle = async (e, answerId) => {
    e.preventDefault();

    const response1 = await fetch('http://localhost:5000/api/users/likeAnswer', {
      method: 'POST',
      body: JSON.stringify({
        curUserID: userId,
        answerID: answerId
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response1.ok) {
      const incObj = await response1.json();
      const inc = incObj.inc;

      const endpoint = inc === 1 ? 'like' : 'unlike';

      
      const response = await fetch(`http://localhost:5000/api/answers/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify({ answerId }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (inc === 1) {
        setLikes(likes + 1);
      }else{
        setLikes(likes - 1);
      }

      if (response.ok) {
        setLike(inc === 1);
      } else {
        console.error(`Failed to ${endpoint} answer`);
      }
    }
  };

  useEffect(() => {
    if (likedAnswer && answer?._id) {
      setLike(likedAnswer.includes(answer._id));
    }

    try {
      const fetchPfp = async() => {
        const imgResponse = await fetch(`http://localhost:5000/api/users/getpfp/${answer.senderID}`);
        const imgaData = await imgResponse.json();
        setPfp(imgaData.imageURL);
      }

      fetchPfp();

      
      
    } catch (error) {
      console.error('Error fetching question:', error);
    
    } 
  }, [likedAnswer, answer._id]);

  return (
    <div key={index} className="flex items-start gap-4 p-6 mb-6 bg-white p-6 rounded-2xl shadow-lg shadow-sm">
      {/* Profile Image */}
      <img
        src={pfp}
        alt="User"
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* Content */}
      <div className="flex-1">
        <p className="font-semibold text-left text-slate-800 cursor-pointer hover:text-blue-600" onClick={()=>navigate('/profile/'+answer.senderID)}>{answer.senderID || 'Anonymous'}</p>
        <p className="text-slate-700 mt-1 text-left whitespace-pre-line">{answer.content}</p>

        {answer.imageURL && (
          <img src={answer.imageURL} alt="Attached" className="mt-4 rounded-lg max-w-xs object-cover max-h-64" />
        )}

        {/* Like Button */}
       
        <div className="flex items-center gap-4 mb-10">
      <button
        onClick={(e) => likeHandle(e,answer._id)}
         disabled={!userId}
        className={`px-4 py-2 text-sm rounded-md border text-gray-700 transition 
        ${userId ? 'bg-white border-gray-300 hover:bg-gray-100 cursor-pointer' : 'bg-gray-200 border-gray-200 cursor-not-allowed'}
  `}
>
        {like ? "Unlike" : "Like"}
      </button>
      <p className="text-gray-500 text-sm">{likes} {likes === 1 ? 'like' : 'likes'}</p>
    </div>
      </div>
    </div>
  );
}
