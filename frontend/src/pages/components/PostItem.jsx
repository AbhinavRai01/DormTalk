import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { use } from 'react';

export default function PostItem({postId}) {
    const [post,setPost] = useState({});

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
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <div className="text-sm text-gray-500 mb-1">{post.cluster ? post.cluster.name : "No tags"} • Posted by {post.authorID} • 5 views</div>
      <div className="text-lg font-semibold mb-2">{post.title}</div>
      <div className="text-gray-700 mb-3">{post.content}</div>
      <div className="flex gap-4 text-sm text-gray-600">
        <span>💬 Comments</span>
        <span>🔗 Share</span>
        <span>🔖 Save</span>
      </div>
    </div>
  );
}
