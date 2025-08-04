FitTracker Pro
Overview
FitTracker Pro is a comprehensive fitness tracking web application that helps users monitor their workouts, track progress, and receive AI-powered coaching suggestions. The application provides a modern, responsive interface for logging exercises, creating workout templates, and analyzing fitness data with intelligent recommendations.

User Preferences
Preferred communication style: Simple, everyday language.

System Architecture
Frontend Architecture
Framework: React with TypeScript, using Vite for development and build tooling
UI Library: Radix UI components with shadcn/ui styling system
Styling: Tailwind CSS with custom CSS variables for theming
State Management: TanStack Query (React Query) for server state management
Routing: Wouter for lightweight client-side routing
Mobile-First Design: Responsive layout with dedicated mobile navigation components
Backend Architecture
Runtime: Node.js with Express.js framework
Language: TypeScript with ES modules
API Design: RESTful API endpoints with JSON responses
Development: Hot reloading with Vite integration in development mode
Error Handling: Centralized error middleware with proper HTTP status codes
Data Storage Solutions
Database: PostgreSQL with Drizzle ORM for type-safe database operations
Connection: Neon Database serverless PostgreSQL
Schema Management: Drizzle Kit for migrations and schema management
Data Models: Comprehensive schema covering users, exercises, workout templates, sessions, and AI suggestions
Authentication and Authorization
Session Management: PostgreSQL-backed sessions using connect-pg-simple
User System: Basic user authentication with username/password
Demo Mode: Default demo user for development and testing
AI Integration
Provider: OpenAI GPT-4o for workout analysis and suggestions
Features: Personalized fitness tips, workout recommendations, and form advice
Data Analysis: AI analyzes user stats and recent workouts to provide contextual suggestions
Response Format: Structured JSON responses for consistent data handling
External Dependencies
Core Technologies
Database: Neon Database (PostgreSQL serverless)
AI Service: OpenAI API for GPT-4o model
ORM: Drizzle ORM with Drizzle Kit for PostgreSQL
UI Components: Radix UI primitives for accessible component foundation
Development Tools
Build System: Vite with React plugin and TypeScript support
Development Environment: Replit-specific plugins for enhanced development experience
Styling: Tailwind CSS with PostCSS for processing
Code Quality: TypeScript for type safety and better development experience
Third-Party Libraries
State Management: TanStack React Query for server state and caching
Date Handling: date-fns for date manipulation and formatting
UI Enhancements: Class Variance Authority for component variant management
Carousel: Embla Carousel for interactive UI components
Form Handling: React Hook Form with Hookform Resolvers for validation
