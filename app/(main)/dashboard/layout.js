// Import loading spinner component for better user experience
// BarLoader shows a horizontal progress bar during loading states
import { BarLoader } from "react-spinners";
// Import React Suspense for handling async component loading
// Async component loading means components that fetch data or have delayed rendering
// Suspense allows us to show a fallback UI while async operations complete
import { Suspense } from "react";

// Dashboard layout component that wraps all dashboard pages
// Provides consistent header and loading states
// This layout is applied to all pages under the dashboard route
export default function Layout({ children }) {
  return (
    // Main container with horizontal padding for consistent spacing
    <div className="px-5">
      {/* Header section with the main dashboard title */}
      {/* This header appears on all dashboard pages for consistency */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Industry Insights</h1>
      </div>
      
      {/* Suspense wrapper to handle loading states for async components */}
      {/* Shows a loading bar while child components are loading */}
      {/* This is especially useful when the dashboard page is fetching industry insights */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {/* Render the child components (dashboard pages) */}
        {/* The children prop contains the actual page content (like DashboardPage) */}
        {children}
      </Suspense>
    </div>
  );
}
