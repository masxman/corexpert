// This tells Next.js that this component runs on the client side (browser)
// This is needed because we use interactive features like state and form handling
"use client";

// Import React hooks for managing state and side effects
import { useState, useEffect } from "react";

// Import form handling library - makes it easier to manage complex forms
import { useForm, Controller } from "react-hook-form";

// Import Zod resolver for form validation
import { zodResolver } from "@hookform/resolvers/zod";

// Import icons from Lucide React (a popular icon library)
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";

// Import toast notifications for showing success/error messages
import { toast } from "sonner";

// Import Markdown editor component for rich text editing
import MDEditor from "@uiw/react-md-editor";

// Import UI components from our custom component library
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Import the saveResume function to save resume data
import { saveResume } from "@/actions/resume";

// Import the EntryForm component for adding experience, education, and projects
import { EntryForm } from "./entry-form";

// Import custom hook for making API calls with loading states
import useFetch from "@/hooks/use-fetch";

// Import Clerk's useUser hook to get current user information
import { useUser } from "@clerk/nextjs";

// Import helper function to convert form entries to markdown format
import { entriesToMarkdown } from "@/app/lib/helper";

// Import the validation schema for the resume form
import { resumeSchema } from "@/app/lib/schema";

// Import PDF generation library
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";

// Main ResumeBuilder component that receives initial content as a prop
export default function ResumeBuilder({ initialContent }) {
  // State to track which tab is currently active (edit or preview)
  const [activeTab, setActiveTab] = useState("edit");
  
  // State to store the content that will be shown in the preview
  const [previewContent, setPreviewContent] = useState(initialContent);
  
  // Get the current user from Clerk authentication
  const { user } = useUser();
  
  // State to track whether we're in preview mode or edit mode in the markdown editor
  const [resumeMode, setResumeMode] = useState("preview");

  // Set up form handling with react-hook-form
  // This gives us form validation, error handling, and easy form state management
  const {
    control,        // Used for controlled components like the markdown editor
    register,       // Used for regular form inputs
    handleSubmit,   // Function to handle form submission
    watch,          // Function to watch form values for real-time updates
    formState: { errors }, // Object containing any form validation errors
  } = useForm({
    // Use Zod schema for form validation
    resolver: zodResolver(resumeSchema),
    // Set default values for all form fields
    defaultValues: {
      contactInfo: {},      // Object to store contact information
      summary: "",          // Professional summary text
      skills: "",           // Skills text
      experience: [],       // Array of work experience entries
      education: [],        // Array of education entries
      projects: [],         // Array of project entries
    },
  });

  // Set up the save functionality using our custom useFetch hook
  // This handles the API call to save the resume with loading states
  const {
    loading: isSaving,     // Boolean indicating if save is in progress
    fn: saveResumeFn,      // Function to call the save API
    data: saveResult,       // Data returned from successful save
    error: saveError,       // Error object if save fails
  } = useFetch(saveResume);

  // Watch all form fields to get real-time updates
  // This is used to update the preview as the user types
  const formValues = watch();

  // Effect to automatically switch to preview tab if there's initial content
  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  // Effect to update preview content whenever form values change
  // This creates a live preview as the user fills out the form
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  // Effect to show success/error messages when save operation completes
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  // Function to generate markdown for contact information section
  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    
    // Add each contact method with an emoji if it exists
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    // Return formatted markdown with centered layout
    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  // Function to combine all form sections into a single markdown document
  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),                                    // Contact info at top
      summary && `## Professional Summary\n\n${summary}`,      // Summary section
      skills && `## Skills\n\n${skills}`,                     // Skills section
      entriesToMarkdown(experience, "Work Experience"),        // Experience section
      entriesToMarkdown(education, "Education"),               // Education section
      entriesToMarkdown(projects, "Projects"),                 // Projects section
    ]
      .filter(Boolean)  // Remove empty sections
      .join("\n\n");    // Join sections with double line breaks
  };

  // State to track if PDF generation is in progress
  const [isGenerating, setIsGenerating] = useState(false);

  // Function to generate and download a PDF of the resume
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Get the hidden div that contains the formatted resume
      const element = document.getElementById("resume-pdf");
      
      // Configure PDF generation options
      const opt = {
        margin: [15, 15],                    // Page margins in mm
        filename: "resume.pdf",               // Name of downloaded file
        image: { type: "jpeg", quality: 0.98 }, // Image quality settings
        html2canvas: { scale: 2 },           // Higher scale for better quality
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // PDF settings
      };

      // Generate and download the PDF
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to handle form submission (saving the resume)
  const onSubmit = async (data) => {
    try {
      // Clean up the content by normalizing line breaks
      const formattedContent = previewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();

      console.log(previewContent, formattedContent);
      // Call the save function with the formatted content
      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  // Render the component
  return (
    // Main container with light theme and spacing
    <div data-color-mode="light" className="space-y-4">
      {/* Header section with title and action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Main title with gradient styling */}
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        
        {/* Action buttons container */}
        <div className="space-x-2">
          {/* Save button */}
          <Button
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          
          {/* Download PDF button */}
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tab interface for switching between form and preview */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tab navigation */}
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        {/* Form tab content */}
        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                {/* Email input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@email.com"
                    error={errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                
                {/* Mobile number input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+1 234 567 8900"
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                
                {/* LinkedIn URL input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                
                {/* Twitter/X Profile input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Twitter/X Profile
                  </label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://twitter.com/your-handle"
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Summary Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                    error={errors.summary}
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your key skills..."
                    error={errors.skills}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* Work Experience Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Project"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>

        {/* Preview tab content */}
        <TabsContent value="preview">
          {/* Toggle button to switch between preview and edit modes in the markdown editor */}
          {activeTab === "preview" && (
            <Button
              variant="link"
              type="button"
              className="mb-2"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
          )}

          {/* Warning message when user is editing markdown directly */}
          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose editied markdown if you update the form data.
              </span>
            </div>
          )}
          
          {/* Markdown editor container */}
          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>
          
          {/* Hidden div used for PDF generation */}
          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
