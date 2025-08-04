import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserStats {
  weeklyWorkouts: number;
  totalWeight: number;
  streak: number;
  weeklyProgress: Array<{day: string, duration: number}>;
}

export default function ProgressChart() {
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["/api/user-stats"],
  });

  if (isLoading) {
    return (
      <Card className="material-elevation-1">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1,2,3,4,5,6,7].map(i => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxDuration = Math.max(...(stats?.weeklyProgress?.map(d => d.duration) || [0]), 1);

  return (
    <Card className="material-elevation-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900">Weekly Progress</CardTitle>
          <Select defaultValue="7days">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats?.weeklyProgress?.map((day, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 w-12" data-testid={`text-day-${day.day.toLowerCase()}`}>
                {day.day}
              </span>
              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    day.duration > 0 
                      ? day.duration >= 60 
                        ? 'bg-orange-500' 
                        : day.duration >= 45 
                          ? 'bg-green-500' 
                          : 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                  style={{ width: `${day.duration > 0 ? (day.duration / maxDuration) * 100 : 0}%` }}
                ></div>
              </div>
              <span className={`text-sm w-16 ${day.duration > 0 ? 'text-gray-900' : 'text-gray-500'}`} data-testid={`text-duration-${day.day.toLowerCase()}`}>
                {day.duration > 0 ? `${day.duration} min` : 'Rest'}
              </span>
            </div>
          )) || (
            <div className="text-center text-gray-500 py-8">
              <p>No workout data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
