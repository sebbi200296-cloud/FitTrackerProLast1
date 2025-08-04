import { useIsMobile } from "@/hooks/use-mobile";

export default function MobileNav() {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden material-elevation-2 z-50">
      <div className="grid grid-cols-4 h-16">
        <a href="#" className="flex flex-col items-center justify-center text-blue-600" data-testid="link-mobile-home">
          <i className="fas fa-home text-lg mb-1"></i>
          <span className="text-xs font-medium">Home</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-gray-500" data-testid="link-mobile-workouts">
          <i className="fas fa-dumbbell text-lg mb-1"></i>
          <span className="text-xs">Workouts</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-gray-500" data-testid="link-mobile-progress">
          <i className="fas fa-chart-line text-lg mb-1"></i>
          <span className="text-xs">Progress</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-gray-500 relative" data-testid="link-mobile-ai-coach">
          <i className="fas fa-robot text-lg mb-1"></i>
          <span className="text-xs">AI Coach</span>
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            !
          </span>
        </a>
      </div>
    </nav>
  );
}
