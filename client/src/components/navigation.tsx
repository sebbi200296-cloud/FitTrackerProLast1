import { useIsMobile } from "@/hooks/use-mobile";

export default function Navigation() {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 material-elevation-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600" data-testid="text-app-title">
                <i className="fas fa-dumbbell mr-2"></i>FitTracker Pro
              </h1>
            </div>
          </div>
          
          {!isMobile && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-blue-600" data-testid="link-dashboard">
                  Dashboard
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" data-testid="link-workouts">
                  Workouts
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" data-testid="link-progress">
                  Progress
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" data-testid="link-ai-coach">
                  AI Coach
                </a>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 relative" data-testid="button-notifications">
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="flex items-center space-x-3">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                alt="User profile" 
                className="h-8 w-8 rounded-full object-cover"
                data-testid="img-user-avatar"
              />
              <span className="hidden sm:block text-sm font-medium text-gray-700" data-testid="text-username">
                Alex Johnson
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
