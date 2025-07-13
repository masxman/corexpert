// Mark this file as a server action (Next.js 13+ feature)
"use server";

// Import database connection and utilities
import { db } from "@/lib/prisma";
// Import Clerk authentication for user management
import { auth } from "@clerk/nextjs/server";
// Import Google's Generative AI for industry analysis
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google's Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Get the specific AI model (Gemini 1.5 Flash) for generating insights
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate AI-powered industry insights using Google's Gemini model
export const generateAIInsights = async (industry) => {
  // Create a detailed prompt for the AI to analyze the specific industry
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

  try {
    // Send the prompt to the Gemini AI model and get the response
    const result = await model.generateContent(prompt);
    const response = result.response;
    // Extract the text content from the AI response
    const text = response.text();
    // Clean the response by removing any markdown code blocks (```json) and trim whitespace
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      // Parse the cleaned text as JSON to get structured insights
      const insights = JSON.parse(cleanedText);

      // Validate the structure and data types of the AI response
      // This ensures the AI returned the expected format before using the data
      if (
        typeof insights.growthRate !== 'number' ||
        !Array.isArray(insights.topSkills) ||
        !Array.isArray(insights.salaryRanges) ||
        !insights.keyTrends || !Array.isArray(insights.keyTrends) ||
        !insights.recommendedSkills || !Array.isArray(insights.recommendedSkills) ||
        !insights.salaryRanges.every(range => typeof range.role === 'string' && typeof range.min === 'number' && typeof range.max === 'number' && typeof range.median === 'number')
      ) {
        // Log the invalid format for debugging
        console.error("Invalid insights format:", insights);
        // Return default insights if validation fails
        return { // Default insights
          salaryRanges: [], growthRate: 0, demandLevel: "Medium", topSkills: [],
          marketOutlook: "Neutral", keyTrends: [], recommendedSkills: []
        };
      }

      // Return the validated insights if everything is correct
      return insights;
    } catch (parseError) {
      // Handle JSON parsing errors (when AI returns malformed JSON)
      console.error("JSON parse error:", parseError, cleanedText);
      // Return default insights as fallback
      return { // Default insights
        salaryRanges: [], growthRate: 0, demandLevel: "Medium", topSkills: [],
        marketOutlook: "Neutral", keyTrends: [], recommendedSkills: []
      };
    }
  } catch (apiError) {
    // Handle API errors (network issues, rate limits, etc.)
    console.error("Gemini API error:", apiError);
    // Return default insights as fallback
    return { // Default insights
      salaryRanges: [], growthRate: 0, demandLevel: "Medium", topSkills: [],
      marketOutlook: "Neutral", keyTrends: [], recommendedSkills: []
    };
  }
};

export async function getIndustryInsights() {
  // Get the current user's ID from Clerk authentication
  const { userId } = await auth();
  if (!userId) {
    // Return unauthorized error if no user is authenticated
    return new Response("Unauthorized", { status: 401 });
  }

  // Fetch the user from database along with their industry insights
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true, // Include the related industry insight data
    },
  });

  if (!user) {
    // Return not found error if user doesn't exist in database
    return new Response("User not found", { status: 404 });
  }

  // Check if user doesn't have any industry insights yet
  if (!user.industryInsight) {
    try {
      // Generate new AI insights for the user's industry
      const insights = await generateAIInsights(user.industry);
      
      // Create a new industry insight record in the database
      const industryInsight = await db.industryInsight.create({
        data: {
          industry: user.industry, // Store the user's industry
          ...insights, // Spread all the AI-generated insights (salary ranges, growth rate, etc.)
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set next update to 7 days from now (configurable)
        },
      });
      
      // Return the newly created industry insight
      return industryInsight;
    } catch (createError) {
      // Log the error for debugging
      console.error("Error creating IndustryInsight:", createError);
      // Return an error response if database creation fails
      return new Response("Error creating insights", { status: 500 });
    }
  }

  // Return existing industry insights if user already has them
  return user.industryInsight;
}