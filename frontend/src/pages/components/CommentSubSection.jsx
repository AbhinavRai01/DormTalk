import React from 'react'
import { useState,useEffect } from 'react'
import Comment from './Comment';

export default function CommentSubSection({parentID}) {
    const [comment, setComment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/comments/parent/${parentID}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setComment(data);

                console.log(data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    },[parentID])

  return (
<div>
  {comment.map((c, index) => (
    <Comment key={index} content={c} />
  ))}
</div>
  )
}
