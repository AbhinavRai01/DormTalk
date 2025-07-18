import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Bookmark, Heart } from 'lucide-react';

export default function PostItem({ postId }) {
  const [post, setPost] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${postId}`);
        setPost(response.data);
        console.log("Post fetched:", response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <div
      className="text-left p-4 mb-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition"
    >
      <div className="text-sm text-gray-500 mb-1">
        <span onClick={() => {navigate('/clusters/'+post.cluster.name)}}>{post.cluster ? post.cluster.name : "No tags"} </span>• <span onClick={() => {navigate('/profile/'+post.authorID)}}>Posted by {post.authorID}</span>
      </div>
      <div className="text-lg font-semibold mb-2" onClick={() => navigate(`/posts/${post._id}`)}>{post.title}</div>
      <div className="text-gray-700 mb-3" onClick={() => navigate(`/posts/${post._id}`)}>{post.content}</div>
      <div className="flex gap-6 text-sm text-gray-600 items-center" onClick={() => navigate(`/posts/${post._id}`)}>
        <span className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          Comments
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          Likes
        </span>
        <span className="flex items-center gap-1">
          <Bookmark className="w-4 h-4" />
          Save
        </span>
      </div>
    </div>
  );
}
