import React from 'react'
import TopClusters from '../components/TopClusters';
import TopProfiles from '../components/TopProfiles';
import QuestionTabs from '../components/QuestionTabs';

export default function NewSMHome() {

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto flex gap-6">
        <QuestionTabs />
        <div className="w-80 space-y-6">
          <TopClusters />
          <TopProfiles />
        </div>
      </div>
    </div>
  );
}
