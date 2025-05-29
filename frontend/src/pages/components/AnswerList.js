import React, { useEffect } from 'react'

export default function AnswerList({ answer, index, likedAnswer, userId }) {

  const [like, setLike] = React.useState(likedAnswer?.includes(answer._id) || false);

  const likeHandle = async (e, answerId) => {
    e.preventDefault();
    console.log("Like button clicked for answer:", answerId);

    const response1 = await fetch('http://localhost:5000/api/users/likeAnswer', {
      method: 'POST',
      body: JSON.stringify({
        curUserID: userId,
        answerID: answerId
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response1.ok) {
      const incObj = await response1.json(); // Assuming your API returns 1 or -1 directly
      const inc = incObj.inc;

      console.log(inc);

      if (inc === 1) {
        const response = await fetch('http://localhost:5000/api/answers/like', {
          method: 'POST',
          body: JSON.stringify({ answerId }),
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          console.log("Liked answer");
          setLike(true);
          // Optionally, you can update the UI or state here
        } else {
          console.error("Failed to like answer");
        }
      } else if (inc === -1) {
        const response = await fetch('http://localhost:5000/api/answers/unlike', {
          method: 'POST',
          body: JSON.stringify({ answerId }),
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          console.log("Liked answer");
          setLike(false);
          // Optionally, you can update the UI or state here
        } else {
          console.error("Failed to like answer");
        }
      }
    }


  };

useEffect(() => {
  if (likedAnswer && answer?._id) {
    setLike(likedAnswer.includes(answer._id));
  }
}, [likedAnswer, answer._id]);

  return (
    <div key={index} className="border border-slate-300 p-4 rounded-lg mb-4">
      <p className="text-md text-slate-700">{answer.content}</p>
      <p className="text-sm text-slate-500 mt-2">
        Answered by: <span className="font-medium">{answer.senderID}</span>
      </p>
      <img src={answer.imageURL} alt="" />
      <button onClick={(e) => likeHandle(e, answer._id)}>{like ? "UnLike" : "Like"}</button>
    </div>
  )
}
