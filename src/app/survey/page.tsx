'use client';

import dynamic from 'next/dynamic';
const SurveyComponent = dynamic(() => import("@/components/Survey"), { 
  loading: () => <p>Loading...</p>
});

export default function Survey() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <SurveyComponent />
    </div>
  );
}
