import React, { useState, useEffect } from 'react';
import PostSection from './PostSection';
import QuestionsSection from './QuestionsSection';

export default function QuestionTabs() {
  const [isPost, setIsPost] = useState(true);

  const selectedClass = "font-medium text-blue-600 border-b-2 border-blue-600 pb-1";
  const unselectedClass = "font-medium text-gray-600";
  return (
    <div className="flex-1">
      <div className="flex gap-4 border-b pb-2 mb-4">
        <button className={isPost? selectedClass: unselectedClass} onClick={()=>{setIsPost(true)}}>Popular Posts</button>
        <button className={!isPost? selectedClass: unselectedClass} onClick={()=>{setIsPost(false)}}>Questions</button>
      </div>
      {isPost ? <PostSection /> : <QuestionsSection/>}
    </div>
  );
}