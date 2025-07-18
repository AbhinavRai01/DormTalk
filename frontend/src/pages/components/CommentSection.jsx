import React, { useState } from 'react';
import CommentSubSection from './CommentSubSection';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function CommentSection({ parentID }) {
  const { user } = useAuthContext();

  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);   // 'success' | 'error' | null

  const handleReplySubmit = async () => {
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/comments/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentID,
          content: replyText,
          authorID: user.userId,
        }),
      });

      if (!res.ok) throw new Error('Network response was not ok');
      /* 🌟 SUCCESS */
      setReplyText('');
      setFeedback('success');
    } catch (err) {
      console.error(err);
      /* 🚨 ERROR */
      setFeedback('error');
    } finally {
      setIsSubmitting(false);
      // hide feedback after 3 s
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Comments</h2>

      <div className="space-y-4">
        {/* --- INPUT BOX --------------------------------------------------- */}
        <div className="mt-3 mb-3 p-3 rounded-2xl border border-gray-300 w-full">
          <textarea
            className="w-full resize-none bg-gray-50 outline-none text-sm placeholder-gray-400"
            rows={3}
            placeholder="Write a reply..."
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
          />

          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={handleReplySubmit}
              disabled={isSubmitting}
              className={`px-4 py-1 text-sm rounded-lg transition 
                          ${isSubmitting
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {isSubmitting ? 'Posting…' : 'Comment'}
            </button>
          </div>

          {/* --- FEEDBACK -------------------------------------------------- */}
          {feedback === 'success' && (
            <p className="mt-2 text-sm text-green-600 flex items-center">
              <span className="mr-1">✔︎</span> Comment posted!
            </p>
          )}
          {feedback === 'error' && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-1">✖︎</span> Something went wrong. Try again.
            </p>
          )}
        </div>

        {/* --- ALREADY‑POSTED COMMENTS ------------------------------------ */}
        <CommentSubSection parentID={parentID} />
      </div>
    </div>
  );
}
