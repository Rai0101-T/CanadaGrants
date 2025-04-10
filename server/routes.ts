import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { businessProfileSchema, insertUserGrantSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import { WebSocketServer } from "ws";
import puppeteer from "puppeteer";
import cron from "node-cron";

// Import scraper functions and types based on your project structure
// This can be adapted to your specific needs
interface ScrapedGrant {
  title: string;
  description: string;
  type: "federal" | "provincial" | "private";
  // Add more fields as per your schema
}

async function runAllScrapers() {
  // Implement or import your scraper functionality
  console.log("Running all scrapers");
}

async function processGrants(grants: ScrapedGrant[]) {
  // Process scraped grants into database format
  console.log(`Processing ${grants.length} scraped grants`);
  return grants.map(grant => ({
    ...grant,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

async function saveGrantsToDatabase(grants: any[]) {
  // Save processed grants to database
  console.log(`Saving ${grants.length} grants to database`);
  for (const grant of grants) {
    try {
      await storage.addGrant(grant);
    } catch (error) {
      console.error(`Error saving grant: ${grant.title}`, error);
    }
  }
}

function scheduleScrapingJob() {
  // Schedule scraping job to run weekly
  cron.schedule('0 0 * * 0', async () => {
    console.log('Running scheduled grant scraping job...');
    try {
      await runAllScrapers();
      console.log('Scheduled grant scraping job completed successfully');
    } catch (error) {
      console.error('Error in scheduled scraping job:', error);
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Create API router
  const apiRouter = express.Router();
  
  // Get all grants
  apiRouter.get("/grants", async (req: Request, res: Response) => {
    try {
      const grants = await storage.getAllGrants();
      res.json(grants);
    } catch (error) {
      console.error("Error getting all grants:", error);
      res.status(500).json({ error: "Failed to fetch grants" });
    }
  });
  
  // Get featured grants
  apiRouter.get("/grants/featured", async (req: Request, res: Response) => {
    try {
      const featuredGrants = await storage.getFeaturedGrants();
      res.json(featuredGrants);
    } catch (error) {
      console.error("Error getting featured grants:", error);
      res.status(500).json({ error: "Failed to fetch featured grants" });
    }
  });
  
  // Get grant by id
  apiRouter.get("/grants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid grant ID" });
      }
      
      const grant = await storage.getGrantById(id);
      if (!grant) {
        return res.status(404).json({ error: "Grant not found" });
      }
      
      res.json(grant);
    } catch (error) {
      console.error("Error getting grant by id:", error);
      res.status(500).json({ error: "Failed to fetch grant" });
    }
  });
  
  // Get grants by type
  apiRouter.get("/grants/type/:type", async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      if (!type || !["federal", "provincial", "private"].includes(type)) {
        return res.status(400).json({ error: "Invalid grant type" });
      }
      
      const grants = await storage.getGrantsByType(type);
      res.json(grants);
    } catch (error) {
      console.error("Error getting grants by type:", error);
      res.status(500).json({ error: "Failed to fetch grants by type" });
    }
  });
  
  // Search grants
  apiRouter.get("/search/:query", async (req: Request, res: Response) => {
    try {
      const { query } = req.params;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const grants = await storage.searchGrants(query);
      res.json(grants);
    } catch (error) {
      console.error("Error searching grants:", error);
      res.status(500).json({ error: "Failed to search grants" });
    }
  });
  
  // Authentication middleware
  function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: "Authentication required" });
  }
  
  // Update user profile
  apiRouter.post("/user/update", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const updateData = businessProfileSchema.parse(req.body);
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid profile data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  
  // Get user's saved grants
  apiRouter.get("/mylist/:userId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      // Check if the requesting user is the same as the user ID in the params
      if (req.user?.id !== userId) {
        return res.status(403).json({ error: "Not authorized to view this user's grants" });
      }
      
      const userGrants = await storage.getUserGrantsWithStatus(userId);
      res.json(userGrants);
    } catch (error) {
      console.error("Error getting user grants:", error);
      res.status(500).json({ error: "Failed to fetch user grants" });
    }
  });
  
  // Add grant to user's list
  apiRouter.post("/mylist", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { userId, grantId, status = "Saved", notes = "" } = req.body;
      
      if (!userId || !grantId) {
        return res.status(400).json({ error: "User ID and Grant ID are required" });
      }
      
      // Check if the requesting user is the same as the user ID in the body
      if (req.user?.id !== userId) {
        return res.status(403).json({ error: "Not authorized to modify this user's grants" });
      }
      
      // Check if the grant exists
      const grant = await storage.getGrantById(grantId);
      if (!grant) {
        return res.status(404).json({ error: "Grant not found" });
      }
      
      // Check if the grant is already in the user's list
      const isGrantInList = await storage.isGrantInUserList(userId, grantId);
      if (isGrantInList) {
        return res.status(400).json({ error: "Grant is already in user's list" });
      }
      
      const userGrantData = insertUserGrantSchema.parse({
        userId,
        grantId,
        status,
        notes,
        addedAt: new Date().toISOString()
      });
      
      const userGrant = await storage.addGrantToUserList(userGrantData);
      res.status(201).json(userGrant);
    } catch (error) {
      console.error("Error adding grant to user list:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add grant to user's list" });
    }
  });
  
  // Remove grant from user's list
  apiRouter.delete("/mylist/:userId/:grantId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const grantId = parseInt(req.params.grantId, 10);
      
      if (isNaN(userId) || isNaN(grantId)) {
        return res.status(400).json({ error: "Invalid user ID or grant ID" });
      }
      
      // Check if the requesting user is the same as the user ID in the params
      if (req.user?.id !== userId) {
        return res.status(403).json({ error: "Not authorized to modify this user's grants" });
      }
      
      const removed = await storage.removeGrantFromUserList(userId, grantId);
      if (!removed) {
        return res.status(404).json({ error: "Grant not found in user's list" });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error removing grant from user list:", error);
      res.status(500).json({ error: "Failed to remove grant from user's list" });
    }
  });
  
  // Check if grant is in user's list
  apiRouter.get("/mylist/:userId/:grantId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const grantId = parseInt(req.params.grantId, 10);
      
      if (isNaN(userId) || isNaN(grantId)) {
        return res.status(400).json({ error: "Invalid user ID or grant ID" });
      }
      
      // Check if the requesting user is the same as the user ID in the params
      if (req.user?.id !== userId) {
        return res.status(403).json({ error: "Not authorized to check this user's grants" });
      }
      
      const isGrantInList = await storage.isGrantInUserList(userId, grantId);
      res.json({ isInList: isGrantInList });
    } catch (error) {
      console.error("Error checking if grant is in user list:", error);
      res.status(500).json({ error: "Failed to check if grant is in user's list" });
    }
  });
  
  // Update user grant status
  apiRouter.post("/mylist/:userId/:grantId/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const grantId = parseInt(req.params.grantId, 10);
      const { status, notes } = req.body;
      
      if (isNaN(userId) || isNaN(grantId) || !status) {
        return res.status(400).json({ error: "Invalid user ID, grant ID, or status" });
      }
      
      // Check if the requesting user is the same as the user ID in the params
      if (req.user?.id !== userId) {
        return res.status(403).json({ error: "Not authorized to modify this user's grants" });
      }
      
      const updatedUserGrant = await storage.updateUserGrantStatus(userId, grantId, status, notes);
      if (!updatedUserGrant) {
        return res.status(404).json({ error: "Grant not found in user's list" });
      }
      
      res.json(updatedUserGrant);
    } catch (error) {
      console.error("Error updating user grant status:", error);
      res.status(500).json({ error: "Failed to update grant status" });
    }
  });
  
  // Calculate grant compatibility score based on user's business profile
  apiRouter.post("/grants/compatibility/:grantId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const grantId = parseInt(req.params.grantId, 10);
      if (isNaN(grantId)) {
        return res.status(400).json({ error: "Invalid grant ID" });
      }
      
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User ID not found" });
      }
      
      // Get grant details
      const grant = await storage.getGrantById(grantId);
      if (!grant) {
        return res.status(404).json({ error: "Grant not found" });
      }
      
      // Get user's business profile
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Calculate compatibility score
      // This is a simplified example - implement your actual compatibility algorithm
      const compatibilityFactors = [
        { name: "Industry", weight: 0.25, score: user.industry && grant.industry ? (user.industry === grant.industry ? 1 : 0.5) : 0.5 },
        { name: "Location", weight: 0.2, score: user.province && grant.province ? (grant.province === user.province ? 1 : 0.3) : 0.5 },
        { name: "Business Size", weight: 0.15, score: user.employeeCount ? 0.7 : 0.5 }, // Simplified since schema doesn't have eligibleBusinessSize
        { name: "Business Type", weight: 0.15, score: user.businessType ? 0.7 : 0.5 }, // Simplified since schema doesn't have eligibleBusinessTypes
        { name: "Purpose", weight: 0.15, score: 0.7 }, // Default to medium compatibility for purpose
        { name: "Funding Amount", weight: 0.1, score: 0.8 } // Default to high compatibility for funding amount
      ];
      
      const totalScore = compatibilityFactors.reduce((acc, factor) => acc + (factor.score * factor.weight), 0);
      const normalizedScore = Math.round(totalScore * 100);
      
      // Return compatibility score and factors
      res.json({
        compatibilityScore: normalizedScore,
        factors: compatibilityFactors
      });
    } catch (error) {
      console.error("Error calculating grant compatibility:", error);
      res.status(500).json({ error: "Failed to calculate grant compatibility" });
    }
  });
  
  // Recommend grants based on user's business profile
  apiRouter.post("/grants/recommend", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User ID not found" });
      }
      
      // Get user's business profile
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Get all grants
      const grants = await storage.getAllGrants();
      
      // Calculate compatibility score for each grant
      const scoredGrants = grants.map(grant => {
        // This is a simplified example - implement your actual compatibility algorithm
        let score = 0;
        let factors = 0;
        
        // Industry match
        if (user.industry && grant.industry) {
          score += user.industry === grant.industry ? 30 : 15;
          factors++;
        }
        
        // Location match
        if (user.province && grant.province) {
          score += grant.province === user.province ? 25 : 10;
          factors++;
        }
        
        // Business size match
        if (user.employeeCount) {
          // Simplified business size matching since schema doesn't have eligibleBusinessSize
          score += 20;
          factors++;
        }
        
        // Business type match
        if (user.businessType) {
          // Simplified business type matching since schema doesn't have eligibleBusinessTypes
          score += 20;
          factors++;
        }
        
        // Normalize score based on factors considered
        const normalizedScore = factors > 0 ? Math.round(score / factors) : 50;
        
        return {
          ...grant,
          compatibilityScore: normalizedScore
        };
      });
      
      // Sort grants by compatibility score (highest first)
      scoredGrants.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
      
      // Return top recommended grants in a 'recommendations' property to match client expectations
      res.json({ recommendations: scoredGrants.slice(0, 10) });
    } catch (error) {
      console.error("Error recommending grants:", error);
      res.status(500).json({ error: "Failed to recommend grants" });
    }
  });
  
  // GrantScribe assistance endpoint
  apiRouter.post("/grantscribe/assist", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Import the fixed implementation
      const { handleAssistEndpoint } = await import('./services/fixed-assist-endpoint');
      
      // Use the fixed implementation
      return handleAssistEndpoint(req, res);
    } catch (error) {
      console.error("Error in assist endpoint:", error);
      return res.status(500).json({ 
        error: "Internal server error", 
        errorMessage: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // GrantScribe plagiarism check endpoint
  apiRouter.post("/grantscribe/plagiarism-check", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Import the fixed implementation
      const { handlePlagiarismCheckEndpoint } = await import('./services/fixed-plagiarism-check');
      
      // Use the fixed implementation
      return handlePlagiarismCheckEndpoint(req, res);
    } catch (error) {
      console.error("Error in plagiarism check endpoint:", error);
      return res.status(500).json({ 
        error: "Internal server error", 
        errorMessage: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // Generate idea suggestions
  apiRouter.post("/grantscribe/generate-ideas", isAuthenticated, async (req: Request, res: Response) => {
    // Import the fixed implementation
    try {
      const { handleGenerateIdeasEndpoint } = await import('./services/fixed-generate-ideas');
      
      // Use the fixed implementation
      return handleGenerateIdeasEndpoint(req, res);
    } catch (error) {
      console.error("Error in generate ideas endpoint:", error);
      return res.status(500).json({ 
        error: "Internal server error", 
        errorMessage: error instanceof Error ? error.message : "Unknown error" 
      });
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
        
        // This is a placeholder for running specific scrapers
        // You would implement the actual scraper logic based on your project's needs
        res.json({ message: `${source} scraping process started in the background. Check server logs for progress.` });
      } else {
        res.status(403).json({ message: "Admin access required" });
      }
    } catch (error) {
      console.error("Error triggering specific scraper:", error);
      res.status(500).json({ message: "Failed to trigger specific grant scraper" });
    }
  });
  
  // Add a new grant (admin endpoint)
  apiRouter.post("/admin/grants/add", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Check if user is an admin
      if (req.user && req.user.email && (req.user.email.includes('admin') || req.user.email === 'admin@grantflix.com')) {
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
      } else {
        res.status(403).json({ message: "Admin access required" });
      }
    } catch (error) {
      console.error("Error adding grant:", error);
      res.status(500).json({ error: "Failed to add grant" });
    }
  });
  
  // Update grant image (admin endpoint)
  apiRouter.post("/admin/grants/update-image", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Check if user is an admin
      if (req.user && req.user.email && (req.user.email.includes('admin') || req.user.email === 'admin@grantflix.com')) {
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
      } else {
        res.status(403).json({ message: "Admin access required" });
      }
    } catch (error) {
      console.error("Error updating grant image:", error);
      res.status(500).json({ error: "Failed to update grant image" });
    }
  });
  
  // Endpoint to delete a grant by ID (admin endpoint)
  apiRouter.delete("/admin/grants/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Check if user is an admin
      if (req.user && req.user.email && (req.user.email.includes('admin') || req.user.email === 'admin@grantflix.com')) {
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
      } else {
        res.status(403).json({ message: "Admin access required" });
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

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle different message types
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
  
  return httpServer;
}