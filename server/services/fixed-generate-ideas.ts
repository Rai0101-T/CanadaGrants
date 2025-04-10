import type { Request, Response } from "express";
import { storage } from "../storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { User, Grant } from "@shared/schema";

// Initialize OpenAI
let openai: OpenAI | null = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.error("Error initializing OpenAI:", error);
}

// Initialize Gemini
let genAI: GoogleGenerativeAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
} catch (error) {
  console.error("Error initializing Google Generative AI:", error);
}

async function getProjectIdeasOpenAI(grantData: any, userProfile: any): Promise<string[]> {
  try {
    if (!openai) {
      throw new Error("OpenAI API not initialized");
    }

    const prompt = `
    As an AI-powered grant assistant, analyze the grant details and business profile below to generate 5 compelling project ideas that would be highly competitive for this funding opportunity.

    GRANT DETAILS:
    Title: ${grantData.title}
    Description: ${grantData.description}
    Type: ${grantData.type}
    Category: ${grantData.category || 'General'}
    Funding Amount: ${grantData.fundingAmount || 'Varies'}
    Eligibility Criteria: ${grantData.eligibilityCriteria ? grantData.eligibilityCriteria.join(", ") : 'Not specified'}
    
    BUSINESS PROFILE:
    Business Name: ${userProfile.businessName || 'Not specified'}
    Business Type: ${userProfile.businessType || 'Not specified'}
    Description: ${userProfile.businessDescription || 'Not specified'}
    Industry: ${userProfile.industry || 'Not specified'}
    Province: ${userProfile.province || 'Not specified'}
    Size: ${userProfile.employeeCount || 'Not specified'} employees
    Founded: ${userProfile.yearFounded || 'Not specified'}
    
    For each project idea:
    1. Provide a concise but descriptive title (10 words or less)
    2. Explain why this idea is a good fit for both the grant criteria and the business profile (2-3 sentences)
    3. Highlight the potential impact of the project in terms of business growth, innovation, or community benefit
    
    Format your response as a numbered list of project ideas only. Do not include any introduction or conclusion.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are GrantScribe, an expert grant writing assistant specializing in Canadian funding opportunities." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Extract the ideas from the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    // Parse the numbered list into separate ideas
    const ideas = content.split(/\d+\./).slice(1).map(idea => idea.trim());
    return ideas.length > 0 ? ideas : [content]; // Fallback to the whole content if parsing fails
  } catch (error) {
    console.error("Error generating project ideas with OpenAI:", error);
    throw error;
  }
}

async function getProjectIdeasGemini(grantData: any, userProfile: any): Promise<string[]> {
  try {
    if (!genAI) {
      throw new Error("Gemini API not initialized");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Using gemini-pro as it's more widely available

    const prompt = `
    As an AI-powered grant assistant, analyze the grant details and business profile below to generate 5 compelling project ideas that would be highly competitive for this funding opportunity.

    GRANT DETAILS:
    Title: ${grantData.title}
    Description: ${grantData.description}
    Type: ${grantData.type}
    Category: ${grantData.category || 'General'}
    Funding Amount: ${grantData.fundingAmount || 'Varies'}
    Provider: ${grantData.fundingProvider || grantData.provider || 'Not specified'}
    Amount: ${grantData.amount || grantData.fundingAmount || 'Varies'}
    Eligibility Criteria: ${grantData.eligibilityCriteria ? grantData.eligibilityCriteria.join(", ") : 'Not specified'}
    
    BUSINESS PROFILE:
    Business Name: ${userProfile.businessName || 'Not specified'}
    Business Type: ${userProfile.businessType || 'Not specified'}
    Description: ${userProfile.businessDescription || 'Not specified'}
    Industry: ${userProfile.industry || 'Not specified'}
    Province: ${userProfile.province || 'Not specified'}
    Size: ${userProfile.employeeCount || 'Not specified'} employees
    Founded: ${userProfile.yearFounded || 'Not specified'}
    
    For each project idea:
    1. Provide a concise but descriptive title (10 words or less)
    2. Explain why this idea is a good fit for both the grant criteria and the business profile (2-3 sentences)
    3. Highlight the potential impact of the project in terms of business growth, innovation, or community benefit
    
    Format your response as a numbered list of project ideas only. Do not include any introduction or conclusion.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse the numbered list into separate ideas
    const ideas = text.split(/\d+\./).slice(1).map(idea => idea.trim());
    return ideas.length > 0 ? ideas : [text]; // Fallback to the whole content if parsing fails
  } catch (error) {
    console.error("Error generating project ideas with Gemini:", error);
    throw error;
  }
}

export async function handleGenerateIdeasEndpoint(req: Request, res: Response) {
  try {
    console.log("Generate ideas endpoint called");
    
    if (!req.user) {
      console.log("Authentication required for idea generation");
      return res.status(401).json({ error: "Authentication required" });
    }

    console.log("User authenticated:", req.user.id);
    const user = req.user as User;
    const { grantId, projectType, keywords } = req.body;
    console.log("Idea generation parameters:", { grantId, projectType, keywords });

    if (!grantId) {
      return res.status(400).json({ error: "Grant ID is required" });
    }

    // Get the grant details
    const grant = await storage.getGrantById(parseInt(grantId, 10));
    if (!grant) {
      return res.status(404).json({ error: "Grant not found" });
    }

    // Try with Gemini first (our preferred provider)
    try {
      const ideas = await getProjectIdeasGemini(grant, user);
      return res.status(200).json({ ideas });
    } catch (geminiError) {
      console.log("Falling back to OpenAI due to Gemini error:", geminiError);
      
      // Fall back to OpenAI if Gemini fails
      try {
        const ideas = await getProjectIdeasOpenAI(grant, user);
        return res.status(200).json({ ideas });
      } catch (openaiError) {
        console.error("Both AI providers failed:", openaiError);
        
        // If both fail, return a predefined set of generic ideas
        return res.status(500).json({ 
          error: "Failed to generate project ideas", 
          errorMessage: "Our AI services are currently unavailable. Please try again later." 
        });
      }
    }
  } catch (error) {
    console.error("Error in generate ideas endpoint:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      errorMessage: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}