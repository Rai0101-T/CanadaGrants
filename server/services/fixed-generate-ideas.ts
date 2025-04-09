import { Request, Response } from "express";
import { storage } from "../storage";
import { generateIdeas } from "./gemini-service";
import { OpenAI } from "openai";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Fixed handler for the /grantscribe/generate-ideas endpoint
export async function handleGenerateIdeasEndpoint(req: Request, res: Response) {
  try {
    const { grantId } = req.body;
    
    if (!grantId) {
      return res.status(400).json({ message: "Grant ID is required" });
    }
    
    // Get the grant details
    const grant = await storage.getGrantById(grantId);
    if (!grant) {
      return res.status(404).json({ message: "Grant not found" });
    }
    
    // Get user business profile
    const userId = (req.user as any).id;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const userBusinessInfo = {
      businessName: user.businessName || 'your business',
      businessType: user.businessType || '',
      industry: user.industry || '',
      businessDescription: user.businessDescription || '',
      province: user.province || '',
      employeeCount: user.employeeCount || '',
      yearFounded: user.yearFounded || ''
    };
    
    try {
      // First try to use Gemini for idea generation
      const result = await generateIdeas(grant, userBusinessInfo);
      
      return res.json({
        ideas: result.ideas,
        explanation: result.explanation,
        grant: grant
      });
    } catch (geminiError) {
      console.warn("Gemini API error for idea generation, trying OpenAI as fallback:", geminiError);
      
      try {
        // Use OpenAI as fallback
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
          messages: [
            {
              role: "system",
              content: `You are GrantScribe, an expert at generating strategic ideas for grant applications. For the provided grant and business profile, generate 3-5 innovative project ideas that would be excellent candidates for this grant opportunity. Your ideas should be specific, practical, and tailored to maximize alignment with the grant's focus and the business's strengths.`
            },
            {
              role: "user",
              content: `Generate strategic ideas for a grant application based on the following:
              
              GRANT DETAILS:
              Title: ${grant.title}
              Description: ${grant.description}
              Type: ${grant.type}
              Funding provider: ${grant.fundingProvider || grant.provider || 'Various agencies'}
              Amount: ${grant.amount || grant.fundingAmount || 'Varies'}
              
              BUSINESS PROFILE:
              Business Name: ${userBusinessInfo.businessName}
              Business Type: ${userBusinessInfo.businessType}
              Industry: ${userBusinessInfo.industry}
              Description: ${userBusinessInfo.businessDescription}
              Province: ${userBusinessInfo.province}
              Employee Count: ${userBusinessInfo.employeeCount}
              Year Founded: ${userBusinessInfo.yearFounded}
              
              Please provide:
              1. 3-5 specific and innovative project ideas that would be strong candidates for this grant
              2. A brief explanation for each idea highlighting why it's suitable
              3. How each idea aligns with both the grant's objectives and the business's strengths
              
              Format your response as a JSON object with two keys:
              - "ideas": an array of strings with each project idea (3-5 ideas)
              - "explanation": a detailed explanation of the strategic thinking behind these ideas`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: "json_object" }
        });
        
        const content = response.choices[0].message.content || "{}";
        const parsed = JSON.parse(content);
        
        return res.json({
          ...parsed,
          grant: grant
        });
      } catch (openaiError) {
        console.warn("OpenAI API error after Gemini failure, using fallback mechanism:", openaiError);
        
        // Basic fallback when both AI services fail
        // Generate simple grant ideas based on business profile and grant details
        
        // Prepare standard ideas based on grant and business types
        const ideas = [
          `Develop a new ${userBusinessInfo.industry || 'business'} solution that addresses ${grant.type === 'federal' ? 'national' : grant.type === 'provincial' ? 'provincial' : 'local'} priorities in ${userBusinessInfo.province || 'your region'}.`,
          `Launch an initiative to improve operational efficiency and sustainability within your ${userBusinessInfo.businessType || 'business'}, resulting in cost savings and environmental benefits.`,
          `Implement a training and development program to upskill your ${userBusinessInfo.employeeCount || ''} employees, leading to improved productivity and innovation capabilities.`,
          `Create a digital transformation project to modernize your ${userBusinessInfo.businessName || 'business'} operations and enhance your market competitiveness.`,
          `Establish a research partnership with a local institution to develop new ${userBusinessInfo.industry || 'industry'} technologies or methodologies that can be commercialized.`
        ];
        
        // Create explanation based on available information
        let explanation = "Based on your business profile and the selected grant, we've identified several strategic directions that could form the basis of a strong application. ";
        
        if (userBusinessInfo.industry) {
          explanation += `As a business in the ${userBusinessInfo.industry} industry, you have unique opportunities to leverage funding for industry-specific innovations. `;
        }
        
        if (userBusinessInfo.province) {
          explanation += `Your location in ${userBusinessInfo.province} may qualify you for region-specific funding priorities. `;
        }
        
        if (grant.eligibilityCriteria && Array.isArray(grant.eligibilityCriteria) && grant.eligibilityCriteria.length > 0) {
          explanation += "The ideas suggested align with the grant's eligibility criteria and focus areas. ";
        }
        
        explanation += "These ideas represent starting points that you can refine and develop based on your specific business goals and the grant's detailed requirements. Consider selecting the idea that best matches your current strategic priorities and where you can demonstrate the strongest potential impact.";
        
        return res.json({
          ideas: ideas,
          explanation: explanation,
          grant: grant,
          note: "These are fallback suggestions. For more tailored ideas, please try again later when our AI services are available."
        });
      }
    }
  } catch (error) {
    console.error("Error in generate ideas endpoint:", error);
    return res.status(500).json({ message: "Failed to generate ideas" });
  }
}