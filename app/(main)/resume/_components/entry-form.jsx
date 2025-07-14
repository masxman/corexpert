// This component handles adding and managing entries for Experience, Education, and Projects
// It's used within the resume builder to create structured entries
"use client";

// Import React hooks for managing state and side effects
import { useEffect, useState } from "react";

// Import form handling library for managing the entry form
import { useForm } from "react-hook-form";

// Import Zod resolver for form validation
import { zodResolver } from "@hookform/resolvers/zod";

// Import date formatting utilities
import { format, parse } from "date-fns";

// Import UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import validation schema for entry form
import { entrySchema } from "@/app/lib/schema";

// Import icons from Lucide React
import { Sparkles, PlusCircle, X, Pencil, Save, Loader2 } from "lucide-react";

// Import AI improvement function
import { improveWithAI } from "@/actions/resume";

// Import toast notifications
import { toast } from "sonner";

// Import custom hook for API calls
import useFetch from "@/hooks/use-fetch";

// Helper function to format dates for display
// Converts "2024-01" format to "Jan 2024" for better readability
const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

// Main EntryForm component that handles Experience, Education, and Project entries
export function EntryForm({ type, entries, onChange }) {
  // State to track whether the user is currently adding a new entry
  const [isAdding, setIsAdding] = useState(false);

  // Set up form handling with react-hook-form
  const {
    register,           // Function to register form inputs
    handleSubmit: handleValidation, // Function to handle form submission with validation
    formState: { errors }, // Object containing validation errors
    reset,              // Function to reset form to default values
    watch,              // Function to watch form values in real-time
    setValue,           // Function to programmatically set form values
  } = useForm({
    // Use Zod schema for form validation
    resolver: zodResolver(entrySchema),
    // Set default values for all form fields
    defaultValues: {
      title: "",        // Job title, degree, or project name
      organization: "", // Company, school, or organization
      startDate: "",    // Start date in YYYY-MM format
      endDate: "",      // End date in YYYY-MM format
      description: "",  // Detailed description of the entry
      current: false,   // Whether this is a current position/education
    },
  });

  // Watch the 'current' field to enable/disable end date input
  const current = watch("current");

  // Function to handle adding a new entry
  const handleAdd = handleValidation((data) => {
    // Format the entry with proper date formatting
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    // Add the new entry to the existing entries array
    onChange([...entries, formattedEntry]);

    // Reset the form and hide the add form
    reset();
    setIsAdding(false);
  });

  // Function to delete an entry by its index
  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  // Set up AI improvement functionality using our custom useFetch hook
  const {
    loading: isImproving,      // Boolean indicating if AI improvement is in progress
    fn: improveWithAIFn,       // Function to call the AI improvement API
    data: improvedContent,     // The improved content returned by AI
    error: improveError,       // Error object if improvement fails
  } = useFetch(improveWithAI);

  // Effect to handle AI improvement results
  useEffect(() => {
    if (improvedContent && !isImproving) {
      // Set the improved content in the description field
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  // Function to improve the description using AI
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    // Call the AI improvement function with current description and entry type
    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(), // 'experience', 'education', or 'project'
    });
  };

  // Render the component
  return (
    <div className="space-y-4">
      {/* Display existing entries */}
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index}>
            {/* Card header with title and delete button */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title} @ {item.organization}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            {/* Card content with date range and description */}
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form for adding new entries */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title and Organization inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="Title/Position"
                  {...register("title")}
                  error={errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Organization/Company"
                  {...register("organization")}
                  error={errors.organization}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            {/* Start and End date inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register("startDate")}
                  error={errors.startDate}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register("endDate")}
                  disabled={current} // Disable if it's a current position
                  error={errors.endDate}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Current position checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", ""); // Clear end date if current
                  }
                }}
              />
              <label htmlFor="current">Current {type}</label>
            </div>

            {/* Description textarea */}
            <div className="space-y-2">
              <Textarea
                placeholder={`Description of your ${type.toLowerCase()}`}
                className="h-32"
                {...register("description")}
                error={errors.description}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            
            {/* AI improvement button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          
          {/* Form action buttons */}
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Button to show the add form */}
      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}
