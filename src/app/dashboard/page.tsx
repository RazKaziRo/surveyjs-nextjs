'use client';

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  loading: () => <p>Loading...</p>
})

export default function SurveyDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Dashboard />
    </div>
  );
}
