import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertExerciseLogSchema, 
  insertWorkoutTemplateSchema, 
  insertWorkoutSessionSchema,
  insertAiSuggestionSchema 
} from "@shared/schema";
import { generateWorkoutSuggestions } from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Exercise routes
  app.get("/api/exercises", async (req, res) => {
    try {
      const { search, category } = req.query;
      const exercises = await storage.getExercises(
        search as string, 
        category as string
      );
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.get("/api/exercises/:id", async (req, res) => {
    try {
      const exercise = await storage.getExercise(req.params.id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });

  // Workout template routes
  app.get("/api/workout-templates", async (req, res) => {
    try {
      // For demo purposes, using a default user ID
      const userId = "demo-user";
      const templates = await storage.getWorkoutTemplates(userId);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout templates" });
    }
  });

  app.post("/api/workout-templates", async (req, res) => {
    try {
      const validatedData = insertWorkoutTemplateSchema.parse({
        ...req.body,
        userId: "demo-user"
      });
      const template = await storage.createWorkoutTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ message: "Invalid workout template data" });
    }
  });

  app.put("/api/workout-templates/:id", async (req, res) => {
    try {
      const updated = await storage.updateWorkoutTemplate(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Workout template not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update workout template" });
    }
  });

  app.delete("/api/workout-templates/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteWorkoutTemplate(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Workout template not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete workout template" });
    }
  });

  // Workout session routes
  app.get("/api/workout-sessions", async (req, res) => {
    try {
      const userId = "demo-user";
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const sessions = await storage.getWorkoutSessions(userId, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout sessions" });
    }
  });

  app.post("/api/workout-sessions", async (req, res) => {
    try {
      const validatedData = insertWorkoutSessionSchema.parse({
        ...req.body,
        userId: "demo-user"
      });
      const session = await storage.createWorkoutSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid workout session data" });
    }
  });

  app.put("/api/workout-sessions/:id", async (req, res) => {
    try {
      const updated = await storage.updateWorkoutSession(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update workout session" });
    }
  });

  // Exercise log routes
  app.get("/api/exercise-logs", async (req, res) => {
    try {
      const userId = "demo-user";
      const { exerciseId } = req.query;
      const logs = await storage.getExerciseLogs(userId, exerciseId as string);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercise logs" });
    }
  });

  app.post("/api/exercise-logs", async (req, res) => {
    try {
      const validatedData = insertExerciseLogSchema.parse({
        ...req.body,
        userId: "demo-user"
      });
      const log = await storage.createExerciseLog(validatedData);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ message: "Invalid exercise log data" });
    }
  });

  // AI suggestions routes
  app.get("/api/ai-suggestions", async (req, res) => {
    try {
      const userId = "demo-user";
      const suggestions = await storage.getAiSuggestions(userId);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI suggestions" });
    }
  });

  app.post("/api/ai-suggestions/generate", async (req, res) => {
    try {
      const userId = "demo-user";
      
      // Get user stats and recent workouts
      const userStats = await storage.getUserStats(userId);
      const recentWorkouts = await storage.getWorkoutSessions(userId, 5);
      
      // Generate AI suggestions
      const analysis = await generateWorkoutSuggestions(userStats, recentWorkouts);
      
      // Store suggestions in the database
      const suggestions = [];
      
      // Add tips
      for (const tip of analysis.tips) {
        const suggestion = await storage.createAiSuggestion({
          userId,
          type: "tip",
          title: "💡 Today's Tip",
          content: tip,
          isRead: 0
        });
        suggestions.push(suggestion);
      }
      
      // Add recommendations
      for (const rec of analysis.recommendations) {
        const suggestion = await storage.createAiSuggestion({
          userId,
          type: "recommendation", 
          title: "🎯 Recommendation",
          content: rec,
          isRead: 0
        });
        suggestions.push(suggestion);
      }
      
      res.json(suggestions);
    } catch (error) {
      console.error('AI suggestions error:', error);
      res.status(500).json({ message: "Failed to generate AI suggestions" });
    }
  });

  app.put("/api/ai-suggestions/:id/read", async (req, res) => {
    try {
      const marked = await storage.markAiSuggestionRead(req.params.id);
      if (!marked) {
        return res.status(404).json({ message: "AI suggestion not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to mark suggestion as read" });
    }
  });

  // User stats route
  app.get("/api/user-stats", async (req, res) => {
    try {
      const userId = "demo-user";
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
