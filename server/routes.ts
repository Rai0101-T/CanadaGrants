import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserGrantSchema, InsertGrant } from "@shared/schema";
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
      
      // Use OpenAI to analyze and improve the application
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are GrantScribe, an expert grant application consultant specializing in Canadian grants. 
                     You provide constructive feedback and improvements to grant applications to help them succeed.
                     Analyze the application text for the ${grant.title} grant and provide detailed, actionable advice.`
          },
          {
            role: "user",
            content: `Grant details:
                     Title: ${grant.title}
                     Description: ${grant.description}
                     Type: ${grant.type}
                     
                     My draft application:
                     ${applicationText}
                     
                     Please analyze my application and provide:
                     1. Overall assessment
                     2. Specific strengths
                     3. Areas for improvement
                     4. Suggested edits and rewording
                     5. Additional points to consider including`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });
      
      res.json({
        feedback: response.choices[0].message.content,
        grant: grant
      });
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
      
      // Use OpenAI to check for potential plagiarism
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are GrantScribe's plagiarism detection system. Your job is to analyze text for signs of potential plagiarism, 
                     such as unusual phrasings, inconsistent tone/style, advanced vocabulary mixed with simple language, 
                     or passages that appear to be written by different authors.
                     
                     Provide your analysis in JSON format with the following structure:
                     {
                       "plagiarismScore": [number between 0-100 indicating likelihood of plagiarism],
                       "flaggedSections": [array of suspicious passages],
                       "explanation": [detailed explanation of concerns],
                       "recommendations": [suggestions to fix issues]
                     }`
          },
          {
            role: "user",
            content: `Please analyze the following text for potential plagiarism:
                     
                     ${text}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
        max_tokens: 1500,
      });
      
      // Get content from the response
      const content = response.choices[0].message.content;
      
      // Safely parse the JSON if content exists
      if (content) {
        const analysisResult = JSON.parse(content);
        res.json(analysisResult);
      } else {
        res.status(500).json({ message: "Failed to get response from AI service" });
      }
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
            content: `Generate project ideas for the following grant:
                     
                     Grant: ${grant.title}
                     Description: ${grant.description}
                     Type: ${grant.type}
                     Amount: ${grant.fundingAmount}
                     
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
