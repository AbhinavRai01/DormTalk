import React, { useState, useEffect } from 'react';
import { lazy, Suspense } from 'react';
import { ThumbsUp, Reply, ChevronDown } from 'lucide-react';
import { useAuthContext } from '../../hooks/useAuthContext';

const CommentSubSection = lazy(() => import('./CommentSubSection'));

export default function Comment({ content }) {

  const { user } = useAuthContext();

  const [likes, setLikes] = useState(content.likes.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${content._id}/likes/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: isLiked ? "decrease" : "increase",
          userId: user.userId,
        }),
      });

      if (!response.ok) {
        // Handle non-2xx responses
        const errorData = await response.json();
        console.error("Server Error:", errorData.message || "Unknown error");
      } else {
        const result = await response.json();
        console.log("Like updated:", result);

        setIsLiked(!isLiked);
      }

    } catch (error) {
      // Handle fetch/network errors
      console.error("Network Error:", error.message);
    }
  };


  const handleViewReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleReplyClick = () => {
    setShowReplyInput(prev => !prev);
  };

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    // TODO: Submit reply logic here
    try {
      const response = fetch('http://localhost:5000/api/comments/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentID: content._id,
          content: replyText,
          authorID: user.userId
        }),
      })

      if (!response.ok) {
        console.log("Not successful");
        setShowReplyInput(false);
      } else {
        setShowReplyInput(false); // hide input after submitting
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLiked(content.likes.includes(user.userId));
  }, [user])

  return (
    <div className="bg-white border rounded-xl p-4 mb-3 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-gray-800">{content.authorID}</span>
      </div>

      <p className="text-gray-700 mb-3 whitespace-pre-line">{content.content}</p>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <button
            onClick={handleLike}
            className={`flex items-center transition ${isLiked ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
              }`}
          >
            <ThumbsUp
              size={16}
              className={`mr-1 transition ${isLiked ? 'fill-current text-blue-600' : ''
                }`}
            />
            {likes} Like{likes !== 1 ? 's' : ''}
          </button>


        <button onClick={handleReplyClick} className="flex items-center hover:text-blue-600 transition">
          <Reply size={16} className="mr-1" /> Reply
        </button>

        <button
          onClick={handleViewReplies}
          className="flex items-center hover:text-blue-600 transition"
        >
          <ChevronDown size={16} className="mr-1" />
          View Replies
        </button>
      </div>

      {showReplyInput && (
        <div className="mt-3 mb-3 p-3 rounded-2xl border border-gray-300 w-full">
          <textarea
            className="w-full resize-none outline-none text-sm placeholder-gray-400"
            rows={3}
            placeholder="Write a reply..."
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
          />

          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => {
                setReplyText('');
                setShowReplyInput(false);
              }}
              className="px-3 py-1 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleReplySubmit}
              className="px-4 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-teal-900 transition"
            >
              Comment
            </button>
          </div>
        </div>
      )}

      {showReplies && (
        <Suspense fallback={<div>Loading...</div>}>
          <CommentSubSection parentID={content._id} />
        </Suspense>
      )}
    </div>
  );
}
