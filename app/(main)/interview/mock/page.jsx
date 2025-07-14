// Import necessary modules and components
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";

// This component renders the Mock Interview page
export default function MockInterviewPage() {
  return (
    <div className="container mx-auto space-y-4 py-6">
      {/* Header section with navigation back to Interview Preparation */}
      <div className="flex flex-col space-y-2 mx-2">
        <Link href="/interview">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation
          </Button>
        </Link>

        <div>
          {/* Page title and description */}
          <h1 className="text-6xl font-bold gradient-title">Mock Interview</h1>
          <p className="text-muted-foreground">
            Test your knowledge with industry-specific questions
          </p>
        </div>
      </div>

      {/* Render the Quiz component for the mock interview */}
      <Quiz />
    </div>
  );
}
