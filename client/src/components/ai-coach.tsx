import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AiSuggestion {
  id: string;
  type: string;
  title: string;
  content: string;
  isRead: number;
  createdAt: string;
}

export default function AiCoach() {
  const { toast } = useToast();
  
  const { data: suggestions, isLoading } = useQuery<AiSuggestion[]>({
    queryKey: ["/api/ai-suggestions"],
  });

  const generateSuggestionsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai-suggestions/generate");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-suggestions"] });
      toast({
        title: "AI suggestions generated!",
        description: "Fresh workout advice is ready for you.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Please try again.",
        variant: "destructive",
      });
    },
  });

  const recentSuggestions = suggestions?.slice(0, 2) || [];
  const unreadCount = suggestions?.filter(s => s.isRead === 0).length || 0;

  return (
    <Card className="material-elevation-1">
      <CardHeader>
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg">
            <i className="fas fa-robot text-white"></i>
          </div>
          <CardTitle className="text-lg font-semibold text-gray-900 ml-3">AI Coach</CardTitle>
          {unreadCount > 0 && (
            <span className="ml-auto bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="text-unread-count">
