import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserGrantSchema } from "@shared/schema";
import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Get grants by type (federal or provincial)
  apiRouter.get("/grants/type/:type", async (req: Request, res: Response) => {
    try {
      const type = req.params.type;
      if (type !== "federal" && type !== "provincial") {
        return res.status(400).json({ message: "Invalid grant type. Must be 'federal' or 'provincial'" });
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

  // Get user's saved grants (My List)
  apiRouter.get("/mylist/:userId", async (req: Request, res: Response) => {
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
  apiRouter.post("/mylist", async (req: Request, res: Response) => {
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
  apiRouter.delete("/mylist/:userId/:grantId", async (req: Request, res: Response) => {
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
  apiRouter.get("/mylist/:userId/:grantId", async (req: Request, res: Response) => {
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

  // GrantSherpa endpoints
  
  // Generate application assistance
  apiRouter.post("/grantsherpa/assist", async (req: Request, res: Response) => {
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
            content: `You are GrantSherpa, an expert grant application consultant specializing in Canadian grants. 
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
      console.error("GrantSherpa assistance error:", error);
      res.status(500).json({ message: "Failed to generate application assistance" });
    }
  });
  
  // Check for plagiarism
  apiRouter.post("/grantsherpa/plagiarism-check", async (req: Request, res: Response) => {
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
            content: `You are GrantSherpa's plagiarism detection system. Your job is to analyze text for signs of potential plagiarism, 
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
  apiRouter.post("/grantsherpa/generate-ideas", async (req: Request, res: Response) => {
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
            content: `You are GrantSherpa's idea generation system, specializing in Canadian grant applications.
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

  // Mount API routes with prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
