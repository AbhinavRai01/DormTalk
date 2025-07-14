import React, { useState, useEffect } from 'react';
import PostSection from './PostSection';

export default function QuestionTabs() {
  return (
    <div className="flex-1">
      <div className="flex gap-4 border-b pb-2 mb-4">
        <button className="font-medium text-blue-600 border-b-2 border-blue-600 pb-1">Popular Posts</button>
        <button className="font-medium text-gray-600">Questions</button>
      </div>
      <PostSection />
    </div>
  );
}