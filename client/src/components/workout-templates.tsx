import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  exercises: any[];
  estimatedDuration: number;
  createdAt: string;
}

export default function WorkoutTemplates() {
  const { toast } = useToast();
  
  const { data: templates, isLoading } = useQuery<WorkoutTemplate[]>({
    queryKey: ["/api/workout-templates"],
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/workout-templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-templates"] });
      toast({
        title: "Template deleted",
        description: "Workout template has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete workout template.",
        variant: "destructive",
      });
    },
  });

  const startWorkoutMutation = useMutation({
    mutationFn: async (template: WorkoutTemplate) => {
      const sessionData = {
        templateId: template.id,
        name: template.name,
        exercises: template.exercises,
      };
      const response = await apiRequest("POST", "/api/workout-sessions", sessionData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Workout started!",
        description: "Your workout session has begun. Good luck!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start workout session.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="material-elevation-1">
        <CardHeader>
          <CardTitle>Workout Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="material-elevation-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900">Workout Templates</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" data-testid="button-create-template">
            <i className="fas fa-plus mr-1"></i>Create New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {templates && templates.length > 0 ? (
          <div className="space-y-4">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200 group"
                data-testid={`card-template-${template.id}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600" data-testid={`text-template-name-${template.id}`}>
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-500" data-testid={`text-template-description-${template.id}`}>
                      {template.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-blue-600" data-testid={`button-edit-template-${template.id}`}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="text-gray-400 hover:text-red-600"
                      onClick={() => deleteTemplateMutation.mutate(template.id)}
                      data-testid={`button-delete-template-${template.id}`}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" data-testid={`badge-exercise-count-${template.id}`}>
                    {Array.isArray(template.exercises) ? template.exercises.length : 0} exercises
                  </Badge>
                  <span className="text-xs text-gray-500" data-testid={`text-duration-${template.id}`}>
                    ~{template.estimatedDuration || 45} min
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => startWorkoutMutation.mutate(template)}
                    disabled={startWorkoutMutation.isPending}
                    data-testid={`button-start-workout-${template.id}`}
                  >
                    {startWorkoutMutation.isPending ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Starting...
                      </>
                    ) : (
                      'Start Workout'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    data-testid={`button-preview-workout-${template.id}`}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No workout templates yet</p>
            <Button className="bg-blue-600 text-white hover:bg-blue-700" data-testid="button-create-first-template">
              Create Your First Template
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
