// Import necessary functions and components for the interview preparation page
import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";

// This is the main page component for Interview Preparation
export default async function InterviewPrepPage() {
  // Fetch assessment data asynchronously (e.g., quiz results, stats)
  const assessments = await getAssessments();

  return (
    <div>
      {/* Header section with the page title */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      {/* Main content: stats, performance chart, and quiz list, all using the fetched assessments data */}
      <div className="space-y-6">
        <StatsCards assessments={assessments} /> {/* Displays key statistics */}
        <PerformanceChart assessments={assessments} /> {/* Shows performance trends */}
        <QuizList assessments={assessments} /> {/* Lists available or past quizzes */}
      </div>
    </div>
  );
}
