import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

interface UserStats {
  weeklyWorkouts: number;
  totalWeight: number;
  streak: number;
  weeklyProgress: Array<{day: string, duration: number}>;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["/api/user-stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const weeklyGoal = 7;
  const weeklyProgress = stats ? (stats.weeklyWorkouts / weeklyGoal) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Workouts This Week */}
      <Card className="material-elevation-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="text-weekly-workouts">
                {stats?.weeklyWorkouts || 0}
              </p>
              <p className="text-sm text-green-600">workouts</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <i className="fas fa-calendar-check text-green-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1" data-testid="text-weekly-goal">
              {stats?.weeklyWorkouts || 0} of {weeklyGoal} goal
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total Weight Lifted */}
      <Card className="material-elevation-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Weight</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="text-total-weight">
                {stats ? `${(stats.totalWeight / 1000).toFixed(1)}k` : '0'}
              </p>
              <p className="text-sm text-blue-600">lbs lifted</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <i className="fas fa-weight-hanging text-blue-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-green-600" data-testid="text-weight-progress">
              <i className="fas fa-arrow-up mr-1"></i>Keep lifting!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card className="material-elevation-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="text-current-streak">
                {stats?.streak || 0}
              </p>
              <p className="text-sm text-orange-600">days</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <i className="fas fa-fire text-orange-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500" data-testid="text-best-streak">
              Keep it up!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
