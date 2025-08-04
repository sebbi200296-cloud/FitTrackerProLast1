import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  equipment: string;
  targetMuscles: string[];
}

export default function ExerciseDatabase() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: exercises, isLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises", search, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'all') params.append('category', category);
      
      const url = `/api/exercises${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch exercises');
      return response.json();
    },
  });

  const categoryColors: Record<string, string> = {
    "Chest": "bg-blue-100 text-blue-600",
    "Back": "bg-green-100 text-green-600", 
    "Shoulders": "bg-yellow-100 text-yellow-600",
    "Arms": "bg-purple-100 text-purple-600",
    "Legs": "bg-orange-100 text-orange-600",
    "Core": "bg-pink-100 text-pink-600",
    "Cardio": "bg-red-100 text-red-600",
  };

  const difficultyColors: Record<string, string> = {
    "Beginner": "bg-green-100 text-green-700",
    "Intermediate": "bg-yellow-100 text-yellow-700",
    "Advanced": "bg-red-100 text-red-700",
  };

  return (
    <Card className="material-elevation-1">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Exercise Database</CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search exercises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full sm:w-64"
                data-testid="input-exercise-search"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            {/* Category Filter */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Chest">Chest</SelectItem>
                <SelectItem value="Back">Back</SelectItem>
                <SelectItem value="Shoulders">Shoulders</SelectItem>
                <SelectItem value="Arms">Arms</SelectItem>
                <SelectItem value="Legs">Legs</SelectItem>
                <SelectItem value="Core">Core</SelectItem>
                <SelectItem value="Cardio">Cardio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : exercises && exercises.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {exercises.map((exercise) => (
                <div 
                  key={exercise.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  data-testid={`card-exercise-${exercise.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 mb-1" data-testid={`text-exercise-name-${exercise.id}`}>
                        {exercise.name}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${categoryColors[exercise.category] || 'bg-gray-100 text-gray-600'}`}
                        data-testid={`badge-category-${exercise.id}`}
                      >
                        {exercise.category}
                      </Badge>
                    </div>
                    <div className={`p-2 rounded-lg ${categoryColors[exercise.category] || 'bg-gray-100'}`}>
                      <i className="fas fa-dumbbell text-sm"></i>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <Badge 
                      variant="outline" 
                      className={`${difficultyColors[exercise.difficulty] || 'bg-gray-100 text-gray-600'} border-0`}
                      data-testid={`badge-difficulty-${exercise.id}`}
                    >
                      {exercise.difficulty}
                    </Badge>
                    <span data-testid={`text-equipment-${exercise.id}`}>
                      {exercise.equipment}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm"
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700 text-xs"
                      data-testid={`button-add-to-workout-${exercise.id}`}
                    >
                      Add to Workout
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="px-3 text-xs"
                      data-testid={`button-view-details-${exercise.id}`}
                    >
                      <i className="fas fa-info-circle"></i>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {exercises.length > 12 && (
              <div className="flex justify-center mt-6">
                <Button variant="outline" data-testid="button-load-more">
                  <i className="fas fa-chevron-down mr-2"></i>
                  Load More Exercises
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
            <p className="text-gray-500">
              {search || category ? "Try adjusting your search or filter." : "No exercises available at the moment."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
