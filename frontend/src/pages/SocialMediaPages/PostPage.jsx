import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Bookmark } from 'lucide-react';
import CommentSection from '../components/CommentSection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

export default function PostView() {
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const postId = useParams().id;
  const { user } = useAuthContext();

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/updateLikes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post._id,
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${postId}`);
        const data = await response.json();
        if (response.ok) {
          setPost(data);

          console.log(user.userId);

          console.log(data.likes);
          console.log(data.likes.includes(user.userId));
          setIsLiked(data.likes.includes(user.userId));
        } else {
          console.error('Failed to fetch post:', data);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [postId,user]);

  if (!post) {
    return <div className="p-4 text-gray-600">Loading post...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto text-left p-6 mt-8">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-1">{post.title}</h1>

      {/* Meta info */}
      <div className="text-sm text-gray-500 mb-4">
        <p>
          Posted in <span className="text-blue-600 font-medium" onClick={() => navigate(`/clusters/${post.cluster?.name}`)}>{post.cluster?.name}</span> by{' '}
          <span className="text-gray-700 font-medium" onClick={() => navigate(`/profile/${post.authorID}`)}>{post.authorID}</span>
        </p>
      </div>

      {/* Content */}
      <p className="text-gray-800 mb-4">{post.content}</p>

      {/* Image */}
      {post.imageURL && (
        <div className="w-full flex justify-center my-4">
          <img src={post.imageURL} alt="Post Visual" className="rounded-lg max-h-[300px]" />
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 px-3 py-1 text-sm transition ${isLiked ? 'text-red-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
            }`}
        >
          <Heart
            size={18}
            className={`stroke-2 transition ${isLiked ? 'fill-red-600 text-red-600' : ''
              }`}
          />
          {post? (post.likes.length) : (0)}
        </button>
        <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-700 hover:text-blue-600 transition">
          <Bookmark size={18} className="stroke-2" />
          Save
        </button>
      </div>
      <div>
      </div>
      <CommentSection parentID={post._id} />
    </div>
  );
}
