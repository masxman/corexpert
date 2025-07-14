// Import React's Suspense for handling async loading, and BarLoader for a loading indicator
import { Suspense } from "react";
import { BarLoader } from "react-spinners";

// Layout component wraps all interview-related pages
export default function Layout({ children }) {
  return (
    <div className="px-5">
      {/* Suspense provides a fallback loader while child components are loading */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children} {/* Render the nested page/component content here */}
      </Suspense>
    </div>
  );
}
