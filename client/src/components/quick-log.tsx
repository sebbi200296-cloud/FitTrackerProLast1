import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  name: string;
  category: string;
}

export default function QuickLog() {
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState(3);
  const [notes, setNotes] = useState("");
  
  const { toast } = useToast();

  const { data: exercises } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises", exerciseSearch],
    queryFn: async () => {
      if (exerciseSearch.length <= 2) return [];
      const params = new URLSearchParams();
      params.append('search', exerciseSearch);
      
      const url = `/api/exercises?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch exercises');
      return response.json();
    },
    enabled: exerciseSearch.length > 2,
  });

  const logExerciseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/exercise-logs", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Exercise logged!",
        description: "Your workout has been recorded successfully.",
