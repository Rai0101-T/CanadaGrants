import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserGrantSchema, InsertGrant, User } from "@shared/schema";
import OpenAI from "openai";
import { setupAuth, comparePasswords, hashPassword } from "./auth";
import puppeteer from "puppeteer";
import { generateApplicationAssistance, checkPlagiarism, generateIdeas, calculateGrantCompatibility as geminiCalculateGrantCompatibility } from "./services/gemini-service";
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
      const allGrants = await storage.getAllGrants();
      
      // Filter out grants with specific deadlines before April 9, 2025
      // But keep grants with ongoing deadlines, periodic calls for proposals, and annual deadlines
      const currentDate = new Date('2025-04-09');
      
      const activeGrants = allGrants.filter(grant => {
        // If grant has no deadline or deadline is null/undefined, keep it
        if (!grant.deadline) return true;
        
        // Keep grants with ongoing deadlines, periodic calls for proposals, or annual deadlines (indicated by keywords)
        if (/ongoing|rolling|continuous|open|multiple|any time|periodic|call for proposals|annual|quarterly|biannual|semi-annual|yearly|monthly/i.test(grant.deadline)) {
          return true;
        }
        
        // Try to parse the deadline
        try {
          const deadlineDate = new Date(grant.deadline);
          // Keep the grant if its deadline is in the future
          return deadlineDate >= currentDate;
        } catch (e) {
          // If we can't parse the date, assume it's an ongoing deadline and keep it
          return true;
        }
      });
      
      res.json(activeGrants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grants" });
    }
  });

  // Get featured grants
  apiRouter.get("/grants/featured", async (req: Request, res: Response) => {
    try {
      const featuredGrants = await storage.getFeaturedGrants();
      
      // Filter out grants with specific deadlines before April 9, 2025
      // But keep grants with ongoing deadlines, periodic calls for proposals, and annual deadlines
      const currentDate = new Date('2025-04-09');
      
      const activeFeaturedGrants = featuredGrants.filter(grant => {
        // If grant has no deadline or deadline is null/undefined, keep it
        if (!grant.deadline) return true;
        
        // Keep grants with ongoing deadlines, periodic calls for proposals, or annual deadlines (indicated by keywords)
        if (/ongoing|rolling|continuous|open|multiple|any time|periodic|call for proposals|annual|quarterly|biannual|semi-annual|yearly|monthly/i.test(grant.deadline)) {
          return true;
        }
        
        // Try to parse the deadline
        try {
          const deadlineDate = new Date(grant.deadline);
          // Keep the grant if its deadline is in the future
          return deadlineDate >= currentDate;
        } catch (e) {
          // If we can't parse the date, assume it's an ongoing deadline and keep it
          return true;
        }
      });
      
      res.json(activeFeaturedGrants);
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
      
      const typeGrants = await storage.getGrantsByType(type);
      
      // Filter out grants with specific deadlines before April 9, 2025
      // But keep grants with ongoing deadlines, periodic calls for proposals, and annual deadlines
      const currentDate = new Date('2025-04-09');
      
      const activeTypeGrants = typeGrants.filter(grant => {
        // If grant has no deadline or deadline is null/undefined, keep it
        if (!grant.deadline) return true;
        
        // Keep grants with ongoing deadlines, periodic calls for proposals, or annual deadlines (indicated by keywords)
        if (/ongoing|rolling|continuous|open|multiple|any time|periodic|call for proposals|annual|quarterly|biannual|semi-annual|yearly|monthly/i.test(grant.deadline)) {
          return true;
        }
        
        // Try to parse the deadline
        try {
          const deadlineDate = new Date(grant.deadline);
          // Keep the grant if its deadline is in the future
          return deadlineDate >= currentDate;
        } catch (e) {
          // If we can't parse the date, assume it's an ongoing deadline and keep it
          return true;
        }
      });
      
      res.json(activeTypeGrants);
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
      
      const searchGrants = await storage.searchGrants(query);
      
      // Filter out grants with specific deadlines before April 9, 2025
      // But keep grants with ongoing deadlines, periodic calls for proposals, and annual deadlines
      const currentDate = new Date('2025-04-09');
      
      const activeSearchGrants = searchGrants.filter(grant => {
        // If grant has no deadline or deadline is null/undefined, keep it
        if (!grant.deadline) return true;
        
        // Keep grants with ongoing deadlines, periodic calls for proposals, or annual deadlines (indicated by keywords)
        if (/ongoing|rolling|continuous|open|multiple|any time|periodic|call for proposals|annual|quarterly|biannual|semi-annual|yearly|monthly/i.test(grant.deadline)) {
          return true;
        }
        
        // Try to parse the deadline
        try {
          const deadlineDate = new Date(grant.deadline);
          // Keep the grant if its deadline is in the future
          return deadlineDate >= currentDate;
        } catch (e) {
          // If we can't parse the date, assume it's an ongoing deadline and keep it
          return true;
        }
      });
      
      res.json(activeSearchGrants);
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
      if (!req.user) {
        console.error("No user in request despite isAuthenticated middleware");
        return res.status(401).json({ message: "No authenticated user found" });
      }
      
      const userId = req.user.id;
      const userData = { ...req.body };
      
      console.log("Updating user profile:", userId, "Data:", JSON.stringify(userData, null, 2));
      
      // Remove fields that shouldn't be directly updated
      delete userData.id;
      delete userData.createdAt;
      
      // Handle password change if present
      if (userData.currentPassword && userData.newPassword) {
        console.log("Password change requested");
        const user = await storage.getUser(userId);
        if (!user) {
          console.error("User not found for password update:", userId);
          return res.status(404).json({ message: "User not found" });
        }
        
        // Verify current password
        try {
          const validPassword = await comparePasswords(userData.currentPassword, user.passwordHash);
          if (!validPassword) {
            console.error("Invalid current password for user:", userId);
            return res.status(400).json({ message: "Current password is incorrect" });
          }
          
          // Hash new password
          userData.passwordHash = await hashPassword(userData.newPassword);
          console.log("Password successfully hashed");
        } catch (err) {
          console.error("Password validation error:", err);
          return res.status(500).json({ message: "Error validating password" });
        }
      }
      
      // Always remove password fields from what gets stored
      delete userData.currentPassword;
      delete userData.newPassword;
      delete userData.confirmNewPassword;
      
      console.log("Final update data:", JSON.stringify(userData, null, 2));
      
      // Update the user data
      try {
        const updatedUser = await storage.updateUser(userId, userData);
        
        if (!updatedUser) {
          console.error("No user returned after update for id:", userId);
          return res.status(404).json({ message: "User not found or update failed" });
        }
        
        console.log("User updated successfully:", updatedUser.id);
        
        // Return user without sensitive data
        const { passwordHash, ...userWithoutPassword } = updatedUser;
        
        // Update the session user object
        req.login(updatedUser, (err) => {
          if (err) {
            console.error("Session update error:", err);
            return res.status(500).json({ message: "Profile updated but failed to update session" });
          }
          console.log("Session updated successfully");
          res.status(200).json(userWithoutPassword);
        });
      } catch (dbError) {
        console.error("Database update error:", dbError);
        res.status(500).json({ message: "Database error during profile update" });
      }
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
          model: "gpt-3.5-turbo", // Using GPT-3.5 Turbo to avoid hitting quota limits
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
  
  // Generate application assistance using fixed implementation
  apiRouter.post("/grantscribe/assist", isAuthenticated, async (req: Request, res: Response) => {
    // Import the fixed implementation
    const { handleAssistEndpoint } = await import('./services/fixed-assist-endpoint');
    
    // Use the fixed implementation
    return handleAssistEndpoint(req, res);
  });
  
  // Generate idea suggestions
  apiRouter.post("/grantscribe/generate-ideas", isAuthenticated, async (req: Request, res: Response) => {
    // Import the fixed implementation
    const { handleGenerateIdeasEndpoint } = await import('./services/fixed-generate-ideas');
    
    // Use the fixed implementation
    return handleGenerateIdeasEndpoint(req, res);
  });
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
          
          // Get AI to generate improved version of the application text
          const improvedResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Using GPT-3.5 Turbo to avoid hitting quota limits
            messages: [
              {
                role: "system",
                content: `You are GrantScribe, an expert grant application writer specializing in Canadian grants.
                        Take the user's draft application and improve it to maximize chances of success.
                        Keep the core ideas but enhance the language, structure, and alignment with grant objectives.
                        Make sure to incorporate relevant details from the applicant's business profile.`
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
                        
                        Please rewrite my application to make it stronger, more compelling and better aligned with the grant requirements.`
              }
            ],
            temperature: 0.7,
            max_tokens: 1500,
          });
          
          const improvedText = improvedResponse.choices[0].message.content;
          
          res.json({
            feedback: response.choices[0].message.content,
            improvedText: improvedText,
            grant: grant,
            originalText: applicationText
          });
        } catch (openaiError) {
          console.warn("OpenAI API error after Gemini failure, using fallback:", openaiError);
          // Fallback mechanism for when both AI APIs fail
          
          // Generate comprehensive feedback based on application text and user business profile
          const wordCount = applicationText.split(/\s+/).length;
        const paragraphCount = applicationText.split(/\n\s*\n/).length;
        const sentenceCount = applicationText.split(/[.!?]+\s/).length;
        
        // Analyze application structure and content more thoroughly
        const sentences = applicationText.split(/[.!?]+\s/).filter((s: string) => s.trim().length > 0);
        const paragraphs = applicationText.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0);
        
        // Calculate average sentence and paragraph lengths
        const avgSentenceLength = sentences.reduce((sum: number, s: string) => sum + s.split(/\s+/).length, 0) / Math.max(1, sentences.length);
        const avgParagraphLength = paragraphs.reduce((sum: number, p: string) => sum + p.split(/\s+/).length, 0) / Math.max(1, paragraphs.length);
        
        // Identify keywords from the grant description and eligibility criteria
        const grantKeywords = new Set<string>();
        if (grant.description) {
          const words = grant.description.toLowerCase().split(/\s+/);
          words.forEach((word: string) => {
            if (word.length > 4 && !['and', 'that', 'this', 'with', 'from', 'have', 'your'].includes(word)) {
              grantKeywords.add(word);
            }
          });
        }
        
        if (grant.eligibilityCriteria && Array.isArray(grant.eligibilityCriteria)) {
          grant.eligibilityCriteria.forEach(criterion => {
            if (typeof criterion === 'string') {
              const words = criterion.toLowerCase().split(/\s+/);
              words.forEach(word => {
                if (word.length > 4 && !['and', 'that', 'this', 'with', 'from', 'have', 'your'].includes(word)) {
                  grantKeywords.add(word);
                }
              });
            }
          });
        }
        
        // Check for alignment with grant keywords
        const keywordMatches: string[] = [];
        const missedKeywords: string[] = [];
        
        grantKeywords.forEach(keyword => {
          if (applicationText.toLowerCase().includes(keyword)) {
            keywordMatches.push(keyword);
          } else {
            missedKeywords.push(keyword);
          }
        });
        
        // Analyze application completeness
        const completenessScore = Math.min(100, Math.round((keywordMatches.length / Math.max(1, grantKeywords.size)) * 100));
        
        // Check for sections that should be in a good application
        const hasProblemStatement = applicationText.toLowerCase().includes('problem') || 
                                    applicationText.toLowerCase().includes('challenge') || 
                                    applicationText.toLowerCase().includes('issue');
        
        const hasSolution = applicationText.toLowerCase().includes('solution') || 
                           applicationText.toLowerCase().includes('resolve') || 
                           applicationText.toLowerCase().includes('solve');
        
        const hasTimeline = applicationText.toLowerCase().includes('timeline') || 
                           applicationText.toLowerCase().includes('schedule') || 
                           applicationText.toLowerCase().includes('milestone');
        
        const hasBudget = applicationText.toLowerCase().includes('budget') || 
                         applicationText.toLowerCase().includes('cost') || 
                         applicationText.toLowerCase().includes('funding');
        
        const hasOutcomes = applicationText.toLowerCase().includes('outcome') || 
                           applicationText.toLowerCase().includes('result') || 
                           applicationText.toLowerCase().includes('impact');
        
        // Generate appropriately detailed assessment
        let assessment = "Your application has a good foundation and addresses some key points.";
        if (wordCount < 200) {
          assessment = "Your application is quite brief and could benefit from more detail and elaboration, particularly about your specific business context and how it aligns with the grant requirements.";
        } else if (wordCount < 400) {
          assessment = "Your application has moderate detail but would benefit from more specific examples and data to strengthen your case, especially regarding how your business uniquely qualifies for this funding.";
        } else if (wordCount > 800) {
          assessment = "Your application is quite detailed, which shows commitment to thoroughness. Consider reviewing for clarity and focus while maintaining your key business differentiators and alignment with grant criteria.";
        }
        
        // Structure assessment with more specific guidance
        let structureAssessment = "The application has a reasonable structure with paragraphs that help organize your thoughts.";
        if (paragraphCount < 3) {
          structureAssessment = "Consider restructuring your application into at least 5-7 distinct sections: Introduction, Business Background, Project Description, Implementation Plan, Expected Outcomes, Budget, and Conclusion. Each section should focus on a specific aspect of your proposal.";
        } else if (avgParagraphLength > 150) {
          structureAssessment = "Some of your paragraphs are quite long. Consider breaking them into smaller, more focused sections to improve readability and ensure the grant reviewers can easily find key information.";
        }
        
        // Get grant-specific information for tailored recommendations
        const eligibilityCriteria = grant.eligibilityCriteria || [];
        const criteria = eligibilityCriteria.join(", ");
        const grantIndustry = grant.industry || 'multiple industries';
        const grantType = grant.type || 'this type of grant';
        const grantCategory = grant.category || 'this category';
        
        // Generate comprehensive business-specific insights
        let businessInsight = "Based on your business profile, we've identified several ways to customize your application:";
        
        // Craft industry-specific recommendations
        if (userBusinessInfo.industry) {
          businessInsight += `\n\n* As a business in the ${userBusinessInfo.industry} industry, emphasize how your project addresses specific industry challenges that align with the grant's focus on ${grantIndustry !== 'any' ? grantIndustry : 'various industries'}.`;
          
          // Add industry-specific success metrics
          if (userBusinessInfo.industry.includes('tech') || userBusinessInfo.industry.includes('software')) {
            businessInsight += " Consider including metrics like user adoption rates, efficiency improvements, or technology readiness levels.";
          } else if (userBusinessInfo.industry.includes('manufacturing')) {
            businessInsight += " Include production capacity increases, quality improvements, or supply chain optimizations as measurable outcomes.";
          } else if (userBusinessInfo.industry.includes('healthcare')) {
            businessInsight += " Highlight patient outcome improvements, service accessibility enhancements, or healthcare cost reductions.";
          }
        }
        
        // Add location-specific insights
        if (userBusinessInfo.province) {
          businessInsight += `\n\n* Your location in ${userBusinessInfo.province} offers specific advantages for this ${grantType} grant. Highlight regional economic impact, local workforce development, or how your project addresses provincial priorities.`;
          
          // Add provincial-specific details if it's a provincial grant
          if (grantType === 'provincial' && grant.province === userBusinessInfo.province) {
            businessInsight += ` This grant is specifically for businesses in ${userBusinessInfo.province}, so emphasize your commitment to the local economy and community.`;
          }
        }
        
        // Add size-specific recommendations
        if (userBusinessInfo.employeeCount) {
          businessInsight += `\n\n* With ${userBusinessInfo.employeeCount} employees, demonstrate how this project will`;
          
          if (parseInt(userBusinessInfo.employeeCount) < 10) {
            businessInsight += " significantly scale your operations, create new job opportunities, and establish a foundation for sustainable growth.";
          } else if (parseInt(userBusinessInfo.employeeCount) < 50) {
            businessInsight += " enhance your existing workforce capabilities, optimize your business processes, and enable you to expand into new markets.";
          } else {
            businessInsight += " leverage your established workforce, strengthen your market position, and create long-term sustainable advantages in your industry.";
          }
        }
        
        // Add experience-based insights
        if (userBusinessInfo.yearFounded) {
          const yearsInBusiness = 2025 - parseInt(userBusinessInfo.yearFounded);
          
          if (yearsInBusiness < 3) {
            businessInsight += `\n\n* As a relatively new business (${yearsInBusiness} years), highlight your innovation, agility, and growth potential. Address any concerns about sustainability by emphasizing your team's expertise and your business model's viability.`;
          } else if (yearsInBusiness < 10) {
            businessInsight += `\n\n* With ${yearsInBusiness} years of operation, showcase your established track record, existing customer base, and how this funding will help you reach the next level of business maturity.`;
          } else {
            businessInsight += `\n\n* Your ${yearsInBusiness} years of business experience demonstrates stability and resilience. Emphasize how this grant will help you innovate, adapt to changing market conditions, or expand your proven business model.`;
          }
        }
        
        // Add business type-specific insights
        if (userBusinessInfo.businessType) {
          businessInsight += `\n\n* As a ${userBusinessInfo.businessType}, you should address how this organizational structure aligns with the grant's objectives and how it enables you to effectively implement the proposed project.`;
        }
        
        // Analyze business description for additional insights
        if (userBusinessInfo.businessDescription) {
          const description = userBusinessInfo.businessDescription.toLowerCase();
          
          if (description.includes('innovation') || description.includes('innovative')) {
            businessInsight += "\n\n* Your focus on innovation aligns well with many grant programs. Provide specific examples of your innovative approaches and how the grant will accelerate them.";
          }
          
          if (description.includes('community') || description.includes('social')) {
            businessInsight += "\n\n* Your community orientation should be emphasized, particularly the social impact and community benefits of your proposed project.";
          }
          
          if (description.includes('sustainable') || description.includes('green') || description.includes('eco')) {
            businessInsight += "\n\n* Highlight your sustainability practices and how they align with the grant's objectives, particularly if there are environmental components to the funding program.";
          }
        }
        
        // Generate highly specific improvement points with business context
        const improvementPoints: string[] = [];
        
        // Address missing key sections
        if (!hasProblemStatement) {
          improvementPoints.push(`Clearly articulate the specific problem or opportunity your ${userBusinessInfo.businessType || 'business'} is addressing in the ${userBusinessInfo.industry || 'industry'}`);
        }
        
        if (!hasSolution) {
          improvementPoints.push(`Thoroughly explain your proposed solution and why it's uniquely effective for the identified need`);
        }
        
        if (!hasTimeline) {
          improvementPoints.push(`Include a detailed timeline with specific milestones to demonstrate project feasibility and planning`);
        }
        
        if (!hasBudget) {
          improvementPoints.push(`Provide a comprehensive budget breakdown showing how the funding will be allocated and why these expenses are necessary`);
        }
        
        if (!hasOutcomes) {
          improvementPoints.push(`Define clear, measurable outcomes and explain how you'll evaluate the project's success`);
        }
        
        // Add eligibility-focused suggestions
        improvementPoints.push(`Explicitly address how your business meets each eligibility criterion: ${criteria}`);
        
        // Add quantitative suggestions
        improvementPoints.push(`Include specific metrics and quantifiable goals that demonstrate your project's potential impact on your ${userBusinessInfo.industry || 'industry'}`);
        
        // Add alignment suggestions
        improvementPoints.push(`Directly connect your business experience (${userBusinessInfo.yearFounded ? 'since ' + userBusinessInfo.yearFounded : ''}) to your project's credibility and likelihood of success`);
        
        // Add grant-specific recommendations
        improvementPoints.push(`Align your language with the grant's focus on ${grantCategory} by using relevant terminology and addressing the specific priorities mentioned in the grant description`);
        
        // Add differentiation recommendation
        improvementPoints.push(`Clearly articulate what makes your approach unique compared to others in ${userBusinessInfo.province || 'your region'} and the ${userBusinessInfo.industry || 'industry'}`);
        
        // Special recommendations based on grant type
        if (grantType === 'federal') {
          improvementPoints.push(`Emphasize national impact and how your project contributes to broader Canadian economic or social objectives`);
        } else if (grantType === 'provincial') {
          improvementPoints.push(`Highlight provincial priorities and regional economic development aspects of your project`);
        } else if (grantType === 'private') {
          improvementPoints.push(`Align with the funding organization's mission and values, and explain how your partnership will benefit both parties`);
        }
        
        // Generate specific content suggestions
        const contentSuggestions: string[] = [];
        
        // Missing keywords
        if (missedKeywords.length > 0) {
          contentSuggestions.push(`Consider incorporating these key terms from the grant description: ${missedKeywords.slice(0, 5).join(', ')}${missedKeywords.length > 5 ? '...' : ''}`);
        }
        
        // Industry-specific language
        if (userBusinessInfo.industry) {
          contentSuggestions.push(`Use industry-specific terminology relevant to ${userBusinessInfo.industry} to demonstrate expertise`);
        }
        
        // Budget specifics
        contentSuggestions.push(`Include specific budget allocations with clear justifications for each expense category`);
        
        // Stakeholder consideration
        contentSuggestions.push(`Identify key stakeholders and explain how they'll be engaged throughout the project`);
        
        // Risk management
        contentSuggestions.push(`Address potential risks and your mitigation strategies to show thorough planning`);
        
        // Craft the comprehensive feedback response
        const feedback = `
# Comprehensive Application Assessment for ${userBusinessInfo.businessName}

## Overall Assessment
${assessment}

## Application Metrics
- Word count: ${wordCount} words
- Sentence count: ${sentenceCount} sentences
- Paragraph count: ${paragraphCount} paragraphs
- Grant alignment score: ${completenessScore}% (based on keyword matching)

## Structure and Organization
${structureAssessment}

## Specific Strengths
${keywordMatches.length > 0 ? `- Strong alignment with ${keywordMatches.length} key grant terms: ${keywordMatches.slice(0, 5).join(', ')}${keywordMatches.length > 5 ? '...' : ''}` : '- Your application provides a foundation to build upon'}
${hasProblemStatement ? '- Clearly identifies the problem or challenge your project addresses' : ''}
${hasSolution ? '- Outlines your proposed solution approach' : ''}
${hasTimeline ? '- Includes timeline information for project implementation' : ''}
${hasBudget ? '- Addresses budget considerations' : ''}
${hasOutcomes ? '- Defines expected outcomes or results' : ''}

## Business Context Analysis
${businessInsight}

## Priority Areas for Improvement
${improvementPoints.slice(0, 5).map((point, index) => `${index + 1}. ${point}`).join('\n')}

## Content Suggestions
${contentSuggestions.map(suggestion => `- ${suggestion}`).join('\n')}

## Section-by-Section Recommendations
- **Introduction:** ${hasProblemStatement ? 'Strengthen your problem statement by quantifying the issue and citing relevant statistics.' : 'Add a clear problem statement that establishes the need for your project.'}
- **Business Background:** Emphasize your ${userBusinessInfo.industry || 'business'} expertise and relevant experience that qualifies you for this grant.
- **Project Description:** ${hasSolution ? 'Enhance your solution description with more specific details about implementation methods.' : 'Clearly articulate your proposed solution and its innovative aspects.'}
- **Implementation Plan:** ${hasTimeline ? 'Add more specific milestones with dates and responsible parties.' : 'Include a detailed timeline with key milestones and deliverables.'}
- **Expected Outcomes:** ${hasOutcomes ? 'Quantify your outcomes with specific metrics to demonstrate impact.' : 'Define clear, measurable outcomes that align with the grant objectives.'}
- **Budget Breakdown:** ${hasBudget ? 'Provide more detailed justification for each budget category.' : 'Add a comprehensive budget with clear categories and justifications.'}
- **Conclusion:** Summarize key points and restate how your project aligns perfectly with the grant's objectives and will deliver measurable impacts.

**Next Steps:** Review these recommendations and update your application to reflect your business's unique position and strengths. Focus particularly on how your ${userBusinessInfo.businessType || 'business'} in ${userBusinessInfo.province || 'your region'} is ideally positioned to deliver exceptional results with this funding.
`;
        
        // Generate an improved version of the text in the fallback mechanism
        const improvedText = `${applicationText}

// Enhanced introduction with context
As ${userBusinessInfo.businessName || 'a business'} operating in the ${userBusinessInfo.industry || 'industry'} since ${userBusinessInfo.yearFounded || 'founding'}, we are uniquely positioned to address key challenges in ${userBusinessInfo.province || 'our region'}. Our application for the ${grant.title} grant aligns with our mission to ${userBusinessInfo.businessDescription ? userBusinessInfo.businessDescription.substring(0, 100) + '...' : 'deliver innovative solutions'}.

// Strengthened problem statement
The challenge we address is significant and timely. Our approach combines industry expertise with innovative methodology to ensure sustainable outcomes.

// Clear implementation plan
Our implementation strategy includes carefully planned phases with measurable milestones to track progress. We have identified key stakeholders and established a communication framework to ensure collaborative success.

// Detailed budget justification
The requested funding will be allocated strategically across essential project components, with each expense directly contributing to our ability to deliver impactful results.

// Measurable outcomes
Upon successful implementation, we will evaluate success through specific metrics including: market impact, community benefit, innovation advancement, and sustainable growth indicators.

// Alignment with grant objectives
This project directly addresses the core objectives of the ${grant.title} grant by focusing on ${grant.description ? grant.description.substring(0, 100) + '...' : 'the stated priorities'}. Our team's qualifications and experience make us ideally suited to deliver exceptional value through this funding opportunity.`;

        res.json({
          feedback,
          improvedText,
          originalText: applicationText,
          grant,
          notice: "Using enhanced application assessment with business profile integration."
        });
      }
    } catch (error) {
      console.error("GrantScribe assistance error:", error);
      res.status(500).json({ message: "Failed to generate application assistance" });
    }
  });
  
  // Check for plagiarism
  apiRouter.post("/grantscribe/plagiarism-check", isAuthenticated, async (req: Request, res: Response) => {
    // Import the fixed implementation
    const { handlePlagiarismCheckEndpoint } = await import('./services/fixed-plagiarism-check');
    
    // Use the fixed implementation
    return handlePlagiarismCheckEndpoint(req, res);
  });
      }
      
      // Get user business profile information for more relevant analysis
      const userId = (req.user as any).id;
      const user = await storage.getUser(userId);
      const userBusinessInfo = {
        businessName: user?.businessName || 'your business',
        businessType: user?.businessType || '',
        industry: user?.industry || '',
        businessDescription: user?.businessDescription || '',
        province: user?.province || '',
        employeeCount: user?.employeeCount || '',
        yearFounded: user?.yearFounded || ''
      };
      
      let result;
      
      // First try Gemini API
      try {
        result = await checkPlagiarism(text, userBusinessInfo);
        return res.json(result);
      } catch (geminiError) {
        console.warn("Gemini API error for plagiarism check, trying OpenAI as fallback:", geminiError);
      }
      
      // Try OpenAI as fallback
        try {
          // Use OpenAI for advanced plagiarism detection
          const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          });
          
          const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Using GPT-3.5 Turbo to avoid hitting quota limits
          messages: [
            { 
              role: "system", 
              content: "You are a plagiarism detection expert. Analyze the provided text for potential plagiarism, considering the business context provided. Return a JSON object with the following properties: plagiarismScore (a number from 0 to 100), analysis (a detailed explanation), suggestions (an array of improvement strings), and possibleSources (an array of likely source types, not specific URLs)." 
            },
            { 
              role: "user", 
              content: `Please check this text for potential plagiarism. The text was written for a grant application by a ${userBusinessInfo.businessType || 'business'} in the ${userBusinessInfo.industry || 'unspecified'} industry located in ${userBusinessInfo.province || 'Canada'}. Their business focuses on: ${userBusinessInfo.businessDescription || 'unspecified'}.

Text to analyze: ${text}` 
            }
          ],
          response_format: { type: "json_object" }
        });
        
        // Parse and return the results
        const content = response.choices[0].message.content || "{}";
        const result = JSON.parse(content);
        return res.json(result);
      } catch (aiError) {
        console.warn("OpenAI API error for plagiarism check, using enhanced fallback:", aiError);
        // Proceed with advanced fallback mechanism
      }
      
      // Enhanced plagiarism analysis with business context
      // 1. Look for stylistic inconsistencies and analyze structure
      const sentences: string[] = text.split(/[.!?]+\s/).filter((s: string) => s.trim().length > 0);
      const paragraphs: string[] = text.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0);
      
      // 2. Calculate advanced linguistic metrics
      const avgWordCount: number = sentences.length > 0 
        ? sentences.reduce((sum: number, sentence: string) => {
            return sum + sentence.split(/\s+/).length;
          }, 0) / Math.max(1, sentences.length)
        : 0;
      
      // Calculate vocabulary richness (unique words / total words)
      const allWords = text.toLowerCase().split(/\s+/).filter((word: string) => word.length > 3);
      const uniqueWords = new Set(allWords);
      const vocabularyRichness = uniqueWords.size / Math.max(1, allWords.length);
      
      // 3. Check for stylistic shifts and inconsistencies
      const longSentences: string[] = sentences.filter((s: string) => s.split(/\s+/).length > avgWordCount * 1.5);
      const shortSentences: string[] = sentences.filter((s: string) => s.split(/\s+/).length < avgWordCount * 0.5 && s.split(/\s+/).length > 3);
      
      // Check for sudden shifts in sentence length
      let sentenceLengthShifts = 0;
      for (let i = 1; i < sentences.length; i++) {
        const prevLength = sentences[i-1].split(/\s+/).length;
        const currLength = sentences[i].split(/\s+/).length;
        
        if (currLength > prevLength * 2 || prevLength > currLength * 2) {
          sentenceLengthShifts++;
        }
      }
      
      // 4. Check for industry-specific terminology
      const industryTerms: Record<string, string[]> = {
        'technology': ['algorithm', 'interface', 'framework', 'integration', 'platform', 'scalable', 'deployment'],
        'healthcare': ['patient', 'clinic', 'treatment', 'diagnostic', 'medical', 'therapy', 'caregiver'],
        'manufacturing': ['production', 'assembly', 'quality control', 'efficiency', 'automation', 'fabrication'],
        'retail': ['customer', 'sales', 'inventory', 'merchandising', 'point-of-sale', 'storefront'],
        'agriculture': ['crop', 'harvest', 'farm', 'soil', 'irrigation', 'livestock', 'sustainable'],
        'education': ['student', 'learning', 'curriculum', 'assessment', 'pedagogy', 'classroom'],
        'finance': ['investment', 'portfolio', 'capital', 'market', 'financial', 'asset', 'equity']
      };
      
      // Count industry terms from user's industry vs. other industries
      let userIndustryTermCount = 0;
      let otherIndustryTermCount = 0;
      
      if (userBusinessInfo.industry) {
        const userIndustry = Object.keys(industryTerms).find(key => 
          userBusinessInfo.industry.toLowerCase().includes(key)
        );
        
        if (userIndustry) {
          // Count terms from user's industry
          industryTerms[userIndustry].forEach(term => {
            if (text.toLowerCase().includes(term.toLowerCase())) {
              userIndustryTermCount++;
            }
          });
          
          // Count terms from other industries
          Object.entries(industryTerms).forEach(([industry, terms]) => {
            if (industry !== userIndustry) {
              terms.forEach(term => {
                if (text.toLowerCase().includes(term.toLowerCase())) {
                  otherIndustryTermCount++;
                }
              });
            }
          });
        }
      }
      
      // 5. Check for academic or formal grant writing phrases
      const formalGrantPhrases: string[] = [
        "moreover", "furthermore", "thus", "hence", "therefore", "consequently",
        "in conclusion", "in summary", "to summarize", "in regards to", "with respect to",
        "it can be concluded that", "the results demonstrate", "according to the findings",
        "innovative solution", "cutting-edge", "state-of-the-art", "paradigm shift",
        "leverage synergies", "maximizing potential", "optimal utilization",
        "strategic implementation", "sustainable development", "key stakeholders",
        "significant impact", "measurable outcomes", "comprehensive approach"
      ];
      
      const formalPhraseMatches: string[] = formalGrantPhrases.filter((phrase: string) => 
        text.toLowerCase().includes(phrase.toLowerCase())
      );
      
      // Check for passive voice (often used in copied academic or formal writing)
      const passiveVoicePatterns = [
        / is being /gi, / are being /gi, / was being /gi, / were being /gi,
        / has been /gi, / have been /gi, / had been /gi, / will be /gi
      ];
      
      let passiveVoiceInstances = 0;
      passiveVoicePatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          passiveVoiceInstances += matches.length;
        }
      });
      
      // 6. Calculate a more sophisticated plagiarism score based on multiple factors
      let plagiarismScore: number = 10; // Base score
      
      // Paragraph style consistency
      if (paragraphs.length > 1) {
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
        
        // Very high or very low variance can indicate problems
        if (variance > 15) {
          plagiarismScore += 20; // High variance - inconsistent styles suggest multiple sources
        } else if (variance < 0.5 && paragraphs.length > 3) {
          plagiarismScore += 15; // Suspiciously consistent style across multiple paragraphs
        }
      }
      
      // Sentence structure analysis
      if (longSentences.length > sentences.length * 0.4) {
        plagiarismScore += 15; // Many long sentences suggest academic sources
      }
      
      if (sentenceLengthShifts > sentences.length * 0.2) {
        plagiarismScore += 10; // Frequent shifts in sentence length suggest multiple sources
      }
      
      // Formal language analysis
      if (formalPhraseMatches.length > 4) {
        plagiarismScore += 15; // Many formal phrases suggest copied content
      }
      
      // Passive voice analysis
      if (passiveVoiceInstances > sentences.length * 0.3) {
        plagiarismScore += 10; // Heavy passive voice use suggests formal/academic sources
      }
      
      // Vocabulary richness analysis
      if (vocabularyRichness < 0.4) {
        plagiarismScore += 10; // Lower vocabulary variation can indicate templated text
      }
      
      // Industry terminology analysis - high mismatch suggests content from other domains
      if (userBusinessInfo.industry && otherIndustryTermCount > userIndustryTermCount * 1.5) {
        plagiarismScore += 15;
      }
      
      // 7. Identify potentially problematic sections
      const flaggedSections: string[] = [];
      
      // Flag exceptionally long sentences
      longSentences.forEach((sentence: string) => {
        if (sentence.split(/\s+/).length > avgWordCount * 2) {
          flaggedSections.push(sentence.trim());
        }
      });
      
      // Flag paragraphs with unusual style compared to the rest
      paragraphs.forEach((paragraph: string) => {
        // Detection of formal language that seems different from business context
        if (
          (formalPhraseMatches.some((phrase: string) => paragraph.toLowerCase().includes(phrase)) &&
           paragraph.split(/\s+/).length > avgWordCount * 1.7) ||
          (passiveVoicePatterns.some(pattern => pattern.test(paragraph)) &&
           paragraph.length > 100)
        ) {
          // Only add if not already added
          if (!flaggedSections.includes(paragraph.trim())) {
            flaggedSections.push(paragraph.trim());
          }
        }
      });
      
      // If no flagged sections, find sections with potential industry mismatches
      if (flaggedSections.length === 0 && userBusinessInfo.industry) {
        const userIndustry = Object.keys(industryTerms).find(key => 
          userBusinessInfo.industry.toLowerCase().includes(key)
        );
        
        if (userIndustry) {
          paragraphs.forEach(paragraph => {
            let otherIndustryTerms = 0;
            
            Object.entries(industryTerms).forEach(([industry, terms]) => {
              if (industry !== userIndustry) {
                terms.forEach(term => {
                  if (paragraph.toLowerCase().includes(term.toLowerCase())) {
                    otherIndustryTerms++;
                  }
                });
              }
            });
            
            if (otherIndustryTerms > 2) {
              flaggedSections.push(paragraph.trim());
            }
          });
        }
      }
      
      // If still no flagged sections, include some longer paragraphs for review
      if (flaggedSections.length === 0 && paragraphs.length > 0) {
        const sortedParagraphs = [...paragraphs].sort((a, b) => 
          b.split(/\s+/).length - a.split(/\s+/).length
        );
        
        const longestParagraphs = sortedParagraphs.slice(0, Math.min(2, sortedParagraphs.length));
        longestParagraphs.forEach(paragraph => {
          flaggedSections.push(paragraph.trim());
        });
      }
      
      // Cap the score with reasonable bounds
      plagiarismScore = Math.min(85, plagiarismScore);
      plagiarismScore = Math.max(15, plagiarismScore);
      
      // 8. Generate business-specific recommendations
      const recommendations: string[] = [];
      
      // Business-specific recommendations based on user profile
      if (userBusinessInfo.industry) {
        recommendations.push(`Use more specific terminology from the ${userBusinessInfo.industry} industry to demonstrate your expertise`);
      }
      
      if (userBusinessInfo.province) {
        recommendations.push(`Include more references to your business context in ${userBusinessInfo.province} to personalize the content`);
      }
      
      if (userBusinessInfo.businessType) {
        recommendations.push(`Highlight the specific challenges and opportunities for your ${userBusinessInfo.businessType} business type`);
      }
      
      // General recommendations for all users
      recommendations.push("Replace generic grant writing phrases with specific examples from your business experience");
      recommendations.push("Convert passive voice sentences to active voice for more authentic, direct communication");
      recommendations.push("Break down overly long sentences into shorter, clearer statements");
      recommendations.push("Ensure consistent writing style throughout your document");
      recommendations.push("Add citations for any statistics or specific claims from external sources");
      
      // 9. Identify possible content sources based on analysis
      const possibleSources: string[] = [];
      
      if (formalPhraseMatches.length > 4) {
        possibleSources.push("Grant writing templates or guides");
      }
      
      if (passiveVoiceInstances > sentences.length * 0.3) {
        possibleSources.push("Academic or formal business publications");
      }
      
      if (otherIndustryTermCount > userIndustryTermCount && userBusinessInfo.industry) {
        possibleSources.push(`Content from industries outside your ${userBusinessInfo.industry} sector`);
      }
      
      if (longSentences.length > sentences.length * 0.4) {
        possibleSources.push("Formal reports or white papers");
      }
      
      if (possibleSources.length === 0) {
        possibleSources.push("Common grant application examples or templates");
      }
      
      // 10. Generate a detailed explanation
      let analysis = "";
      
      if (plagiarismScore < 30) {
        analysis = "Your content appears largely original. While we detected a few common phrases, the overall text demonstrates a personal writing style with appropriate business context.";
      } else if (plagiarismScore < 50) {
        analysis = "Your content shows moderate indicators of potentially non-original elements. We found several common grant writing phrases and some sections that may benefit from more personalization.";
      } else if (plagiarismScore < 70) {
        analysis = "Our analysis identified significant indicators suggesting portions of this content may not be entirely original. The text contains multiple common phrases, formal language patterns, and potential stylistic inconsistencies.";
      } else {
        analysis = "We've detected strong indicators that substantial portions of this content may be derived from other sources. The text contains numerous standardized phrases, formal language patterns, and potential stylistic inconsistencies characteristic of template-based writing.";
      }
      
      // Add specific findings to the analysis
      if (formalPhraseMatches.length > 0) {
        analysis += `\n\nWe identified ${formalPhraseMatches.length} common grant writing phrases or expressions that appear in many applications, such as: "${formalPhraseMatches.slice(0, 3).join('", "')}"${formalPhraseMatches.length > 3 ? '...' : ''}.`;
      }
      
      if (passiveVoiceInstances > sentences.length * 0.2) {
        analysis += `\n\nYour text contains a high proportion of passive voice (approximately ${Math.round(passiveVoiceInstances / sentences.length * 100)}% of sentences), which is common in formal documents but less typical in authentic business writing.`;
      }
      
      if (userBusinessInfo.industry && otherIndustryTermCount > userIndustryTermCount) {
        analysis += `\n\nWe noticed terminology more common in industries outside your stated ${userBusinessInfo.industry} sector, which may indicate content adapted from other business contexts.`;
      }
      
      if (flaggedSections.length > 0) {
        analysis += `\n\nWe've highlighted ${flaggedSections.length} sections for your review that show the strongest indicators of potential non-originality.`;
      }
      
      // 11. Assemble the final result
      const analysisResult = {
        plagiarismScore: Math.round(plagiarismScore),
        analysis: analysis,
        suggestions: recommendations,
        flaggedSections: flaggedSections.slice(0, 3), // Limit to top 3 sections
        possibleSources: possibleSources,
        formalPhrases: formalPhraseMatches.slice(0, 5) // Include top matched phrases
      };
      
      res.json(analysisResult);
    } catch (error) {
      console.error("Plagiarism check error:", error);
      res.status(500).json({ message: "Failed to perform plagiarism check" });
    }
  });
  
  // Generate ideas endpoint (implemented via fixed implementation)
  apiRouter.post("/grantscribe/generate-ideas", isAuthenticated, async (req: Request, res: Response) => {
    const { handleGenerateIdeasEndpoint } = await import('./services/fixed-generate-ideas');
    return handleGenerateIdeasEndpoint(req, res);
  });
          // Use OpenAI to generate project ideas
          const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Using GPT-3.5 Turbo to avoid hitting quota limits
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
        
        // Generate advanced project ideas based on comprehensive analysis of grant and user business information
        const grantType = grant.type || '';
        const grantIndustry = grant.industry || '';
        const grantTitle = grant.title || '';
        const grantCategory = grant.category || '';
        const grantDescription = grant.description || '';
        const grantAmount = grant.fundingAmount || '';
        const grantEligibility = Array.isArray(grant.eligibilityCriteria) ? grant.eligibilityCriteria.join(', ') : '';
        const grantDeadline = grant.deadline || '';
        const grantFundingAgency = grant.fundingOrganization || grant.department || '';
        
        const userIndustry = userBusinessInfo.industry || '';
        const businessType = userBusinessInfo.businessType || '';
        const businessDescription = userBusinessInfo.businessDescription || '';
        const businessProvince = userBusinessInfo.province || '';
        const businessName = userBusinessInfo.businessName || '';
        const employeeCount = userBusinessInfo.employeeCount || '';
        const yearFounded = userBusinessInfo.yearFounded || '';
        
        // Parse business size from employee count
        let businessSize = 'small';
        if (employeeCount) {
          const employees = parseInt(employeeCount);
          if (!isNaN(employees)) {
            if (employees >= 100) {
              businessSize = 'large';
            } else if (employees >= 50) {
              businessSize = 'medium';
            } else if (employees >= 10) {
              businessSize = 'small';
            } else {
              businessSize = 'micro';
            }
          }
        }
        
        // Calculate business age and maturity
        let businessAge = 0;
        let businessMaturity = 'startup';
        if (yearFounded) {
          const foundingYear = parseInt(yearFounded);
          if (!isNaN(foundingYear)) {
            businessAge = 2025 - foundingYear;
            if (businessAge > 10) {
              businessMaturity = 'established';
            } else if (businessAge > 5) {
              businessMaturity = 'growing';
            } else if (businessAge > 2) {
              businessMaturity = 'early-stage';
            } else {
              businessMaturity = 'startup';
            }
          }
        }
        
        // Extract keywords from business description
        const businessKeywords: string[] = [];
        if (businessDescription) {
          const descriptionWords = businessDescription.toLowerCase().split(/\s+/);
          const keywordCandidate = new Set<string>();
          
          // Common significant business terms to look for
          const significantTerms = [
            'innovation', 'technology', 'sustainable', 'green', 'digital', 'traditional',
            'handmade', 'artisan', 'manufacturing', 'service', 'retail', 'wholesale',
            'export', 'import', 'local', 'global', 'community', 'social', 'training',
            'education', 'healthcare', 'consulting', 'design', 'software', 'hardware',
            'product', 'platform', 'solution', 'application', 'research', 'development'
          ];
          
          descriptionWords.forEach(word => {
            if (significantTerms.includes(word) && !keywordCandidate.has(word)) {
              keywordCandidate.add(word);
              businessKeywords.push(word);
            }
          });
        }
        
        // Determine primary and secondary focus areas from comprehensive analysis
        let primaryFocus = '';
        let secondaryFocus = '';
        
        // Logic for determining primary focus (industry/sector)
        if (userIndustry) {
          primaryFocus = userIndustry;
        } else if (grantIndustry && grantIndustry !== 'any') {
          primaryFocus = grantIndustry;
        } else if (grantCategory) {
          primaryFocus = grantCategory;
        } else if (businessKeywords.length > 0) {
          primaryFocus = businessKeywords[0];
        } else if (grantTitle.toLowerCase().includes('innovation')) {
          primaryFocus = 'innovation';
        } else if (grantTitle.toLowerCase().includes('research')) {
          primaryFocus = 'research';
        } else if (grantTitle.toLowerCase().includes('digital')) {
          primaryFocus = 'digital transformation';
        } else {
          primaryFocus = 'business improvement';
        }
        
        // Logic for determining secondary focus (common grant themes)
        const grantThemeKeywords = {
          'sustainability': ['green', 'sustainable', 'environmental', 'clean', 'renewable', 'eco'],
          'innovation': ['innovative', 'cutting-edge', 'novel', 'advancement', 'breakthrough'],
          'technology': ['tech', 'digital', 'software', 'hardware', 'platform', 'online'],
          'community': ['social', 'community', 'local', 'regional', 'public', 'nonprofit'],
          'research': ['research', 'development', 'study', 'investigation', 'analysis'],
          'international': ['export', 'global', 'international', 'foreign', 'worldwide', 'trade'],
          'workforce': ['training', 'skills', 'employment', 'jobs', 'personnel', 'talent'],
          'diversity': ['diverse', 'inclusion', 'inclusive', 'equity', 'accessibility'],
          'collaboration': ['partnership', 'collaborative', 'alliance', 'joint', 'cooperation']
        };
        
        // Check grant description to identify secondary theme
        for (const [theme, keywords] of Object.entries(grantThemeKeywords)) {
          if (grantDescription && keywords.some(keyword => 
            grantDescription.toLowerCase().includes(keyword)
          )) {
            secondaryFocus = theme;
            break;
          } else if (grantTitle && keywords.some(keyword => 
            grantTitle.toLowerCase().includes(keyword)
          )) {
            secondaryFocus = theme;
            break;
          }
        }
        
        // If no secondary focus found, derive from keywords or set default
        if (!secondaryFocus && businessKeywords.length > 1) {
          secondaryFocus = businessKeywords[1];
        } else if (!secondaryFocus) {
          // Default secondary focus based on grant type
          if (grantType === 'federal') {
            secondaryFocus = 'innovation';
          } else if (grantType === 'provincial') {
            secondaryFocus = 'community';
          } else {
            secondaryFocus = 'sustainability';
          }
        }
        
        // Generate highly customized project ideas based on business profile and grant details
        const projectIdeas: { title: string; description: string }[] = [];
        
        // Format the primary focus for use in titles, ensuring proper capitalization
        const formatTitle = (text: string): string => {
          return text.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        };
        
        // Primary and secondary focus with proper formatting
        const primaryFocusFormatted = formatTitle(primaryFocus);
        const secondaryFocusFormatted = formatTitle(secondaryFocus);
        
        // Business-specific customization elements
        const businessTypePrefix = businessType ? businessType : 'business';
        const locationContext = businessProvince ? `in ${businessProvince}` : 'in Canada';
        const businessSizeContext = businessSize === 'micro' || businessSize === 'small' 
          ? 'scalable for small businesses' 
          : 'leveraging organizational capacity';
        const maturityContext = businessMaturity === 'startup' || businessMaturity === 'early-stage'
          ? 'accelerating early growth'
          : 'building on established operations';
          
        // Generate ideas based on grant type with business context integration
        if (grantType === 'federal') {
          // Federal grants typically focus on broader economic impact, innovation, and cross-provincial benefits
          projectIdeas.push({
            title: `${businessName ? businessName : 'Canadian'} ${primaryFocusFormatted} Expansion Initiative`,
            description: `A strategic project designed for a ${businessTypePrefix} ${locationContext} to expand ${primaryFocus} capabilities across multiple regions, creating jobs and contributing to Canada's economic priorities. This initiative leverages your ${businessSize}-sized operation's ${maturityContext} to deliver measurable nationwide impact.`
          });
          
          projectIdeas.push({
            title: `Innovative ${primaryFocusFormatted} Solutions with ${secondaryFocusFormatted} Integration`,
            description: `Develop a groundbreaking approach that combines your expertise in ${primaryFocus} with emerging trends in ${secondaryFocus}. This project will position your ${businessTypePrefix} as a leader in addressing national-level challenges while creating exportable Canadian intellectual property and technology.`
          });
          
          projectIdeas.push({
            title: `Cross-Provincial ${primaryFocusFormatted} Network Development`,
            description: `Establish a collaborative network connecting your ${businessTypePrefix} with partners across multiple provinces to create a nationwide resource for ${primaryFocus} advancement. This approach is specifically designed for a ${businessMaturity} business, enabling you to leverage federal funding for broader market access.`
          });
          
          // Add a sector-specific idea if we have industry information
          if (userIndustry) {
            projectIdeas.push({
              title: `Canadian ${userIndustry} Sector Transformation through ${secondaryFocusFormatted}`,
              description: `Lead a sector-wide initiative that addresses key challenges in the ${userIndustry} industry through innovative ${secondaryFocus} solutions. This project leverages your unique position as a ${businessTypePrefix} ${locationContext} with ${businessAge > 0 ? `${businessAge} years of experience` : 'specialized expertise'} to drive national industry standards and practices.`
            });
          }
        } else if (grantType === 'provincial') {
          // Provincial grants focus on regional economic development and local impact
          projectIdeas.push({
            title: `${businessProvince || 'Provincial'} ${primaryFocusFormatted} Excellence Hub`,
            description: `Establish your ${businessTypePrefix} as a center of excellence for ${primaryFocus} within ${businessProvince || 'your province'}, serving as a resource and innovation catalyst for the local ecosystem. This initiative is specifically designed to address provincial priorities while leveraging your ${businessMaturity} stage capabilities.`
          });
          
          projectIdeas.push({
            title: `Regional ${primaryFocusFormatted} Talent Development Program`,
            description: `Create a specialized training program that builds critical skills in ${primaryFocus} for the local workforce, addressing provincial labor needs and economic goals. As a ${businessSize}-sized ${businessTypePrefix}, you're uniquely positioned to develop practical, industry-relevant training pathways that benefit the broader community.`
          });
          
          projectIdeas.push({
            title: `${businessProvince || 'Local'} ${secondaryFocusFormatted} Integration for ${primaryFocusFormatted}`,
            description: `Implement a regionally-focused initiative that combines ${secondaryFocus} approaches with ${primaryFocus} solutions to address specific needs within your local community. This project includes clear metrics and evaluation methods tailored for provincial reporting requirements and local impact measurement.`
          });
          
          // Add a business-size specific idea
          projectIdeas.push({
            title: `${businessSize.charAt(0).toUpperCase() + businessSize.slice(1)} Business ${primaryFocusFormatted} Accelerator`,
            description: `Develop a provincial resource specifically designed to help ${businessSize} ${businessTypePrefix}s like yours implement ${primaryFocus} solutions efficiently and cost-effectively. This project addresses the unique challenges faced by ${businessSize} organizations in ${businessProvince || 'your province'} while creating a model for regional economic development.`
          });
        } else {
          // Private grants often focus on specific organizational goals, partnerships, and measurable ROI
          projectIdeas.push({
            title: `Strategic ${primaryFocusFormatted} Partnership for ${businessTypePrefix}s`,
            description: `Develop a collaborative project between your ${businessTypePrefix} and the funding organization that aligns your ${primaryFocus} expertise with their ${secondaryFocus} priorities. This partnership will deliver measurable business outcomes while advancing the funder's strategic objectives in the ${userIndustry || 'industry'} sector.`
          });
          
          projectIdeas.push({
            title: `${primaryFocusFormatted} Market Expansion through ${secondaryFocusFormatted}`,
            description: `Leverage funding to enter new markets or develop new products that combine your ${primaryFocus} capabilities with innovative ${secondaryFocus} approaches. This initiative includes clear revenue and growth projections specifically calibrated for a ${businessSize} ${businessTypePrefix} at the ${businessMaturity} stage.`
          });
          
          projectIdeas.push({
            title: `${businessName || 'Business'} ${primaryFocusFormatted} Innovation Pilot`,
            description: `Create a novel approach to addressing ${primaryFocus} challenges that demonstrates potential for commercial success and stakeholder benefit. This pilot program is designed to generate valuable data and metrics that resonate with private funders while establishing your ${businessTypePrefix} as an innovation leader.`
          });
          
          // Add a maturity-specific idea
          projectIdeas.push({
            title: `${businessMaturity.charAt(0).toUpperCase() + businessMaturity.slice(1)} Stage ${primaryFocusFormatted} Scaling Program`,
            description: `Develop a targeted initiative that addresses the unique challenges and opportunities for ${primaryFocus} implementation at the ${businessMaturity} business stage. This program will demonstrate to private funders how their investment can achieve maximum impact for a ${businessTypePrefix} in your specific growth phase.`
          });
        }
        
        // Add highly customized cross-cutting ideas that work for any grant type
        projectIdeas.push({
          title: `Integrated ${primaryFocusFormatted}-${secondaryFocusFormatted} Solution`,
          description: `Develop an innovative approach that combines your ${businessTypePrefix}'s expertise in ${primaryFocus} with cutting-edge ${secondaryFocus} methodologies. This project is specifically tailored for a ${businessSize} organization at the ${businessMaturity} stage ${locationContext}, addressing unique challenges while creating scalable solutions with potential for broader application.`
        });
        
        // Add a digital transformation idea customized to the business
        projectIdeas.push({
          title: `Digital Transformation for ${businessSize.charAt(0).toUpperCase() + businessSize.slice(1)} ${primaryFocusFormatted} Providers`,
          description: `Implement a customized digital strategy that transforms how your ${businessTypePrefix} delivers ${primaryFocus} solutions, specifically designed for ${businessSize} organizations ${locationContext}. This initiative will improve operational efficiency, enhance customer experiences, and generate valuable data insights while addressing the unique constraints of ${businessMaturity} stage businesses.`
        });
        
        // If we have business description keywords, add a keyword-focused idea
        if (businessKeywords.length > 0) {
          const keywordFormatted = formatTitle(businessKeywords[0]);
          projectIdeas.push({
            title: `${keywordFormatted}-Driven ${primaryFocusFormatted} Innovation`,
            description: `Leverage your ${businessTypePrefix}'s unique approach to ${businessKeywords[0]} to create differentiated ${primaryFocus} solutions that stand out in the marketplace. This project builds on your established expertise while opening new revenue streams and partnership opportunities aligned with the grant's objectives.`
          });
        }
        
        // Generate implementation approaches customized to business profile
        const approachSuggestions: string[] = [];
        
        // Core implementation approaches for all businesses
        approachSuggestions.push(`Form a right-sized project team with clearly defined roles aligned with your ${businessSize} ${businessTypePrefix}'s organizational structure`);
        approachSuggestions.push(`Create a detailed project timeline with milestones that account for your ${businessMaturity} stage operational realities`);
        
        // Size and maturity-specific approaches
        if (businessSize === 'micro' || businessSize === 'small') {
          if (businessMaturity === 'startup' || businessMaturity === 'early-stage') {
            approachSuggestions.push(`Leverage agile methodologies with rapid iteration cycles to maximize learning while minimizing resource commitment`);
            approachSuggestions.push(`Build strategic partnerships with larger organizations or industry associations to extend your reach and capabilities`);
            approachSuggestions.push(`Implement lean measurement frameworks focusing on 3-5 key metrics that directly demonstrate grant impact`);
          } else {
            approachSuggestions.push(`Utilize your established business processes while introducing innovations that expand your ${primaryFocus} capabilities`);
            approachSuggestions.push(`Leverage your existing customer/client relationships to rapidly validate and refine your approach`);
            approachSuggestions.push(`Develop a comprehensive but pragmatic monitoring system that integrates with your current business metrics`);
          }
        } else {
          // Medium to large business approaches
          if (businessMaturity === 'growing') {
            approachSuggestions.push(`Establish cross-functional teams with representation from key business units to ensure org-wide alignment`);
            approachSuggestions.push(`Implement a staged deployment approach that allows for controlled scaling and minimizes operational disruption`);
            approachSuggestions.push(`Develop robust change management protocols to ensure successful adoption across the organization`);
          } else {
            approachSuggestions.push(`Leverage your organization's established governance frameworks while introducing appropriate innovation structures`);
            approachSuggestions.push(`Integrate the project with existing strategic initiatives to maximize synergies and organizational buy-in`);
            approachSuggestions.push(`Establish comprehensive reporting mechanisms that align with your enterprise-level performance management systems`);
          }
        }
        
        // Grant type-specific approaches
        if (grantType === 'federal') {
          approachSuggestions.push(`Implement robust documentation processes that satisfy federal reporting requirements while supporting business objectives`);
          approachSuggestions.push(`Establish connections with relevant federal agencies and industry partners to maximize project impact and visibility`);
        } else if (grantType === 'provincial') {
          approachSuggestions.push(`Engage with local economic development agencies and regional stakeholders to strengthen provincial alignment`);
          approachSuggestions.push(`Develop impact narratives that highlight regional benefits and contributions to provincial economic priorities`);
        } else {
          // Private grant approaches
          approachSuggestions.push(`Create regular touchpoints with the funding organization to ensure alignment and demonstrate ongoing value`);
          approachSuggestions.push(`Develop case studies and success metrics that the funding organization can leverage in their own reporting`);
        }
        
        // Add an industry-specific approach if we have that information
        if (userIndustry) {
          approachSuggestions.push(`Apply industry best practices specific to ${userIndustry} while incorporating innovative ${primaryFocus}-${secondaryFocus} integration approaches`);
        }
        
        // Generate alignment notes with specific business context
        const alignmentNotes: string[] = [
          `This project directly addresses the grant's focus on ${primaryFocus} with solutions tailored for a ${businessTypePrefix}`,
          `The proposed initiatives align with the grant's objectives while leveraging your ${businessSize}-sized organization's unique capabilities`,
          `The project outcomes will contribute to the grant's goals while supporting your business growth at the ${businessMaturity} stage`,
          `The approach is designed to meet the specific requirements outlined in the grant description with practical implementation for a business ${locationContext}`
        ];
        
        // Generate budget considerations based on business size and maturity
        const budgetConsiderations: string[] = [];
        
        // Budget considerations vary by business size
        if (businessSize === 'micro' || businessSize === 'small') {
          budgetConsiderations.push(`Allocate 30-40% for critical personnel costs, considering part-time or contract resources to maximize flexibility`);
          budgetConsiderations.push(`Reserve 25-35% for essential technology and equipment that offers the best ROI for a ${businessSize} ${businessTypePrefix}`);
          budgetConsiderations.push(`Set aside 10-15% for targeted marketing and outreach focused on specific customer segments`);
          budgetConsiderations.push(`Budget 5-10% for lean evaluation and quality assurance processes appropriate for a ${businessSize} organization`);
          budgetConsiderations.push(`Include 10-15% contingency for unexpected opportunities, which is crucial for ${businessMaturity} stage businesses`);
        } else {
          budgetConsiderations.push(`Allocate 35-45% for comprehensive personnel costs, including dedicated project management and specialized expertise`);
          budgetConsiderations.push(`Reserve 20-25% for enterprise-grade technology and equipment with scalability considerations`);
          budgetConsiderations.push(`Set aside 15-20% for multichannel marketing, communications, and stakeholder engagement`);
          budgetConsiderations.push(`Budget 10-15% for robust evaluation frameworks and quality assurance systems`);
          budgetConsiderations.push(`Include 5-10% contingency aligned with your organization's established risk management protocols`);
        }
        
        // Add specific recommendation based on maturity
        if (businessMaturity === 'startup' || businessMaturity === 'early-stage') {
          budgetConsiderations.push(`Consider allocating 10-15% specifically for rapid iteration and product-market fit validation`);
        } else if (businessMaturity === 'growing') {
          budgetConsiderations.push(`Consider allocating 10-15% specifically for scaling operations and market expansion activities`);
        } else {
          budgetConsiderations.push(`Consider allocating 10-15% specifically for innovation and business transformation initiatives`);
        }
        
        // Generate impact metrics tailored to business profile and grant type
        const impactMetrics: string[] = [];
        
        // Business-specific metrics based on size and type
        if (businessSize === 'micro' || businessSize === 'small') {
          impactMetrics.push(`Growth in monthly revenue directly attributable to this ${primaryFocus} initiative (target: 15-25% increase in 12 months)`);
          impactMetrics.push(`Number of new clients or customers acquired through the project (specific to a ${businessSize} ${businessTypePrefix})`);
          impactMetrics.push(`Cost savings or efficiency improvements (measured as % reduction in operational costs)`);
        } else {
          impactMetrics.push(`Number of new jobs created or positions supported (target: aligned with your ${businessSize} organization's growth plan)`);
          impactMetrics.push(`Return on investment calculation showing direct and indirect benefits`);
          impactMetrics.push(`Productivity improvements measured through standardized KPIs in your industry`);
        }
        
        // Industry-specific metrics if we have that information
        if (userIndustry) {
          if (userIndustry.includes('tech') || userIndustry.includes('software')) {
            impactMetrics.push(`Adoption rate of new ${primaryFocus} technologies or solutions (user growth metrics)`);
            impactMetrics.push(`Technical performance improvements (speed, reliability, or other relevant metrics)`);
          } else if (userIndustry.includes('manufacturing')) {
            impactMetrics.push(`Production capacity increases or quality improvements (% change)`);
            impactMetrics.push(`Supply chain or logistical optimizations (measured in time or cost savings)`);
          } else if (userIndustry.includes('health') || userIndustry.includes('medical')) {
            impactMetrics.push(`Patient outcome improvements or treatment accessibility enhancements`);
            impactMetrics.push(`Healthcare cost reductions or service delivery efficiency metrics`);
          } else if (userIndustry.includes('retail')) {
            impactMetrics.push(`Customer satisfaction scores and repeat purchase rates`);
            impactMetrics.push(`Inventory turnover improvements or reduced waste metrics`);
          } else if (userIndustry.includes('service')) {
            impactMetrics.push(`Client satisfaction and retention metrics specific to your service offerings`);
            impactMetrics.push(`Service delivery time reductions or quality improvements (measured through client feedback)`);
          } else {
            // Generic industry metric
            impactMetrics.push(`Industry-specific performance indicators relevant to ${userIndustry} (benchmarked against sector standards)`);
          }
        }
        
        // Grant type-specific impact metrics
        if (grantType === 'federal') {
          impactMetrics.push(`Economic impact metrics across multiple regions or provinces of Canada`);
          impactMetrics.push(`Contribution to national priorities in ${primaryFocus} (quantified through specific indicators)`);
        } else if (grantType === 'provincial') {
          impactMetrics.push(`Local economic impact in ${businessProvince || 'your province'} (measured through direct and indirect benefits)`);
          impactMetrics.push(`Alignment with provincial development priorities for ${businessProvince || 'your region'}`);
        } else {
          // Private grant metrics
          impactMetrics.push(`Alignment with the funding organization's strategic objectives (specific measurable outcomes)`);
          impactMetrics.push(`Partnership value metrics demonstrating mutual benefit (quantified ROI for both parties)`);
        }
        
        // Always include a sustainability or long-term impact metric
        impactMetrics.push(`Long-term sustainability indicators showing how the initiative will continue to generate value beyond the funding period`);
        
        // Add a specific grant-aligned metric
        if (grant.category) {
          impactMetrics.push(`Specific ${grant.category} performance indicators directly tied to grant objectives and reporting requirements`);
        }
        
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
