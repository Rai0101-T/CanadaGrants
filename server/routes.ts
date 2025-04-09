import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserGrantSchema, InsertGrant, User } from "@shared/schema";
import OpenAI from "openai";
import { setupAuth } from "./auth";
import puppeteer from "puppeteer";
import { 
  runAllScrapers, 
  scheduleScrapingJob, 
  processGrants, 
  saveGrantsToDatabase,
  ScrapedGrant
} from "./scrapers/scraper";
import { 
  scrapeAlbertaInnovates, 
  scrapeInnovationCanada,
  scrapeTradeCommissioner,
  scrapeFuturpreneur,
  scrapeWomenEntrepreneurship,
  scrapeLaunchOnline,
  scrapeAlbertaHealth
} from './scrapers/site-scrapers';
import { scrapeTradeFundingPrograms } from './scrapers/trade-commissioner-scraper';
import { calculateGrantCompatibility } from "./services/compatibility-service";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  // API routes
  const apiRouter = express.Router();
  
  // Get all grants
  apiRouter.get("/grants", async (req: Request, res: Response) => {
    try {
      const grants = await storage.getAllGrants();
      res.json(grants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grants" });
    }
  });

  // Get featured grants
  apiRouter.get("/grants/featured", async (req: Request, res: Response) => {
    try {
      const grants = await storage.getFeaturedGrants();
      res.json(grants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured grants" });
    }
  });

  // Get grant by ID
  apiRouter.get("/grants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid grant ID" });
      }
      
      const grant = await storage.getGrantById(id);
      if (!grant) {
        return res.status(404).json({ message: "Grant not found" });
      }
      
      res.json(grant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grant" });
    }
  });

  // Get grants by type (federal, provincial, or private)
  apiRouter.get("/grants/type/:type", async (req: Request, res: Response) => {
    try {
      const type = req.params.type;
      if (type !== "federal" && type !== "provincial" && type !== "private") {
        return res.status(400).json({ message: "Invalid grant type. Must be 'federal', 'provincial', or 'private'" });
      }
      
      const grants = await storage.getGrantsByType(type);
      res.json(grants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grants by type" });
    }
  });

  // Search grants
  apiRouter.get("/grants/search/:query", async (req: Request, res: Response) => {
    try {
      const query = req.params.query;
      if (!query || query.length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters" });
      }
      
      const grants = await storage.searchGrants(query);
      res.json(grants);
    } catch (error) {
      res.status(500).json({ message: "Failed to search grants" });
    }
  });

  // Authentication middleware
  function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Authentication required" });
  }
  
  // Update user profile
  apiRouter.post("/user/update", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id; // Type assertion with ! since isAuthenticated ensures user exists
      const userData = req.body;
      
      // Update the user data
      const updatedUser = await storage.updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update the session user object
      req.login(updatedUser, (err) => {
        if (err) return res.status(500).json({ message: "Failed to update session" });
        res.status(200).json(updatedUser);
      });
    } catch (error) {
      console.error("User update error:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Get user's saved grants (My List)
  apiRouter.get("/mylist/:userId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const grants = await storage.getUserGrants(userId);
      res.json(grants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user's grants" });
    }
  });

  // Add grant to user's list
  apiRouter.post("/mylist", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const result = insertUserGrantSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.format() });
      }
      
      // Check if user exists
      const user = await storage.getUser(result.data.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if grant exists
      const grant = await storage.getGrantById(result.data.grantId);
      if (!grant) {
        return res.status(404).json({ message: "Grant not found" });
      }
      
      // Check if grant is already in user's list
      const isInList = await storage.isGrantInUserList(result.data.userId, result.data.grantId);
      if (isInList) {
        return res.status(409).json({ message: "Grant already in user's list" });
      }
      
      const userGrant = await storage.addGrantToUserList(result.data);
      res.status(201).json(userGrant);
    } catch (error) {
      res.status(500).json({ message: "Failed to add grant to user's list" });
    }
  });

  // Remove grant from user's list
  apiRouter.delete("/mylist/:userId/:grantId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const grantId = parseInt(req.params.grantId);
      
      if (isNaN(userId) || isNaN(grantId)) {
        return res.status(400).json({ message: "Invalid user or grant ID" });
      }
      
      const result = await storage.removeGrantFromUserList(userId, grantId);
      
      if (!result) {
        return res.status(404).json({ message: "Grant not found in user's list" });
      }
      
      res.status(200).json({ message: "Grant removed from user's list" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove grant from user's list" });
    }
  });

  // Check if grant is in user's list
  apiRouter.get("/mylist/:userId/:grantId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const grantId = parseInt(req.params.grantId);
      
      if (isNaN(userId) || isNaN(grantId)) {
        return res.status(400).json({ message: "Invalid user or grant ID" });
      }
      
      const isInList = await storage.isGrantInUserList(userId, grantId);
      
      res.status(200).json({ isInList });
    } catch (error) {
      res.status(500).json({ message: "Failed to check grant status" });
    }
  });

  // Get compatibility score between a user's business profile and a grant
  apiRouter.post("/grants/compatibility/:grantId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const grantId = parseInt(req.params.grantId);
      if (isNaN(grantId)) {
        return res.status(400).json({ message: "Invalid grant ID" });
      }
      
      // Get the grant and user
      const grant = await storage.getGrantById(grantId);
      if (!grant) {
        return res.status(404).json({ message: "Grant not found" });
      }
      
      // Get the authenticated user
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Calculate compatibility score
      const compatibilityResult = await calculateGrantCompatibility(user, grant);
      
      res.json({
        grant,
        compatibility: compatibilityResult
      });
    } catch (error) {
      console.error("Compatibility calculation error:", error);
      res.status(500).json({ message: "Failed to calculate compatibility score" });
    }
  });

  // Get grant recommendations based on business description
  apiRouter.post("/grants/recommend", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { businessDescription } = req.body;
      
      if (!businessDescription || businessDescription.trim() === "") {
        return res.status(400).json({ message: "Business description is required" });
      }
      
      // Get all grants to analyze
      const allGrants = await storage.getAllGrants();
      
      // Try to use OpenAI for recommendations
      try {
        // Create a context with the grant information
        const grantsContext = allGrants.map(grant => {
          return `
            Grant ID: ${grant.id}
            Title: ${grant.title}
            Type: ${grant.type}
            Description: ${grant.description}
            Industry: ${grant.industry || "Any"}
            Category: ${grant.category}
            Eligibility: ${grant.eligibilityCriteria ? grant.eligibilityCriteria.join(", ") : "No specific criteria"}
          `;
        }).join("\n\n");
        
        // Create system message with instructions
        const systemMessage = `
          You are a grant recommendation system for Canadian businesses.
          Based on the business description, analyze which grants would be most suitable.
          Consider industry alignment, eligibility criteria, and business needs.
          Provide a relevance score from 1-100 for each grant recommended, where 100 is a perfect match.
          
          Here is information about available grants:
          ${grantsContext}
        `;
        
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: `Business Description: ${businessDescription}
            
            Please recommend the top 5 most relevant grants for this business with a relevance score (1-100).
            Return the response in the following JSON format:
            {
              "recommendations": [
                { "grantId": number, "relevanceScore": number, "reason": "string" },
                ...
              ]
            }` }
          ],
          temperature: 0.5,
          response_format: { type: "json_object" }
        });
        
        // Parse the JSON response
        const content = response.choices[0].message.content;
        const assistantResponse = content ? JSON.parse(content) : { recommendations: [] };
        
        // Get the full grant details for the recommended grants
        const recommendedGrantIds = assistantResponse.recommendations.map((rec: { grantId: number }) => rec.grantId);
        const recommendedGrants = await Promise.all(
          recommendedGrantIds.map(async (id: number) => {
            const grant = await storage.getGrantById(Number(id));
            const recommendation = assistantResponse.recommendations.find((rec: { grantId: number }) => rec.grantId === id);
            if (!grant) return null;
            return {
              ...grant,
              relevanceScore: recommendation.relevanceScore,
              reason: recommendation.reason
            };
          })
        ).then(grants => grants.filter(Boolean)); // Filter out null values
        
        res.json({ recommendations: recommendedGrants });
      } catch (aiError) {
        // If OpenAI API fails, use a fallback recommendation engine
        console.warn("OpenAI API error, using fallback recommendation engine:", aiError);
        
        // Parse business description for keywords
        const keywords = businessDescription.toLowerCase().split(/\s+/);
        const relevantIndustries: string[] = [];
        
        // Common industry keywords mapping
        const industryKeywordMap: Record<string, string[]> = {
          "technology": ["software", "tech", "digital", "computer", "it", "programming", "development", "app"],
          "healthcare": ["health", "medical", "care", "clinic", "patient", "doctor", "hospital", "wellness"],
          "manufacturing": ["manufacturing", "factory", "production", "industrial", "assembly", "fabrication"],
          "retail": ["retail", "store", "shop", "merchandise", "ecommerce", "customer", "product", "selling"],
          "agriculture": ["farm", "agriculture", "crop", "livestock", "organic", "agricultural", "farming"],
          "construction": ["construction", "building", "contractor", "renovation", "property", "infrastructure"],
          "education": ["education", "school", "training", "learning", "teach", "student", "course", "tutoring"],
          "food": ["food", "restaurant", "catering", "culinary", "chef", "kitchen", "meal", "bakery"],
          "arts": ["art", "design", "creative", "culture", "music", "film", "entertainment", "artist"],
          "clean tech": ["green", "energy", "environmental", "sustainable", "clean", "renewable", "eco", "climate"],
          "social": ["social", "nonprofit", "community", "charity", "service", "help", "support", "assistance"],
          "research": ["research", "innovation", "development", "science", "scientific", "lab", "experiment", "study"],
          "tourism": ["tourism", "travel", "hospitality", "hotel", "visitor", "destination", "experience", "tourist"]
        };
        
        // Detect relevant industries based on keywords
        for (const [industry, industryKeywords] of Object.entries(industryKeywordMap)) {
          for (const keyword of industryKeywords) {
            if (businessDescription.toLowerCase().includes(keyword)) {
              // Add only if not already in the array to avoid duplicates
              if (!relevantIndustries.includes(industry)) {
                relevantIndustries.push(industry);
              }
              break;
            }
          }
        }
        
        // Get all matching grants based on industries
        const matchingGrants = allGrants.filter(grant => {
          if (!grant.industry && !grant.category) return false;
          
          const grantIndustry = (grant.industry || '').toLowerCase();
          const grantCategory = (grant.category || '').toLowerCase();
          
          // Check if any of the detected industries match the grant
          for (const industry of relevantIndustries) {
            if (grantIndustry.includes(industry) || grantCategory.includes(industry)) {
              return true;
            }
          }
          
          // If no specific industry matches were found, look for keyword matches
          for (const keyword of keywords) {
            if (keyword.length < 4) continue; // Skip short words
            
            if (
              grantIndustry.includes(keyword) || 
              grantCategory.includes(keyword) || 
              (grant.description && grant.description.toLowerCase().includes(keyword))
            ) {
              return true;
            }
          }
          
          return false;
        });
        
        // Sort by relevance (first by exact industry matches, then by type)
        // Prioritize federal and provincial grants over private ones
        const scoredGrants = matchingGrants.map(grant => {
          let score = 70; // Base score
          
          // Adjust score based on type
          if (grant.type === "federal") score += 15;
          else if (grant.type === "provincial") score += 10;
          
          // Boost score for exact industry matches
          const grantIndustry = (grant.industry || '').toLowerCase();
          for (const industry of relevantIndustries) {
            if (grantIndustry === industry) {
              score += 15;
              break;
            } else if (grantIndustry.includes(industry)) {
              score += 10;
              break;
            }
          }
          
          // Cap at 100
          score = Math.min(score, 100);
          
          return {
            ...grant,
            relevanceScore: score,
            reason: `This ${grant.type} grant appears to align with your business description.`
          };
        });
        
        // Sort by score (descending) and get top 5
        scoredGrants.sort((a, b) => b.relevanceScore - a.relevanceScore);
        const recommendations = scoredGrants.slice(0, 5);
        
        res.json({ 
          recommendations,
          notice: "Using simplified recommendation engine due to AI service limitations."
        });
      }
    } catch (error) {
      console.error("Grant recommendation error:", error);
      res.status(500).json({ message: "Failed to get grant recommendations", error: (error as Error).message });
    }
  });
  
  // GrantScribe endpoints
  
  // Generate application assistance
  apiRouter.post("/grantscribe/assist", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { grantId, applicationText } = req.body;
      
      if (!grantId || !applicationText) {
        return res.status(400).json({ message: "Grant ID and application text are required" });
      }
      
      // Get grant details to provide context
      const grant = await storage.getGrantById(parseInt(grantId));
      if (!grant) {
        return res.status(404).json({ message: "Grant not found" });
      }
      
      // Get user business information to provide personalized feedback
      const user = req.user as User;
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
        // Use OpenAI to analyze and improve the application
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: `You are GrantScribe, an expert grant application consultant specializing in Canadian grants. 
                      You provide constructive feedback and improvements to grant applications to help them succeed.
                      Analyze the application text for the ${grant.title} grant and provide detailed, actionable advice.
                      Tailor your feedback to make the application more relevant to the applicant's business profile.`
            },
            {
              role: "user",
              content: `Grant details:
                      Title: ${grant.title}
                      Description: ${grant.description}
                      Type: ${grant.type}
                      
                      My Business Profile:
                      Business Name: ${userBusinessInfo.businessName}
                      Business Type: ${userBusinessInfo.businessType}
                      Industry: ${userBusinessInfo.industry}
                      Description: ${userBusinessInfo.businessDescription}
                      Province: ${userBusinessInfo.province}
                      Employee Count: ${userBusinessInfo.employeeCount}
                      Year Founded: ${userBusinessInfo.yearFounded}
                      
                      My draft application:
                      ${applicationText}
                      
                      Please analyze my application and provide:
                      1. Overall assessment
                      2. Specific strengths
                      3. Areas for improvement
                      4. Suggested edits and rewording (with specific examples)
                      5. Additional points to consider including based on my business profile`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        });
        
        res.json({
          feedback: response.choices[0].message.content,
          grant: grant
        });
      } catch (aiError) {
        // Fallback mechanism for when OpenAI API fails
        console.warn("OpenAI API error for grant assistance, using fallback:", aiError);
        
        // Generate basic feedback based on application text and user business info
        const wordCount = applicationText.split(/\s+/).length;
        const paragraphCount = applicationText.split(/\n\s*\n/).length;
        const sentenceCount = applicationText.split(/[.!?]+\s/).length;
        
        // Basic assessment
        let assessment = "Your application has a good foundation and addresses some key points.";
        if (wordCount < 200) {
          assessment = "Your application is quite brief and could benefit from more detail and elaboration, particularly about your specific business context.";
        } else if (wordCount > 800) {
          assessment = "Your application is quite detailed, which is good, but consider condensing some sections for clarity while maintaining your key business differentiators.";
        }
        
        // Structure assessment
        let structureAssessment = "The application has a reasonable structure with paragraphs that help organize your thoughts.";
        if (paragraphCount < 3) {
          structureAssessment = "Consider breaking your application into more paragraphs to improve readability and organization. Each major aspect of your business proposal should have its own section.";
        }
        
        const eligibilityCriteria = grant.eligibilityCriteria || [];
        const criteria = eligibilityCriteria.join(", ");
        
        // Personalized business insight
        let businessInsight = "";
        if (userBusinessInfo.industry) {
          businessInsight = `As a business in the ${userBusinessInfo.industry} industry, consider emphasizing how your project addresses specific industry challenges or opportunities.`;
        }
        if (userBusinessInfo.province) {
          businessInsight += ` Your location in ${userBusinessInfo.province} may qualify you for specific regional considerations within this grant - highlight the local economic impact.`;
        }
        if (userBusinessInfo.employeeCount) {
          businessInsight += ` With ${userBusinessInfo.employeeCount} employees, you should mention how this project will affect your workforce development or job creation.`;
        }
        
        // Generate improvement points with business context
        const improvementPoints = [
          `Highlight how your ${userBusinessInfo.businessType || 'business'} specifically meets the eligibility criteria: ${criteria}`,
          `Add quantifiable metrics that demonstrate the potential impact of your project on your ${userBusinessInfo.industry || 'industry'}`,
          "Include a clear timeline for implementation and milestones that align with your business capacity",
          `Elaborate on how your project aligns with both the grant's objectives and your business goals in ${userBusinessInfo.province || 'your region'}`,
          `Emphasize what makes your approach innovative compared to others in the ${userBusinessInfo.industry || 'industry'}`
        ];
        
        const feedback = `
# Application Assessment for ${userBusinessInfo.businessName}

## Overall Assessment
${assessment}

## Structure and Organization
${structureAssessment}

## Specific Strengths
- You've provided ${wordCount} words which helps explain your project
- Your application includes approximately ${sentenceCount} sentences, providing details about your proposal
- You've created a readable format with ${paragraphCount} paragraphs

## Business Context Analysis
${businessInsight}

## Areas for Improvement
- Ensure you explicitly address all eligibility criteria: ${criteria}
- Check if your application clearly articulates the problem, solution, and expected outcomes from your business perspective
- Review for clarity and conciseness in your explanations
- Consider more directly connecting your business experience (${userBusinessInfo.yearFounded ? 'since ' + userBusinessInfo.yearFounded : ''}) to your project's credibility

## Suggestions for Improvement
1. ${improvementPoints[0]}
2. ${improvementPoints[1]}
3. ${improvementPoints[2]}
4. ${improvementPoints[3]}
5. ${improvementPoints[4]}

**Next Steps:** Review these recommendations and update your application to reflect your business's unique position and strengths.
`;
        
        res.json({
          feedback,
          grant,
          notice: "Using basic assessment with business profile integration."
        });
      }
    } catch (error) {
      console.error("GrantScribe assistance error:", error);
      res.status(500).json({ message: "Failed to generate application assistance" });
    }
  });
  
  // Check for plagiarism
  apiRouter.post("/grantscribe/plagiarism-check", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text to check is required" });
      }
      
      // Basic plagiarism analysis that always works
      // 1. Look for stylistic inconsistencies
      const sentences: string[] = text.split(/[.!?]+\s/).filter((s: string) => s.trim().length > 0);
      const paragraphs: string[] = text.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0);
      
      // 2. Calculate average sentence length 
      const avgWordCount: number = sentences.length > 0 
        ? sentences.reduce((sum: number, sentence: string) => {
            return sum + sentence.split(/\s+/).length;
          }, 0) / Math.max(1, sentences.length)
        : 0;
      
      // 3. Check for stylistic shifts - very long vs very short sentences
      const longSentences: string[] = sentences.filter((s: string) => s.split(/\s+/).length > avgWordCount * 1.5);
      const shortSentences: string[] = sentences.filter((s: string) => s.split(/\s+/).length < avgWordCount * 0.5 && s.split(/\s+/).length > 3);
      
      // 4. Check for academic or overly formal language that might be copied
      const academicPhrases: string[] = [
        "moreover", "furthermore", "thus", "hence", "therefore", "consequently",
        "in conclusion", "in summary", "to summarize", "in regards to", "with respect to",
        "it can be concluded that", "the results demonstrate", "according to the findings"
      ];
      
      const academicMatches: string[] = academicPhrases.filter((phrase: string) => 
        text.toLowerCase().includes(phrase.toLowerCase())
      );
      
      // 5. Generate a basic score based on these heuristics
      let plagiarismScore: number = 15; // Base score - text is usually somewhat similar to other texts
      
      if (paragraphs.length > 1) {
        // Check for style consistency between paragraphs
        const styleDifferences: number[] = paragraphs.map((p: string) => {
          const pWordCount: number = p.split(/\s+/).length;
          const pSentenceCount: number = p.split(/[.!?]+\s/).filter((s: string) => s.trim().length > 0).length;
          return pWordCount / Math.max(1, pSentenceCount); // words per sentence
        });
        
        // Calculate variance in style
        let sum: number = 0;
        const mean: number = styleDifferences.reduce((a: number, b: number) => a + b, 0) / Math.max(1, styleDifferences.length);
        
        styleDifferences.forEach((val: number) => {
          sum += Math.pow(val - mean, 2);
        });
        
        const variance: number = sum / Math.max(1, styleDifferences.length);
        
        // High variance might indicate different writing styles
        if (variance > 10) {
          plagiarismScore += 20;
        }
      }
      
      // Long sentences might be copied from academic sources
      if (longSentences.length > sentences.length * 0.3) {
        plagiarismScore += 15;
      }
      
      // Frequent academic phrases might indicate copying from formal sources
      if (academicMatches.length > 3) {
        plagiarismScore += 15; 
      }
      
      // Identify potentially problematic sections
      const flaggedSections: string[] = [];
      
      // Flag exceptionally long sentences
      longSentences.forEach((sentence: string) => {
        if (sentence.split(/\s+/).length > avgWordCount * 2) {
          flaggedSections.push(sentence.trim());
        }
      });
      
      // Flag paragraphs with unusual style compared to the rest
      paragraphs.forEach((paragraph: string) => {
        // Simple detection of very formal language that seems different
        if (
          academicMatches.some((phrase: string) => paragraph.toLowerCase().includes(phrase)) &&
          paragraph.split(/\s+/).length > avgWordCount * 1.7
        ) {
          // Only add if not already added (avoid duplicate flagging)
          if (!flaggedSections.includes(paragraph.trim())) {
            flaggedSections.push(paragraph.trim());
          }
        }
      });
      
      // If no flagged sections are found, pick a couple of longer sections to review
      if (flaggedSections.length === 0 && paragraphs.length > 0) {
        // Sort paragraphs by length and take the longest ones
        const sortedParagraphs = [...paragraphs].sort((a, b) => 
          b.split(/\s+/).length - a.split(/\s+/).length
        );
        
        // Take up to 2 of the longest paragraphs
        const longestParagraphs = sortedParagraphs.slice(0, Math.min(2, sortedParagraphs.length));
        
        longestParagraphs.forEach(paragraph => {
          flaggedSections.push(paragraph.trim());
        });
      }
      
      // Cap the score at 75 since we can't definitively detect plagiarism without comparing to sources
      plagiarismScore = Math.min(75, plagiarismScore);
      
      // Ensure a minimum score to make results more useful
      plagiarismScore = Math.max(25, plagiarismScore);
      
      // Always provide specific recommendations
      const recommendations = [
        "Review flagged sections for content that may have been copied from other sources",
        "Ensure consistent writing style throughout your document",
        "Rephrase overly complex or formal language to match your natural writing style",
        "Consider adding citations for any information taken from external sources",
        "Use quotation marks for direct quotes from other sources"
      ];
      
      // Generate a clear explanation
      let explanation = `This analysis identified ${flaggedSections.length} potential areas for review.`;
      
      if (academicMatches.length > 0) {
        explanation += ` The text contains ${academicMatches.length} academic phrases `;
        if (longSentences.length > 0) {
          explanation += `and ${longSentences.length} sentences that are longer than average, `;
        }
        explanation += `which may indicate portions copied from other sources.`;
      } else if (longSentences.length > 0) {
        explanation += ` The text contains ${longSentences.length} sentences that are longer than average, which may indicate portions copied from other sources.`;
      } else {
        explanation += ` While no specific academic phrases were detected, it's always good practice to review your writing for originality.`;
      }
      
      const analysisResult = {
        plagiarismScore,
        flaggedSections: flaggedSections.slice(0, 3), // Limit to top 3 sections
        explanation,
        recommendations,
        academicPhrases: academicMatches
      };
      
      res.json(analysisResult);
    } catch (error) {
      console.error("Plagiarism check error:", error);
      res.status(500).json({ message: "Failed to perform plagiarism check" });
    }
  });
  
  // Generate ideas for grant applications
  apiRouter.post("/grantscribe/generate-ideas", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { grantId, projectType, keywords } = req.body;
      
      if (!grantId) {
        return res.status(400).json({ message: "Grant ID is required" });
      }
      
      // Get grant details
      const grant = await storage.getGrantById(parseInt(grantId));
      if (!grant) {
        return res.status(404).json({ message: "Grant not found" });
      }
      
      // Get user information to personalize ideas
      const user = req.user as User;
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
        // Use OpenAI to generate project ideas
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: `You are GrantScribe's idea generation system, specializing in Canadian grant applications.
                       You help applicants generate innovative, compelling project ideas that align with grant requirements.
                       Your suggestions should be specific, relevant to the grant's focus, and tailored to meet eligibility criteria.
                       
                       Provide your response in JSON format with the following structure:
                       {
                         "projectIdeas": [array of 5 project ideas with title and description],
                         "approachSuggestions": [array of implementation approaches],
                         "alignmentNotes": [notes on how ideas align with grant objectives],
                         "budgetConsiderations": [suggestions for budget allocation],
                         "impactMetrics": [potential ways to measure project success]
                       }`
            },
            {
              role: "user",
              content: `Generate project ideas for the following grant that are specifically tailored to my business:
                       
                       Grant: ${grant.title}
                       Description: ${grant.description}
                       Type: ${grant.type}
                       Amount: ${grant.fundingAmount}
                       
                       My Business Information:
                       Business Name: ${userBusinessInfo.businessName}
                       Business Type: ${userBusinessInfo.businessType}
                       Industry: ${userBusinessInfo.industry}
                       Description: ${userBusinessInfo.businessDescription}
                       Province: ${userBusinessInfo.province}
                       Employee Count: ${userBusinessInfo.employeeCount}
                       Year Founded: ${userBusinessInfo.yearFounded}
                       
                       ${projectType ? `Project type: ${projectType}` : ''}
                       ${keywords ? `Keywords: ${keywords}` : ''}`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.8,
          max_tokens: 1500,
        });
        
        // Get content from the response
        const content = response.choices[0].message.content;
        
        // Safely parse the JSON if content exists
        if (content) {
          const ideasResult = JSON.parse(content);
          res.json({
            grant: grant,
            ideas: ideasResult
          });
        } else {
          res.status(500).json({ message: "Failed to get response from AI service" });
        }
      } catch (aiError) {
        // Fallback mechanism for when OpenAI API fails
        console.warn("OpenAI API error for idea generation, using fallback:", aiError);
        
        // Generate basic project ideas based on grant and user business information
        const grantType = grant.type || '';
        const grantIndustry = grant.industry || '';
        const grantTitle = grant.title || '';
        const grantCategory = grant.category || '';
        const grantDescription = grant.description || '';
        const userIndustry = userBusinessInfo.industry || '';
        const businessType = userBusinessInfo.businessType || '';
        const businessDescription = userBusinessInfo.businessDescription || '';
        const businessProvince = userBusinessInfo.province || '';
        
        // Determine main focus areas from the grant and user information
        let mainFocus = '';
        if (userIndustry) {
          mainFocus = userIndustry;
        } else if (grantIndustry) {
          mainFocus = grantIndustry;
        } else if (grantCategory) {
          mainFocus = grantCategory;
        } else if (grantTitle.toLowerCase().includes('innovation')) {
          mainFocus = 'innovation';
        } else if (grantTitle.toLowerCase().includes('research')) {
          mainFocus = 'research';
        } else if (grantTitle.toLowerCase().includes('digital')) {
          mainFocus = 'digital transformation';
        } else if (grantTitle.toLowerCase().includes('green') || grantTitle.toLowerCase().includes('environmental')) {
          mainFocus = 'sustainability';
        } else {
          mainFocus = 'business improvement';
        }
        
        // Create generic project ideas based on grant type and focus
        const projectIdeas: { title: string; description: string }[] = [];
        
        if (grantType === 'federal') {
          projectIdeas.push({
            title: `${mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1)} Expansion Initiative`,
            description: `A comprehensive project to expand your ${mainFocus} capabilities with a focus on creating jobs and economic growth in your region.`
          });
          
          projectIdeas.push({
            title: `Canadian ${mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1)} Innovation Program`,
            description: `Develop new approaches or technologies that address gaps in the ${mainFocus} sector, with potential for commercialization and scaling across Canada.`
          });
          
          projectIdeas.push({
            title: `Cross-Provincial ${mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1)} Collaboration`,
            description: `Build partnerships with organizations across multiple provinces to create a nationwide approach to improving ${mainFocus} outcomes.`
          });
        } else if (grantType === 'provincial') {
          projectIdeas.push({
            title: `Regional ${mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1)} Hub Development`,
            description: `Establish a center of excellence for ${mainFocus} within your province, serving as a resource and innovation center for local organizations.`
          });
          
          projectIdeas.push({
            title: `Provincial ${mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1)} Workforce Development`,
            description: `Create a training program to build skills in ${mainFocus} for the local workforce, addressing provincial labor needs and economic goals.`
          });
          
          projectIdeas.push({
            title: `Community-Based ${mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1)} Solution`,
            description: `Implement a ${mainFocus} initiative that addresses specific needs within your local community, with clear metrics for measuring success.`
          });
        } else {
          // Private grants
          projectIdeas.push({
            title: `Corporate ${mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1)} Partnership`,
            description: `Develop a collaborative project that aligns with the funding organization's ${mainFocus} goals while delivering measurable business outcomes.`
          });
          
          projectIdeas.push({
            title: `${mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1)} Market Expansion`,
            description: `Use funding to enter new markets or develop new products related to ${mainFocus}, with clear revenue and growth projections.`
          });
          
          projectIdeas.push({
            title: `Innovative ${mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1)} Solution`,
            description: `Create a novel approach to addressing ${mainFocus} challenges that demonstrates potential for commercial success and stakeholder benefit.`
          });
        }
        
        // Add generic ideas that work for any grant type
        projectIdeas.push({
          title: `${mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1)} Research and Development Initiative`,
          description: `Conduct targeted research to develop new methodologies, technologies, or approaches in the field of ${mainFocus} that can be implemented in real-world contexts.`
        });
        
        projectIdeas.push({
          title: `Digital Transformation for ${mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1)}`,
          description: `Implement digital tools and technologies to streamline and enhance ${mainFocus} processes, improving efficiency, data collection, and outcomes.`
        });
        
        // Generate implementation approaches
        const approachSuggestions: string[] = [
          `Form a dedicated project team with clearly defined roles and responsibilities`,
          `Create a detailed project timeline with milestones and deliverables`,
          `Establish partnerships with relevant stakeholders and organizations`,
          `Develop a comprehensive monitoring and evaluation framework`,
          `Implement regular reporting and communication mechanisms`
        ];
        
        // Generate alignment notes
        const alignmentNotes: string[] = [
          `This project directly addresses the grant's focus on ${mainFocus}`,
          `The proposed initiatives align with the grant's objectives of promoting innovation and growth`,
          `The project outcomes will contribute to the grant's goals of creating economic impact`,
          `The approach is designed to meet the specific requirements outlined in the grant description`
        ];
        
        // Generate budget considerations
        const budgetConsiderations: string[] = [
          `Allocate 30-40% for personnel costs including project management and implementation`,
          `Reserve 20-30% for technology and equipment needs`,
          `Set aside 15-20% for marketing, outreach, and communications`,
          `Budget 10-15% for evaluation, reporting, and quality assurance`,
          `Include 5-10% contingency for unexpected costs or opportunities`
        ];
        
        // Generate impact metrics
        const impactMetrics: string[] = [
          `Number of new jobs created or positions supported`,
          `Revenue growth or cost savings achieved`,
          `Customer/client satisfaction and engagement metrics`,
          `Market share or competitive position improvements`,
          `Environmental or social impact indicators relevant to the project focus`
        ];
        
        // Create fallback ideas result
        const ideasResult = {
          projectIdeas,
          approachSuggestions,
          alignmentNotes,
          budgetConsiderations,
          impactMetrics
        };
        
        res.json({
          grant: grant,
          ideas: ideasResult,
          notice: "Using template-based ideas due to advanced generation service limitations."
        });
      }
    } catch (error) {
      console.error("Idea generation error:", error);
      res.status(500).json({ message: "Failed to generate ideas" });
    }
  });

  // Grant Scraper routes - protected by admin authentication
  apiRouter.post("/admin/scraper/run", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Check if user is an admin (you can add more robust admin checks)
      if (req.user && req.user.email && (req.user.email.includes('admin') || req.user.email === 'admin@grantflix.com')) {
        // Run the scraper
        console.log('Grant scraper manually triggered by admin');
        
        // Run the scraper in the background so we don't block the response
        runAllScrapers().catch(err => {
          console.error('Error during manual scraping:', err);
        });
        
        res.json({ message: "Grant scraping process started in the background. Check server logs for progress." });
      } else {
        res.status(403).json({ message: "Admin access required" });
      }
    } catch (error) {
      console.error('Error triggering scraper:', error);
      res.status(500).json({ message: "Failed to trigger scraper" });
    }
  });
  
  // Admin endpoint to run specific scrapers
  apiRouter.post("/admin/scraper/run/:source", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Check if user is an admin
      if (req.user && req.user.email && (req.user.email.includes('admin') || req.user.email === 'admin@grantflix.com')) {
        const { source } = req.params;
        
        console.log(`Specific scraper '${source}' manually triggered by admin`);
        
        // Run the specific scraper in the background
        (async () => {
          try {
            // Initialize browser
            console.log('Launching browser for specific scraper...');
            const browser = await puppeteer.launch({
              headless: true,
              args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-extensions'
              ]
            });
            
            let scraperFunction;
            let scraperName = '';
            
            // Select the appropriate scraper based on the source parameter
            switch(source) {
              case 'alberta-innovates':
                scraperFunction = scrapeAlbertaInnovates;
                scraperName = 'Alberta Innovates';
                break;
              case 'innovation-canada':
                scraperFunction = scrapeInnovationCanada;
                scraperName = 'Innovation Canada';
                break;
              case 'trade-commissioner':
                scraperFunction = scrapeTradeCommissioner;
                scraperName = 'Trade Commissioner';
                break;
              case 'trade-funding-programs':
                scraperFunction = scrapeTradeFundingPrograms;
                scraperName = 'Trade Funding Programs';
                break;
              case 'futurpreneur':
                scraperFunction = scrapeFuturpreneur;
                scraperName = 'Futurpreneur';
                break;
              case 'women-entrepreneurship':
                scraperFunction = scrapeWomenEntrepreneurship;
                scraperName = 'Women Entrepreneurship Strategy';
                break;
              case 'launch-online':
                scraperFunction = scrapeLaunchOnline;
                scraperName = 'Launch Online';
                break;
              case 'alberta-health':
                scraperFunction = scrapeAlbertaHealth;
                scraperName = 'Alberta Health';
                break;
              default:
                console.error(`Invalid scraper source: ${source}`);
                await browser.close();
                return;
            }
            
            console.log(`Running ${scraperName} scraper...`);
            
            // Run the specific scraper
            const scrapedGrants = await scraperFunction(browser);
            console.log(`${scraperName} scraper completed with ${scrapedGrants.length} grants`);
            
            // Process and save the grants
            if (source === 'trade-funding-programs') {
              // This scraper returns InsertGrant objects directly
              // Type assertion to ensure correct type for database
              await saveGrantsToDatabase(scrapedGrants as unknown as InsertGrant[]);
            } else {
              // Other scrapers return ScrapedGrant objects that need processing
              // Type assertion to ensure correct type for processing
              const processedGrants = await processGrants(scrapedGrants as unknown as ScrapedGrant[]);
              await saveGrantsToDatabase(processedGrants);
            }
            
            await browser.close();
            console.log(`${scraperName} scraper job completed successfully`);
          } catch (error) {
            console.error(`Error running specific scraper '${source}':`, error);
          }
        })();
        
        res.json({ message: `${source} scraping process started in the background. Check server logs for progress.` });
      } else {
        res.status(403).json({ message: "Admin access required" });
      }
    } catch (error) {
      console.error("Error triggering specific scraper:", error);
      res.status(500).json({ message: "Failed to trigger specific grant scraper" });
    }
  });
  
  // Add a new grant (admin endpoint - no auth for demonstration purposes)
  apiRouter.post("/admin/grants/add", async (req: Request, res: Response) => {
    try {
      const grantData = req.body;
      
      // Ensure required fields
      if (!grantData.title || !grantData.description || !grantData.type) {
        return res.status(400).json({ error: "Missing required fields: title, description, or type" });
      }

      // Add defaults for required fields if missing
      const processedGrant = {
        ...grantData,
        createdAt: grantData.createdAt || new Date().toISOString(),
        featured: grantData.featured !== undefined ? grantData.featured : false,
        pros: Array.isArray(grantData.pros) ? grantData.pros : [],
        cons: Array.isArray(grantData.cons) ? grantData.cons : [],
        eligibilityCriteria: Array.isArray(grantData.eligibilityCriteria) ? grantData.eligibilityCriteria : [],
        documents: Array.isArray(grantData.documents) ? grantData.documents : [],
        imageUrl: grantData.imageUrl || "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=500&h=280&q=80",
        competitionLevel: grantData.competitionLevel || "Medium",
        faqQuestions: null,
        faqAnswers: null
      };
      
      const grant = await storage.addGrant(processedGrant);
      res.status(201).json(grant);
    } catch (error) {
      console.error("Error adding grant:", error);
      res.status(500).json({ error: "Failed to add grant" });
    }
  });
  
  // Update grant image (admin endpoint - no auth for demonstration purposes)
  apiRouter.post("/admin/grants/update-image", async (req: Request, res: Response) => {
    try {
      const { id, imageUrl } = req.body;
      
      if (!id || !imageUrl) {
        return res.status(400).json({ error: "Missing required fields: id or imageUrl" });
      }
      
      // Get the grant to verify it exists
      const grant = await storage.getGrantById(Number(id));
      if (!grant) {
        return res.status(404).json({ error: "Grant not found" });
      }
      
      // Update the grant's image
      const updatedGrant = await storage.updateGrantImage(Number(id), imageUrl);
      
      if (!updatedGrant) {
        return res.status(500).json({ error: "Failed to update grant image" });
      }
      
      res.status(200).json(updatedGrant);
    } catch (error) {
      console.error("Error updating grant image:", error);
      res.status(500).json({ error: "Failed to update grant image" });
    }
  });
  
  // Endpoint to delete a grant by ID
  apiRouter.delete("/admin/grants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid grant ID" });
      }
      
      // Get the grant to verify it exists
      const grant = await storage.getGrantById(id);
      if (!grant) {
        return res.status(404).json({ error: "Grant not found" });
      }
      
      // Delete the grant
      const success = await storage.deleteGrant(id);
      
      if (success) {
        res.status(200).json({ success: true, message: `Grant ${id} deleted successfully` });
      } else {
        res.status(500).json({ error: "Failed to delete grant" });
      }
    } catch (error) {
      console.error("Error deleting grant:", error);
      res.status(500).json({ error: "Failed to delete grant" });
    }
  });
  
  // Schedule the scraper to run weekly
  try {
    scheduleScrapingJob();
    console.log('Grant scraper scheduled successfully');
  } catch (error) {
    console.error('Error scheduling scraper:', error);
  }

  // Mount API routes with prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
