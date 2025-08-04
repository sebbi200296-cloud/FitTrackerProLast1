import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface WorkoutAnalysis {
  tips: string[];
  recommendations: string[];
  formAdvice: string[];
}

export async function generateWorkoutSuggestions(userStats: any, recentWorkouts: any[]): Promise<WorkoutAnalysis> {
  try {
    const prompt = `Analyze this fitness data and provide personalized workout suggestions:

User Stats:
- Weekly workouts: ${userStats.weeklyWorkouts}
- Total weight lifted: ${userStats.totalWeight} lbs
- Current streak: ${userStats.streak} days

Recent Workouts:
${recentWorkouts.map(w => `- ${w.name}: ${w.duration || 'Unknown'} minutes, ${Array.isArray(w.exercises) ? w.exercises.length : 0} exercises`).join('\n')}

Please provide:
1. Daily fitness tips (2-3 tips)
2. Workout recommendations based on their patterns (2-3 recommendations)  
3. Form and technique advice (2-3 pieces of advice)

Respond with JSON in this format:
{
  "tips": ["tip1", "tip2", "tip3"],
  "recommendations": ["rec1", "rec2", "rec3"], 
  "formAdvice": ["advice1", "advice2", "advice3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional fitness coach providing personalized workout advice. Be encouraging, specific, and focus on progressive improvement and proper form."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      tips: result.tips || ["Stay consistent with your workouts!", "Focus on progressive overload.", "Don't forget to rest and recover."],
      recommendations: result.recommendations || ["Try adding more compound movements.", "Consider increasing workout frequency.", "Focus on proper form over heavy weight."],
      formAdvice: result.formAdvice || ["Keep your core engaged during lifts.", "Control the weight on both up and down movements.", "Breathe properly - exhale on exertion."]
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback suggestions
    return {
      tips: ["Stay consistent with your workouts!", "Focus on progressive overload.", "Don't forget to rest and recover."],
      recommendations: ["Try adding more compound movements.", "Consider increasing workout frequency.", "Focus on proper form over heavy weight."],
      formAdvice: ["Keep your core engaged during lifts.", "Control the weight on both up and down movements.", "Breathe properly - exhale on exertion."]
    };
  }
}

export async function generateExerciseAdvice(exerciseName: string, userPerformance: any): Promise<string> {
  try {
    const prompt = `Provide specific form and technique advice for the exercise "${exerciseName}" based on this performance data:
    
Recent performance: ${JSON.stringify(userPerformance)}

Give 1-2 sentences of actionable advice to improve form, technique, or progression. Be specific and encouraging.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: "You are a certified personal trainer providing specific exercise form corrections and progression advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150
    });

    return response.choices[0].message.content || "Focus on proper form and controlled movements.";

  } catch (error) {
    console.error('OpenAI API error:', error);
    return "Focus on proper form and controlled movements.";
  }
}
