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

async function improveApplicationTextOpenAI(grant: Grant, applicationText: string, userProfile: any): Promise<string> {
  try {
    if (!openai) {
      throw new Error("OpenAI API not initialized");
    }

    const prompt = `
    As an AI-powered grant writing assistant, help improve the following grant application text. 
    
    GRANT DETAILS:
    Title: ${grant.title}
    Description: ${grant.description}
    Type: ${grant.type}
    Category: ${grant.category || 'General'}
    Funding Amount: ${grant.fundingAmount || 'Varies'}
    Eligibility Criteria: ${grant.eligibilityCriteria ? grant.eligibilityCriteria.join(", ") : 'Not specified'}
    
    BUSINESS PROFILE:
    Business Name: ${userProfile.businessName || 'Not specified'}
    Business Type: ${userProfile.businessType || 'Not specified'}
    Description: ${userProfile.businessDescription || 'Not specified'}
    Industry: ${userProfile.industry || 'Not specified'}
    Province: ${userProfile.province || 'Not specified'}
    Size: ${userProfile.employeeCount || 'Not specified'} employees
    Founded: ${userProfile.yearFounded || 'Not specified'}
    
    APPLICATION TEXT TO IMPROVE:
    ${applicationText}
    
    Please improve this application text by:
    1. Enhancing clarity and language
    2. Aligning it more closely with the grant's eligibility criteria
    3. Adding specificity about how the business meets the grant requirements
    4. Strengthening the case for why this business should receive funding
    5. Ensuring appropriate tone and formality
    
    Return only the improved application text without any additional commentary, introductions, or explanations.
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

    // Extract the improved text from the response
    const improvedText = response.choices[0].message.content;
    if (!improvedText) {
      throw new Error("No content returned from OpenAI");
    }

    return improvedText;
  } catch (error) {
    console.error("Error improving application text with OpenAI:", error);
    throw error;
  }
}

async function improveApplicationTextGemini(grant: Grant, applicationText: string, userProfile: any): Promise<string> {
  try {
    if (!genAI) {
      throw new Error("Gemini API not initialized");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    As an AI-powered grant writing assistant, help improve the following grant application text. 
    
    GRANT DETAILS:
    Title: ${grant.title}
    Description: ${grant.description}
    Type: ${grant.type}
    Category: ${grant.category || 'General'}
    Funding Amount: ${grant.fundingAmount || 'Varies'}
    Eligibility Criteria: ${grant.eligibilityCriteria ? grant.eligibilityCriteria.join(", ") : 'Not specified'}
    
    BUSINESS PROFILE:
    Business Name: ${userProfile.businessName || 'Not specified'}
    Business Type: ${userProfile.businessType || 'Not specified'}
    Description: ${userProfile.businessDescription || 'Not specified'}
    Industry: ${userProfile.industry || 'Not specified'}
    Province: ${userProfile.province || 'Not specified'}
    Size: ${userProfile.employeeCount || 'Not specified'} employees
    Founded: ${userProfile.yearFounded || 'Not specified'}
    
    APPLICATION TEXT TO IMPROVE:
    ${applicationText}
    
    Please improve this application text by:
    1. Enhancing clarity and language
    2. Aligning it more closely with the grant's eligibility criteria
    3. Adding specificity about how the business meets the grant requirements
    4. Strengthening the case for why this business should receive funding
    5. Ensuring appropriate tone and formality
    
    Return only the improved application text without any additional commentary, introductions, or explanations.
    `;

    const result = await model.generateContent(prompt);
    const improvedText = result.response.text();

    return improvedText;
  } catch (error) {
    console.error("Error improving application text with Gemini:", error);
    throw error;
  }
}

export async function handleAssistEndpoint(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = req.user as User;
    const { grantId, applicationText } = req.body;

    if (!grantId || !applicationText) {
      return res.status(400).json({ error: "Grant ID and application text are required" });
    }

    // Get the grant details
    const grant = await storage.getGrantById(parseInt(grantId, 10));
    if (!grant) {
      return res.status(404).json({ error: "Grant not found" });
    }

    // Try with Gemini first (our preferred provider)
    try {
      const improvedText = await improveApplicationTextGemini(grant, applicationText, user);
      return res.status(200).json({ 
        originalText: applicationText,
        improvedText: improvedText 
      });
    } catch (geminiError) {
      console.log("Falling back to OpenAI due to Gemini error:", geminiError);
      
      // Fall back to OpenAI if Gemini fails
      try {
        const improvedText = await improveApplicationTextOpenAI(grant, applicationText, user);
        return res.status(200).json({ 
          originalText: applicationText,
          improvedText: improvedText 
        });
      } catch (openaiError) {
        console.error("Both AI providers failed:", openaiError);
        
        // If both fail, return a friendly error message
        return res.status(500).json({ 
          error: "Failed to improve application text", 
          errorMessage: "Our AI services are currently unavailable. Please try again later." 
        });
      }
    }
  } catch (error) {
    console.error("Error in assist endpoint:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      errorMessage: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}