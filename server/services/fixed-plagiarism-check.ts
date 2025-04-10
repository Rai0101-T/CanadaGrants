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

async function checkPlagiarismOpenAI(applicationText: string): Promise<{
  originalityScore: number;
  analysis: string;
  suggestions: string[];
}> {
  try {
    if (!openai) {
      throw new Error("OpenAI API not initialized");
    }

    const prompt = `
    As an AI-powered grant writing assistant, analyze the following application text for potential plagiarism or unoriginal content.

    APPLICATION TEXT:
    ${applicationText}
    
    Please provide:
    1. An originality score from 0-100 (where 100 is completely original)
    2. A brief analysis highlighting any concerning sections that may need revision
    3. 3-5 specific suggestions for making the content more original if needed
    
    Format your response as a JSON object with the following structure:
    {
      "originalityScore": number,
      "analysis": "string",
      "suggestions": ["string", "string", ...]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are GrantScribe, an expert grant writing assistant specializing in Canadian funding opportunities. You help check text for potential plagiarism and unoriginality." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    // Extract the analysis from the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const result = JSON.parse(content);
    return {
      originalityScore: result.originalityScore,
      analysis: result.analysis,
      suggestions: result.suggestions
    };
  } catch (error) {
    console.error("Error checking plagiarism with OpenAI:", error);
    throw error;
  }
}

async function checkPlagiarismGemini(applicationText: string): Promise<{
  originalityScore: number;
  analysis: string;
  suggestions: string[];
}> {
  try {
    if (!genAI) {
      throw new Error("Gemini API not initialized");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    As an AI-powered grant writing assistant, analyze the following application text for potential plagiarism or unoriginal content.

    APPLICATION TEXT:
    ${applicationText}
    
    Please provide:
    1. An originality score from 0-100 (where 100 is completely original)
    2. A brief analysis highlighting any concerning sections that may need revision
    3. 3-5 specific suggestions for making the content more original if needed
    
    Format your response as a JSON object with the following structure:
    {
      "originalityScore": number,
      "analysis": "string",
      "suggestions": ["string", "string", ...]
    }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      // Attempt to parse the response as JSON
      const jsonResult = JSON.parse(text);
      return {
        originalityScore: jsonResult.originalityScore,
        analysis: jsonResult.analysis,
        suggestions: jsonResult.suggestions
      };
    } catch (jsonError) {
      // If the response isn't valid JSON, attempt to extract information manually
      console.error("Failed to parse Gemini response as JSON, attempting manual extraction:", jsonError);
      
      // Try to extract the response from a code block if present
      let cleanedText = text;
      const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]+?\})\s*```/);
      if (codeBlockMatch) {
        try {
          const jsonResult = JSON.parse(codeBlockMatch[1]);
          return {
            originalityScore: jsonResult.originalityScore,
            analysis: jsonResult.analysis,
            suggestions: jsonResult.suggestions.map((s: string) => s.replace(/\\/g, ''))
          };
        } catch (e) {
          console.error("Failed to parse JSON from code block:", e);
          cleanedText = codeBlockMatch[1]; // Use the code block content for extraction
        }
      }
      
      // Fallback extraction logic
      const scoreMatch = cleanedText.match(/originalityScore["\s:]+(\d+)/);
      const analysisMatch = cleanedText.match(/analysis["\s:]+["'](.+?)["']/s);
      const suggestionsMatch = cleanedText.match(/suggestions["\s:]+\[(.+?)\]/s);
      
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 75;
      const analysis = analysisMatch 
        ? analysisMatch[1].replace(/\\/g, '') 
        : "Unable to perform detailed analysis. The text appears to be generally original, but consider reviewing for common phrasings.";
      
      let suggestions: string[] = [];
      if (suggestionsMatch) {
        const suggestionsText = suggestionsMatch[1];
        suggestions = suggestionsText
          .split(/,(?=["'])/)
          .map(s => s.trim().replace(/^["']|["']$/g, '').replace(/\\/g, ''))
          .filter(s => s.length > 0);
      }
      
      // Extract any bullet point list that might contain suggestions
      if (suggestions.length === 0 && text.includes('*')) {
        const bulletPoints = text.match(/\*\s+([^*\n]+)/g);
        if (bulletPoints) {
          suggestions = bulletPoints.map(point => point.replace(/^\*\s+/, '').replace(/\\/g, ''));
        }
      }
      
      if (suggestions.length === 0) {
        suggestions = [
          "Review your text for generic phrases and replace with more specific language",
          "Add more details unique to your business and project",
          "Use industry-specific terminology that shows your expertise"
        ];
      }
      
      return {
        originalityScore: score,
        analysis,
        suggestions
      };
    }
  } catch (error) {
    console.error("Error checking plagiarism with Gemini:", error);
    throw error;
  }
}

export async function handlePlagiarismCheckEndpoint(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
    
    const applicationText = text; // Use the text parameter from the client

    // Try with Gemini first (our preferred provider)
    try {
      const plagiarismResult = await checkPlagiarismGemini(applicationText);
      return res.status(200).json(plagiarismResult);
    } catch (geminiError) {
      console.log("Falling back to OpenAI due to Gemini error:", geminiError);
      
      // Fall back to OpenAI if Gemini fails
      try {
        const plagiarismResult = await checkPlagiarismOpenAI(applicationText);
        return res.status(200).json(plagiarismResult);
      } catch (openaiError) {
        console.error("Both AI providers failed:", openaiError);
        
        // If both fail, return fallback analysis
        return res.status(200).json({
          originalityScore: 75, // Default moderate score
          analysis: "We're currently unable to perform a detailed analysis. As a precaution, please review your text to ensure it's original and specific to your application.",
          suggestions: [
            "Review your text for generic phrases and replace with more specific language.",
            "Add more details unique to your business and project.",
            "Use industry-specific terminology that shows your expertise.",
            "Cite any external sources or references.",
            "Ensure descriptions of your business and plans are authentic."
          ]
        });
      }
    }
  } catch (error) {
    console.error("Error in plagiarism check endpoint:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      errorMessage: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}