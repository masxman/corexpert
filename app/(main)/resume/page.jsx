// Import the getResume function from the actions folder
// This function likely fetches resume data from gemini
import { getResume } from "@/actions/resume";

// Import the ResumeBuilder component from the _components folder
// This component handles the actual resume building interface
import ResumeBuilder from "./_components/resume-builder";

// This is the main Resume page component
// It's an async function because it needs to fetch data before rendering
export default async function ResumePage() {
  // Fetch the resume data from the database/API
  // The 'await' keyword means we wait for this operation to complete
  // before moving to the next line
  const resume = await getResume();

  // Return the JSX (JavaScript XML) that will be rendered on the page
  return (
    // This div creates a container for the entire resume page
    // 'container' centers the content, 'mx-auto' adds horizontal auto margins
    // 'py-6' adds vertical padding (top and bottom) of 1.5rem
    <div className="container mx-auto py-6">
      {/* 
        Render the ResumeBuilder component and pass it the resume content
        - initialContent: The resume data we fetched above
        - The '?' is called optional chaining - it safely accesses the content
          property even if resume is null or undefined
      */}
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
}
