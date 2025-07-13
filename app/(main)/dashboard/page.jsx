// Import the function to fetch industry insights from the dashboard actions
import { getIndustryInsights } from "@/actions/dashboard";
// Import the main dashboard view component that displays the insights
import DashboardView from "./_component/dashboard-view";
// Import the function to check if user has completed onboarding
import { getUserOnboardingStatus } from "@/actions/user";
// Import Next.js redirect function for navigation
import { redirect } from "next/navigation";

// Main dashboard page component - handles onboarding check and data fetching
export default async function DashboardPage() {
  // Check if the current user has completed the onboarding process
  const { isOnboarded } = await getUserOnboardingStatus();

  // If user hasn't completed onboarding, redirect them to the onboarding page
  // This ensures users see the onboarding flow before accessing the dashboard
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  // Fetch industry insights for the authenticated user
  // This includes salary ranges, growth rates, market trends, etc.
  const insights = await getIndustryInsights();

  // Render the dashboard with the fetched insights
  // we are showing the insights in the dashboard view graphs and charts
  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
}
