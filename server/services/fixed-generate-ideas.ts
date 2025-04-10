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

// Function to generate fallback ideas when AI services are unavailable
function generateFallbackIdeas(grant: Grant, user: User): string[] {
  // Industry-specific ideas
  const industryIdeas: Record<string, string[]> = {
    "Technology": [
      "Digital Transformation Initiative: Implement new technologies to streamline operations and improve customer experience. This aligns with innovation priorities in technology grants and would position your business for improved efficiency and market competitiveness.",
      "Cybersecurity Enhancement Program: Upgrade security infrastructure to protect customer data and ensure compliance with privacy regulations. This addresses a critical need for businesses and can open new service offerings while protecting your existing customer base.",
      "AI-Powered Customer Insights Platform: Develop a data analytics solution to better understand customer behavior and preferences. This project leverages cutting-edge technology to provide actionable insights, potentially increasing customer retention and sales conversion rates."
    ],
    "Manufacturing": [
      "Sustainable Production Modernization: Upgrade manufacturing processes to reduce waste and energy consumption. This project aligns with environmental priorities in manufacturing grants and could significantly reduce operational costs while improving your sustainability credentials.",
      "Supply Chain Optimization System: Implement digital tracking and management of materials from sourcing to delivery. This initiative would improve efficiency, reduce costs, and increase resilience to supply chain disruptions.",
      "Advanced Automation Implementation: Integrate robotics and automated systems into production lines to increase output and precision. This would position your business at the forefront of manufacturing innovation while potentially reducing labor costs and improving product quality."
    ],
    "Healthcare": [
      "Telehealth Expansion Project: Develop infrastructure for remote healthcare delivery to underserved communities. This addresses healthcare accessibility challenges while opening new markets for your services.",
      "Patient Management System Upgrade: Implement AI-driven analytics to improve patient outcomes and operational efficiency. This project combines technology innovation with healthcare delivery improvement.",
      "Medical Training Simulation Platform: Create virtual reality training modules for healthcare professionals. This innovative approach to medical education could become a valuable product offering while addressing skills gaps in the healthcare sector."
    ],
    "Retail": [
      "Omnichannel Customer Experience Enhancement: Integrate online and offline shopping experiences with seamless transitions. This project addresses the evolving retail landscape and could significantly improve customer satisfaction and sales.",
      "Sustainable Packaging Initiative: Develop eco-friendly packaging solutions to reduce environmental impact. This aligns with sustainability priorities in many grants and responds to growing consumer demand for environmentally responsible businesses.",
      "Local Supply Chain Development: Establish partnerships with local suppliers to create resilient, community-based sourcing. This project supports local economic development while potentially reducing logistics costs and supply chain vulnerabilities."
    ],
    "Agriculture": [
      "Precision Farming Implementation: Utilize IoT sensors and data analytics to optimize crop yields and resource usage. This technology-driven approach could dramatically improve productivity while reducing environmental impact.",
      "Farm-to-Table Distribution Network: Develop direct marketing channels between your farm and local consumers or restaurants. This project could increase margins while supporting the local food economy.",
      "Sustainable Agriculture Certification Program: Implement practices to achieve recognized sustainability certifications. This initiative could open premium markets while improving long-term land viability."
    ]
  };

  // Provincial/regional focus ideas
  const regionalIdeas: Record<string, string[]> = {
    "Ontario": [
      "Ontario Innovation Ecosystem Integration: Partner with local research institutions to commercialize emerging technologies. This leverages Ontario's strong innovation network and could provide access to additional resources and expertise.",
      "Great Lakes Market Expansion: Develop strategies to capture cross-border business opportunities in the Great Lakes region. This geographical advantage could significantly expand your market reach.",
      "Ontario Green Business Transformation: Implement sustainable practices aligned with provincial environmental priorities. This positions your business favorably for government contracts and environmentally conscious consumers."
    ],
    "British Columbia": [
      "Pacific Rim Export Development: Create strategies to access Asian markets through BC's strategic location. This leverages BC's position as Canada's gateway to Asia and could significantly expand your international market presence.",
      "Sustainable Tourism Initiative: Develop eco-tourism offerings that showcase BC's natural beauty responsibly. This aligns with provincial priorities while tapping into the growing market for sustainable travel experiences.",
      "Clean Tech Adoption Project: Implement environmentally sustainable technologies aligned with BC's green policies. This positions your business favorably with provincial procurement and environmentally conscious consumers."
    ],
    "Quebec": [
      "French Market Export Program: Develop strategies to leverage Quebec's linguistic advantage in French-speaking markets. This unique positioning could open significant international opportunities.",
      "Cultural Industries Innovation: Create products or services that showcase Quebec's distinctive cultural identity. This taps into strong provincial support for cultural industries and tourism.",
      "Quebec-European Trade Partnership: Establish business relationships leveraging the Quebec-EU special relationship. This could provide preferential access to European markets through existing agreements."
    ],
    "Alberta": [
      "Energy Sector Diversification Initiative: Develop new services or technologies for Alberta's evolving energy landscape. This addresses provincial priorities for economic diversification while leveraging existing expertise.",
      "Agricultural Technology Advancement: Implement innovations to improve productivity in Alberta's significant agricultural sector. This combines technology with a traditional provincial strength.",
      "Tourism Experience Development: Create distinctive offerings that showcase Alberta's natural attractions. This taps into provincial efforts to diversify beyond traditional resource industries."
    ]
  };

  // Grant type ideas
  const grantTypeIdeas: Record<string, string[]> = {
    "federal": [
      "National Market Expansion Strategy: Develop infrastructure to serve customers across multiple Canadian provinces. This initiative aligns with federal priorities for national economic development.",
      "Cross-Provincial Supply Chain Development: Establish relationships with suppliers across Canada to create a truly national business ecosystem. This project supports national economic integration while potentially reducing costs.",
      "Official Languages Business Integration: Implement bilingual capabilities to serve both English and French-speaking Canadians. This addresses federal language priorities while expanding your market reach."
    ],
    "provincial": [
      "Local Economic Development Initiative: Create jobs and growth specifically targeted to provincial priorities. This direct alignment with provincial economic development goals increases funding compatibility.",
      "Provincial Industry Specialization: Develop expertise in sectors specifically prioritized by your province. This strategic focus demonstrates strong alignment with provincial economic planning.",
      "Regional Supply Chain Integration: Establish stronger connections with other businesses in your province. This strengthens the local economy while potentially creating more stable business relationships."
    ],
    "private": [
      "Corporate Social Responsibility Partnership: Develop initiatives that align with the funding organization's CSR priorities. This demonstrates shared values which is often crucial for private grant approval.",
      "Market Expansion Through Innovation: Create new products or services with strong commercial potential. Private funders often prioritize initiatives with clear paths to market success.",
      "Industry Problem-Solving Initiative: Address specific challenges faced by your sector that align with the funder's interests. This practical approach often appeals to industry-specific private grants."
    ]
  };

  // Default ideas if no specific matches
  const defaultIdeas = [
    "Digital Transformation Project: Implement new technologies to improve efficiency and competitiveness. This modernization initiative would position your business for sustainable growth while addressing evolving customer expectations.",
    "Sustainable Business Practices Implementation: Reduce environmental impact through operational changes. This strategy could both reduce costs and appeal to increasingly environmentally conscious consumers.",
    "Market Expansion Strategy: Develop infrastructure and marketing to reach new customer segments. This growth-oriented approach could diversify your revenue streams while reducing dependency on existing markets.",
    "Workforce Development Program: Create training initiatives to enhance employee skills and productivity. This investment in human capital addresses workforce challenges while potentially increasing operational excellence.",
    "Product/Service Innovation Initiative: Develop new offerings based on identified market opportunities. This forward-looking approach focuses on growth through innovation, a priority for many grant programs."
  ];

  // Build a collection of relevant ideas based on the grant and user profile
  let relevantIdeas: string[] = [];

  // Add industry-specific ideas if applicable
  if (user.industry && industryIdeas[user.industry]) {
    relevantIdeas = relevantIdeas.concat(industryIdeas[user.industry]);
  }

  // Add province-specific ideas if applicable
  if (user.province && regionalIdeas[user.province]) {
    relevantIdeas = relevantIdeas.concat(regionalIdeas[user.province]);
  }

  // Add grant type ideas
  if (grant.type && grantTypeIdeas[grant.type]) {
    relevantIdeas = relevantIdeas.concat(grantTypeIdeas[grant.type]);
  }

  // If we still don't have enough ideas, add some default ones
  if (relevantIdeas.length < 3) {
    relevantIdeas = relevantIdeas.concat(defaultIdeas);
  }

  // Return 5 ideas (or fewer if not enough available)
  return relevantIdeas.slice(0, 5);
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
      console.log("Attempting to generate ideas with Gemini...");
      const ideas = await getProjectIdeasGemini(grant, user);
      console.log("Successfully generated ideas with Gemini");
      return res.status(200).json({ ideas });
    } catch (geminiError) {
      console.log("Gemini API error:", geminiError);
      
      // Only fall back to OpenAI if it's clearly not a quota issue and we have a valid API key
      if (openai && process.env.OPENAI_API_KEY) {
        try {
          console.log("Attempting to generate ideas with OpenAI...");
          const ideas = await getProjectIdeasOpenAI(grant, user);
          console.log("Successfully generated ideas with OpenAI");
          return res.status(200).json({ ideas });
        } catch (openaiError) {
          console.error("OpenAI API error:", openaiError);
        }
      } else {
        console.log("Skipping OpenAI fallback - API key missing or previous quota issues detected");
      }
      
      // If both services fail or OpenAI is skipped, return a set of fallback ideas based on grant type
      console.log("All AI services failed, providing fallback ideas based on grant type");
      
      // Generate fallback ideas based on the grant and user information
      const fallbackIdeas = generateFallbackIdeas(grant, user);
      return res.status(200).json({ 
        ideas: fallbackIdeas,
        source: "fallback"  // Indicate these are fallback ideas, frontend can show a note
      });
    }
  } catch (error) {
    console.error("Error in generate ideas endpoint:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      errorMessage: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}