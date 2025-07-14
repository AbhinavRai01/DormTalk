import React from 'react'
import PostItem from './PostItem';
import { useState, useEffect } from 'react';

export default function PostSection() {

    const user = localStorage.getItem('user');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        console.log("Fetching posts for user:", user);
        const userId = user ? JSON.parse(user).userId : null;
        console.log("User ID:", userId);
        const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/posts/feed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched posts:', data);
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };
        fetchPosts();
    }
        , [user]);
    return (
        <div className="flex-1">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h2 className="text-xl font-semibold">Popular Posts</h2>
                <select className="border rounded px-2 py-1 text-sm">
                    <option>Hot</option>
                    <option>New</option>
                </select>
            </div>
            {posts.map((post, idx) => (
                <PostItem key={idx} postId={post._id} />
            ))}
        </div>
    );
}
