import { 
  type User, 
  type InsertUser, 
  type Exercise, 
  type InsertExercise,
  type WorkoutTemplate,
  type InsertWorkoutTemplate,
  type WorkoutSession,
  type InsertWorkoutSession,
  type ExerciseLog,
  type InsertExerciseLog,
  type AiSuggestion,
  type InsertAiSuggestion
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Exercise operations
  getExercises(search?: string, category?: string): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;

  // Workout template operations
  getWorkoutTemplates(userId: string): Promise<WorkoutTemplate[]>;
  getWorkoutTemplate(id: string): Promise<WorkoutTemplate | undefined>;
  createWorkoutTemplate(template: InsertWorkoutTemplate): Promise<WorkoutTemplate>;
  updateWorkoutTemplate(id: string, template: Partial<InsertWorkoutTemplate>): Promise<WorkoutTemplate | undefined>;
  deleteWorkoutTemplate(id: string): Promise<boolean>;

  // Workout session operations
  getWorkoutSessions(userId: string, limit?: number): Promise<WorkoutSession[]>;
  getWorkoutSession(id: string): Promise<WorkoutSession | undefined>;
  createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession>;
  updateWorkoutSession(id: string, session: Partial<InsertWorkoutSession>): Promise<WorkoutSession | undefined>;

  // Exercise log operations
  getExerciseLogs(userId: string, exerciseId?: string): Promise<ExerciseLog[]>;
  createExerciseLog(log: InsertExerciseLog): Promise<ExerciseLog>;

  // AI suggestions operations
  getAiSuggestions(userId: string): Promise<AiSuggestion[]>;
  createAiSuggestion(suggestion: InsertAiSuggestion): Promise<AiSuggestion>;
  markAiSuggestionRead(id: string): Promise<boolean>;

  // Stats operations
  getUserStats(userId: string): Promise<{
    weeklyWorkouts: number;
    totalWeight: number;
    streak: number;
    weeklyProgress: Array<{day: string, duration: number}>;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private exercises: Map<string, Exercise>;
  private workoutTemplates: Map<string, WorkoutTemplate>;
  private workoutSessions: Map<string, WorkoutSession>;
  private exerciseLogs: Map<string, ExerciseLog>;
  private aiSuggestions: Map<string, AiSuggestion>;

  constructor() {
    this.users = new Map();
    this.exercises = new Map();
    this.workoutTemplates = new Map();
    this.workoutSessions = new Map();
    this.exerciseLogs = new Map();
    this.aiSuggestions = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Create demo user
    const demoUser: User = {
      id: "demo-user",
      username: "demo",
      password: "demo123"
    };
    this.users.set("demo-user", demoUser);

    // Seed exercises
    const exerciseData = [
      { name: "Bench Press", category: "Chest", difficulty: "Intermediate", equipment: "Barbell", instructions: "Lie on bench, lower bar to chest, press up", targetMuscles: ["chest", "triceps", "shoulders"] },
      { name: "Deadlift", category: "Back", difficulty: "Advanced", equipment: "Barbell", instructions: "Hip hinge movement, lift bar from ground", targetMuscles: ["hamstrings", "glutes", "back"] },
      { name: "Squats", category: "Legs", difficulty: "Intermediate", equipment: "Barbell", instructions: "Lower hips down and back, then stand up", targetMuscles: ["quadriceps", "glutes", "hamstrings"] },
      { name: "Pull-ups", category: "Back", difficulty: "Intermediate", equipment: "Bodyweight", instructions: "Hang from bar, pull body up", targetMuscles: ["lats", "biceps", "rear delts"] },
      { name: "Shoulder Press", category: "Shoulders", difficulty: "Beginner", equipment: "Dumbbells", instructions: "Press weights overhead from shoulder height", targetMuscles: ["shoulders", "triceps"] },
      { name: "Planks", category: "Core", difficulty: "Beginner", equipment: "Bodyweight", instructions: "Hold body in straight line on elbows", targetMuscles: ["abs", "core"] },
      { name: "Push-ups", category: "Chest", difficulty: "Beginner", equipment: "Bodyweight", instructions: "Lower body to ground, push back up", targetMuscles: ["chest", "triceps", "shoulders"] },
      { name: "Bicep Curls", category: "Arms", difficulty: "Beginner", equipment: "Dumbbells", instructions: "Curl weights to shoulders", targetMuscles: ["biceps"] },
    ];

    const exerciseIds: string[] = [];
    exerciseData.forEach(exercise => {
      const id = randomUUID();
      exerciseIds.push(id);
      this.exercises.set(id, {
        id,
        ...exercise,
        instructions: exercise.instructions || null,
        targetMuscles: exercise.targetMuscles || null,
        createdAt: new Date(),
      });
    });

    // Add some sample workout data for demo
    const sampleWorkout: WorkoutSession = {
      id: randomUUID(),
      userId: "demo-user",
      templateId: null,
      name: "Morning Workout",
      startTime: new Date(Date.now() - 86400000), // Yesterday
      endTime: new Date(Date.now() - 86400000 + 3600000), // 1 hour later
      exercises: [
        { exerciseId: exerciseIds[0], sets: 3, reps: 10, weight: 135 },
        { exerciseId: exerciseIds[2], sets: 3, reps: 12, weight: 185 }
      ],
      notes: "Good workout, felt strong",
      totalWeight: "4050",
      duration: 60,
    };
    this.workoutSessions.set(sampleWorkout.id, sampleWorkout);

    // Add some exercise logs
    if (exerciseIds.length > 0) {
      const log1: ExerciseLog = {
        id: randomUUID(),
        userId: "demo-user",
        exerciseId: exerciseIds[0],
        sessionId: sampleWorkout.id,
        sets: 3,
        reps: 10,
        weight: "135",
        notes: null,
        loggedAt: new Date(Date.now() - 86400000),
      };
      this.exerciseLogs.set(log1.id, log1);

      const log2: ExerciseLog = {
        id: randomUUID(),
        userId: "demo-user",
        exerciseId: exerciseIds[2],
        sessionId: sampleWorkout.id,
        sets: 3,
        reps: 12,
        weight: "185",
        notes: null,
        loggedAt: new Date(Date.now() - 86400000),
      };
      this.exerciseLogs.set(log2.id, log2);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getExercises(search?: string, category?: string): Promise<Exercise[]> {
    let exercises = Array.from(this.exercises.values());
    
    if (search) {
      exercises = exercises.filter(ex => 
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        (ex.targetMuscles && ex.targetMuscles.some(muscle => muscle.toLowerCase().includes(search.toLowerCase())))
      );
    }
    
    if (category && category !== "all" && category !== "All Categories") {
      exercises = exercises.filter(ex => ex.category === category);
    }
    
    return exercises;
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const id = randomUUID();
    const newExercise: Exercise = {
      ...exercise,
      id,
      createdAt: new Date(),
      instructions: exercise.instructions || null,
      targetMuscles: exercise.targetMuscles || null,
    };
    this.exercises.set(id, newExercise);
    return newExercise;
  }

  async getWorkoutTemplates(userId: string): Promise<WorkoutTemplate[]> {
    return Array.from(this.workoutTemplates.values())
      .filter(template => template.userId === userId);
  }

  async getWorkoutTemplate(id: string): Promise<WorkoutTemplate | undefined> {
    return this.workoutTemplates.get(id);
  }

  async createWorkoutTemplate(template: InsertWorkoutTemplate): Promise<WorkoutTemplate> {
    const id = randomUUID();
    const newTemplate: WorkoutTemplate = {
      ...template,
      id,
      createdAt: new Date(),
      userId: template.userId || null,
      description: template.description || null,
      estimatedDuration: template.estimatedDuration || null,
    };
    this.workoutTemplates.set(id, newTemplate);
    return newTemplate;
  }

  async updateWorkoutTemplate(id: string, template: Partial<InsertWorkoutTemplate>): Promise<WorkoutTemplate | undefined> {
    const existing = this.workoutTemplates.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...template };
    this.workoutTemplates.set(id, updated);
    return updated;
  }

  async deleteWorkoutTemplate(id: string): Promise<boolean> {
    return this.workoutTemplates.delete(id);
  }

  async getWorkoutSessions(userId: string, limit?: number): Promise<WorkoutSession[]> {
    let sessions = Array.from(this.workoutSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => {
        const dateA = a.startTime ? new Date(a.startTime).getTime() : 0;
        const dateB = b.startTime ? new Date(b.startTime).getTime() : 0;
        return dateB - dateA;
      });
    
    if (limit) {
      sessions = sessions.slice(0, limit);
    }
    
    return sessions;
  }

  async getWorkoutSession(id: string): Promise<WorkoutSession | undefined> {
    return this.workoutSessions.get(id);
  }

  async createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession> {
    const id = randomUUID();
    const newSession: WorkoutSession = {
      ...session,
      id,
      startTime: new Date(),
      userId: session.userId || null,
      templateId: session.templateId || null,
      endTime: session.endTime || null,
      notes: session.notes || null,
      totalWeight: session.totalWeight || null,
      duration: session.duration || null,
    };
    this.workoutSessions.set(id, newSession);
    return newSession;
  }

  async updateWorkoutSession(id: string, session: Partial<InsertWorkoutSession>): Promise<WorkoutSession | undefined> {
    const existing = this.workoutSessions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...session };
    this.workoutSessions.set(id, updated);
    return updated;
  }

  async getExerciseLogs(userId: string, exerciseId?: string): Promise<ExerciseLog[]> {
    let logs = Array.from(this.exerciseLogs.values())
      .filter(log => log.userId === userId);
    
    if (exerciseId) {
      logs = logs.filter(log => log.exerciseId === exerciseId);
    }
    
    return logs.sort((a, b) => {
      const dateA = a.loggedAt ? new Date(a.loggedAt).getTime() : 0;
      const dateB = b.loggedAt ? new Date(b.loggedAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async createExerciseLog(log: InsertExerciseLog): Promise<ExerciseLog> {
    const id = randomUUID();
    const newLog: ExerciseLog = {
      ...log,
      id,
      loggedAt: new Date(),
      userId: log.userId || null,
      exerciseId: log.exerciseId || null,
      sessionId: log.sessionId || null,
      weight: log.weight || null,
      notes: log.notes || null,
    };
    this.exerciseLogs.set(id, newLog);
    return newLog;
  }

  async getAiSuggestions(userId: string): Promise<AiSuggestion[]> {
    return Array.from(this.aiSuggestions.values())
      .filter(suggestion => suggestion.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createAiSuggestion(suggestion: InsertAiSuggestion): Promise<AiSuggestion> {
    const id = randomUUID();
    const newSuggestion: AiSuggestion = {
      ...suggestion,
      id,
      createdAt: new Date(),
      userId: suggestion.userId || null,
      isRead: suggestion.isRead || null,
    };
    this.aiSuggestions.set(id, newSuggestion);
    return newSuggestion;
  }

  async markAiSuggestionRead(id: string): Promise<boolean> {
    const suggestion = this.aiSuggestions.get(id);
    if (!suggestion) return false;
    
    suggestion.isRead = 1;
    return true;
  }

  async getUserStats(userId: string): Promise<{
    weeklyWorkouts: number;
    totalWeight: number;
    streak: number;
    weeklyProgress: Array<{day: string, duration: number}>;
  }> {
    const sessions = await this.getWorkoutSessions(userId);
    const logs = await this.getExerciseLogs(userId);
    
    // Calculate weekly workouts (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyWorkouts = sessions.filter(session => 
      session.startTime && new Date(session.startTime) >= oneWeekAgo
    ).length;
    
    // Calculate total weight lifted
    const totalWeight = logs.reduce((sum, log) => {
      const weight = parseFloat(log.weight || "0");
      return sum + (weight * log.sets * log.reps);
    }, 0);
    
    // Calculate streak (simplified - consecutive days with workouts)
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const hasWorkout = sessions.some(session => {
        if (!session.startTime) return false;
        const sessionDate = new Date(session.startTime);
        return sessionDate.toDateString() === checkDate.toDateString();
      });
      if (hasWorkout) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    // Weekly progress
    const weeklyProgress = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const daySession = sessions.find(session => {
        if (!session.startTime) return false;
        const sessionDate = new Date(session.startTime);
        return sessionDate.toDateString() === date.toDateString();
      });
      weeklyProgress.push({
        day: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
        duration: daySession?.duration || 0
      });
    }
    
    return {
      weeklyWorkouts,
      totalWeight: Math.round(totalWeight),
      streak,
      weeklyProgress
    };
  }
}

export const storage = new MemStorage();
