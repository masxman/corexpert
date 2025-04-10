"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (industry) => {
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
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const insights = JSON.parse(cleanedText);

      // Basic type validation (improve with zod or ajv)
      if (
        typeof insights.growthRate !== 'number' ||
        !Array.isArray(insights.topSkills) ||
        !Array.isArray(insights.salaryRanges) ||
        !insights.keyTrends || !Array.isArray(insights.keyTrends) ||
        !insights.recommendedSkills || !Array.isArray(insights.recommendedSkills) ||
        !insights.salaryRanges.every(range => typeof range.role === 'string' && typeof range.min === 'number' && typeof range.max === 'number' && typeof range.median === 'number')
      ) {
        console.error("Invalid insights format:", insights);
        return { // Default insights
          salaryRanges: [], growthRate: 0, demandLevel: "Medium", topSkills: [],
          marketOutlook: "Neutral", keyTrends: [], recommendedSkills: []
        };
      }

      return insights;
    } catch (parseError) {
      console.error("JSON parse error:", parseError, cleanedText);
      return { // Default insights
        salaryRanges: [], growthRate: 0, demandLevel: "Medium", topSkills: [],
        marketOutlook: "Neutral", keyTrends: [], recommendedSkills: []
      };
    }
  } catch (apiError) {
    console.error("Gemini API error:", apiError);
    return { // Default insights
      salaryRanges: [], growthRate: 0, demandLevel: "Medium", topSkills: [],
      marketOutlook: "Neutral", keyTrends: [], recommendedSkills: []
    };
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  if (!user.industryInsight) {
    try {
      const insights = await generateAIInsights(user.industry);
      const industryInsight = await db.industryInsight.create({
        data: {
          industry: user.industry, // Or user.industryInsight.industry if you fetch it
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Make this configurable
        },
      });
      return industryInsight;
    } catch (createError) {
      console.error("Error creating IndustryInsight:", createError);
      return new Response("Error creating insights", { status: 500 });
    }
  }

  return user.industryInsight;
}